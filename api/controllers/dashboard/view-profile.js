/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'View profile',


  description: 'Display "Profile" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/profile'
    },

    failure: {
      responseType: 'serverError',
      description: 'Something went wrong duaring serving this request'
    },

    noSuchUser: {
      responseType: 'notFound'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal profile page.'
    },

  },


  fn: async function (inputs, exits) {

    const uuid = this.req.param('uuid');
    let profile;
 /*countsArray,*/ 
let current = 0;
    const userId = this.req.session.userId;

    if (uuid) {

      // Authenticated user
      if (userId) {

        const { me } = this.req;

        if (me.uuid === uuid || me.userCustomURL === uuid) {
          throw {redirect: '/profile'};
        }
      }

      // Whom page we currently viewing profile
      profile = await User.findOne({
        or: [
          {userCustomURL: uuid},
          {uuid}
        ]
      })
      .intercept(() => 'failure');

      if (profile) {

        if (profile.uuid === uuid && profile.userCustomURL) {
          throw {redirect: `${profile.userCustomURL}`};
        }

        // We authenticated and watching page of another user
        if (userId) {

          try {

            const criteria = { initiatorId: userId, viewedId: profile.id };

            const [newView, currentlyView] = await Promise.all([
              View.findOne(criteria),
              ViewNow.findOne(criteria)
            ]);

            if (!currentlyView) {
              await ViewNow.create({ ...criteria, initiator: criteria.initiatorId });
            }

            if (newView) {

              View.updateOne(criteria)
                  .set({ viewedAt: Date.now(), isNew: true })
                  .exec(() => {});

            }else {

              View.create({
                viewedAt: Date.now(),
                viewedId: profile.id,
                initiatorId: userId,
                initiator: userId,
                isNew: true
              })
              .exec(() => {});

            }

            // We logged-in and fetching data for self
            // countsArray = await Promise.all([
            //   View.count({ viewedId: userId, isNew: true }),
            //   View.count({ viewedId: userId })
            // ]);


          }catch(e) {}

        }

        current = await ViewNow.count({ viewedId: profile.id }).tolerate(() => {});

        // Remove unnecessary attributes
        // for (let attrName in User.attributes) {
        //   if (User.attributes[attrName].protect) {
        //     delete profile[attrName];
        //   }
        // }

      }

    }

    if (!profile) {
      throw 'noSuchUser';
    }

    const { new: newCount= 0, total= 0, unreadMessagesTotalCount= 0, messagesTotalCount= 0, activeThreadCount= 0 } = userId ? await sails.helpers.getCounts(this.req).tolerate(() => {}) : {};
    return exits.success({
      me: sails.helpers.removeUnwantedModelAttrs.with({ model: User, modelAttrs: this.req.me }),
      profile: sails.helpers.removeUnwantedModelAttrs.with({ model: User, modelAttrs: profile }),
      views: userId ? ({
        //new: countsArray[0],
        //total: countsArray[1],
        //...(await sails.helpers.getCounts(this.req)),
        new: newCount,
        total,
        current
      }) : ({ current }),
      chat: userId && ({ unreadTotalCount: unreadMessagesTotalCount, totalCount: messagesTotalCount, activeThreadCount }),
      lang: this.req.getLocale()
    });

  }


};
