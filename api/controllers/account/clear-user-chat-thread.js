module.exports = {


  friendlyName: 'Clear user chat thread',


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

    const threadId = this.req.param('threadId');

    if (!this.req.isSocket || !threadId) {
      throw 'invalid';
    }

    try {

      const { uuid, id } = this.req.me;
      const searchCriteria = { chatThreadId: threadId, participantUUID: uuid, partcipantId: id };

      const clearUserMessageHistoryThreadRemoved = await ClearUserMessageHistory.updateOne(searchCriteria)
                                                                                .set({ threadRemoved: true, threadRemovedAt: Date.now() });
      if (!clearUserMessageHistoryThreadRemoved) {
        await ClearUserMessageHistory.create({ ...searchCriteria, threadRemoved: true, threadRemovedAt: Date.now(), thread: threadId, partcipant: id });
      }
      


      return exits.success({
        type: 'DEL_CHAT',
        code: 7,
        body: {
          thread: { 
            isNew: false,
            id: threadId 
          }
        }
      });

    }catch(e) {
      sails.log('LOGGING ERROR e => ', e);
      throw 'someError';
    }

  }


};
