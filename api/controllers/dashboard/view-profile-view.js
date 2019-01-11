module.exports = {


  friendlyName: 'View profile view',


  description: 'Display "Profile view" page.',


  exits: {

    redirect: {
      responseType: 'redirect',
      description: 'Because user do not have yet any page views so we redirect him to his profile'
    },

    forbiddenJSON: {
      responseType: 'unauthorized'
    },

    invalid: {
      responseType: 'badRequest'
    },

    success: {
      viewTemplatePath: 'pages/dashboard/profile-view'
    },

    successJSON: {
      statusCode: 200,
      description: 'Respond to api endpoint with json'
    }

  },


  fn: async function (inputs, exits) {
    const PAGE_ITEMS_LIMIT = 6;
    const pageNum = Math.abs(parseInt(this.req.param('page')));
    const viewedId = this.req.session.userId;
    let countsArray, viewers = [];

    if (!viewedId) {
      // respond to as unathorized for AJAX req
      if (this.req.wantsJSON) {
        throw 'forbiddenJSON';
      }
      // need to give just view such will render a homepage view with prompt to login
      return exits.success({
        openSignInDialog: !viewedId, 
        lang: this.req.getLocale()
      });

    }

    const myUUID = this.req.me.uuid;

    if (Number.isNaN(pageNum)) {
      // Requesting first time view          //omit / select -> operators
      try {
        countsArray = await Promise.all([
          View.stream({ where: { viewedId }, limit: PAGE_ITEMS_LIMIT, sort: 'viewedAt DESC', select: ['viewedAt'] })
              .populate('initiator')
              .eachRecord(selectFields),
          View.count({ viewedId }),
          View.update({ viewedId })
              .set({ isNew: false }),
          sails.helpers.messagesCounts.with({ userUUID: myUUID })
        ]);
      }catch(e) {}

      if (!viewers.length) {
        throw {redirect: '.'};
      }

      /*let userChatThreadIds = [];
      await User.stream({ id: viewedId })
                .populate('chats')
                .eachRecord(async chatThread => userChatThreadIds = chatThread.chats.map(({ id }) => id))
                .tolerate(() => {});

      const clearMessagesThreads = await ClearUserMessageHistory.find({ participantUUID: myUUID, chatThreadId: userChatThreadIds }).tolerate(() => {});
      let unreadMessagesTotalCount = 0;

      for (let i = 0; i < userChatThreadIds.length; i++) {
        let matchFound = false;
        for (const clearMessagesThread of clearMessagesThreads) {
          if (userChatThreadIds[i] === clearMessagesThread.chatThreadId) {
            if (clearMessagesThread.threadRemoved) {
              userChatThreadIds.splice(i--,1);
            }else if (clearMessagesThread.displayMessagesAfter) {
              unreadMessagesTotalCount += await Message.count({ threadId: userChatThreadIds[i], toUUID: myUUID, createdAt: { '>': clearMessagesThread.displayMessagesAfter }, fromUUID: { '!=': myUUID }, viewed: false });
            }
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          unreadMessagesTotalCount += await Message.count({ threadId: userChatThreadIds[i], toUUID: myUUID, fromUUID: { '!=': myUUID }, viewed: false });
        }
      }*/
      /*for (const chatThreadId of userChatThreadIds) {
        let matchFound = false;
        for (const clearMessagesThread of clearMessagesThreads) {
          if (chatThreadId.id === clearMessagesThread.chatThreadId && clearMessagesThread.displayMessagesAfter) {
            unreadMessagesTotalCount += await Message.count({ threadId: clearMessagesThread.chatThreadId, createdAt: { '>': clearMessagesThread.displayMessagesAfter }, fromUUID: { '!=': this.req.me.uuid }, viewed: false }).tolerate(() => {});
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          unreadMessagesTotalCount += await Message.count({ threadId: chatThreadId, fromUUID: { '!=': this.req.me.uuid }, viewed: false }).tolerate(() => {});
        }
      }*/
        // Respond with view.
      return exits.success({
        me: this.res.locals.me, 
        views: {
          viewers,
          total: countsArray[1]
        },
        chat: {
          unreadTotalCount: countsArray[3] ? countsArray[3].unreadMessagesTotalCount : 0,//userChatThreadIds.length && (await Message.count({ threadId: userChatThreadIds, fromUUID: { '!=': this.req.me.uuid }, viewed: false })),
          totalCount: countsArray[3] ? countsArray[3].messagesTotalCount : 0,//userChatThreadIds.length && (await Message.count({ threadId: userChatThreadIds, toUUID: myUUID }).tolerate(() => {}))
          activeThreadCount: countsArray[3] ? countsArray[3].activeThreadCount : 0
        },
        lang: this.req.getLocale()
      });

    }

    // Requset came from api AJAX call

    try {

      countsArray = await Promise.all([
        View.count({ viewedId })
      ]);

    }catch(e) {}

    // User must visited '/profile/views' page before send api AJAX calls || invalid page requested
    const totalPages = Math.ceil(countsArray[0] / PAGE_ITEMS_LIMIT);
    if (pageNum <= 0 || pageNum > totalPages) {
      throw 'invalid';
    }

    await View.stream({ where: { viewedId }, skip: (pageNum-1) * PAGE_ITEMS_LIMIT, limit: PAGE_ITEMS_LIMIT, sort: 'viewedAt DESC', select: ['viewedAt'] })
              .populate('initiator')
              .eachRecord(selectFields)
              .tolerate(() => {});
    
      // Respond with json.
    return exits.successJSON({ 
      views: {
        viewers,
        total: countsArray[0]
      },
      lang: this.req.getLocale()
    });

    function selectFields(viewerDb) {
      if (typeof viewerDb === 'object') {
        const userObject = {};
        for (const field of [
          'name', 
          'place', 
          'dateOfBirth',
          'gender',
          'lastSeenAt',
          'secondaryProfilePic',
          'userCustomURL',
          'uuid',
          'photosCount',
          'userDeviceType',
          'online'
        ]) {
          userObject[field] = viewerDb.initiator[field];
        }
        delete viewerDb.id;
        viewerDb.initiator = userObject;

        viewers.push(viewerDb);

      }
    }
    /*function selectFields(viewers) {
      for (const record of viewers) {
        const userObject = {};
        for (const field of [
          'name', 
          'place', 
          'dateOfBirth',
          'gender',
          'lastSeenAt',
          'secondaryProfilePic',
          'userCustomURL',
          'uuid',
          'photosCount',
          'userDeviceType',
          'online'
        ]) {
          userObject[field] = record.initiator[field];
        }
        delete record.id;
        record.initiator = userObject;
      }
      return viewers;
    }*/

  }


};
