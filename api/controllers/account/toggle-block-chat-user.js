/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Toggle block chat user',


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

    const { userUUID } = this.req.allParams();

    if (!this.req.isSocket || !userUUID) {
      throw 'invalid';
    }

    try {

      const chatBlacklistedUser = await ChatBlacklistedUser.findOne({ where: { uuid: userUUID }, select: ['id'] });

      if (chatBlacklistedUser) {
        await ChatBlacklistedUser.destroyOne({ id: chatBlacklistedUser.id });
      }else {
        await ChatBlacklistedUser.create({
          uuid: userUUID,
          blockedAt: Date.now(),
          user: this.req.session.userId
        });
      }

      return exits.success({
        type: 'TOGGLE_BLOCK_USER',
        code: 10,
        body: {
          participant: {
            uuid: userUUID,
            userBlocked: !chatBlacklistedUser
          }
        }
      });

    }catch(e) {
      throw 'someError';
    }

  }


};
