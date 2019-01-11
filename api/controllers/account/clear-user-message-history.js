module.exports = {


  friendlyName: 'Clear user message history',


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
      const searchCriteria = { partcipantId: id, participantUUID: uuid, chatThreadId: threadId };
      let clearUserMessageHistory = await ClearUserMessageHistory.updateOne(searchCriteria)
                                                                  .set({ displayMessagesAfter: Date.now() });
      if (!clearUserMessageHistory) {

        clearUserMessageHistory = await ClearUserMessageHistory.create({ 
          ...searchCriteria,
          displayMessagesAfter: Date.now(),
          thread: threadId,
          partcipant: id
        }).fetch();

      }

      const searchOpts = { threadId, toUUID: uuid, createdAt: { '>': clearUserMessageHistory.displayMessagesAfter } };
      const messageCounts = await Promise.all([
        Message.count(searchOpts),
        Message.count({ ...searchOpts, fromUUID: { '!=': uuid }, viewed: false })
      ]);
    
      const CLEAR_MESSAGE_HISTORY = {
        type: 'CLEAR_MESS_HIST',
        code: 6,
        body: {
          thread: {
            isNew: false,
            messageCounts: {
              total: messageCounts[0],
              new: messageCounts[1]
            },
            id: threadId,
            messages: []
            /*...(await ChatThread.findOne({ where: { id: threadId } })
                                  .populate('participants', {
                                    where: {
                                      uuid: { '!=': uuid }
                                    },
                                    select: ['secondaryProfilePic', 'lastSeenAt', 'online', 'name', 'gender', 'uuid']
                                  })
                                  .populate('messages', {
                                    where: {
                                      createdAt: { '>': clearUserMessageHistory.displayMessagesAfter }
                                    },
                                    sort: 'createdAt DESC',
                                    omit: ['thread','deliveredAt','viewedAt','updatedAt']
                                  }))*/
          }
        }
      };
      
      CLEAR_MESSAGE_HISTORY.body.thread.messageCounts = {
        total: messageCounts[0],
        new: messageCounts[1]
      };
      
      return exits.success(CLEAR_MESSAGE_HISTORY);

    }catch(e) { 
      throw 'someError'; 
    }

  }


};
