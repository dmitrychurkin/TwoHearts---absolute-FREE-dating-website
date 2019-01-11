Vue.component('signin-form', {
  template: `
  <v-dialog v-model="value" persistent max-width="900px">
    <v-toolbar
      color="primary"
      dark>
      <v-toolbar-title v-once v-text="textData[0]"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :disabled="requestSent" icon @click.stop="onWindowClose">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <alert-notification :response-data="responseError"></alert-notification>
        <v-layout>
          <v-flex xs7 class="pa-3">
            <v-card-title v-once v-text="textData[1]" class="title pa-2 d-block text-xs-center"></v-card-title>
            <v-card-actions class="flex-column w-100">
              <v-form class="w-100" @submit.stop.prevent="submitForm" ref="formModal" lazy-validation>
                <v-text-field
                    v-model.trim="formData.email"
                    type="email"
                    :label="email.label"
                    :rules="[validationRules.required(email.errors[0]), validationRules.email(email.errors[1])]"
                    prepend-icon="assignment_ind"
                ></v-text-field>
                <v-text-field
                    v-model.trim="formData.password"
                    :append-icon="showPass ? 'visibility_off' : 'visibility'"
                    :rules="[validationRules.required(email.errors[0]), validationRules.password(password.errors[0])]"
                    :type="showPass ? 'text' : 'password'"
                    :label="password.label"
                    prepend-icon="fingerprint"
                    @click:append="showPass = !showPass"
                ></v-text-field>
                <v-btn class="mt-2" v-once v-text="controls[0]" flat href="/password/forgot"></v-btn>
                <v-checkbox
                  v-model="formData.rememberMe"
                  color="primary"
                  :label="remember.label"
                ></v-checkbox>
                <div class="d-flex ma-auto" style="width:160px">
                  <v-btn class="d-block"
                      :loading="requestSent" 
                      :disabled="requestSent" 
                      type="submit"
                      color="info">{{ controls[1] }}</v-btn>
                </div>
              </v-form>
            </v-card-actions>
            <v-card-text v-html="textData[5]"></v-card-text>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex class="pa-3">
            <div v-once v-text="textData[2]" class="title text-xs-center py-3"></div>
            <p v-once v-text="textData[3]"></p>
            <p v-once v-text="textData[4]" class="mb-3"></p>
            <div class="d-flex ma-auto" style="width:250px">
                <v-btn v-once v-text="controls[2]" block href="/signup" color="success"></v-btn>
            </div>
          </v-flex>
          </v-layout>
    </v-card>
  </v-dialog>
  `,
  data() {
    return {
      // Sign In form
      showPass: false,
      formData: {
        email: undefined,
        password: undefined,
        rememberMe: undefined
      },
      responseError: null,
      validationRules: Helpers,
      requestSent: false
    };
  },
  model: {
    event: 'openWindow'
  },
  props: [
    'email',
    'password',
    'remember',
    'textData',
    'controls',
    'value'
  ],
  methods: {

    _resetAllData() {
      if (this.$refs.formModal) {
        this.$refs.formModal.reset();
      }
      this.showPass = !!(this.responseError = null);
      for (const field in this.formData) {
        if (this.formData.hasOwnProperty(field)) {
          this.formData[field] = undefined;
        }
      }
    },

    onWindowClose() {
      if (this.requestSent) {
        return;
      }
      this._resetAllData();
      this.$emit('openWindow', false);
    },

    async submitForm() {

      if (this.requestSent || !this.$refs.formModal || !this.$refs.formModal.validate()) {
        return;
      }

      this.$emit('requestSent', (this.requestSent = true));

      this.formData.userDeviceType = Helpers.getOsFlag();

      try {
        const response = await Cloud.login.with(this.formData);
        console.dir(response);
        this._resetAllData();
        window.location.reload(true);
      }catch(err) {
        console.dir(err);
        const { responseInfo } = err;
        this.responseError = responseInfo;

      }
      this.$emit('requestSent', (this.requestSent = false));

      //this.openSignInDialog = !!(this.responseErrorInfo = null);
      //setTimeout(() => {
      //this.$refs[formRefName].reset();
      //this.formData = {};
      // window.location = '/';
      //}, 500);



    },
  }
});
