/**
 * ClearUserMessageHistory.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
// owner of metadata
    partcipantId: {
      type: 'string',
      required: true
    },

    participantUUID: {
      type: 'string',
      required: true,
      isUUID: true
    },

    chatThreadId: {
      type: 'string',
      required: true
    },

// clear messages history
    displayMessagesAfter: {
      type: 'number',
      isInteger: true
    },

// thread removed
    threadRemoved: {
      type: 'boolean',
      defaultsTo: false
    },

    threadRemovedAt: {
      type: 'number',
      isInteger: true
    },

// thread muted
    threadMuted: {
      type: 'boolean',
      defaultsTo: false
    },

    threadMutedAt: {
      type: 'number',
      isInteger: true
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    thread: {
      model: 'chatthread'
    },
    partcipant: {
      model: 'user'
    }

  },

};

