/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Thread message count',


  description: '',


  inputs: {
    chatThreadId: {
      required: true,
      type: 'string'
    },
    userUUID: {
      required: true,
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    try {
      const { userUUID, chatThreadId } = inputs;
      const { displayMessagesAfter= 0, threadRemoved= false } = (await ClearUserMessageHistory.findOne({ participantUUID: userUUID, chatThreadId })) || {};
      let threadCounts = [].fill(0);
      if (!threadRemoved) {
        threadCounts = await Promise.all([
          Message.count({ threadId: chatThreadId, toUUID: userUUID, createdAt: { '>': displayMessagesAfter }, fromUUID: { '!=': userUUID }, viewed: false }),
          Message.count({ threadId: chatThreadId, toUUID: userUUID, createdAt: { '>': displayMessagesAfter } })
        ]);
      }

      return exits.success({ unreadMessagesTotalCount: threadCounts[0], messagesTotalCount: threadCounts[1] });

    }catch(e) {

      sails.log('LOGGING error e => ', e);
      return exits.error();
    }

  }


};

