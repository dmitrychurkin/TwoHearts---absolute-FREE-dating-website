module.exports = {


  friendlyName: 'Signup',


  description: 'Sign up for a new user account.',


  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    name:  {
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 20,
      example: 'Frida Kahlo de Rivera',
      description: 'The user\'s full name.',
    },

    gender: {
      required: true,
      type: 'number',
      isInteger: true,
      min: 0,
      max: 1,
      description: 'Gender of user: 1 - male; 0 - female',
      example: 1
    },

    dateOfBirth: {
      required: true,
      type: 'string',
      custom: value => {
        const re = /^[0-9]{4}-[0-9]{2}-[0-9]{1,2}$/;
        if (re.test(value)) {
          const [ year, month, day ] = value.split('-');
          const userBirthDateMs = +new Date(year, month-1, day);
          return !Number.isNaN(userBirthDateMs) && userBirthDateMs <= new Date(new Date().setFullYear(new Date().getFullYear() - 18))
        }
        return false
      },
      description: 'Users birth date',
      example: '1988-06-22'
    },

    lookingFor: {
      required: true,
      type: 'json',
      custom: val => {
        if (Array.isArray(val) && val.length-1 <= 1) {
          return val.every(v => typeof v === 'number' && v >= 0 && v <= 1);
        }
        return false;
      },
      description: 'For of user male or female or both',
      example: [1]
    },

    purpose: {
      required: true,
      type: 'number',
      isInteger: true,
      min: 0,
      max: 3,
      description: 'Porpose of dating: 0 - friedship, 1 - romantic flirt, 2 - family, 3 - Sex',
      example: 1
    },

    place: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 200,
      description: 'Place, where user locates',
      example: 'Mariupol'
    },

    email: {
      required: true,
      type: 'string',
      isEmail: true,
      maxLength: 200,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
      example: 'carol.reyna@microsoft.com'
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      minLength: 6,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    confirmPassword: {
      required: true,
      type: 'string',
      maxLength: 200,
      minLength: 6,
      example: 'passwordlol',
      description: 'Repeat password to match'
    },

    userDeviceType: {
      type: 'number',
      required: true,
      isInteger: true,
      min: 0,
      max: 2,
      description: 'Describes device from which user currently logged in: 0 - iOS, 1 - Android, 2 - desctop/laptop'
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided user fields are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs, exits) {
    const localizedJson = require(`../../../config/locales/${this.req.getLocale()}`);
    //console.log('COOKIES ', this.req.cookies);
    //console.log('Locale ', this.req.getLocale());
    //console.log('Incoming inputs ', inputs);
    const { name, gender, dateOfBirth, lookingFor, purpose, place, email, password, confirmPassword, userDeviceType } = inputs;

    const pwd = password.trim();
    const confirmPwd = confirmPassword.trim();
    if (pwd.length < 6) {
      return exits.invalid(localizedJson['password_minlength']);
    }
    if (pwd !== confirmPwd) {
      return exits.invalid(localizedJson['password_mismatch']);
    }
    var newEmailAddress = email.trim().toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord = await User.create(Object.assign({
      name: name.trim(),
      gender,
      dateOfBirth: dateOfBirth.trim(),
      lookingFor,
      purpose: [purpose],
      place: place.trim(),
      email: newEmailAddress,
      password: pwd.trim(), //await sails.helpers.passwords.hashPassword(inputs.password),
      tosAcceptedByIp: this.req.ip,
      userDeviceType,
      online: true
    }, sails.config.custom.verifyEmailAddresses? {
      emailProofToken: await sails.helpers.strings.random('url-friendly'),
      emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
      emailStatus: 'unconfirmed'
    }:{}))
    .intercept('E_UNIQUE', () => ({ 'emailAlreadyInUse': localizedJson['email_already_inuse'] }))
    .intercept({name: 'UsageError'}, () => ({ 'invalid': localizedJson['signup_invalid'] }))
    .fetch();
    //console.log('newUserRecord => ', newUserRecord);
    // If billing feaures are enabled, save a new customer entry in the Stripe API.
    // Then persist the Stripe customer id in the database.
    if (sails.config.custom.enableBillingFeatures) {
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        emailAddress: newEmailAddress
      });
      await User.update(newUserRecord.id).set({
        stripeCustomerId
      });
    }

    // Store the user's new id in their session.
    this.req.session.userId = newUserRecord.id;

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: inputs.fullName,
          token: newUserRecord.emailProofToken
        }
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

    // Since everything went ok, send our 200 response.
    return exits.success();

  }

};
