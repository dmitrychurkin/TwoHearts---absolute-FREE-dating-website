/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /':                   { action: 'view-homepage-or-redirect' },
  'GET /user/:uuid':         { action: 'dashboard/view-profile' },
  'GET /user/:uuid/photo':   { action: 'dashboard/view-profile' },
  'GET /user/:uuid/diary':   { action: 'dashboard/view-profile' },
  'GET /profile':            { action: 'dashboard/view-profile-authenticated' },
  'GET /profile/photo':      { action: 'dashboard/view-profile-authenticated' },
  'GET /profile/diary':      { action: 'dashboard/view-profile-authenticated' },
  'GET /profile/views':      { action: 'dashboard/view-profile-view' },
  'GET /profile/chat/:uuid?': { action: 'dashboard/view-profile-chat' },

  'GET /faq':                { view:   'pages/faq' },
  'GET /legal/terms':        { view:   'pages/legal/terms' },
  'GET /legal/privacy':      { view:   'pages/legal/privacy' },
  'GET /contact':            { view:   'pages/contact' },

  'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { view:   'pages/entrance/confirmed-email' },

  'GET /login':              { action: 'entrance/view-login' },
  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },
  'POST /search':            { action: 'search-partner' },

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
  'PUT  /api/v1/check-user-custom-url':               'account/check-user-custom-url',
  '/api/v1/views/:page':                           { action: 'dashboard/view-profile-view' },
  '/api/v1/search/:page':                          { action: 'search-partner' },
  'PUT /api/v1/account/send-message':              { action: 'account/send-chat-message' },
  '/api/v1/account/thread-messages':               { action: 'account/get-chat-thread-messages' },
  'PATCH /api/v1/account/messages-viewed':         { action: 'account/chat-message-viewed' },
  'PATCH /api/v1/account/message-delivered':       { action: 'account/chat-message-delivered' },
  'PUT /api/v1/account/user-typing':               { action: 'account/chat-user-typing' },
  '/api/v1/account/subscribe-to-sock':             { action: 'account/subscribe-user-to-socket' },
  'PATCH /api/v1/account/clear-message-history':   { action: 'account/clear-user-message-history' },
  'DELETE /api/v1/account/remove-chat':            { action: 'account/clear-user-chat-thread' },
  'PATCH /api/v1/account/toggle-mute-chat':        { action: 'account/toggle-mute-chat-thread' },
  'PATCH /api/v1/account/toggle-block-user':       { action: 'account/toggle-block-chat-user' },

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  '/test/debug':                              { action: 'debug-dev-only' },

  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/terms':                   '/legal/terms',
  //'/logout':                  '/api/v1/account/logout',

};
