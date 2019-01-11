module.exports = {


  friendlyName: 'Remove unwanted model attrs',


  description: '',

  sync: true,

  inputs: {
    model: {
      type: 'ref',
      required: true
    },
    modelAttrs: {
      type: 'ref'
    }
  },


  exits: {

  },


  fn: function (inputs, exits) {

    let sanitizedModelAttrs;

    if (inputs.modelAttrs) {

      sanitizedModelAttrs = _.extend({}, inputs.modelAttrs);
      for (let attrName in inputs.model.attributes) {
        if (inputs.model.attributes[attrName].protect) {
          delete sanitizedModelAttrs[attrName];
        }
      }
      delete sanitizedModelAttrs.id;

    }

    return exits.success(sanitizedModelAttrs);

  }


};

