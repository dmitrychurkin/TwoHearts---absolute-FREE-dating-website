module.exports = {


  friendlyName: 'Subscribe user to socket',


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

    const { uuid } = this.req.me;

    if (!uuid || !this.req.isSocket) {
      throw 'invalid';
    }

    sails.sockets.leaveAll(uuid, err => {
      if (err) {
        throw 'someError';
      }
      sails.sockets.join(this.req, uuid, err => {
        if (err) {
          throw 'someError';
        }
        return exits.success();
      });
    });


  }


};
