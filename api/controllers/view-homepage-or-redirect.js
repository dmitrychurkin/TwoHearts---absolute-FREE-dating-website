module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',


  exits: {

    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage'
    },

    // redirect: {
    //   responseType: 'redirect',
    //   description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    // },

  },


  fn: async function (inputs, exits) {

    try {
      const PAGE_ITEMS_LIMIT = 6;
      const userId = this.req.session.userId;
      // if (this.req.me) {
      //   throw {redirect:'/profile'};
      // }
      const responseToClient = {
        me: sails.helpers.removeUnwantedModelAttrs.with({ model: User, modelAttrs: this.req.me }),
        lang: this.req.getLocale()
      };
      const { me } = this.req;
      const users = [];
      await User.stream({
        where: userId && ({
          gender: me.lookingFor,
          lookingFor: me.gender,
          place: me.place,
          purpose: me.purpose,
          year: {'<=': new Date().getFullYear() - me.ageRange[0], '>=': new Date().getFullYear() - me.ageRange[1]},
          id: { '!=': userId }
        }),
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
      .sort('lastSeenAt DESC')
      .limit(PAGE_ITEMS_LIMIT)
      .eachRecord(user => {
        if (typeof user === 'object') {
          delete user.id;
          users.push(user);
        }
      });

      if (userId) {
        const { new: newCount= 0, total= 0, unreadMessagesTotalCount= 0, messagesTotalCount= 0, activeThreadCount= 0 } = await sails.helpers.getCounts(this.req);
        return exits.success({
          ...responseToClient,
          views: {
            new: newCount,
            total//...(await sails.helpers.getCounts(this.req))
          },
          users: {
            users
          },
          chat: {
            unreadTotalCount: unreadMessagesTotalCount,
            totalCount: messagesTotalCount,
            activeThreadCount
          }
        });
      }
    
      return exits.success({
        ...responseToClient,
        users: {
          users
        }
      });
    
    }catch(e) {}
    
  }


};
