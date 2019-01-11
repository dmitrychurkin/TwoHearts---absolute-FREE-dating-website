module.exports = {


  friendlyName: 'Debug dev only',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const testData = await ClearUserMessageHistory.create({ chatThreadId: '5c16c726fed3371ac463f30a', participantUUID: '22e68253-9ecf-4dd5-a2d5-fa2250469768', threadRemoved: true, thread: '5c16c726fed3371ac463f30a' })
                                                  .fetch();
    sails.log('testData => ', testData);
    return exits.success();

  }


};
