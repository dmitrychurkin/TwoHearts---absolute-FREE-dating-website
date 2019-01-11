module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/profile-authenticated',
      description: 'Display the profile page for authenticated users or home page if not authenticated.'
    },

  },


  fn: async function (inputs, exits) {

    const viewedId = this.req.session.userId;
    
    if (viewedId) {

      //let countsArray;

      // try {
      //   countsArray = await Promise.all([
      //     View.count({ viewedId, isNew: true }),
      //     View.count({ viewedId }),
      //     ViewNow.count({ viewedId })
      //   ]);
      // }catch(e) {}

      const profile = sails.helpers.removeUnwantedModelAttrs.with({ model: User, modelAttrs: this.req.me });
      const { new: newCount= 0, total= 0, unreadMessagesTotalCount= 0, messagesTotalCount= 0, activeThreadCount= 0 } = await sails.helpers.getCounts(this.req).tolerate(() => {});
      return exits.success({
        me: profile, 
        profile, 
        views: {
          new: newCount,
          total,
          activeThreadCount,
          //new: countsArray[0],
          //total: countsArray[1],
          //...(await sails.helpers.getCounts(this.req)),
          current: (await ViewNow.count({ viewedId }).tolerate(() => {})) || 0//countsArray[2] 
        },
        chat: {
          unreadTotalCount: unreadMessagesTotalCount,
          totalCount: messagesTotalCount
        },
        lang: this.req.getLocale()
      });

    }
    

    return exits.success({
      openSignInDialog: true, 
      lang: this.req.getLocale()
    });

  }


};
