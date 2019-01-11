/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Send chat message',


  description: '',


  inputs: {
    messageText: {
      type: 'string'
    },
    attachment: {
      type: 'json'
    },
    threadId: {
      type: 'string'
    },
    fromUUID: {
      type: 'string',
      required: true
    },

    toUUID: {
      type: 'string'
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    },
    someError: {
      responseType: 'serverError'
    }
  },


  fn: async function (inputs, exits) {

    // { messageBody, attachment?, threadId?, fromUUID, toUUID? }
    const { attachment, threadId, fromUUID, toUUID } = this.req.allParams();
    const messageText = this.req.param('messageText').trim();

    // if threadId === undefined => toUUID !== undefined
    //else if threadId !== undefined => toUUID === undefined

    if (!this.req.isSocket || this.req.me.uuid !== fromUUID) {
      throw 'invalid';
    }

    try {

      const messageAuthor = this.req.me;
      let newThread; let participantsUUIDsWhomICanSendMessageObj = {}; let usersWhoBlockedMe = []; let chatThreadParticipantsPopulated;

      if (threadId) {
        // check if user blocked me
        const chatThread = await ChatThread.findOne({ where: { id: threadId }, select: ['id'] })
                                                        .populate('participants', {
                                                          where: {
                                                            uuid: {'!=': fromUUID}
                                                          },
                                                          select: ['uuid']
                                                        });
        if (!chatThread) {
          return exits.invalid();
        }

        chatThreadParticipantsPopulated = await User.find({ where: { id: chatThread.participants.map(({ id }) => id) }, select: ['uuid'] })
                                            .populate('chatBlacklistedUsers', {
                                              where: { uuid: fromUUID },
                                              select: ['uuid', 'blockedAt']
                                            });

        const participantsUUIDsWhomICanSendMessage = [];

        chatThreadParticipantsPopulated.forEach(chatParticipant => {

          if (chatParticipant.chatBlacklistedUsers[0] && chatParticipant.chatBlacklistedUsers[0].uuid === fromUUID) {
            usersWhoBlockedMe.push(chatParticipant.uuid);
          }else {
            participantsUUIDsWhomICanSendMessage.push(chatParticipant.uuid);
            participantsUUIDsWhomICanSendMessageObj[chatParticipant.uuid] = chatParticipant.uuid;
          }
        });


        // check if users removed this chat thread from their collections

        await ClearUserMessageHistory.update({ chatThreadId: chatThread.id, participantUUID: participantsUUIDsWhomICanSendMessage })
                                    .set({ threadRemoved: false, threadRemovedAt: 0 });


      }else {

        const toUser = await User.findOne({ where: { uuid: toUUID }, select: ['uuid'] });

        participantsUUIDsWhomICanSendMessageObj[toUser.uuid] = toUser.uuid;
        // we can create new thread instead
        newThread = await ChatThread.create({
          participants: [
            toUser.id,
            messageAuthor.id
          ]
        })
        .fetch();

      }

      // add self to the list of user whom I can send message

      participantsUUIDsWhomICanSendMessageObj[messageAuthor.uuid] = messageAuthor.uuid;

      const messageData = await MessageData.create({ messageText, attachment })
                                              .fetch();
      let lastMessageAt = messageData.createdAt;
      await Promise.all([
        ChatThread.stream({ id: threadId || newThread.id })
                  .populate('participants', {
                    select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
                  })
                  .populate('clearMessageHistory', {
                    select: ['threadMuted', 'participantUUID']
                  })
                  .eachRecord(async chatThread => {

                    const userThreadMuted = {};
                    for (const userChatAggregator of chatThread.clearMessageHistory) {
                      if (userChatAggregator.threadMuted) {
                        userThreadMuted[userChatAggregator.participantUUID] = userChatAggregator.participantUUID;
                      }
                    }

                    for (const participant of chatThread.participants) {

                      if (!userThreadMuted[participant.uuid] && participantsUUIDsWhomICanSendMessageObj[participant.uuid]) {

                        const message = await Message.create({
                          messageID: messageData.id,
                          fromUUID,
                          toUUID: participant.uuid,
                          threadId: chatThread.id,
                          author: messageAuthor.id,
                          thread: chatThread.id,
                          messageData: messageData.id
                        })
                        .fetch();

                        const { unreadMessagesTotalCount= 0, messagesTotalCount= 0 } = (await sails.helpers.threadMessageCount.with({ userUUID: participant.uuid, chatThreadId: chatThread.id })) || {};
                        const NEW_MESS = {
                          type: 'NEW_MESS',
                          code: 1,
                          body: {
                            thread: {
                              messageCounts: {
                                total: messagesTotalCount,
                                new: unreadMessagesTotalCount
                              },
                              isNew: !!newThread,
                              id: chatThread.id,
                              lastMessageAt,
                              createdAt: chatThread.createdAt,
                              participants: chatThread.participants.filter(p => {
                                delete p.id;
                                return p.uuid !== participant.uuid;
                              })
                            },
                            message: {
                              messageText,
                              attachment,
                              threadId: chatThread.id,
                              fromUUID,
                              createdAt: message.createdAt,
                              id: message.messageID,
                              author: {
                                secondaryProfilePic: messageAuthor.secondaryProfilePic,
                                lastSeenAt: messageAuthor.lastSeenAt,
                                online: messageAuthor.online,
                                name: messageAuthor.name,
                                gender: messageAuthor.gender,
                                uuid: messageAuthor.uuid
                              },
                              delivered: message.delivered,
                              viewed: message.viewed
                            }
                          }
                        };

                        // broadcasting default event 'message' with data for every user (uuid) who attended in particular thread
                        sails.sockets.broadcast(participant.uuid, NEW_MESS);

                      }
                    }
                  }),
        ChatThread.updateOne({ id: threadId || newThread.id })
                  .set({
                    lastMessageAt
                  })
      ]);

      return exits.success({ failedMessageDeliveryTo: usersWhoBlockedMe });

    }catch(e) {
      sails.log('INSIDE catch block e => ', e);
      throw 'someError';
    }

    /*let newThread;
    const messageOwner = await User.findOne({ where: { uuid: fromUUID }, select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid'] })
                                    .intercept((e) => {
                                      sails.log('INSIDE User.findOne messageOwner');
                                      sails.log(e);
                                      return 'someError';
                                    });

    // if no threadId specified we considering as case to create new chat thread, but toUUID must be specified
    if (!threadId) {
      const toId = await User.findOne({ where: { uuid: toUUID }, select: ['id'] })
                              .populate('chats', {
                                select: ['id']
                              })
                              .intercept((e) => {
                                sails.log('INSIDE User.findOne toId');
                                sails.log(e);
                                return 'someError';
                              });
      sails.log('LOGGING toId.chats => ', toId && toId.chats);
      let existedChatThread = null;
      if (toId && Array.isArray(toId.chats)) {
        existedChatThread = await ClearUserMessageHistory.findOne({ where: { chatThreadId: toId.chats.map(({ id }) => id), threadRemoved: true, participantUUID: messageOwner.uuid }, select: ['chatThreadId'] })
                                                              .intercept((e) => {
                                                                sails.log('INSIDE ClearUserMessageHistory.findOne => ');
                                                                sails.log(e);
                                                                return 'someError';
                                                              });
      }

      if (existedChatThread && existedChatThread.chatThreadId) {

        const testReturn = await ChatThread.addToCollection(existedChatThread.chatThreadId, 'participants')
                                          .members([messageOwner.id])
                                          .intercept((e) => {
                                            sails.log('INSIDE ChatThread.addToCollection ');
                                            sails.log(e);
                                            return 'someError';
                                          });
        sails.log('ChatThread.addToCollection => response ', testReturn);
        threadId = existedChatThread.chatThreadId;

      }else {
        newThread = await ChatThread.create({
          participants: [
            toId.id,
            messageOwner.id
          ]
        })
        .fetch()
        .intercept((e) => {
          sails.log('INSIDE ChatThread.create new');
          sails.log(e);
          return 'someError';
        });
      }

    }else {

      const removedParticipantsUids = await ClearUserMessageHistory.find({ where: { chatThreadId: threadId, threadRemoved: true }, select: ['participantUUID'] })
                                  .intercept((e) => {
                                    sails.log('INSIDE ClearUserMessageHistory.find preparing to addToCollection replaced users ');
                                    sails.log(e);
                                    return 'someError';
                                  });
      sails.log('removedParticipantsUids => ', removedParticipantsUids);
      if (removedParticipantsUids.length) {
        const removedParticipantsIds = await User.find({ where: { uuid: removedParticipantsUids.map(({ participantUUID }) => participantUUID) }, select: ['id'] })
                                              .intercept((e) => {
                                                sails.log('INSIDE User.find preparing to preparing addToCollection replaced users extract IDs ');
                                                sails.log(e);
                                                return 'someError';
                                              });
        const testAddRemovedUsers = await ChatThread.addToCollection(threadId, 'participants')
                                                  .members(removedParticipantsIds.map(({ id }) => id))
                                                  .intercept((e) => {
                                                    sails.log('INSIDE ChatThread.addToCollection hui ');
                                                    sails.log(e);
                                                    return 'someError';
                                                  });
        sails.log(' testAddRemovedUsers => ', testAddRemovedUsers);
      }

    }

    const newMessage = await Message.create({
      messageBody: messageBody.trim(),
      attachment,
      threadId: threadId || newThread.id,
      fromUUID,
      thread: threadId || newThread.id,
      author: messageOwner.id
    })
    .fetch()
    .intercept((e) => {
      sails.log('INSIDE Message.create new');
      sails.log(e);
      return 'someError';
    });

    delete messageOwner.id;

    if (newMessage) {
      const { messageBody, attachment, threadId, fromUUID, createdAt, id, delivered, viewed } = newMessage;

      const NEW_MESS = {
        type: 'NEW_MESS',
        code: 1,
        body: {
          message: { messageBody, attachment, threadId, fromUUID, createdAt, id, author: messageOwner, delivered, viewed }
        }
      };

      try {
        await Promise.all([

          ChatThread.stream({ id: threadId })
                    .populate('participants', {
                      select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
                    })
                    .eachRecord(async thread => {
                      const { participants, lastMessageAt, id, createdAt, updatedAt } = thread;

                      for (const { uuid } of participants) {
                        const clearMessagesThreads = await ClearUserMessageHistory.findOne({ participantUUID: uuid, chatThreadId: id }).intercept(() => 'someError');
                        let messageCounts;

                        try {
                          messageCounts = await Promise.all([
                            Message.count({ threadId: id, ...(clearMessagesThreads ? { createdAt: {'>': clearMessagesThreads.displayMessagesAfter} } : {}) }),
                            Message.count({ threadId: id, ...(clearMessagesThreads ? { createdAt: {'>': clearMessagesThreads.displayMessagesAfter} } : {}), fromUUID: { '!=': uuid }, viewed: false })
                          ]);
                        }catch(e) { throw 'someError'; }

                        NEW_MESS.body.thread= {
                          isNew: !!newThread,
                          id,
                          lastMessageAt,
                          createdAt,
                          updatedAt,
                          participants: participants.filter(p => p.uuid !== uuid),
                          messageCounts: {
                            total: messageCounts[0],
                            new: messageCounts[1]
                          }
                        };

                        // broadcasting default event 'message' with data for every user (uuid) who attended in particular thread
                        sails.sockets.broadcast(uuid, NEW_MESS);
                      }
                    }),

          ChatThread.updateOne({ id: threadId })
                    .set({
                      lastMessageAt: createdAt
                    })
                    .tolerate(() => {})

        ]);

      }catch(e) {
        sails.log('INSIDE Promise.all ');
        sails.log(e);
        throw 'someError';
      }


      return exits.success();

    }

    return exits.invalid();*/



  }


};
