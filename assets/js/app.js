/* eslint-disable no-return-assign */
/* eslint-disable eqeqeq */
/* eslint-disable no-labels */
const {
  maxLength,
  minLength,
  required,
  getFormatedAge,
  zodiakFinder,
  getAge,
  setActiveTabLocation,
  getCookie,
  b64toBlob,
  formatBytes } = Helpers;

const APP = new Vue({
  el: '#page-wrap',
  beforeMount() {

    if (this.$data.me.data.uuid) {
      console.log('LOGGING WE ARE GOING SUBSCRIBE ON message events');
      //let timeoutId;
      io.socket.on('message', msg => this.chatApiResponses(msg)/*{
        console.log('LOGGING SOCKET MESSAGE => ', msg);
        if (!this.$data.chatActivated) {
          if (msg.code == 1) {
            this.$data.chat.unreadTotalCount += 1;
          }
        }else {
          switch (msg.code) {
            case 1: {
              let messageProcessed;
              for (let i = 0; i < this.$data.chat.threads.length; i++) {
                const thread = this.$data.chat.threads[i];
                // replace temp thread with newly created one
                if (!thread.id || thread.id === 'TEMP_THREAD_ID') {

                  let attemptedThread;
                  msg.body.thread.participants.forEach((participant) => {
                    thread.participants.forEach((attempedParticipant) => {
                      if (participant.uuid === attempedParticipant.uuid) {
                        attemptedThread = true;
                      }
                    });
                  });
                  if (attemptedThread) {
                    const modifiedThread = { ...thread, ...msg.body.thread, messages: [msg.body.message] };

                    if (this.$data.chat.activeThread && (!this.$data.chat.activeThread.id || this.$data.chat.activeThread.id === 'TEMP_THREAD_ID')) {
                      this.$data.chat.activeThread = Helpers.quickClone(modifiedThread);
                    }

                    this.$set(this.$data.chat.threads, i, modifiedThread);
                    messageProcessed = true;
                  }

                }
                // add new message
                else if (thread.id === msg.body.thread.id) {

                  if (!Array.isArray(thread.messages)) {
                    thread.messages = [];
                  }

                  thread.messages.push(msg.body.message);
                  msg.body.thread.messages = thread.messages;
                  thread.skip = !thread.skip ? 1 : thread.skip + 1;
                  const modifiedThread = { ...thread, ...msg.body.thread }

                  if (this.$data.chat.activeThread && (this.$data.chat.activeThread.id === msg.body.thread.id)) {
                    this.$data.chat.activeThread = Helpers.quickClone(modifiedThread);
                  }

                  this.$set(this.$data.chat.threads, i, modifiedThread);
                  messageProcessed = true;
                }

              }

              // message came from new thread
              if (!messageProcessed && msg.body.thread.isNew) {
                msg.body.thread.messages = [ msg.body.message ];
                msg.body.thread.messagesReceived = true;
                this.$data.chat.threads.unshift(msg.body.thread);
                messageProcessed = true;
              }

              if (messageProcessed && msg.body.message.fromUUID !== this.$data.me.data.uuid && !msg.body.message.delivered) {
                io.socket.patch('/api/v1/account/message-delivered', {
                  _csrf: this.$data.csrf,
                  threadId: msg.body.thread.id,
                  messageId: msg.body.message.id
                }, (resData, jwres) => {
                  console.log('MESSAGES DELIVERED => ', resData, jwres);
                });
              }


              this.$nextTick(() => {
                this.scrollChat();
                this.setObservers();
              });
              break;
            }
            case 2:
            case 4: {
              for (let i = 0; i < this.$data.chat.threads.length; i++) {
                const thread = this.$data.chat.threads[i];
                if (thread.id === msg.body.thread.id) {
                  // updating viewed state on messages
                  if (Array.isArray(msg.body.amendedMessages)) {
                    for (const amendedMessage of msg.body.amendedMessages) {
                      if (Array.isArray(thread.messages)) {
                        for (const message of thread.messages) {
                          if (message.id === amendedMessage.id) {
                            Object.assign(message, amendedMessage);
                          }
                        }
                      }
                    }
                  }

                  // updating thread
                  const updatedThread = { ...thread, ...msg.body.thread };
                  this.$set(this.$data.chat.threads, i, updatedThread);
                  // updating active thread if match
                  if (this.$data.chat.activeThread && (msg.body.thread.id === this.$data.chat.activeThread.id)) {
                    this.$data.chat.activeThread = Helpers.quickClone(updatedThread);
                  }
                }
              }

              break;
            }
            case 3: {

              if (this.$data.chat.activeThread && (this.$data.chat.activeThread.id === msg.body.threadId)) {
                this.$data.chat.typingIndicator = true;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => this.$data.chat.typingIndicator = false,600);
              }

              break;
            }
            case 5: {

              for (let i = 0; i < this.$data.chat.threads.length; i++) {
                const thread = this.$data.chat.threads[i];
                if (thread.id === msg.body.threadId) {

                  for (const participant of thread.participants) {
                    if (participant.uuid === msg.body.participant.uuid) {
                      Object.assign(participant, msg.body.participant);
                      break;
                    }
                  }

                  this.$set(this.$data.chat.threads, i, thread);

                  if (this.$data.chat.activeThread && (msg.body.threadId === this.$data.chat.activeThread.id)) {
                    this.$data.chat.activeThread = Helpers.quickClone(thread);
                  }

                }
              }

              break;
            }

          }
        }
      }*/);
    }
  },
  mounted() {
    if (this.me.data.uuid) {
      io.socket.get('/api/v1/account/subscribe-to-sock', (resData, jwres) => {
        console.log('USER has been subscribed to socket => ', resData, jwres);
      });
    }
    this.scrollChat(true);
    this.setObservers();
    this.setChatWindHandlers();
    window.addEventListener('resize', () => this.adjustPaneDivider());
    if (this.$refs && this.$refs.fileElem) {
      this.$refs.fileElem.addEventListener('change', ({ target: { files= [] } }) => {
        //let totalBytes = 0;
        // check allowed file size
        for (let i = 0; i < files.length; i++) {
          //totalBytes += files[i].size;
          this.$data.chat.totalFileSize += files[i].size;
        }
        // for (let aMultiples = ['Kb', 'Mb'], nMultiple = 0, nApprox = totalBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        //   this.$data.chat.totalFileSize = nApprox.toFixed(2) + ' ' + aMultiples[nMultiple];
        // }

        if (/*totalBytes*/this.$data.chat.totalFileSize > this.$data.chat.maxFileSize) {
          this.$data.chat.snakeBar = true;
          this.$data.chat.snakeBarMessageCode = -2;
          this.$refs.fileElem.value = null;
          this.$data.chat.files.others.length = this.$data.chat.files.images.length = 0;
          return;
        }

        // conver blob into string
        for (let i = 0; i < files.length; i++) {
          const { name, size, type, lastModified } = files[i];
          const reader = new FileReader();
          reader.onload = ({ target: { result } }) => {
            const objDataFile = {
              name, size, type, lastModified,
              data: result.split('base64,').slice(-1)[0]
            };
            if (type.startsWith('image/')) {
              this.$data.chat.files.images.push(objDataFile);
            }else {
              this.$data.chat.files.others.push(objDataFile);
            }
          };
          reader.readAsDataURL(files[i]);
        }

      });
    }

    this.playChatTimeout();
  },

  data() {
    const { profile= {}, me= {}, views= {}, users= {}, chat= {} } = SAILS_LOCALS;
    const self = this;
    const { OFFLINE_GAP } = Helpers;
    const checkURLAvail = _.debounce(async (errorMessage, availableMessage) => {
      if (!this.$data.me.data.uuid) {
        return;
      }
      const { url } = this.$data.userProfile;
      url.loading = true;
      try {
        await Cloud.checkUserURL.with(url.cache);
        url.infoMessage = availableMessage;
      }catch({ responseInfo }) {
        if (responseInfo.statusCode != 400) {
          url.errorMessage = errorMessage;
        }
      }
      url.loading = false;
    },500);

    const markMessageAsViewedApi = _.debounce(async () => {
      const { queueCache, activeThread } = this.$data.chat;

      if (queueCache.length && this.me.data.uuid) {
        io.socket.patch('/api/v1/account/messages-viewed', {
          _csrf: this.$data.csrf,
          threadId: activeThread.id,
          viewedMessagesBatch: queueCache
        }, (resData, jwres) => {
          console.log('MESSAGES VIEWED => ', resData, jwres);
        });
      }

    },2000);

    const chatMessageTyping = _.throttle(() => {
      if (!this.$data.chat.activeThread) {
        return;
      }
      const { csrf: _csrf, chat: { activeThread: { id }, messageBody }, me: { data } } = this.$data;
      if (!data.uuid || !id || !messageBody) {return;}
      io.socket.put('/api/v1/account/user-typing', {
        _csrf,
        threadId: id
        //uuid: data.uuid
      }, (resData, jwres) => {
        console.log('USER TYPING => ', resData, jwres);
      });
    }, 500);

    const { chatThreads= [], activeThread= null } = ((chatThreads, tempThread) => {

      if (!chatThreads || !me.uuid) {
        return {};
      }
      // sorting threads
      //chatThreads.sort((t1, t2) => t2.lastMessageAt - t1.lastMessageAt);

      let activeThread = null;

      if (tempThread) {

        for (let i = 0; i < chatThreads.length; i++) {
          for (let k = 0; k < chatThreads[i].participants.length; k++) {

            if (chatThreads[i].participants[k].uuid === tempThread.uuid) {

              //chatThreads[i].messagesReceived = true;
              activeThread = Helpers.quickClone(chatThreads[i]);
              // move forward thread
              chatThreads = [...chatThreads.splice(i,1),...chatThreads];

              return { chatThreads, activeThread };
            }

          }
        }


        // new user in thread
        const temp = {
          //id: 'TEMP_THREAD_ID',
          messagesReceived: true,
          messageCounts: {
            new: 0,
            total: 0
          },
          lastMessageAt: Date.now(),
          participants: [tempThread]
        };
        activeThread = Helpers.quickClone(temp);
        chatThreads = [temp, ...chatThreads];

      }

      const threadIds = [];
      chatThreads.forEach(({ id }) => {
        if (id && id !== 'TEMP_THREAD_ID') {
          threadIds.push(id);
        }
      });

      if (threadIds.length) {
        io.socket.patch('/api/v1/account/message-delivered', {
          _csrf: SAILS_LOCALS._csrf,
          threadId: threadIds
        }, (resData, jwres) => {
          console.log('MESSAGES DELIVERED => ', resData, jwres);
        });
      }

      return { chatThreads, activeThread };

    })(chat.threads, chat.tempThread);

    // chat tracker
    // (function trackTimeoutForChat() {
    //   if (chat.threads) {
    //     setInterval(() => self.$data.chat.mediator = Date.now(), 1000);
    //   }
    // })();

    // // join room // test purpose only
    // io.socket.on('connect', () => {
    //   console.log("This is from the connect: ", io.socket);
    //   console.log("WebSocket is connected:", io.socket.isConnected());

    //   io.socket.get('/profile/chat', (resData, jwres) => {
    //     console.log('LOGGING we joined socket of Valera to room with his uuid => ', resData, jwres);
    //   });
    // });


    return {
      csrf: SAILS_LOCALS._csrf,
      astroArray: SAILS_LOCALS.astroArray || ['', 'Козерог', 'Водолей', 'Рыбы', 'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог'],
      genderTypes: SAILS_LOCALS.genderTypes || ['Девушка','Парень'],
      yearSlov: SAILS_LOCALS.yearSlov || ['лет','год','года'],

      // Information about owner of device (guest)
      me: {
        authed: !!SAILS_LOCALS.me || false,
        primaryProfilePic: me.primaryProfilePic,
        secondaryProfilePic: me.secondaryProfilePic,
        data: me,
        // Diaries tab
        diaries: {
          subscribed: SAILS_LOCALS.diaries && SAILS_LOCALS.diaries.subscribed || false
        },
        partnerSelectorSearchProps: users.partnerSelectorSearchProps
      },
      // chat
      chatActivated: window.location.pathname.includes('chat'),
      // find more parners
      findMore: false,
      // captcha
      captchaChecked: false,
      // alert error message
      responseInfo: null,
      localeMessages: $L,

      //Introduction article
      showFullIntro: false,

      // Sign In form
      openSignInDialog: !!SAILS_LOCALS.openSignInDialog,
      requestSent: false,

      //Search result cpm show partner-selector
      parnerSelectorVisible: false,

      //User Profile
      //zodiac: SAILS_LOCALS.zodiac || ['Козерог', 'Водолей', 'Рыбы', 'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог'],
      userProfile: {
        currentTab: Helpers.getActiveTabIndex(),
        activeTab: Helpers.getActiveTabIndex(),
        menu: false,
        notification: null,
        dialog: false,

        userDeviceType: profile.userDeviceType,
        photosCount: profile.photosCount || 0,
        lastSeen: !profile.online || (Date.now() - profile.lastSeenAt > OFFLINE_GAP) ? profile.lastSeenAt : 0,
        primaryProfilePic: profile.primaryProfilePic,
        secondaryProfilePic: profile.secondaryProfilePic,
        blacklisted: false,
        data: profile,

        mainData: {
          saveBirthDate(date) {
            self.$refs['menu-profile'].save(date);
          },
          cache: {},
          data: {
            name: profile.name,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth,
            place: profile.place
          }
        },

        thought: {
          async save(model) {
            if (!self.$data.me.data.uuid) {
              return;
            }
            try {
              await Cloud.updateProfile.with({thought: model.cache});
              model.saved = model.cache;
              model.cache = undefined;
            }catch({ responseInfo }) {
              self.$data.responseInfo = responseInfo;
            }
          },
          async remove(model) {
            if (!self.$data.me.data.uuid) {
              return;
            }
            try {
              await Cloud.updateProfile.with({thought: ''});
              model.saved = undefined;
            }catch({ responseInfo }) {
              self.$data.responseInfo = responseInfo;
            }
          },
          requestSent: false,
          cache: undefined,
          saved: profile.thought
        },

        interests: {
          onInput(model, limit= 20) {
            if (!Array.isArray(model)) {return;}
            if (model.length > 10) {
              model.length = 10;
            }
            for (let i = 0; i < model.length; i++) {
              const el = model[i].trim();
              if (!el.length) {
                model.splice(i--,1);
              }else if (el.length > limit) {
                model[i] = el.slice(0,limit);
              }
            }
          },
          async onRemove(interests, index) {
            if (!self.$data.me.data.uuid) {
              return;
            }
            try {
              const clonedInterests = [...interests];
              clonedInterests.splice(index,1);
              await Cloud.updateProfile.with({interests: clonedInterests});
              interests.splice(index,1);
            }catch({ responseInfo }) {
              self.$data.responseInfo = responseInfo;
            }
          },
          cache: {},
          data: {
            interests: profile.interests
          }
        },
        datingReq: {
          cache: {},
          data: {
            lookingFor: profile.lookingFor,
            ageRange: profile.ageRange,
            lookingAs: profile.lookingAs,
            purpose: profile.purpose,
            datingAs: profile.datingAs,
            sponsore: profile.sponsore
          }
        },
        aboutEssay: {
          cache: {},
          data: {
            aboutEssay: profile.aboutEssay
          }
        },
        expectEssay: {
          cache: {},
          data: {
            expectEssay: profile.expectEssay
          }
        },
        generalInfo: {
          height: profile.height || 140,
          weight: profile.weight || 40,
          // onLanguageSelected({ value, skill }, model) {
          //   if (value && !model.find(t => value == t.value)) {
          //     model.push({value, skill});
          //   }
          // },
          // deleteLanguage(model, index) {
          //   model.splice(index,1);
          // },
          sortLanguages(modelData) {
            modelData.languages.sort((a,b) => b.skill - a.skill);
          },
          cache: {},
          data: {
            height: profile.height,
            weight: profile.weight,
            body: profile.body,
            eyes: profile.eyes,
            hair: profile.hair,
            extras: profile.extras,
            relation: profile.relation,
            children: profile.children,
            mortgage: profile.mortgage,
            car: profile.car,
            education: profile.education,
            income: profile.income,
            scope: profile.scope,
            smoke: profile.smoke,
            drink: profile.drink,
            languages: Array.isArray(profile.languages) ? profile.languages.sort((a,b) => b.skill - a.skill) : [],
            sport: profile.sport
          }
        },
        sexualInfo: {
          cache: {},
          data: {
            orientation: profile.orientation,
            sexRole: profile.sexRole,
            sexLikeIn: profile.sexLikeIn,
            sexOral: profile.sexOral,
            sexGroup: profile.sexGroup,
            sexBdsm: profile.sexBdsm,
            sexFetish: profile.sexFetish
          }
        },
        autoPortrait: {
          dataAvailable: false,
          cache: {},
          data: {
            educationAutoPortrait: profile.educationAutoPortrait,
            musicAutoPortrait: profile.musicAutoPortrait,
            movieAutoPortrait: profile.movieAutoPortrait,
            bookAutoPortrait: profile.bookAutoPortrait,
            recipeAutoPortrait: profile.recipeAutoPortrait,
            countryAutoPortrait: profile.countryAutoPortrait,
            hobbyAutoPortrait: profile.hobbyAutoPortrait,
            placeAutoPortrait: profile.placeAutoPortrait,
            goodAutoPortrait: profile.goodAutoPortrait,
            badAutoPortrait: profile.badAutoPortrait,
            qualityAutoPortrait: profile.qualityAutoPortrait,
            forgiveAutoPortrait: profile.forgiveAutoPortrait,
            religionAutoPortrait: profile.religionAutoPortrait,
            petAutoPortrait: profile.petAutoPortrait,
            meritAutoPortrait: profile.meritAutoPortrait,
            limitationAutoPortrait: profile.limitationAutoPortrait,
            workAutoPortrait: profile.workAutoPortrait,
            actAutoPortrait: profile.actAutoPortrait,
            tvAutoPortrait: profile.tvAutoPortrait,
            filthAutoPortrait: profile.filthAutoPortrait
          }
        },
        url: {
          loading: false,
          infoMessage: '',
          errorMessage: '',
          checkURLAvail: ({required, maxLength, unique, available}) => {
            let error;
            const { url } = this.$data.userProfile;
            const { cache: { userCustomURL } } = url;
            url.errorMessage = url.infoMessage = '';
            url.cache.userCustomURL = (userCustomURL || '').trim();
            if (!userCustomURL) {
              url.errorMessage = required;
              error = true;
            }else if (userCustomURL.length > 45) {
              url.errorMessage = maxLength;
              error = true;
            }

            if (error) {
              return checkURLAvail.cancel();
            }
            checkURLAvail(unique, available);
          },
          cache: {},
          data: {
            userCustomURL: profile.userCustomURL || profile.uuid
          }
        },
        options: profile.uuid === me.uuid ? [
          { callback() { console.log('Добавить фото'); } },
          { callback() { console.log('Настройки'); } }
        ] :
        [
          { callback() { console.log('Написать сообщение'); } },
          { callback() { console.log('В избранное'); } },
          { callback() { console.log('Пожаловаться'); } },
          { callback() { console.log('В чёрный список или из оного'); } }
        ]
      },
      diaries: {
        postsCount: 0,
        activeSection: 0,
        selectedTopicId: 0,
        topicModel: undefined,
        valid: false,
        topics: [{id:2,text:'Test 1'},
          {id:3,text:'Test 2'},
          {id:4,text:'Test 3'},
          {id:5,text:'Test 4'},
          {id:6,text:'Test 5'},
          {id:7,text:'Test 6'},
          {id:8,text:'Test 7'},
          {id:9,text:'Test 8'},
          {id:10,text:'Test 9'},
          {id:11,text:'Test 10'}],
        subscribtions: [
          { id: 'user_1', userUrl: '#', gender: 1, name: 'Дмитрий', dateOfBirth: '1988-06-22', place: 'Mariupol', lastSeen: 0, deviceType: 1 }
        ]
      },

      // new viewers page
      viewers: {
        async onInput(pageNum) {

          self.$data.responseInfo = null;

          if (!self.$data.me.data.uuid) {
            return;
          }

          try {
            const res = await Cloud.viewers.with({page:pageNum});
            if (res && res.views) {
              const { viewers: v, total } = res.views;
              const { viewers } = self.$data;
              viewers.model = v;
              viewers.total = total;
              viewers.length = Math.ceil(total/6);
            }
          }catch({ responseInfo }) {
            self.$data.responseInfo = responseInfo;
          }
        },
        model: views.viewers || views.newViewers,
        total: views.total,
        length: Math.ceil(views.total/6),
        currentPage: 1
      },

      // fetched users page
      users: {
        onInput(pageNum) {

          self.$data.responseInfo = null;

          const { users: { searchParams= {} } } = self.$data;
          // for (const field in searchParams) {
          //   searchParams[field] = searchParams[field].toString();
          // }

          $.ajax({
            url: `/api/v1/search/${pageNum}`,
            data: {
              ...searchParams
            }
          })
          .done(res => {
            if (res && res.users) {
              const { users: u, total } = res.users;
              const { users } = self.$data;
              users.model = u;
              users.total = total;
              users.length = Math.ceil(total/6);
            }
          })
          .fail(() => self.$data.responseInfo = {statusCode: 0});
        },
        searchParams: users.searchParams,
        model: users.users,
        total: users.total,
        length: Math.ceil(users.total/6),
        currentPage: 1
      },
      chat: {
        slickActivated: false,
        activeFileMessage: null,
        filesDialog: false,
        maxFileSize: 1e7,
        totalFileSize: 0,
        unreadTotalCount: chat.unreadTotalCount,
        totalCount: chat.totalCount,
        activeThreadCount: chat.activeThreadCount,
        snakeBar: false,
        snakeBarMessageCode: undefined,
        showControls: false,
        showThreadLoadSpinner: false,
        showMessLoadSpinner: false,
        typingIndicator: false,
        timeoutId: undefined,
        MAX_LENGTH: 10000,
        chatTimerId: null,
        activeThread,
        threads: chatThreads,
        mediator: Date.now(),
        messageBody: '',
        files: {
          images: [],
          others: []
        },
        queueCache: [],
        markMessageAsViewedApi,
        chatMessageTyping,
        b64toBlob: b64toBlob.bind(Helpers),
        formatBytes: formatBytes.bind(Helpers),
        async openFileModal(message, slideNum) {
          console.log('slideNum => ', slideNum);
          const resourcesLoaded = await Helpers.loadSlickLib();
          if (resourcesLoaded) {
            self.$data.chat.activeFileMessage = message;
            self.$data.chat.filesDialog = true;

            if (!self.$data.chat.slickActivated) {
              self.$nextTick(() => {
                $('.js-messageFiles').slick({
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false,
                  fade: true,
                  asNavFor: '.js-messageFilesNav',
                  initialSlide: slideNum
                });
                $('.js-messageFilesNav').slick({
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  asNavFor: '.js-messageFiles',
                  centerMode: true,
                  focusOnSelect: true
                });
              });

              self.$data.chat.slickActivated = true;
              return;
            }

            $('.js-messageFilesNav').slick('slickGoTo', slideNum);

          }
        },
        resetFilesInput: () => {
          if (self.$refs && self.$refs.fileElem) {
            self.$refs.fileElem.value = null;
          }
          self.$data.chat.totalFileSize = self.$data.chat.files.images.length = self.$data.chat.files.others.length = 0;
        },
        // onImageLoaded: src => {
        //   console.log('IMAGE LOADED => ', src);
        //   window.URL.revokeObjectURL(src);
        // },
        basicAction(method, url, params, callbackAction, threadId) {
          self.$data.responseInfo = null;
          const { chat: { activeThread, showMessLoadSpinner }, me: { data }, csrf } = self.$data;
          if (!data.uuid || showMessLoadSpinner) {
            return;
          }
          self.$data.chat.showMessLoadSpinner = true;

          io.socket[method](url, {
            _csrf: csrf,
            threadId: threadId || activeThread.id,
            ...params
          }, (resData, jwr) => {
            console.log('LOGGING RESPONSE FROM removeBasicAction => ', resData, jwr);
            if (jwr.statusCode == 200) {
              self.chatApiResponses(resData);
              typeof callbackAction === 'function' && callbackAction(jwr);
            }else {
              self.$data.responseInfo = {statusCode: 0};
            }
            self.$data.chat.showMessLoadSpinner = self.$data.chat.showControls = false;
          });
        },
        toggleBlockUser() {
          this.basicAction('patch', '/api/v1/account/toggle-block-user', { userUUID: self.$data.chat.activeThread.participants[0].uuid }, jwr => self.chatSnakBarAction(jwr));
        },
        toggleMute() {
          this.basicAction('patch', '/api/v1/account/toggle-mute-chat', {}, jwr => self.chatSnakBarAction(jwr));
        },
        clearMessages() {
          this.basicAction('patch', '/api/v1/account/clear-message-history');
        },
        deleteThread() {
          const { threads, activeThread } = self.$data.chat;
          const isTempThread = thread => !thread.id || thread.id === 'TEMP_THREAD_ID';
          const checkAvailOfThreads = () => {
            if (threads.length) {
              self.$data.chat.activeThread = null;
              self.$data.chat.showMessLoadSpinner = self.$data.chat.showControls = false;
            }else {
              window.location.href = '/';
            }
          };
          if (isTempThread(activeThread)) {
            for (let i = 0; i < threads.length; i++) {
              const thread = threads[i];
              if (isTempThread(thread)) {
                threads.splice(i, 1);
                checkAvailOfThreads();
                break;
              }
            }

          }else {
            this.basicAction('delete', '/api/v1/account/remove-chat', {}, checkAvailOfThreads);
          }
        },
        filterThreads(threadName) {
          threadName = threadName.trim();
          const chatThreads = self.$data.chat.threads;
          if (!threadName) {
            chatThreads.sort((t1, t2) => t2.lastMessageAt - t1.lastMessageAt);
            chatThreads.forEach(thread => delete thread.filteredNum);
            return;
          }
          if (threadName) {
            let num = 0;
            chatThreads.forEach(thread => {
              let nameContains = false;
              for (const participant of thread.participants) {
                if (participant.name.includes(threadName)) {
                  nameContains = true;
                  break;
                }
              }
              thread.filteredNum = nameContains ? (++num) : 0;
            });
            chatThreads.sort((t1, t2) => t2.filteredNum - t1.filteredNum);
          }
        },
        sendChatMessage() {
          let { chat: { messageBody, activeThread, MAX_LENGTH, maxFileSize, totalFileSize, files }, me: { data }, csrf: _csrf } = self.$data;
          messageBody = messageBody.trim();
          const { chatForm } = self.$refs;
          const threadId = !activeThread.id || activeThread.id === 'TEMP_THREAD_ID' ? undefined : activeThread.id;

          if (chatForm
            && chatForm.validate()
            && (messageBody.length || files.images.length || files.others.length)
            && messageBody.length <= MAX_LENGTH
            && data.uuid
            && totalFileSize <= maxFileSize) {
            io.socket.put('/api/v1/account/send-message', {
              _csrf,
              messageText: messageBody,
              threadId, //'5c16c726fed3371ac463f30a',
              fromUUID: data.uuid,//'22e68253-9ecf-4dd5-a2d5-fa2250469768'
              toUUID: threadId ? undefined : activeThread.participants[0].uuid,
              attachment: files.images.concat(files.others)
              //fromUUID: '22e68253-9ecf-4dd5-a2d5-fa2250469768',
              //toUUID: 'e9e08642-a263-418a-9c00-ccab47eed98b'
            }, (resData, jwres) => {
              console.log('Message has been sent => ', resData, jwres);
              if (Array.isArray(resData.failedMessageDeliveryTo) && resData.failedMessageDeliveryTo.length) {
                self.$data.chat.snakeBar = true;
                self.$data.chat.snakeBarMessageCode = -1;
              }
            });
            self.$data.chat.resetFilesInput();
            chatForm.reset();
          }
        },
        selectFiles() {
          if (typeof self.$refs === 'object') {
            const { fileElem } = self.$refs;
            fileElem.click();
          }
        }
      }
    };
  },
  computed: {
  //User Profile computed
    totalLikeInSex() {
      const { sexLikeIn, sexOral, sexGroup, sexBdsm, sexFetish } =  this.userProfile.sexualInfo.data;
      return [ ...sexLikeIn, ...sexOral, ...sexGroup, ...sexBdsm, ...sexFetish ];
    },
    pageURL() {
      return `${window.location.origin}/user/${this.userProfile.url.data.userCustomURL}`;
    }

  },
  //User Profile watchers
  watch: {
    'userProfile.datingReq.cache.lookingFor': {
      handler(val) {
        if (!val) {return;}
        this.userProfile.notification = val.length ? null : ({ data: this.$refs.datingAs.$el.dataset.defaultErrorMessage });
      }
    }
  },
  //User Profile methods
  methods: {
    async logout() {
      if (!this.me.data.uuid) {
        return;
      }
      try {
        await Cloud.logout();
        if (this.chatActivated) {
          window.location.href = '/';
        }else {
          window.location.reload();
        }
      }catch(e) {
        this.responseInfo = {statusCode: 0};
      }
    },
    getCookie: getCookie.bind(Helpers),
    onChangeTab: setActiveTabLocation.bind(Helpers),

    maxLength: maxLength.bind(Helpers),
    required: required.bind(Helpers),
    minLength: minLength.bind(Helpers),
    zodiakFinder: zodiakFinder.bind(Helpers),
    getFormatedAge: getFormatedAge.bind(Helpers),
    getAge: getAge.bind(Helpers),
    // formatData(model, prop) {
    //   return (model.data && Array.isArray(model.data[prop])) ? model.data[prop].map(({ display }) => display).join(', ') : '';
    // },
    formatData(model, dataArrayToDisplay) {
      const arrayOfValues = Array.isArray(model) ? model : [model];
      const outputArrayToDisplay = [];
      for (const value of arrayOfValues) {
        if (dataArrayToDisplay[value]) {
          outputArrayToDisplay.push(dataArrayToDisplay[value]);
        }
      }
      return outputArrayToDisplay.join(', ');
    },


    // Diaries Methods
    diaryTopicSelected(topic) {
      console.log(topic);
      this.diaries.selectedTopicId = topic.id;
    },
    onTopicEdit(topic) {
      this.diaries.activeSection = 5;
      this.diaries.topicModel = topic;
    },
    onTopicCreate() {
      this.diaries.activeSection = 4;
      this.diaries.topics.sort((a,b) => a.id-b.id);
      this.diaries.topicModel = {id:this.diaries.topics.slice(-1)[0].id+1, text: ''};
    },
    onTopicDelete() {
      for (let i = 0; i < this.diaries.topics.length; i++) {
        if (this.diaries.topicModel.id === this.diaries.topics[i].id) {
          this.diaries.topics.splice(i,1);
          break;
        }
      }
      this.diaries.activeSection = 3;
    },
    unique(errorMessage) {
      return input => {
        if (this.diaries.topics.find(topic => topic.text === input && topic.id !== this.diaries.topicModel.id)) {
          return errorMessage;
        }
        return true;
      };
    },

    // chat
    chatOfflineStator(lastSeenAt, { messages: { from } }) {
      const today = new Date();
      const lastSeen = new Date(lastSeenAt);
      let message = `${from} ${lastSeen.toLocaleTimeString('ru').split(':').slice(0,-1).join(':')}`;
      if (today.getDate() != lastSeen.getDate()
        || today.getMonth() != lastSeen.getMonth()
        || today.getFullYear() != lastSeen.getFullYear()) {
        message += ` ${lastSeen.toLocaleDateString(this.getCookie('lang'))}`;
      }

      return `offline ${message}`;
    },

    sortMessages(messages) {
      return messages.sort((m1, m2) => m1.createdAt - m2.createdAt);
    },

    setChatWindHandlers() {

      if (typeof this.$refs !== 'object') {
        return;
      }
      const { messagePanel } = this.$refs;
      if (!messagePanel || typeof messagePanel.onscroll === 'function') {
        return;
      }

      const TRIG_PERSENTAGE = 15;

      messagePanel.onscroll = ({ target }) => {
        const currentPersentage = (target.scrollHeight * TRIG_PERSENTAGE) / 100;
        console.log(this.chat.activeThread.messages.length, this.chat.activeThread.messageCounts.total);
        if (target.scrollTop < currentPersentage
          && !this.chat.showMessLoadSpinner
          && this.chat.activeThread
          && this.chat.activeThread.id && this.chat.activeThread.messages
          && this.chat.activeThread.messages.length != this.chat.activeThread.messageCounts.total
          && this.me.data.uuid) {
          console.log('CAN LOAD MORE');
          this.chat.basicAction('get', '/api/v1/account/thread-messages', { batch: this.chat.activeThread.batch + 1, skip:  this.chat.activeThread.skip || 0 }, () => this.setObservers());
          /*this.chat.showMessLoadSpinner = true;

          io.socket.get('/api/v1/account/thread-messages', {
            threadId: this.chat.activeThread.id,
            batch: this.chat.activeThread.batch + 1,
            skip:  this.chat.activeThread.skip || 0
          }, (selectedThread, { statusCode }) => {

                if (statusCode == 200) {

                  for (let i = 0; i < this.chat.threads.length; i++) {
                    const thread = this.chat.threads[i];
                    if (thread.id === selectedThread.id) {
                      selectedThread.messages.push(...thread.messages);
                      //this.sortMessages(selectedThread.messages);
                      const modifiedThread = { ...thread, ...selectedThread };
                      this.chat.activeThread = Helpers.quickClone(modifiedThread);
                      this.$set(this.chat.threads, i, modifiedThread);

                      const messagesNeedToMarkDelivered = this.chat.activeThread.messages.filter(({ fromUUID, delivered }) => fromUUID !== this.me.data.uuid && !delivered);
                      if (messagesNeedToMarkDelivered.length) {
                        io.socket.patch('/api/v1/account/message-delivered', {
                          _csrf: this.csrf,
                          threadId: this.chat.activeThread.id,
                          messageId: messagesNeedToMarkDelivered.map(({ id }) => id)
                        }, (resData, jwres) => {
                          console.log('MESSAGES DELIVERED => ', resData, jwres);
                        });
                      }
                      this.chat.showMessLoadSpinner = false;
                      return this.setObservers();
                    }
                  }

                }else {

                  this.responseInfo = {statusCode: 0};

                }

              this.chat.showMessLoadSpinner = false;
          });*/


        }
      };
    },

    adjustPaneDivider() {
      if (typeof this.$refs === 'object') {
        const { messagePanel, panelDivider } = this.$refs;
        if (messagePanel && panelDivider) {
          panelDivider.style.height = `${messagePanel.scrollHeight - 16}px`;
        }
      }
    },

    scrollChat(onload) {

      if (typeof this.$refs !== 'object') {
        return;
      }
      const { messagePanel } = this.$refs;

      if (!messagePanel) {
        return;
      }

      this.adjustPaneDivider();

      if (onload) {
        messagePanel.scrollTop = messagePanel.scrollHeight;
      }else {
        const lastMessage = Array.prototype.slice.call(messagePanel.children, -1)[0];
        if (messagePanel.scrollHeight - (messagePanel.scrollTop + messagePanel.offsetHeight) <= lastMessage.offsetHeight) {
          messagePanel.scrollTop = messagePanel.scrollHeight;
        }
      }
    },

    setObservers() {
      const messagesToTrack = document.querySelectorAll('.js-tracking-view:not(.js-tracking-set)');
      for (const el of messagesToTrack) {
        const io = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            // send call to server here
            if (!this.chat.queueCache.includes(el.id)) {
              this.chat.queueCache.push(el.id);
            }
            this.chat.markMessageAsViewedApi();
            el.classList.remove('js-tracking-view', 'js-tracking-set');
            io.disconnect();
          }
        });
        io.observe(el);
        el.classList.add('js-tracking-set');
      }
    },

    async switchThread(thread) {
      this.responseInfo = null;
      if (thread.filteredNum == 0 || this.chat.showThreadLoadSpinner || this.chat.showMessLoadSpinner) {
        return;
      }
      const handleUX = () => this.$nextTick(() => {
        this.scrollChat(true);
        this.setObservers();
        this.setChatWindHandlers();
      });
      const clearOpts = () => {
        const chatForm = this.$refs.chatForm;
        if (chatForm) {
          this.$refs.chatForm.reset();
        }
        this.chat.resetFilesInput();
        this.pauseChatTimeout();
        this.chat.showControls = false;
      };
      if (!thread.id || thread.id === 'TEMP_THREAD_ID' || thread.messagesReceived) {
        if (this.chat.activeThread && this.chat.activeThread.id === thread.id) {
          return;
        }
        clearOpts();
        this.chat.activeThread = Helpers.quickClone(thread);
        this.playChatTimeout();
        return handleUX();
      }
      if (thread && thread.id && thread.id !== (this.chat.activeThread && this.chat.activeThread.id) && this.me.data.uuid) {

        this.chat.showThreadLoadSpinner = true;
        this.chat.activeThread = null;
        clearOpts();
        io.socket.get('/api/v1/account/thread-messages', {
          threadId: thread.id,
          batch: this.chat.activeThread && this.chat.activeThread.batch ? this.chat.activeThread.batch : 1
        }, (/*selectedThread*/apiMsg, { statusCode }) => {
          if (statusCode == 200) {
            this.chatApiResponses(apiMsg);
            handleUX();
            /*for (let i = 0; i < this.chat.threads.length; i++) {
                const thread = this.chat.threads[i];
                if (thread.id === selectedThread.id) {
                  selectedThread.messagesReceived = true;
                  this.chat.activeThread = Helpers.quickClone(selectedThread);
                  this.$set(this.chat.threads, i, selectedThread);

                  const messagesNeedToMarkDelivered = this.chat.activeThread.messages.filter(({ fromUUID, delivered }) => fromUUID !== this.me.data.uuid && !delivered);
                  if (messagesNeedToMarkDelivered.length) {
                    io.socket.patch('/api/v1/account/message-delivered', {
                      _csrf: this.csrf,
                      threadId: this.chat.activeThread.id,
                      messageId: messagesNeedToMarkDelivered.map(({ id }) => id)
                    }, (resData, jwres) => {
                      console.log('MESSAGES DELIVERED => ', resData, jwres);
                    });
                  }
                  this.chat.showThreadLoadSpinner = false;
                  return handleUX();
                }
              }*/

          }else {

            this.responseInfo = {statusCode: 0};

          }
          this.playChatTimeout();
          this.chat.showThreadLoadSpinner = false;
        });

      }

    },

    messageTimestamps(timestamp, { t='today', y='yesterday' }) {
      const today = new Date();
      const yesterday = new Date(new Date().setDate(today.getDate() - 1));
      const messageCreated = new Date(timestamp);
      let displayTime = messageCreated.toLocaleTimeString('ru').split(':').slice(0,-1).join(':');

      if (today.getDate() == messageCreated.getDate()) {
        return `${displayTime}, ${t[0].toUpperCase()}${t.slice(1)}`;
      }else if (yesterday.getDate() == messageCreated.getDate()) {
        return `${displayTime}, ${y[0].toUpperCase()}${y.slice(1)}`;
      }
      return `${displayTime}, ${messageCreated.toLocaleDateString(this.getCookie('lang'))}`;
    },

    chatSnakBarAction(jwr) {
      if (jwr.statusCode == 200) {
        this.chat.snakeBar = true;
        this.chat.snakeBarMessageCode = jwr.body.code;
      }
    },

    playChatTimeout() {
      this.$nextTick(() => {
        if (this.chat.threads.length) {
          this.chat.chatTimerId = setInterval(() => {
            this.chat.mediator = Date.now();
          }, 1000);
        }
      });
    },

    pauseChatTimeout() {
      clearInterval(this.chat.chatTimerId);
    },

    chatApiResponses(msg) {
      console.log('LOGGING SOCKET MESSAGE => ', msg);
      if (!this.chatActivated) {
        if (msg.code == 1) {
          const { total, new: newMessagesCount, activeThreadCount } = msg.body.thread.messageCounts;
          this.chat.unreadTotalCount = newMessagesCount;
          this.chat.totalCount = total;
          this.chat.activeThreadCount = activeThreadCount;
        }
      }else {
        outer:
        switch (msg.code) {
          case 1: {
            const handleParticipants = thread => {
              for (const messageParticipant of msg.body.thread.participants) {
                const threadParticipant = thread.participants.find(tP => tP.uuid === messageParticipant.uuid);
                if (threadParticipant) {
                  Object.assign(threadParticipant, messageParticipant);
                }else {
                  thread.participants.push(messageParticipant);
                }
              }
              delete msg.body.thread.participants;
            };
            let messageProcessed;
            for (let i = 0; i < this.chat.threads.length; i++) {
              const thread = this.chat.threads[i];
              // replace temp thread with newly created one
              if (!thread.id || thread.id === 'TEMP_THREAD_ID') {

                let attemptedThread;
                for (const messageParticipant of msg.body.thread.participants) {
                  if (thread.participants.find(tP => tP.uuid === messageParticipant.uuid)) {
                    attemptedThread = true;
                    break;
                  }
                }
                if (attemptedThread) {
                  handleParticipants(thread);
                  const modifiedThread = { ...thread, ...msg.body.thread, messages: [msg.body.message] };

                  if (this.chat.activeThread && (!this.chat.activeThread.id || this.chat.activeThread.id === 'TEMP_THREAD_ID')) {
                    this.chat.activeThread = Helpers.quickClone(modifiedThread);
                  }

                  this.$set(this.chat.threads, i, modifiedThread);
                  messageProcessed = true;
                }

              }
              // add new message
              else if (thread.id === msg.body.thread.id) {

                if (!Array.isArray(thread.messages)) {
                  thread.messages = [];
                }

                thread.messages.push(msg.body.message);
                msg.body.thread.messages = thread.messages;
                thread.skip = !thread.skip ? 1 : thread.skip + 1;
                handleParticipants(thread);
                const modifiedThread = { ...thread, ...msg.body.thread };

                if (this.chat.activeThread && (this.chat.activeThread.id === msg.body.thread.id)) {
                  this.chat.activeThread = Helpers.quickClone(modifiedThread);
                }

                this.$set(this.chat.threads, i, modifiedThread);
                messageProcessed = true;
              }

            }

            // message came from new thread
            if (!messageProcessed && msg.body.thread.isNew) {
              msg.body.thread.messages = [ msg.body.message ];
              msg.body.thread.messagesReceived = true;
              this.chat.threads.unshift(msg.body.thread);
              messageProcessed = true;
            }

            if (messageProcessed && msg.body.message.fromUUID !== this.me.data.uuid && !msg.body.message.delivered) {
              io.socket.patch('/api/v1/account/message-delivered', {
                _csrf: this.csrf,
                threadId: msg.body.thread.id,
                messageId: msg.body.message.id
              }, (resData, jwres) => {
                console.log('MESSAGES DELIVERED => ', resData, jwres);
              });
            }


            this.$nextTick(() => {
              this.scrollChat();
              this.setObservers();
            });
            break;
          }

          case 2:
          case 4:
          case 6:
          case 8: {
            for (let i = 0; i < this.chat.threads.length; i++) {
              const thread = this.chat.threads[i];
              if (thread.id === msg.body.thread.id) {
                // updating viewed state on messages
                if (Array.isArray(msg.body.amendedMessages)) {
                  for (const amendedMessage of msg.body.amendedMessages) {
                    if (Array.isArray(thread.messages)) {
                      for (const message of thread.messages) {
                        if (message.id === amendedMessage.id) {
                          Object.assign(message, amendedMessage);
                        }
                      }
                    }
                  }
                }

                // updating thread
                const updatedThread = { ...thread, ...msg.body.thread };
                this.$set(this.chat.threads, i, updatedThread);
                // updating active thread if match
                if (this.chat.activeThread && (msg.body.thread.id === this.chat.activeThread.id)) {
                  this.chat.activeThread = Helpers.quickClone(updatedThread);
                }
                break outer;
              }
            }
            break;
          }
          case 3: {

            if (this.chat.activeThread && (this.chat.activeThread.id === msg.body.threadId)) {
              this.chat.typingIndicator = true;
              clearTimeout(this.chat.timeoutId);
              this.chat.timeoutId = setTimeout(() => this.chat.typingIndicator = false, 600);
            }

            break;
          }
          case 5:
          case 10: {
            for (let i = 0; i < this.chat.threads.length; i++) {
              const thread = this.chat.threads[i];

              for (const participant of thread.participants) {
                if (participant.uuid === msg.body.participant.uuid) {

                  Object.assign(participant, msg.body.participant);

                  this.$set(this.chat.threads, i, thread);

                  if (this.chat.activeThread && (/*msg.body.threadId*/thread.id === this.chat.activeThread.id)) {
                    this.chat.activeThread = Helpers.quickClone(thread);
                  }
                  break outer;
                }

              }
            }

            break;
          }
          case 7: {
            for (let i = 0; i < this.chat.threads.length; i++) {
              const threadToDelete = this.chat.threads[i];
              if (threadToDelete.id === msg.body.thread.id) {
                this.chat.threads.splice(i, 1);
                if (this.chat.activeThread.id === msg.body.thread.id) {
                  this.chat.activeThread = null;
                }
                break outer;
              }
            }
            break;
          }
          case 9: {
            // get thread messages
            for (let i = 0; i < this.chat.threads.length; i++) {
              const thread = this.chat.threads[i];
              if (thread.id === msg.body.thread.id) {

                // Remove dublicated messages if previously received
                if (!Array.isArray(thread.messages)) {
                  thread.messages = [];
                }
                if (msg.body.thread.batch == 1) {
                  delete thread.skip;
                  for (let r = 0; r < thread.messages.length; r++) {
                    for (let n = 0; n < msg.body.thread.messages.length; n++) {
                      if (thread.messages[r].id === msg.body.thread.messages[n].id) {
                        msg.body.thread.messages.splice(n--,1);
                      }
                    }
                  }
                }

                msg.body.thread.messages.push(...thread.messages);

                // sort messages after removal
                this.sortMessages(msg.body.thread.messages);

                const modifiedThread = { ...thread, ...msg.body.thread };

                this.chat.activeThread = Helpers.quickClone(modifiedThread);
                this.$set(this.chat.threads, i, modifiedThread);

                const messagesNeedToMarkDelivered = this.chat.activeThread.messages.filter(({ fromUUID, delivered }) => fromUUID !== this.me.data.uuid && !delivered);
                if (messagesNeedToMarkDelivered.length) {
                  io.socket.patch('/api/v1/account/message-delivered', {
                    _csrf: this.csrf,
                    threadId: this.chat.activeThread.id,
                    messageId: messagesNeedToMarkDelivered.map(({ id }) => id)
                  }, (resData, jwres) => {
                    console.log('MESSAGES DELIVERED => ', resData, jwres);
                  });
                }
                break outer;
              }
            }
            break;
          }

        }
      }
    }

  }

});

