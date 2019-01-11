Vue.component('alert-notification', {
  template: `
    <v-alert v-if="responseData && typeof responseData === 'object'" class="ma-0"
      :value="responseData"
      type="error"
      :dismissible="dismissible"
      transition="scale-transition"
    >
      {{ message }}
    </v-alert>
  `,
  props: {
    dismissible: {
      type: Boolean,
      default: true
    },
    responseData: {
      type: Object
    },
    localeMessages: {
      type: Object,
      default: () => window.$L
    }
  },
  computed: {
    message() {
      const { statusCode, data } = this.responseData;
      if (statusCode == 0) {
        return this.localeMessages.modal.errors[statusCode].message;
      }
      return data;
    }
  }
});