/**
 * Message.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    messageID: {
      type: 'string',
      required: true
    },

    fromUUID: {
      type: 'string',
      required: true
    },

    toUUID: {
      type: 'string',
      required: true
    },

    delivered: {
      type: 'boolean',
      defaultsTo: false
    },

    deliveredAt: {
      type: 'number',
      isInteger: true
    },

    viewed: {
      type: 'boolean',
      defaultsTo: false
    },

    viewedAt: {
      type: 'number',
      isInteger: true
    },

    threadId: {
      type: 'string',
      required: true
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    author: {
      model: 'user'
    },
    thread: {
      model: 'chatthread'
    },
    messageData: {
      model: 'messagedata'
    }

  },

};

