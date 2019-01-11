/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Chat message delivered',


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

    const { threadId, messageId } = this.req.allParams();

    if (!this.req.isSocket || !threadId) {
      throw 'invalid';
    }

    try {

      const { uuid } = this.req.me;


      const searchToUpdateParams = { ...(messageId ? { messageID: messageId } : { threadId }), toUUID: uuid, fromUUID: { '!=': uuid }, delivered: false };

      const deliveredUserMessages = await Message.update(searchToUpdateParams)
                                                    .set({
                                                      delivered: true,
                                                      deliveredAt: Date.now()
                                                    })
                                                    .fetch();

      sails.log('LOGGING deliveredUserMessages => ', deliveredUserMessages);

      deliveredUserMessages.forEach(async deliveredUserMessage => {

        sails.sockets.broadcast(uuid, {
          type: 'MESS_DELIVERED',
          code: 4,
          body: {
            thread: {
              isNew: false,
              id: deliveredUserMessage.threadId
            },
            amendedMessages: [{
              id: deliveredUserMessage.messageID,
              delivered: deliveredUserMessage.delivered
            }]
          }
        });

        const updatedAuthorMessage = await Message.updateOne({ fromUUID: deliveredUserMessage.fromUUID, messageID: deliveredUserMessage.messageID, toUUID: deliveredUserMessage.fromUUID, delivered: false })
                                                    .set({
                                                      delivered: true,
                                                      deliveredAt: Date.now()
                                                    });

        if (!updatedAuthorMessage) {
          return;
        }

        sails.sockets.broadcast(updatedAuthorMessage.toUUID, {
          type: 'MESS_DELIVERED',
          code: 4,
          body: {
            thread: {
              isNew: false,
              id: updatedAuthorMessage.threadId
            },
            amendedMessages: [{
              id: updatedAuthorMessage.messageID,
              delivered: updatedAuthorMessage.delivered
            }]
          }
        });

      });

      return exits.success();

      //const searchBaseCriteria = { fromUUID: { '!=': uuid }, delivered: false };

      //   const deliveredMessages = await Message.update(messageId ? { messageID: messageId, ...searchBaseCriteria } : { threadId, ...searchBaseCriteria })
      //                                           .set({
      //                                             delivered: true,
      //                                             deliveredAt: Date.now()
      //                                           })
      //                                           .fetch();

      //   if (deliveredMessages.length) {
      //     const threadsToNotify = [];
      //     if (Array.isArray(threadId)) {
      //       for (const deliveredMess of deliveredMessages) {
      //         for (const tId of threadId) {
      //           if (deliveredMess.threadId === tId) {
      //             threadsToNotify.push(tId);
      //           }
      //         }
      //       }
      //     }

      //     await ChatThread.stream({
      //       where: { id: threadsToNotify.length ? threadsToNotify : threadId },
      //       select: ['id']
      //     })
      //     .populate('participants', {
      //       //select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
      //       select: ['uuid']
      //     })
      //     .eachRecord(async ({ participants, id/*, lastMessageAt, createdAt, updatedAt*/ }) => {

      //       const MESS_DELIVERED = {
      //         type: 'MESS_DELIVERED',
      //         code: 4,
      //         body: {
      //           amendedMessages: deliveredMessages.map(({ messageID, delivered }) => ({ id: messageID, delivered }))
      //         }
      //       };

      //       for (const { uuid } of participants) {

      //                         /*const clearMessagesThread = await ClearUserMessageHistory.findOne({ participantUUID: uuid, chatThreadId: id });

      //                         const messageCounts = await Promise.all([
      //                             Message.count({ threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: { '>': clearMessagesThread.displayMessagesAfter } } : {}) }),
      //                             Message.count({ threadId, ...(clearMessagesThread && clearMessagesThread.displayMessagesAfter ? { createdAt: { '>': clearMessagesThread.displayMessagesAfter } } : {}), fromUUID: { '!=': uuid }, viewed: false })
      //                           ]);*/


      //         MESS_DELIVERED.body.thread = {
      //           isNew: false,
      //           id
      //                           //lastMessageAt,
      //                           //createdAt,
      //                           //updatedAt,
      //                           //participants: participants.filter(p => p.uuid !== uuid),
      //                           //messageCounts: {
      //                             //total: messageCounts[0],
      //                             //new: messageCounts[1]
      //                           //}
      //           };

      //         // broadcasting default event 'message' with data for every user (uuid) who attended in particular thread
      //         sails.sockets.broadcast(uuid, MESS_DELIVERED);
      //       }
      //     });

      //   }

      //   return exits.success();

    } catch (e) {
      sails.log('LOGGING error => ', e);
      throw 'someError';
    }

  }


};
