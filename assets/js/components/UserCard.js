Vue.component('user-card', {
  template: `
    <v-card
      :height="mode == 0 ? 185 : 215"
      width="300"
      hover>
      <v-layout column fill-height>
        <v-flex class="pa-3">
          <v-layout row fill-height>
            <v-flex style="position:relative" align-self-center>
              <v-tooltip lazy bottom>
                <a slot="activator" :href="pageURL">
                  <v-img
                    :src="user.photosCount ? user.secondaryProfilePic : (user.gender ? '/images/male.jfif' : '/images/female.png')"
                    :lazy-src="lazySrc"
                    :alt="user.name"
                    height="150"
                    width="110"
                    class="grey lighten-2">
                    <v-layout
                      slot="placeholder"
                      fill-height
                      align-center
                      justify-center
                      ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </v-img>
                </a>
                <span v-once v-text="controls.tt"></span>
              </v-tooltip>
              <div v-if="user.photosCount" class="d-flex" style="position:absolute;right:5px;bottom:-1px;color:#fff">
                <v-icon small dark>photo_camera</v-icon>
                <div class="pl-2">{{ user.photosCount }}</div>
              </div>
            </v-flex>
            <v-flex xs7>
              <v-layout fill-height class="pl-2" align-content-space-between column>
                <v-flex>
                  <div class="font-weight-bold">
                    <a :href="pageURL">{{ user.name }}</a>
                  </div>
                  <div>
                    {{ formattedAge }}, {{ astroArray[astroCode] }}
                  </div>
                  <div>
                    {{ user.place }}
                  </div>
                  <div>
                    <a href="#" style="color:#8c8a8a">Как далеко от тебя?</a>
                  </div>
                  <div v-if="lastSeen != 0" class="text-truncate" style="color:rgba(0,0,0,.54);font-size:14px;font-weight:500">{{ offlineTextDataArray[0][user.gender] }} {{ new Date(user.lastSeenAt).toLocaleDateString(locale) }} {{ offlineTextDataArray[1][0] }} {{ new Date(user.lastSeenAt).toLocaleTimeString('ru').split(':').slice(0,-1).join(':') }}</div>
                  <div v-else>
                    <svg v-if="user.userDeviceType == 0" style="height:20px" viewBox="0 0 24 24">
                      <path fill="#4caf50" d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                    </svg>
                    <svg v-else-if="user.userDeviceType == 1" style="height:20px" viewBox="0 0 24 24">
                      <path fill="#4caf50" d="M15,5H14V4H15M10,5H9V4H10M15.53,2.16L16.84,0.85C17.03,0.66 17.03,0.34 16.84,0.14C16.64,-0.05 16.32,-0.05 16.13,0.14L14.65,1.62C13.85,1.23 12.95,1 12,1C11.04,1 10.14,1.23 9.34,1.63L7.85,0.14C7.66,-0.05 7.34,-0.05 7.15,0.14C6.95,0.34 6.95,0.66 7.15,0.85L8.46,2.16C6.97,3.26 6,5 6,7H18C18,5 17,3.25 15.53,2.16M20.5,8A1.5,1.5 0 0,0 19,9.5V16.5A1.5,1.5 0 0,0 20.5,18A1.5,1.5 0 0,0 22,16.5V9.5A1.5,1.5 0 0,0 20.5,8M3.5,8A1.5,1.5 0 0,0 2,9.5V16.5A1.5,1.5 0 0,0 3.5,18A1.5,1.5 0 0,0 5,16.5V9.5A1.5,1.5 0 0,0 3.5,8M6,18A1,1 0 0,0 7,19H8V22.5A1.5,1.5 0 0,0 9.5,24A1.5,1.5 0 0,0 11,22.5V19H13V22.5A1.5,1.5 0 0,0 14.5,24A1.5,1.5 0 0,0 16,22.5V19H17A1,1 0 0,0 18,18V8H6V18Z"/>
                    </svg>
                    <svg v-else-if="user.userDeviceType == 2" style="height:20px" viewBox="0 0 24 24">
                        <path fill="#4caf50" d="M21,14H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10L8,21V22H16V21L14,18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/>
                    </svg>
                    <span style="color:#4caf50">Online</span>
                  </div>
                </v-flex>
                <v-flex>
                  <v-btn @click.stop="switchChat" class="mb-0 mt-2" small color="success">
                    <v-icon left small>edit</v-icon>
                    {{ controls.btn }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="mode == 1">
          <v-layout column class="pt-1">
            <v-flex>
              <v-divider></v-divider>
              <v-subheader style="height:auto">{{ new Date(viewedAt).toLocaleDateString(locale) }} {{ offlineTextDataArray[1][0] }} {{ new Date(viewedAt).toLocaleTimeString(locale).split(':').slice(0,-1).join(':') }}</v-subheader>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  `,
  data() {
    return {
      chatActivated: false
    };
  },
  props: {
    user: {
      photosCount: Number,
      secondaryProfilePic: String,
      gender: Number,
      name: String,
      ageData: Array, // -> ! custom key
      place: String,
      lastSeenAt: Number,
      userDeviceType: String,
      online: Boolean,
      userCustomURL: String,
      uuid: String
    },

    viewedAt: {
      type: Number
    },

    locale: {
      type: String,
      default: () => Helpers.getCookie('lang')
    },

    mode: {
      // 0 -> default simple user card | 1 -> view page mode
      type: Number,
      default: 0
    },

    offlineTextDataArray: Array,

    astroArray: Array,

    urlPrefix: {
      type: String,
      default: '/user'
    },

    lazySrc: {
      type: String,
      default: '/images/lazy.jfif'
    },
    controls: {
      tt: String,
      btn: String
    }
  },
  computed: {
    formattedAge() {
      // const { ageData } = this.user,
      //    [ dateOfBirth ] = ageData,
      //     dateOfBirthArr = dateOfBirth.split('-'),
      //     age = new Date().getFullYear() - dateOfBirthArr[0];
      // return `${age} ${(ageData.length > 2) ? ageData[Helpers.russianAge(age)] : ageData[1]}`;
      return Helpers.getFormatedAge(this.user.ageData);
    },
    astroCode() {
      return Helpers.zodiakFinder(this.user.ageData[0]);
    },
    lastSeen() {
      return !this.user.online || (Date.now() - this.user.lastSeenAt > Helpers.OFFLINE_GAP) ? this.user.lastSeenAt : 0;
    },
    pageURL() {
      return `${window.location.origin}${this.urlPrefix}/${this.user.userCustomURL || this.user.uuid}`;
    }
  },
  methods: {
    switchChat() {
      if (!this.chatActivated) {
        window.location = `/profile/chat/${this.user.uuid}`;
        this.chatActivated = true;
      }
    }
  }
});
