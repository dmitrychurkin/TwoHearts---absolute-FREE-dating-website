/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  autoIncrementedFieldsArray: [],

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    password: {
      type: 'string',
      required: true,
      minLength: 6,
      maxLength: 200,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    name: {
      type: 'string',
      required: true,
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

    primaryProfilePic: {
      type: 'string',
      description: 'User\'s profile main image related url',
      example: '/profile/1y323rtef324/profile_img_1.png'
    },

    secondaryProfilePic: {
      type: 'string',
      description: 'User\'s profile search card (tile) image related url',
      example: '/profile/1y323rtef324/profile_img_2.png'
    },

    gender: {
      type: 'number',
      isInteger: true,
      min: 0,
      max: 1,
      description: 'Gender of user: 1 - male; 0 - female',
      defaultsTo: 1
    },

    lookingFor: {
      type: 'json',
      custom: arrayValuesValidation(0,1),
      description: 'For of user male or female or both',
      defaultsTo: [0]
    },

    purpose: {
      type: 'json',
      description: "[{text:'Поиск друзей',value:0,display:'дружбы'},{text:'Романтические отношения',value:1,display:'романтических отношений'},{text:'Создание семьи',value:2,display:'создания семьи'},{text:'Секс',value:3,display:'секса'},{text:'Совместное путешествие',value:4,display:'совместного путешествия'}]",
      custom: arrayValuesValidation(0,4),
      defaultsTo: []
    },

    thought: {
      type: 'string',
      maxLength: 200,
      description: 'User thoughts'
    },

    interests: {
      type: 'json',
      description: 'Array of users interests',
      example: ['football', 'hockey'],
      custom: value => Array.isArray(value) && value.length <= 50 && value.every(v => v.length <= 50),
      defaultsTo: []
    },

    ageRange: {
      type: 'json',
      description: 'Array of user age requirements',
      custom: value => Array.isArray(value) && value.length == 2 && value.every(v => v <= 99 && v >= 18),
      defaultsTo: [18, 20]
    },

    lookingAs: {
      type: 'json',
      description: "Array looking as [{text:'М+Ж',value:0,display:'М+Ж'},{text:'М+М',value:1,display:'М+М'},{text:'Ж+Ж',value:2,display:'Ж+Ж'}]",
      example: [0,1],
      custom: arrayValuesValidation(0,2),
      defaultsTo: []
    },

    datingAs: {
      type: 'number',
      description: "[{text:'М+Ж',value:1,display:'М+Ж'},{text:'М+М',value:2,display:'М+М'},{text:'Ж+Ж',value:3,display:'Ж+Ж'},{text:'Нет ответа',value:0,display:''}]",
      isInteger: true,
      min: 0,
      max: 3,
      defaultsTo: 0
    },

    sponsore: {
      type: 'number',
      description: "[{text:'Нужна поддержка',value:1,display:'Нужна поддержка'},{text:'Готов поддержать',value:2,display:'Готов поддержать'},{text:'Нет ответа',value:0,display:''}]",
      isInteger: true,
      min: 0,
      max: 2,
      defaultsTo: 0
    },

    aboutEssay: {
      type: 'string',
      maxLength: 2000,
      description: 'About user essay'
    },

    expectEssay: {
      type: 'string',
      maxLength: 2000,
      description: 'Partner expectations'
    },

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
      max: 4,
      defaultsTo: 0
    },

    eyes: {
      type: 'number',
      description: "[{text:'Карие',value:1},{text:'Серые',value:2},{text:'Голубые',value:3},{text:'Зеленые',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4,
      defaultsTo: 0
    },

    hair: {
      type: 'number',
      description: "[{text:'Блонд',value:1,display:'белокурые'},{text:'Русые',value:2},{text:'Шатен',value:3,display:'каштановые'},{text:'Черные',value:4},{text:'Рыжие',value:5},{text:'Седые',value:6},{text:'Мелированные',value:7},{text:'Голова бритая наголо',value:8},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 8,
      defaultsTo: 0
    },

    extras: {
      type: 'json',
      description: "['Пирсинг','Татуировки','Шрамы','Веснушки']",
      example: [0,1,3],
      custom: arrayValuesValidation(0,3),
      defaultsTo: []
    },

    relation: {
      type: 'number',
      description: "[{text:'Свободен',value:1},{text:'Занят',value:2},{text:'Женат, живем порознь',value:3},{text:'Разведен',value:4},{text:'Вдовец',value:5},{text:'Всё сложно',value:6},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 6,
      defaultsTo: 0
    },

    children: {
      type: 'number',
      description: "[{text:'Нет, и не хочу',value:1},{text:'Возможны в будущем',value:2},{text:'Уже есть, больше не хочу',value:3},{text:'Уже есть, хочу еще',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4,
      defaultsTo: 0
    },

    mortgage: {
      type: 'number',
      description: "[{text:'Собственная квартира',value:1},{text:'Дом, коттедж',value:2},{text:'Комната в общежитии, коммуналка',value:3},{text:'Снимаю квартиру',value:4},{text:'Снимаю комнату',value:5},{text:'Живу у родителей',value:6},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 6,
      defaultsTo: 0
    },

    car: {
      type: 'number',
      description: "[{text:'Нет',value:1},{text:'Есть',value:2},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 2,
      defaultsTo: 0
    },

    education: {
      type: 'number',
      description: "[{text:'Среднее',value:1},{text:'Среднее-специальное',value:2},{text:'Студент(-ка)',value:3},{text:'Неполное высшее',value:4},{text:'Высшее',value:5},{text:'Несколько высших',value:6},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 6,
      defaultsTo: 0
    },

    income: {
      type: 'number',
      description: "[{text:'Небольшой стабильный доход',value:1},{text:'Средний доход',value:2},{text:'Очень хорошо зарабатываю',value:3},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 3,
      defaultsTo: 0
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
      max: 4,
      defaultsTo: 0
    },

    drink: {
      type: 'number',
      description: "[{text:'Не пью, не терплю выпивающих',value:1},{text:'Не пью, к выпивающим отношусь нейтрально',value:2},{text:'Выпиваю иногда в компаниях',value:3},{text:'Люблю выпить',value:4},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 4,
      defaultsTo: 0
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
      },
      defaultsTo: []
    },

    sport: {
      type: 'json',
      description: "[{value:0,text:'Бег'},{value:1,text:'Ходьба'},{value:2,text:'Фитнес'},{value:3,text:'Плавание'},{value:4,text:'Велосипед'},{value:5,text:'Ролики'},{value:6,text:'Лыжи'},{value:7,text:'Качалка'},{value:8,text:'Экстрим'},{value:9,text:'Единоборства'},{value:10,text:'Йога'},{value:11,text:'Командные игры'},{value:12,text:'Танцы'},{value:13,text:'Футбол'},{value:14,text:'Волейбол'},{value:15,text:'Хоккей'},{value:16,text:'Коньки'},{value:17,text:'Пилатес'},{value:18,text:'Гимнастика'}]",
      example: [1,4,8],
      custom: arrayValuesValidation(0, 18),
      defaultsTo: []
    },

    orientation: {
      type: 'number',
      description: "[{value:1,text:'Гетеро'},{value:2,text:'В поиске себя'},{value:3,text:userProfile.mainData.data.gender?'Пансексуал':'Пансексуалка'},{value:4,text:userProfile.mainData.data.gender?'Бисексуал':'Бисексуалка'},{value:5,text:userProfile.mainData.data.gender?'Гей':'Лесбиянка'},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 5,
      defaultsTo: 0
    },

    sexRole: {
      type: 'number',
      description: "[{value:1,text:'Универсальная'},{value:2,text:'Активная'},{value:3,text:'Пассивная'},{text:'Нет ответа',value:0}]",
      isInteger: true,
      min: 0,
      max: 3,
      defaultsTo: 0
    },

    sexLikeIn: {
      type: 'json',
      description: "[{value:0,text:'Классический секс'},{value:1,text:'Анальный секс'},{value:2,text:'Ролевые игры'},{value:3,text:'Публичный секс'},{value:4,text:'Подглядывание'},{value:5,text:'Шимейл'},{value:6,text:'Кросс-дрессинг'},{value:7,text:'MILF'},{value:8,text:'Большой член'},{value:9,text:'Сквирт'},{value:10,text:'Фистинг'},{value:11,text:'Фингеринг'},{value:12,text:'Взаимная мастурбация'},{value:13,text:'Трибадизм'},{value:14,text:'Фрот'},{value:15,text:'Золотой дождь'}]",
      custom: arrayValuesValidation(0,15),
      defaultsTo: []
    },

    sexOral: {
      type: 'json',
      description: "[{value:16,text:'Минет'},{value:17,text:'Глубокий минет'},{value:18,text:'МБР'},{value:19,text:'Куннилигус'},{value:20,text:'Вылизывание тела'},{value:21,text:'Вылизывание ног'},{value:22,text:'Анилингус'},{value:23,text:'Поза 69'}]",
      custom: arrayValuesValidation(16,23),
      defaultsTo: []
    },

    sexGroup: {
      type: 'json',
      description: "[{value:24,text:'Свинг'},{value:25,text:'Оргия'},{value:26,text:'ЖМЖ'},{value:27,text:'МЖМ'},{value:28,text:'МЖМЖ'},{value:29,text:'Куколд'}]",
      custom: arrayValuesValidation(24,29),
      defaultsTo: []
    },

    sexBdsm: {
      type: 'json',
      description: "[{value:30,text:'Доминирование'},{value:31,text:'Подчинение'},{value:32,text:'Свитчинг'},{value:33,text:'Порка'},{value:34,text:'Бондаж'},{value:35,text:'Игры с дыханием'},{value:36,text:'Беби-плей'},{value:37,text:'Пет-плей'},{value:38,text:'Пеггинг'},{value:39,text:'Страпон'},{value:40,text:'Принуждение'},{value:41,text:'Пси-доминация'},{value:42,text:'Туалетные игры'},{value:43,text:'Фейсситтинг'},{value:44,text:'Садо'},{value:45,text:'Мазо'}]",
      custom: arrayValuesValidation(30,45),
      defaultsTo: []
    },

    sexFetish: {
      type: 'json',
      description: "[{value:46,text:'Кружевное белье'},{value:47,text:'Латекс'},{value:48,text:'Кожа'},{value:49,text:'Нейлон'},{value:50,text:'Фут-фетиш'}]",
      custom: arrayValuesValidation(46,50),
      defaultsTo: []
    },

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

    // newViewsPageVisitedState: {
    //   type: 'boolean',
    //   description: `Describes current state of seen views: 
    //                 true => user currently viewing URI "/profile/new-views" and in case of leaving this URI we may update state View.isNew to false
    //                 false => user still did not visited URI "/profile/new-views"`,
    //   defaultsTo: false
    // },
    zodiac: {
      type: 'number',
      isInteger: true,
      min: 1,
      max: 12,
      protect: true,
    },

    userCustomURL: {
      type: 'string',
      description: 'To allow user override predefined uuid in URL',
      example: 'http://localhost:1337/user/88b04452-f53f-4177-b080-25b0032dd796 => http://localhost:1337/user/dimasik',
      maxLength: 45
    },

    photosCount: {
      type: 'number',
      defaultsTo: 0,
      description: 'Total count of all user photos'
    },

    online: {
      type: 'boolean',
      description: 'Define whether user online or not'
    },

    userDeviceType: {
      type: 'number',
      isInteger: true,
      min: 0,
      max: 2,
      description: 'Describes device from which user currently logged in: 0 - iOS, 1 - Android, 2 - desctop/laptop'
    },

    year: {
      type: 'number',
      isInteger: true,
      required: true,
      protect: true,
    },

    month: {
      type: 'number',
      isInteger: true,
      required: true,
      protect: true,
    },

    date: {
      type: 'number',
      isInteger: true,
      required: true,
      protect: true,
    },

    fullName: {
      type: 'string',
      description: 'Full representation of the user\'s name',
      maxLength: 120,
      example: 'Lisa Microwave van der Jenny'
    },

    isSuperAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
      protect: true,
      extendedDescription:
`Super admins might have extra permissions, see a different default home page when they log in,
or even have a completely different feature set from normal users.  In this app, the \`isSuperAdmin\`
flag is just here as a simple way to represent two different kinds of users.  Usually, it's a good idea
to keep the data model as simple as possible, only adding attributes when you actually need them for
features being built right now.

For example, a "super admin" user for a small to medium-sized e-commerce website might be able to
change prices, deactivate seasonal categories, add new offerings, and view live orders as they come in.
On the other hand, for an e-commerce website like Walmart.com that has undergone years of development
by a large team, those administrative features might be split across a few different roles.

So, while this \`isSuperAdmin\` demarcation might not be the right approach forever, it's a good place to start.`
    },

    passwordResetToken: {
      type: 'string',
      description: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    stripeCustomerId: {
      type: 'string',
      protect: true,
      description: 'The id of the customer entry in Stripe associated with this user (or empty string if this user is not linked to a Stripe customer -- e.g. if billing features are not enabled).',
      extendedDescription:
`Just because this value is set doesn't necessarily mean that this user has a billing card.
It just means they have a customer entry in Stripe, which might or might not have a billing card.`
    },

    hasBillingCard: {
      type: 'boolean',
      description: 'Whether this user has a default billing card hooked up as their payment method.',
      extendedDescription:
`More specifically, this indcates whether this user record's linked customer entry in Stripe has
a default payment source (i.e. credit card).  Note that a user have a \`stripeCustomerId\`
without necessarily having a billing card.`
    },

    billingCardBrand: {
      type: 'string',
      example: 'Visa',
      description: 'The brand of this user\'s default billing card (or empty string if no billing card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    billingCardLast4: {
      type: 'string',
      example: '4242',
      description: 'The last four digits of the card number for this user\'s default billing card (or empty string if no billing card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    billingCardExpMonth: {
      type: 'string',
      example: '08',
      description: 'The two-digit expiration month from this user\'s default billing card, formatted as MM (or empty string if no billing card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    billingCardExpYear: {
      type: 'string',
      example: '2023',
      description: 'The four-digit expiration year from this user\'s default billing card, formatted as YYYY (or empty string if no credit card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },

    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      defaultsTo: 'confirmed',
      description: 'The confirmation status of the user\'s email address.',
      extendedDescription:
`Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "changeRequested"
email status until they click the link in the confirmation email.`
    },

    emailChangeCandidate: {
      type: 'string',
      description: 'The (still-unconfirmed) email address that this user wants to change to.'
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
    },

    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a
    userCount: {
      type: 'number',
      autoIncrement: true,
      defaultsTo: 0,
      protect: true
    },

    uuid: {
      type: 'string',
      isUUID: true,
      description: 'uuid of user'
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a
    chats: {
      collection: 'chatthread',
      via: 'participants'
    },
    chatBlacklistedUsers: {
      collection: 'chatblacklisteduser',
      via: 'user'
    }

  },

  beforeCreate: function (valuesToSet, proceed) {

    let error;
    const dateOfBirthArr = valuesToSet.dateOfBirth.split('-');
  
    if (dateOfBirthArr.lenght != 3) {
      error = true;
    }
    const [year, month, date ] = dateOfBirthArr;
    if (Number.isNaN(parseInt(year)) || Number.isNaN(parseInt(month)) || Number.isNaN(parseInt(date))) {
      error = true;
    }
    if (error) {
      return proceed(new Error('Wrong birth date format'));
    }
    //set zodiak code
    valuesToSet.zodiac = getZodiacCode(+month, +date);
  
    //set year
    valuesToSet.year = year;
    // set month
    valuesToSet.month = month;
    //set day
    valuesToSet.date = date;
    // set uuid of user
    valuesToSet.uuid = sails.helpers.strings.uuid();
    // Hash password
    sails.helpers.passwords.hashPassword(valuesToSet.password).exec((err, hashedPassword)=>{
      if (err) { return proceed(err); }
      valuesToSet.password = hashedPassword;
    
      User.setAutoIncrements(valuesToSet, proceed);

    });

  },

  async setAutoIncrements(valuesToSet, proceed) {
    
    const attributes = this.attributes;

    if (!this.autoIncrementedFieldsArray.length) {
      for (const field in attributes) {
        const object = attributes[field];
        if (object.autoMigrations.autoIncrement) {
          this.autoIncrementedFieldsArray.push(field);
        }
      }
    }

    try {
      const count = await User.count();
      
      for (const field of this.autoIncrementedFieldsArray) {
        valuesToSet[field] = count + 1;
      }
      proceed(null);
    }catch(e) {
      proceed(e);
    }
    
  }

};

function getZodiacCode(day, month) {
  const Z_CODES = [, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];
  const LAST_DAYS = [, 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
  return (day > LAST_DAYS[month]) ? Z_CODES[month * 1 + 1] : Z_CODES[month];
}

function arrayValuesValidation(minVal, maxVal) {
  return value => {
    if (Array.isArray(value) && value.length-1 <= maxVal) {
      return value.every(v => typeof v === 'number' && v >= minVal && v <= maxVal);
    }
    return false;
  };
}
