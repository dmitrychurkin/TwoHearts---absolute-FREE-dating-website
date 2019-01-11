/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["name","place","dateOfBirth","gender","thought","interests","lookingFor","purpose","ageRange","lookingAs","datingAs","sponsore","aboutEssay","expectEssay","height","weight","body","eyes","hair","extras","relation","children","mortgage","car","education","income","scope","smoke","drink","languages","sport","orientation","sexRole","sexLikeIn","sexOral","sexGroup","sexBdsm","sexFetish","educationAutoPortrait","musicAutoPortrait","movieAutoPortrait","bookAutoPortrait","recipeAutoPortrait","countryAutoPortrait","hobbyAutoPortrait","placeAutoPortrait","goodAutoPortrait","badAutoPortrait","qualityAutoPortrait","forgiveAutoPortrait","religionAutoPortrait","petAutoPortrait","meritAutoPortrait","limitationAutoPortrait","workAutoPortrait","actAutoPortrait","tvAutoPortrait","filthAutoPortrait","userCustomURL","fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["email","password","rememberMe","userDeviceType"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["email","password","name","confirmPassword","place","dateOfBirth","gender","lookingFor","purpose","userDeviceType"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},'checkUserURL':{"verb":"PUT","url":"/api/v1/check-user-custom-url","args":["userCustomURL"]},'viewers':{"verb":"GET","url":"/api/v1/views/:page","args":[]}}
  /* eslint-enable */

});
