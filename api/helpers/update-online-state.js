/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Update online state',


  description: '',


  inputs: {
    me: {
      type: 'ref'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const { secondaryProfilePic, lastSeenAt, online, name, gender, uuid, id } = inputs.me;

    try {

      const user = await User.findOne({ id })
                                .populate('chats');
      if (user) {
        const userChatIds = user.chats.map(({ id }) => id);
        const clearUserMessageHistorys = await ClearUserMessageHistory.find({ where: { chatThreadId: userChatIds, threadRemoved: true }, select: ['chatThreadId', 'participantUUID'] });
        await ChatThread.stream({ id: userChatIds })
                        .populate('participants', {
                          where: {
                            uuid: {'!=': uuid}
                          },
                          select: ['uuid']
                        })
                        .eachRecord(chatThread => {
                          const restrictedParticipantUUIDs = [];
                          for (const clearUserMessageHist of clearUserMessageHistorys) {
                            if (clearUserMessageHist.chatThreadId === chatThread.id) {
                              for (const participant of chatThread.participants) {
                                if (clearUserMessageHist.participantUUID === participant.uuid) {
                                  restrictedParticipantUUIDs.push(participant.uuid);
                                }
                              }
                            }
                          }
                          chatThread.participants.forEach(participant => {
                            if (!restrictedParticipantUUIDs.includes(participant.uuid)) {
                              sails.sockets.broadcast(participant.uuid, {
                                type: 'U_STATE',
                                code: 5,
                                body: {
                                  //threadId: chatThread.id,
                                  participant: { secondaryProfilePic, lastSeenAt, online, name, gender, uuid }
                                }
                              });
                            }
                          });
                        });

      }

      // All done.
      return exits.success();

    }catch(e) {
      sails.log('LOGGING error e => ', e);
      return exits.error();
    }

  }


};

