/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Counts',


  description: 'Counts users view and others subjects with included in menu.',


  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    }
  },


  exits: {
    // FETCH_ERROR: {
    //   description: 'Any error occured, while fetching data'
    // }
  },


  fn: async function (inputs, exits) {

    try {

      const userId = inputs.req.session.userId;
      const uuid = inputs.req.me.uuid;
      let resultCountsArray;

      if (userId) {

        resultCountsArray = await Promise.all([
          View.count({ viewedId: userId, isNew: true }),
          View.count({ viewedId: userId }),
          sails.helpers.messagesCounts.with({ userUUID: uuid })
        ]);

      }

      return exits.success(!resultCountsArray ? undefined : ({
        new: resultCountsArray[0] || 0,
        total: resultCountsArray[1] || 0,
        unreadMessagesTotalCount: resultCountsArray[2].unreadMessagesTotalCount,
        messagesTotalCount: resultCountsArray[2].messagesTotalCount,
        activeThreadCount: resultCountsArray[2].activeThreadCount
      }));

    }catch(e) {
      sails.log('LOGGING error e => ', e);
      return exits.error();
    }

  }


};

