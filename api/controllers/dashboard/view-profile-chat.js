/* eslint-disable no-undef,no-labels */
module.exports = {


  friendlyName: 'View profile chat',


  description: 'Display "Profile chat" page.',


  exits: {

    redirect: {
      responseType: 'redirect'
    },
    someError: {
      responseType: 'serverError'
    },
    success: {
      viewTemplatePath: 'pages/dashboard/profile-chat'
    }

  },


  fn: async function (inputs, exits) {

    const MESS_BATCH_SIZE = 10;
    const myId =  this.req.session.userId;
    if (!myId) {
      return exits.success({
        openSignInDialog: true,
        lang: this.req.getLocale()
      });
    }

    const FLASH_STORE_TOKEN = 'chat-req-user-uuid';
    const REDIRECT_URI = '/profile/chat';
    const uuidURIParam = this.req.param('uuid');
    const myUUID = this.req.me.uuid;
    let user; let threads = [];


    if (uuidURIParam) {

      const paramUser = await User.findOne({
        where: { id: { '!=': myId }, uuid: uuidURIParam },
        select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
      })
      .intercept(() => 'someError');

      if (paramUser) {

        delete paramUser.id;
        this.req.addFlash(FLASH_STORE_TOKEN, paramUser);

        throw {redirect: REDIRECT_URI};

      }else {

        throw {redirect: '/'};

      }
    } else {
      // After redirect populating user into user variable
      user = this.req.hasFlash(FLASH_STORE_TOKEN) && this.res.locals.flash.get(FLASH_STORE_TOKEN);

    }

    try {

      // get collection of previously deleted threads
      const previouslyDeletedThreadIds = (await ClearUserMessageHistory.find({
        where: { threadRemoved: true, participantUUID: myUUID },
        select: ['chatThreadId']
      })).map(({ chatThreadId }) => chatThreadId);

      // check if theard been deleted previously we adding him into participants collection
      if (Array.isArray(user) && user.length > 0) {

        if (previouslyDeletedThreadIds.length) {
        // find all previously deleted threads
          const previouslyDeletedChats = await ChatThread.find({ where: { id: previouslyDeletedThreadIds }, select: ['id'] })
                                                        .populate('participants', {
                                                          select: ['uuid']
                                                        });
          // if user was in deleted thread - add self into that thread
          exUserFoundAndAdded:
          for (const { id, participants } of previouslyDeletedChats) {
            for (const exParticipant of participants) {
              if (exParticipant.uuid === user[0].uuid) {
                sails.log('WE ARE GOING TO ADD PREVIOUSLY DELETED USER => user[0].uuid, id ', user[0].uuid, id);
                await ClearUserMessageHistory.updateOne({ chatThreadId: id, participantUUID: myUUID }).set({ threadRemoved: false, threadRemovedAt: 0 });
                for (let i = 0; i < previouslyDeletedThreadIds.length; i++) {
                  if (previouslyDeletedThreadIds[i] === id) {
                    previouslyDeletedThreadIds.splice(i, 1);
                    break exUserFoundAndAdded;
                  }
                }
              }
            }
          }

        }

      }

      // get self updated chats
      const { chats= [], chatBlacklistedUsers= [] } = (await User.findOne({
        where: { id: myId },
        select: ['uuid']
      })
    .populate('chats', {
      select: ['id']
    })
    .populate('chatBlacklistedUsers', {
      select: ['uuid', 'blockedAt']
    })) || {};

      //const chatBlacklistedUsersUUIDs = chatBlacklistedUsers.map(({ uuid, blockedAt }) => ({ uuid, blockedAt }));
      const actualChatIds = [];
      chats.forEach(chat => {
        if (!previouslyDeletedThreadIds.includes(chat.id)) {
          actualChatIds.push(chat.id);
        }
      });
      await ChatThread.stream({ id: actualChatIds })
      .sort('lastMessageAt DESC')
      .populate('participants', {
        where: {
          uuid: { '!=': myUUID }
        },
        select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
      })
      .populate('clearMessageHistory', {
        where: {
          participantUUID: myUUID
        },
        select: ['threadMuted', 'displayMessagesAfter']
      })
      .eachRecord(async thread => {

        //const clearMessagesThread = await ClearUserMessageHistory.findOne({ participantUUID: populatedUser.uuid, chatThreadId: thread.id }).intercept(() => 'someError');
        const messageSearchConstraint = { threadId: thread.id, toUUID: myUUID, ...(thread.clearMessageHistory.length > 0 ? { createdAt: {'>': thread.clearMessageHistory[0].displayMessagesAfter} } : {}) };

        for (const participant of thread.participants) {

          //set meta info to participant
          sails.log('LOGGING chatBlacklistedUsers => ', chatBlacklistedUsers, participant.uuid);
          participant.userBlocked = !!chatBlacklistedUsers.find(blackListedUser => blackListedUser.uuid === participant.uuid);

          delete participant.id;

          // So we can fetch thread messages at once.
          // request came from user
          if (Array.isArray(user) && user.length > 0 && user[0].uuid === participant.uuid) {

            const messages = await Message.find({
              where: messageSearchConstraint,
              //...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: {'>': clearMessagesThread.displayMessagesAfter} } : {})
              limit: MESS_BATCH_SIZE,
              sort: 'createdAt DESC',
              omit: ['thread','deliveredAt','viewedAt','updatedAt']
            })
            .populate('author')
            .populate('messageData');

            thread.messages = messages.map(message => {
              const author = {};
              for (const field of ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']) {
                author[field] = message.author[field];
              }
              const { messageText, attachment } = message.messageData;
              message.messageText = messageText;
              message.attachment = attachment;
              message.author = author;
              message.id = message.messageID;
              delete message.messageID;
              delete message.messageData;
              return message;
            }).sort((m1, m2) => m1.createdAt - m2.createdAt);

            thread.messagesReceived = true;

            thread.batch = 1;

          }
        }

        const { unreadMessagesTotalCount= 0, messagesTotalCount= 0 } = (await sails.helpers.threadMessageCount.with({ userUUID: myUUID, chatThreadId: thread.id })) || {};
        // await Promise.all([
        //     Message.count(messageSearchConstraint /*{ threadId: thread.id, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: {'>': clearMessagesThread.displayMessagesAfter} } : {}) }*/),
        //     Message.count({ ...messageSearchConstraint, fromUUID: { '!=': myUUID }, viewed: false /*threadId: thread.id, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: {'>': clearMessagesThread.displayMessagesAfter} } : {})*/})
        //   ]);

        thread.messageCounts = {
          total: messagesTotalCount,
          new: unreadMessagesTotalCount
        };

        thread.muted = thread.clearMessageHistory.length > 0 && thread.clearMessageHistory[0].threadMuted;

        delete thread.clearMessageHistory;
        threads.push(thread);

      });

    }catch(e) {
      sails.log('LOGGING ERROR => e ', e);
      throw 'someError';
    }


    const tempThread = user ? user[0] : undefined;
    if (!threads.length && !tempThread) {
      throw {redirect: '/'};
    }


    // Respond with view.
    return exits.success({
      flash: undefined,
      chat: {
        tempThread,
        threads
      },
      me: sails.helpers.removeUnwantedModelAttrs.with({ model: User, modelAttrs: this.req.me }),
      lang: this.req.getLocale()
    });

  }


};
