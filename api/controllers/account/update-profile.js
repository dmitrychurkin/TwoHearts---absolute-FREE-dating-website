module.exports = {


  friendlyName: 'Update profile',


  description: 'Update the profile for the logged-in user.',


  inputs: {
// "name","place","dateOfBirth","gender",

//"thought",

//"interests",

//"lookingFor","purpose","ageRange","lookingAs","datingAs","sponsore",

//"aboutEssay",

//"expectEssay",

//"height","weight","body","eyes","hair","extras","relation","children","mortgage","car","education","income","scope","smoke","drink","languages","sport",

//"orientation","sexRole","sexLikeIn","sexOral","sexGroup","sexBdsm","sexFetish",

//"educationAutoPortrait","musicAutoPortrait","movieAutoPortrait","bookAutoPortrait","recipeAutoPortrait",
//"countryAutoPortrait","hobbyAutoPortrait","placeAutoPortrait","goodAutoPortrait","badAutoPortrait",
//"qualityAutoPortrait","forgiveAutoPortrait","religionAutoPortrait","petAutoPortrait","meritAutoPortrait",
//"limitationAutoPortrait","workAutoPortrait","actAutoPortrait","tvAutoPortrait","filthAutoPortrait",

//"userCustomURL"

//User mainData
    name: {
      type: 'string',
      description: 'Name of the user',
      minLength: 3,
      maxLength: 20,
      example: 'Dmitry'
    },

    place: {
      type: 'string',
      minLength: 2,
      maxLength: 200,
      description: 'Place, where user locates'
    },

    dateOfBirth: {
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
      description: 'Users birth date'
    },
    gender: {
      type: 'number',
      isInteger: true,
      min: 0,
      max: 1,
      description: 'Gender of user: 1 - male; 0 - female'
    },

// User thought
    thought: {
      type: 'string',
      maxLength: 200,
      description: 'User thoughts'
    },

// User interests
    interests: {
      type: 'json',
      description: 'Array of users interests',
      example: ['football', 'hockey'],
      custom: value => Array.isArray(value) && value.length <= 50 && value.every(v => v.length <= 50)
    },

// User datingReq
    lookingFor: {
      type: 'json',
      custom: arrayValuesValidation(0,1),
      description: 'For of user male or female or both'
    },
    purpose: {
      type: 'json',
      description: "[{text:'Поиск друзей',value:0,display:'дружбы'},{text:'Романтические отношения',value:1,display:'романтических отношений'},{text:'Создание семьи',value:2,display:'создания семьи'},{text:'Секс',value:3,display:'секса'},{text:'Совместное путешествие',value:4,display:'совместного путешествия'}]",
      custom: arrayValuesValidation(0,4)
    },
    ageRange: {
      type: 'json',
      description: 'Array of user age requirements',
      custom: value => Array.isArray(value) && value.length == 2 && value.every(v => v <= 99 && v >= 18)
    },
    lookingAs: {
      type: 'json',
      description: "Array looking as [{text:'М+Ж',value:0,display:'М+Ж'},{text:'М+М',value:1,display:'М+М'},{text:'Ж+Ж',value:2,display:'Ж+Ж'}]",
      example: [0,1],
      custom: arrayValuesValidation(0,2)
    },
    datingAs: {
      type: 'number',
      description: "[{text:'М+Ж',value:1,display:'М+Ж'},{text:'М+М',value:2,display:'М+М'},{text:'Ж+Ж',value:3,display:'Ж+Ж'},{text:'Нет ответа',value:0,display:''}]",
      isInteger: true,
      min: 0,
      max: 3
    },
    sponsore: {
      type: 'number',
      description: "[{text:'Нужна поддержка',value:1,display:'Нужна поддержка'},{text:'Готов поддержать',value:2,display:'Готов поддержать'},{text:'Нет ответа',value:0,display:''}]",
      isInteger: true,
      min: 0,
      max: 2
    },

// User aboutEssay
    aboutEssay: {
      type: 'string',
      maxLength: 2000,
      description: 'About user essay'
    },

// User expectEssay
    expectEssay: {
      type: 'string',
      maxLength: 2000,
      description: 'Partner expectations'
    },

// User generalInfo
    height: {
      type: 'number',
      description: 'User height in CM',
      isInteger: true,
      min: 0,
      max: 240
    },
    weight: {
      type: 'number',
      description: 'User height in KG',
      isInteger: true,
      min: 0,
      max: 150
    },
    body: {
      type: 'number',
      description: "[{text:'Стройное',value:1},{text:'Спортивное',value:2},{text:'Есть пара лишних кило',value:3},{text:'Полное',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4
    },
    eyes: {
      type: 'number',
      description: "[{text:'Карие',value:1},{text:'Серые',value:2},{text:'Голубые',value:3},{text:'Зеленые',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4
    },
    hair: {
      type: 'number',
      description: "[{text:'Блонд',value:1,display:'белокурые'},{text:'Русые',value:2},{text:'Шатен',value:3,display:'каштановые'},{text:'Черные',value:4},{text:'Рыжие',value:5},{text:'Седые',value:6},{text:'Мелированные',value:7},{text:'Голова бритая наголо',value:8},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 8
    },
    extras: {
      type: 'json',
      description: "['Пирсинг','Татуировки','Шрамы','Веснушки']",
      example: [0,1,3],
      custom: arrayValuesValidation(0,3)
    },
    relation: {
      type: 'number',
      description: "[{text:'Свободен',value:1},{text:'Занят',value:2},{text:'Женат, живем порознь',value:3},{text:'Разведен',value:4},{text:'Вдовец',value:5},{text:'Всё сложно',value:6},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 6
    },
    children: {
      type: 'number',
      description: "[{text:'Нет, и не хочу',value:1},{text:'Возможны в будущем',value:2},{text:'Уже есть, больше не хочу',value:3},{text:'Уже есть, хочу еще',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4
    },
    mortgage: {
      type: 'number',
      description: "[{text:'Собственная квартира',value:1},{text:'Дом, коттедж',value:2},{text:'Комната в общежитии, коммуналка',value:3},{text:'Снимаю квартиру',value:4},{text:'Снимаю комнату',value:5},{text:'Живу у родителей',value:6},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 6
    },
    car: {
      type: 'number',
      description: "[{text:'Нет',value:1},{text:'Есть',value:2},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 2
    },
    education: {
      type: 'number',
      description: "[{text:'Среднее',value:1},{text:'Среднее-специальное',value:2},{text:'Студент(-ка)',value:3},{text:'Неполное высшее',value:4},{text:'Высшее',value:5},{text:'Несколько высших',value:6},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 6
    },
    income: {
      type: 'number',
      description: "[{text:'Небольшой стабильный доход',value:1},{text:'Средний доход',value:2},{text:'Очень хорошо зарабатываю',value:3},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 3
    },
    scope: {
      type: 'string',
      description: 'Concrete explanation about user\'s activity',
      maxLength: 200,
      example: 'Lisa Microwave van der Jenny'
    },
    smoke: {
      type: 'number',
      description: "[{text:'Не курю, не терплю курящих',value:1},{text:'Не курю, к курящим отношусь нейтрально',value:2},{text:'Курю время от времени',value:3},{text:'Курю каждый день',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4
    },
    drink: {
      type: 'number',
      description: "[{text:'Не пью, не терплю выпивающих',value:1},{text:'Не пью, к выпивающим отношусь нейтрально',value:2},{text:'Выпиваю иногда в компаниях',value:3},{text:'Люблю выпить',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4
    },
    languages: {
      type: 'json',
      description: "[{text:'Выберите язык',value:0},{text:'Английский',value:1,skill:0},{text:'Немецкий',value:2,skill:0},{text:'Французский',value:3,skill:0},{text:'Итальянский',value:4,skill:0},{text:'Испанский',value:5,skill:0},{text:'Португальский',value:6,skill:0},{text:'Украинский',value:7,skill:0},{text:'Русский',value:8,skill:0},{text:'Иврит',value:9,skill:0},{text:'Арабский',value:10,skill:0}]",
      example: [{ value: 1, skill: 2 }],
      custom: value => {
        if (Array.isArray(value) && value.length <= 10) {
          return value.every(v => v.value >= 0 && v.value <= 10 && v.skill >= 0 && v.skill <= 3);
        }
        return false;
      }
    },
    sport: {
      type: 'json',
      description: "[{value:0,text:'Бег'},{value:1,text:'Ходьба'},{value:2,text:'Фитнес'},{value:3,text:'Плавание'},{value:4,text:'Велосипед'},{value:5,text:'Ролики'},{value:6,text:'Лыжи'},{value:7,text:'Качалка'},{value:8,text:'Экстрим'},{value:9,text:'Единоборства'},{value:10,text:'Йога'},{value:11,text:'Командные игры'},{value:12,text:'Танцы'},{value:13,text:'Футбол'},{value:14,text:'Волейбол'},{value:15,text:'Хоккей'},{value:16,text:'Коньки'},{value:17,text:'Пилатес'},{value:18,text:'Гимнастика'}]",
      example: [1,4,8],
      custom: arrayValuesValidation(0, 18)
    },

// User sexualInfo
    orientation: {
      type: 'number',
      description: "[{value:1,text:'Гетеро'},{value:2,text:'В поиске себя'},{value:3,text:userProfile.mainData.data.gender?'Пансексуал':'Пансексуалка'},{value:4,text:userProfile.mainData.data.gender?'Бисексуал':'Бисексуалка'},{value:5,text:userProfile.mainData.data.gender?'Гей':'Лесбиянка'},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 5
    },

    sexRole: {
      type: 'number',
      description: "[{value:1,text:'Универсальная'},{value:2,text:'Активная'},{value:3,text:'Пассивная'},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 3
    },

    sexLikeIn: {
      type: 'json',
      description: "[{value:0,text:'Классический секс'},{value:1,text:'Анальный секс'},{value:2,text:'Ролевые игры'},{value:3,text:'Публичный секс'},{value:4,text:'Подглядывание'},{value:5,text:'Шимейл'},{value:6,text:'Кросс-дрессинг'},{value:7,text:'MILF'},{value:8,text:'Большой член'},{value:9,text:'Сквирт'},{value:10,text:'Фистинг'},{value:11,text:'Фингеринг'},{value:12,text:'Взаимная мастурбация'},{value:13,text:'Трибадизм'},{value:14,text:'Фрот'},{value:15,text:'Золотой дождь'}]",
      custom: arrayValuesValidation(0,15)
    },

    sexOral: {
      type: 'json',
      description: "[{value:16,text:'Минет'},{value:17,text:'Глубокий минет'},{value:18,text:'МБР'},{value:19,text:'Куннилигус'},{value:20,text:'Вылизывание тела'},{value:21,text:'Вылизывание ног'},{value:22,text:'Анилингус'},{value:23,text:'Поза 69'}]",
      custom: arrayValuesValidation(16,23)
    },

    sexGroup: {
      type: 'json',
      description: "[{value:24,text:'Свинг'},{value:25,text:'Оргия'},{value:26,text:'ЖМЖ'},{value:27,text:'МЖМ'},{value:28,text:'МЖМЖ'},{value:29,text:'Куколд'}]",
      custom: arrayValuesValidation(24,29)
    },

    sexBdsm: {
      type: 'json',
      description: "[{value:30,text:'Доминирование'},{value:31,text:'Подчинение'},{value:32,text:'Свитчинг'},{value:33,text:'Порка'},{value:34,text:'Бондаж'},{value:35,text:'Игры с дыханием'},{value:36,text:'Беби-плей'},{value:37,text:'Пет-плей'},{value:38,text:'Пеггинг'},{value:39,text:'Страпон'},{value:40,text:'Принуждение'},{value:41,text:'Пси-доминация'},{value:42,text:'Туалетные игры'},{value:43,text:'Фейсситтинг'},{value:44,text:'Садо'},{value:45,text:'Мазо'}]",
      custom: arrayValuesValidation(30,45)
    },

    sexFetish: {
      type: 'json',
      description: "[{value:46,text:'Кружевное белье'},{value:47,text:'Латекс'},{value:48,text:'Кожа'},{value:49,text:'Нейлон'},{value:50,text:'Фут-фетиш'}]",
      custom: arrayValuesValidation(46,50)
    },

// User autoPortrait
    educationAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    musicAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    movieAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    bookAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    recipeAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    countryAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    hobbyAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    placeAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    goodAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    badAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    qualityAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    forgiveAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    religionAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    petAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    meritAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    limitationAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    workAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    actAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    tvAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },
    filthAutoPortrait: {
      type: 'string',
      maxLength: 5000
    },

// User url
    userCustomURL: {
      type: 'string',
      description: 'To allow user override predefined uuid in URL',
      example: 'http://localhost:1337/user/88b04452-f53f-4177-b080-25b0032dd796 => http://localhost:1337/user/dimasik',
      maxLength: 45
    },


    fullName: {
      type: 'string'
    },

    emailAddress: {
      type: 'string'
    },

  },


  exits: {

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs, exits) {

    const userCustomURL = inputs.userCustomURL && inputs.userCustomURL.trim();
    if (userCustomURL) {
      const conflictingUser = await User.findOne({or: [{userCustomURL},{uuid: userCustomURL}]});
      if (conflictingUser) {
        throw {'emailAlreadyInUse': require(`../../../config/locales/${this.req.getLocale()}`)['url_in_use']};
      }
    }

    var newEmailAddress = inputs.emailAddress;
    if (newEmailAddress !== undefined) {
      newEmailAddress = newEmailAddress.toLowerCase();
    }

    // Determine if this request wants to change the current user's email address,
    // revert her pending email address change, modify her pending email address
    // change, or if the email address won't be affected at all.
    var desiredEffectReEmail;// ('changeImmediately', 'beginChange', 'cancelPendingChange', 'modifyPendingChange', or '')
    if (
      newEmailAddress === undefined ||
      (this.req.me.emailStatus !== 'changeRequested' && newEmailAddress === this.req.me.emailAddress) ||
      (this.req.me.emailStatus === 'changeRequested' && newEmailAddress === this.req.me.emailChangeCandidate)
    ) {
      desiredEffectReEmail = '';
    } else if (this.req.me.emailStatus === 'changeRequested' && newEmailAddress === this.req.me.emailAddress) {
      desiredEffectReEmail = 'cancelPendingChange';
    } else if (this.req.me.emailStatus === 'changeRequested' && newEmailAddress !== this.req.me.emailAddress) {
      desiredEffectReEmail = 'modifyPendingChange';
    } else if (!sails.config.custom.verifyEmailAddresses || this.req.me.emailStatus === 'unconfirmed') {
      desiredEffectReEmail = 'changeImmediately';
    } else {
      desiredEffectReEmail = 'beginChange';
    }


    // If the email address is changing, make sure it is not already being used.
    if (_.contains(['beginChange', 'changeImmediately', 'modifyPendingChange'], desiredEffectReEmail)) {
      let conflictingUser = await User.findOne({
        or: [
          { emailAddress: newEmailAddress },
          { emailChangeCandidate: newEmailAddress }
        ]
      });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }


    // Start building the values to set in the db.
    // (We always set the fullName if provided.)
    var valuesToSet = {
      fullName: inputs.fullName,
    };

    for (const input in inputs) {
      const value = inputs[input];
      //if (typeof value === 'undefined' || (typeof value === 'string' && value.length == 0)) {
        //continue;
      //}
      valuesToSet[input] = value;
    }

    switch (desiredEffectReEmail) {

      // Change now
      case 'changeImmediately':
        Object.assign(valuesToSet, {
          emailAddress: newEmailAddress,
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: this.req.me.emailStatus === 'unconfirmed' ? 'unconfirmed' : 'confirmed'
        });
        break;

      // Begin new email change, or modify a pending email change
      case 'beginChange':
      case 'modifyPendingChange':
        Object.assign(valuesToSet, {
          emailChangeCandidate: newEmailAddress,
          emailProofToken: await sails.helpers.strings.random('url-friendly'),
          emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: 'changeRequested'
        });
        break;

      // Cancel pending email change
      case 'cancelPendingChange':
        Object.assign(valuesToSet, {
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: 'confirmed'
        });
        break;

      // Otherwise, do nothing re: email
    }

    // Save to the db
    await User.update({id: this.req.me.id }).set(valuesToSet);

    // If this is an immediate change, and billing features are enabled,
    // then also update the billing email for this user's linked customer entry
    // in the Stripe API to make sure they receive email receipts.
    // > Note: If there was not already a Stripe customer entry for this user,
    // > then one will be set up implicitly, so we'll need to persist it to our
    // > database.  (This could happen if Stripe credentials were not configured
    // > at the time this user was originally created.)
    if(desiredEffectReEmail === 'changeImmediately' && sails.config.custom.enableBillingFeatures) {
      let didNotAlreadyHaveCustomerId = (! this.req.me.stripeCustomerId);
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        stripeCustomerId: this.req.me.stripeCustomerId,
        emailAddress: newEmailAddress
      });
      if (didNotAlreadyHaveCustomerId){
        await User.update({ id: this.req.me.id }).set({
          stripeCustomerId
        });
      }
    }

    // If an email address change was requested, and re-confirmation is required,
    // send the "confirm account" email.
    if (desiredEffectReEmail === 'beginChange' || desiredEffectReEmail === 'modifyPendingChange') {
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: 'Your account has been updated',
        template: 'email-verify-new-email',
        templateData: {
          fullName: inputs.fullName||this.req.me.fullName,
          token: valuesToSet.emailProofToken
        }
      });
    }

    return exits.success();

  }


};

function arrayValuesValidation(minVal, maxVal) {
  return value => {
    if (Array.isArray(value) && value.length-1 <= maxVal) {
      return value.every(v => typeof v === 'number' && v >= minVal && v <= maxVal);
    }
    return false;
  };
}