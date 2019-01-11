/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Chat message viewed',


  description: '',


  inputs: {

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

    const { /*threadId,*/ viewedMessagesBatch } = this.req.allParams();

    if (!this.req.isSocket || !viewedMessagesBatch.length /*|| !threadId*/) {
      throw 'invalid';
    }

    try {

      const { uuid } = this.req.me;

      const viewedUserMessages = await Message.update({ messageID: viewedMessagesBatch, toUUID: uuid, fromUUID: { '!=': uuid }, viewed: false })
                                              .set({
                                                viewed: true,
                                                viewedAt: Date.now()
                                              })
                                              .fetch();
      viewedUserMessages.forEach(async viewedUserMessage => {

        const userMessageCounts = (await sails.helpers.threadMessageCount.with({ userUUID: uuid, chatThreadId: viewedUserMessage.threadId })) || {};
        sails.sockets.broadcast(uuid, {
          type: 'MESS_VIEWED',
          code: 2,
          body: {
            thread: {
              isNew: false,
              id: viewedUserMessage.threadId,
              messageCounts: {
                total: userMessageCounts.messagesTotalCount,
                new: userMessageCounts.unreadMessagesTotalCount
              }
            },
            amendedMessages: [{
              id: viewedUserMessage.messageID,
              viewed: viewedUserMessage.viewed
            }]
          }
        });

        const updatedAuthorMessage = await Message.updateOne({ fromUUID: viewedUserMessage.fromUUID, messageID: viewedUserMessage.messageID, toUUID: viewedUserMessage.fromUUID, viewed: false })
                                                  .set({
                                                    viewed: true,
                                                    viewedAt: Date.now()
                                                  });
        if (!updatedAuthorMessage) {
          return;
        }

        const authorMessageCounts = (await sails.helpers.threadMessageCount.with({ userUUID: updatedAuthorMessage.toUUID, chatThreadId: updatedAuthorMessage.threadId })) || {};
        sails.sockets.broadcast(updatedAuthorMessage.toUUID, {
          type: 'MESS_VIEWED',
          code: 2,
          body: {
            thread: {
              isNew: false,
              id: updatedAuthorMessage.threadId,
              messageCounts: {
                total: authorMessageCounts.messagesTotalCount,
                new: authorMessageCounts.unreadMessagesTotalCount
              }
            },
            amendedMessages: [{
              id: updatedAuthorMessage.messageID,
              viewed: updatedAuthorMessage.viewed
            }]
          }
        });
      });

      return exits.success();
      // const viewedMessages = await Message.update({ messageID: viewedMessagesBatch, fromUUID: { '!=': uuid }, viewed: false })
      //   .set({
      //     viewed: true,
      //     viewedAt: Date.now()
      //   })
      //   .fetch();

      // await ChatThread.stream({
      //   where: { id: threadId },
      //   select: ['id']
      // })
      //   .populate('participants', {
      //     //select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
      //     select: ['uuid']
      //   })
      //   //.populate('clearMessageHistory', {
      //     // where: {
      //     //   participantUUID: uuid
      //     // },
      //     //select: ['displayMessagesAfter', 'participantUUID']
      //   //})
      //   .eachRecord(async ({ participants, id  /*clearMessageHistory, lastMessageAt, createdAt, updatedAt*/ }) => {

      //     const MESS_VIEWED = {
      //       type: 'MESS_VIEWED',
      //       code: 2,
      //       body: {
      //         amendedMessages: viewedMessages.map(({ messageID, viewed }) => ({ id: messageID, viewed }))
      //       }
      //     };

      //     for (const { uuid } of participants) {

      //       // const clearMessagesThread = await ClearUserMessageHistory.findOne({ participantUUID: uuid, chatThreadId: id }).intercept(() => 'someError');
      //       //const clearMessageUserHistorySubject = clearMessageHistory.find(({ participantUUID }) => participantUUID === uuid);
      //       //const messageSearchConstraint = { threadId: id, toUUID: uuid, ...(clearMessageUserHistorySubject ? { createdAt: {'>': clearMessageUserHistorySubject.displayMessagesAfter} } : {}) };
      //       // const messageCounts = await Promise.all([
      //       //     Message.count(messageSearchConstraint/*{ threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: { '>': clearMessagesThread.displayMessagesAfter } } : {}) }*/),
      //       //     Message.count({ ...messageSearchConstraint, fromUUID: { '!=': uuid }, viewed: false /*threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: { '>': clearMessagesThread.displayMessagesAfter } } : {})*/ })
      //       //   ]);
      //       const { unreadMessagesTotalCount= 0, messagesTotalCount= 0, activeThreadCount= 0 } = (await sails.helpers.messagesCounts.with({ userUUID: uuid })) || {};

      //       MESS_VIEWED.body.thread = {
      //         isNew: false,
      //         id,
      //         //lastMessageAt,
      //         //createdAt,
      //         //updatedAt,
      //         //participants: participants.filter(p => p.uuid !== uuid),
      //         messageCounts: {
      //           total: messagesTotalCount,
      //           new: unreadMessagesTotalCount,
      //           activeThreadCount
      //         }
      //       };

      //       // broadcasting default event 'message' with data for every user (uuid) who attended in particular thread
      //       sails.sockets.broadcast(uuid, MESS_VIEWED);
      //     }
      //   });

      // return exits.success();

    } catch (e) {
      sails.log('LOGGING error => ', e);
      throw 'someError';
    }

  }


};
