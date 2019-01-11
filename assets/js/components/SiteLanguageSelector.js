
Vue.component('site-language-selector', {
  template: `
  <v-menu open-on-hover top offset-y>
    <div slot="activator">
      {{ model.name }}
    </div>
    <v-list>
      <v-list-tile
        v-for="item in langs"
        :key="item.id"
        @click="setSiteLang(item.id)">
        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
  `,
  data() {
    return {
      model: '',
      langs: [{id: 'en', name: 'English'}, {id: 'ru', name: 'Русский'}]
    };
  },
  props: {
    cookieName: {
      type: String,
      default: 'lang'
    }
  },
  beforeMount() {
    this.setSiteLang(Helpers.getCookie(this.cookieName), true);
  },
  methods: {
    setSiteLang(lang= 'ru', init= false) {
      if (typeof lang === 'string') {
        this.model = this.langs.find(({ id }) => id === lang);
        //set lang cookie on 10 years
        Helpers.setCookie(this.cookieName, lang, { expires: 365 * 10 * (24*60*60) });
        if (!init) {
          window.location.reload();
        }
      }
    }
  }

});