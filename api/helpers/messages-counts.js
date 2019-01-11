/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Messages counts',


  description: '',


  inputs: {
    userUUID: {
      required: true,
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    try {

      const { userUUID } = inputs;
      let unreadMessagesTotalCount = 0;
      let messagesTotalCount = 0;
      let activeThreadCount = 0;

      if (userUUID) {
        const user = await User.findOne({ uuid: userUUID })
                                .populate('chats');
        const userChatThreadIds = user ? user.chats.map(({ id }) => id) : [];
        const clearMessagesThreads = await ClearUserMessageHistory.find({ participantUUID: userUUID, chatThreadId: userChatThreadIds });

        for (let i = 0; i < userChatThreadIds.length; i++) {
          let matchFound = false;
          for (const clearMessagesThread of clearMessagesThreads) {
            if (userChatThreadIds[i] === clearMessagesThread.chatThreadId) {
              if (clearMessagesThread.threadRemoved) {
                userChatThreadIds.splice(i--,1);
              }else if (clearMessagesThread.displayMessagesAfter) {
                const countsArr = await Promise.all([
                  Message.count({ threadId: userChatThreadIds[i], toUUID: userUUID, createdAt: { '>': clearMessagesThread.displayMessagesAfter }, fromUUID: { '!=': userUUID }, viewed: false }),
                  Message.count({ threadId: userChatThreadIds[i], toUUID: userUUID, createdAt: { '>': clearMessagesThread.displayMessagesAfter } })
                ]);
                unreadMessagesTotalCount += countsArr[0];
                messagesTotalCount += countsArr[1];
                matchFound = true;
              }

              break;
            }
          }
          if (!matchFound) {
            const countsArr = await Promise.all([
              Message.count({ threadId: userChatThreadIds[i], toUUID: userUUID, fromUUID: { '!=': userUUID }, viewed: false }),
              Message.count({ threadId: userChatThreadIds[i], toUUID: userUUID })
            ]);
            unreadMessagesTotalCount += countsArr[0];
            messagesTotalCount += countsArr[1];
          }
        }

        // unreadMessagesTotalCount = userChatThreadIds.length && await Message.count({ threadId: userChatThreadIds, fromUUID: { '!=': uuid }, viewed: false });
        //messagesTotalCount = userChatThreadIds.length && await Message.count({ threadId: userChatThreadIds, toUUID: userUUID });
        activeThreadCount = userChatThreadIds.length;
      }

      return exits.success({ unreadMessagesTotalCount, messagesTotalCount, activeThreadCount });

    }catch(e) {
      sails.log('LOGGING error e => ', e);
      return exits.error();
    }

  }


};

