module.exports = {


  friendlyName: 'Chat user typing',


  description: '',


  inputs: {

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {

    const { threadId } = this.req.allParams();
    
    if (!this.req.isSocket || !threadId) {
      throw 'invalid';
    }

    try {

      const { uuid, secondaryProfilePic, name } = this.req.me;
      const TYPING = {
        type: 'TYPING',
        code: 3
      };

      const chatThread = await ChatThread.findOne({ id: threadId })
                      .populate('participants', {
                        where: {
                          uuid: { '!=': uuid }
                        },
                        select: ['secondaryProfilePic', 'name', 'uuid']
                      });

      if (chatThread) {
        const participantsUUIDs = chatThread.participants.map(({ uuid }) => uuid);
        const clearUserMessageHistory = await ClearUserMessageHistory.find({ where: { participantUUID: participantsUUIDs, chatThreadId: chatThread.id, or: [ { threadRemoved: true }, { threadMuted: true } ] }, select: ['participantUUID'] });
        for (const partUUID of participantsUUIDs) {
          if (clearUserMessageHistory.find(({ participantUUID }) => participantUUID === partUUID)) {
            continue;
          }
          const user = await User.findOne({ where: { uuid: partUUID }, select: ['id'] })
                                  .populate('chatBlacklistedUsers', {
                                    where: { uuid: this.req.me.uuid },
                                    select: ['uuid']
                                  });
          if (user.chatBlacklistedUsers.length) {
            continue;
          }
          
          TYPING.body = { threadId, secondaryProfilePic, name, uuid };
          sails.sockets.broadcast(partUUID, TYPING);
        }
      }

      return exits.success();

    }catch(e) {}
    

  }


};
