/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Toggle mute chat thread',


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

    const { threadId } = this.req.allParams();

    if (!this.req.isSocket || !threadId) {
      throw 'invalid';
    }

    try {

      const { uuid, id } = this.req.me;
      const searchOpts = { participantUUID: uuid, chatThreadId: threadId, partcipantId: id };

      const clearuserMessageHistory = await ClearUserMessageHistory.findOne({ where: searchOpts, select: ['threadMuted'] });
      let threadMuted = clearuserMessageHistory ? clearuserMessageHistory.threadMuted : null;

      if (threadMuted === null) {
        await ClearUserMessageHistory.create({ ...searchOpts, threadMuted: true, threadMutedAt: Date.now(), thread: threadId, partcipant: id });
      }else {
        await ClearUserMessageHistory.updateOne(searchOpts)
                                     .set({ threadMuted: !threadMuted, threadMutedAt: threadMuted ? Date.now() : 0 });
      }

      return exits.success({
        type: 'TOGGLE_MUTE',
        code: 8,
        body: {
          thread: {
            id: threadId,
            muted: !threadMuted
          }
        }
      });

    }catch(e) {
      throw 'someError';
    }

  }


};
