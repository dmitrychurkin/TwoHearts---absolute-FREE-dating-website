module.exports = {


  friendlyName: 'Search partner',


  description: '',


  inputs: {

  },


  exits: {

    // invalid: {
    //   responseType: 'badRequest'
    // },

    sendHome: {
      responseType: 'redirect'
    },

    success: {
      viewTemplatePath: 'pages/search-partner'
    },

    successJSON: {
      statusCode: 200,
      description: 'Respond to api endpoint with json'
    }
  },


  fn: async function (inputs, exits) {
    const RESTRICTED_PARAMS_ARR = [
      'nearMe','interests','languages','relation','children',
      'education','income','smoke','drink','zodiac',
      'body','eyes','hair','extras','sponsore',
      'car','sport','mortgage','orientation','datingAs',
      'lookingAs','sexRole','sexLikeIn','sexOral','sexGroup','sexBdsm','sexFetish'
    ];
    const MIN_WEIGHT = 40;
    const MAX_WEIGHT = 150;
    const MIN_HEIGHT = 140;
    const MAX_HEIGHT = 220;
    const MIN_AGE = 18;
    const MAX_AGE = 99;
    const PAGE_ITEMS_LIMIT = 6;

    const userId = this.req.session.userId;
    const searchParams = this.req.allParams();
    const pageNum = Math.abs(parseInt(this.req.param('page')));

    let searchInput = {};

    for (const field in searchParams) {
      if (field === '_csrf' || field === 'nearMe' || field === 'page' || !searchParams[field]) continue;

      let parsedField;
      try {
        parsedField = JSON.parse(searchParams[field]);
      }catch(e) {}

      if (typeof parsedField === 'undefined' 
        || parsedField == -1
        || Array.isArray(parsedField) && (parsedField.length == 0 || parsedField.length == 1 && (parsedField[0] === '' || parsedField[0] == -1))) {
        continue;
      }

      searchInput[field] = parsedField;

    }

    /*if ((!Array.isArray(searchInput.ageRange) || searchInput.ageRange.length != 2)
        || (!Array.isArray(searchInput.weightRange) || searchInput.weightRange.length != 2)
        || (!Array.isArray(searchInput.heightRange) || searchInput.heightRange.length != 2)) {
      throw 'invalid';
    }*/
    if (!Array.isArray(searchInput.ageRange) || searchInput.ageRange.length != 2) {
      searchInput.ageRange = [MIN_AGE, MAX_AGE];
    }

    // restrict for unauthed users search params
    for (const field in searchInput) {
      if (!userId && RESTRICTED_PARAMS_ARR.includes(field)) {
        throw {sendHome: '/'};
      }
    }
    
    const queryObject = {
      ...(typeof searchInput.lookingFor !== 'undefined' ? { gender: searchInput.lookingFor } : {}),
      ...(typeof searchInput.gender !== 'undefined' ? { lookingFor: [searchInput.gender] } : {}),
      year: {'<=': new Date().getFullYear() - searchInput.ageRange[0], '>=': new Date().getFullYear() - searchInput.ageRange[1]},
      ...(!searchInput.weightRange || searchInput.weightRange[0] == MIN_WEIGHT && searchInput.weightRange[1] == MAX_WEIGHT ? {} : {weight: {'<=': searchInput.weightRange[0], '>=': searchInput.weightRange[1]}}),
      ...(!searchInput.heightRange || searchInput.heightRange[0] == MIN_HEIGHT && searchInput.heightRange[1] == MAX_HEIGHT ? {} : {height: {'<=': searchInput.heightRange[0], '>=': searchInput.heightRange[1]}}),
      // users considered new which registered 0.5 year ago
      ...(searchInput.newUsers ? {createdAt: {'>=': new Date() - (31540000 / 2) * 1000}} : {}),
      ...(searchInput.online ? {online: true, lastSeenAt: {'>=': new Date() - 60 * 30 * 1000}} : {}),
      ...(userId ? { id: { '!=': userId } } : {})
    };

    const partnerSelectorSearchProps = JSON.parse(JSON.stringify(searchInput));

    delete searchInput.ageRange;
    delete searchInput.weightRange;
    delete searchInput.heightRange;
    delete searchInput.newUsers;
    delete searchInput.online;
    delete searchInput.gender;
    delete searchInput.lookingFor;
    
    const compiledQuery = { ...queryObject, ...searchInput };
    const pageQueryNum = Number.isNaN(pageNum) ? 0 : pageNum;
    const users = [];

    await User.stream({
      where: compiledQuery,
      sort: 'lastSeenAt DESC',
      limit: PAGE_ITEMS_LIMIT,
      skip: pageQueryNum > 0 ? (pageQueryNum-1) * PAGE_ITEMS_LIMIT : 0,
      select: ['name', 
              'place', 
              'dateOfBirth',
              'gender',
              'lastSeenAt',
              'secondaryProfilePic',
              'userCustomURL',
              'uuid',
              'photosCount',
              'userDeviceType',
              'online']
    })
    .eachRecord(user => {
      if (typeof user === 'object') {
        delete user.id;
        users.push(user);
      }
    })
    .tolerate(() => {});

    const { new: newCount= 0, total= 0, unreadMessagesTotalCount= 0, messagesTotalCount= 0, activeThreadCount= 0 } = userId ? await sails.helpers.getCounts(this.req).tolerate(() => {}) : {};

    const responseToClient = {
      me: sails.helpers.removeUnwantedModelAttrs.with({ model: User, modelAttrs: this.req.me }),
      users: {
        users,
        total: (await User.count(compiledQuery).tolerate(() => {})) || 0,
        searchParams,
        partnerSelectorSearchProps
      },
      views: userId && ({ new: newCount, total }), //userId && (await sails.helpers.getCounts(this.req)),
      chat: userId && ({
        unreadTotalCount: unreadMessagesTotalCount,
        totalCount: messagesTotalCount,
        activeThreadCount
      })
    };
    
    if (this.req.wantsJSON) {
      return exits.successJSON(responseToClient);
    }
    return exits.success(responseToClient);

  }


};
