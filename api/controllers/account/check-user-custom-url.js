module.exports = {


  friendlyName: 'Check user custom url',


  description: 'We allow for user to change his profile URL. So we check in our DB for unique user given name of page',


  inputs: {
    userCustomURL: {
      type: 'string',
      required: true,
      maxLength: 45
    }
  },


  exits: {

    alreadyInUse: {
      statusCode: 409
    },
    invalidInput: {
      responseType: 'badRequest'
    },
    success: {
      description: 'Given name can be used'
    },
    failure: {
      responseType: 'serverError'
    }
  },


  fn: async function ({ userCustomURL }, exits) {
    const localizedJson = require(`../../../config/locales/${this.req.getLocale()}`);
    const url = userCustomURL.trim();
    if (!url) {
      throw {'invalidInput': localizedJson['empty_string']};
    }

    const user = await User.findOne({or: [{userCustomURL: url}, {uuid: url}]})
                            .intercept(() => ({'failure': localizedJson['500.error']}));
    if (user) {
      throw {'alreadyInUse': localizedJson['url_in_use']};
    }
    
    return exits.success();

  }


};
