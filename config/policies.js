/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': ['currently-viewing', 'is-logged-in'],

  // Bypass the `is-logged-in` policy for:
  'dashboard/*': 'currently-viewing',
  'entrance/*': 'currently-viewing',
  'account/logout': 'currently-viewing',
  'view-homepage-or-redirect': 'currently-viewing',
  'deliver-contact-form-message': 'currently-viewing',
  'search-partner': 'currently-viewing',

  //Test only bypassing `is-logged-in` => dont forget to remove
  /*'account/send-chat-message': true,
  'account/get-chat-thread-messages': true,
  'account/chat-message-delivered': true,
  'account/chat-message-viewed': true,
  'account/chat-user-typing': true,*/
  'debug-dev-only': true,

  // Bypass the `currently-viewing` policy for:
  'dashboard/view-profile': true

};
