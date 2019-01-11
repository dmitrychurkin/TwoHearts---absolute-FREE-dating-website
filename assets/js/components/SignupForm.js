
Vue.component('signup-form', {
  template: `
      <v-stepper alt-labels v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" :step="1">{{ steps.step1 }}</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" :step="2">{{ steps.step2 }}</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="showBottomSheet" :step="MAX_STEP">{{ steps.step3 }}</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
        
          <v-stepper-content :step="1">
            <v-form ref="1" lazy-validation>
              <v-text-field
                class="mb-3"
                v-model.trim="formData.name"
                :label="name.label"
                maxlength="20"
                :counter="20"
                :rules="[specialRules.step1.name]"
                :hint="name.hint"
              ></v-text-field>

              <v-radio-group 
                class="mb-3"
                :label="gender.labels[0]" 
                v-model="formData.gender"
                column
              >
                <v-radio class="pl-3 py-2" color="primary" :label="gender.labels[1]" :value="1"></v-radio>
                <v-radio class="pl-3" color="primary" :label="gender.labels[2]" :value="0"></v-radio>
              </v-radio-group>

              <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field 
                  class="mb-3"
                  slot="activator"
                  v-model="formData.dateOfBirth"
                  :label="birthdayLabel"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  ref="picker"
                  v-model="formData.dateOfBirth"
                  :max="new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString()"
                  :min="new Date().getFullYear()-100+'-'+0+'-'+1"
                  @change="save"
                ></v-date-picker>
              </v-menu>
            </v-form>
          </v-stepper-content>

          <v-stepper-content :step="2">
            <v-form ref="2" lazy-validation>
              <div class="mb-4">
                <v-subheader class="title">{{ lookingFor.title }}</v-subheader>
                <v-checkbox class="pl-3" :rules="[specialRules.step2.lookingFor]" color="primary" v-model="formData.lookingFor" :label="lookingFor.male" :value="1"></v-checkbox>
                <v-checkbox class="pl-3" :rules="[specialRules.step2.lookingFor]" color="primary" v-model="formData.lookingFor" :label="lookingFor.female" :value="0"></v-checkbox>
              </div>
              <div class="px-1">
                <v-select
                  v-model="formData.purpose"
                  :rules="[specialRules.step2.purpose]"
                  :items="purpose.items"
                  :label="purpose.label"
                  item-value="id"
                  solo
                  chips
                  clearable
                >
                  <template 
                    slot="selection"
                    slot-scope="data">
                    <v-chip
                      :selected="data.selected"
                      dark
                      color="orange"
                      text-color="white"
                    >
                      {{data.item.text}}
                      <v-icon right>{{ data.item.avatar }}</v-icon>
                    </v-chip>
                  </template>
                  
                </v-select>
              </div>
            </v-form>
          </v-stepper-content>
            
          <v-stepper-content :step="3">
            <v-form ref="3" lazy-validation>
              <div class="mb-3 mt-5 px-1">
                <v-combobox
                  v-model.trim="formData.place"
                  :rules="[specialRules.step3.place]"
                  clearable
                  chips
                  solo
                  maxlength="200"
                  :label="place.label"
                  :hint="place.hint"
                >
                  <template
                    slot="selection"
                    slot-scope="data"
                  >
                    <v-chip
                      :selected="data.selected"
                      color="blue-grey"
                      class="white--text"
                    >
                      <v-icon left>location_city</v-icon>
                      <span v-text="data.item"></span>
                    </v-chip>
                  </template>
                </v-combobox>
              </div>
              <div class="mb-3">
                <v-text-field 
                  v-model.trim="formData.email"
                  :rules="[specialRules.step3.email]"
                  type="email"
                  :label="email.label"
                  :hint="email.hint"
                  maxlength="200"
                ></v-text-field>
              </div>
              <div class="mb-3">
                <v-text-field
                    v-model.trim="formData.password"
                    :append-icon="showPass ? 'visibility_off' : 'visibility'"
                    :rules="[specialRules.step3.password]"
                    :type="showPass ? 'text' : 'password'"
                    :label="passwords.labels[0]"
                    maxlength="200"
                    @click:append="showPass = !showPass"
                    :hint="passwords.hint"
                ></v-text-field>
              </div>
              <div class="mb-5">
                <v-text-field
                    v-model.trim="formData.confirmPassword"
                    :append-icon="showPass ? 'visibility_off' : 'visibility'"
                    :rules="[specialRules.step3.confirmPassword]"
                    :type="showPass ? 'text' : 'password'"
                    :label="passwords.labels[1]"
                    @click:append="showPass = !showPass"
                ></v-text-field>
              </div>
              <div class="g-recaptcha" data-callback="reCaptchaSuccess" data-expired-callback="reCaptchaExpired" data-sitekey="6LdLcHsUAAAAAMJovqeUkUHr0Mfn98_kr0MOWfrI"></div>
            </v-form>

          </v-stepper-content>

          <v-container grid-list-xs>
            <v-layout class="px-4 pb-4" row justify-content-between>
              <v-flex>
                <v-btn @click.stop="next(-1)" :disabled="step == 1" color="primary" fab light>
                  <v-icon>arrow_back_ios</v-icon>
                </v-btn>
                <span class="subheading">{{ back }}</span>
              </v-flex>
              <v-flex class="text-xs-right">
                <span class="subheading">{{ forward }}</span>
                <v-btn @click.stop="next(1)" :disabled="btnDisabled" color="primary" fab light>
                  <v-icon>arrow_forward_ios</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>

        </v-stepper-items>

        <v-bottom-sheet 
          v-model="showBottomSheet"
          full-width
          lazy 
          persistent>
          <v-card tile>
            <v-card-actions>
              <v-layout column>
                <v-flex>
                  <v-layout style="width:50%" class="mx-auto" align-center row>
                    <v-flex>
                      <v-checkbox 
                        v-model="sitePolicyAccepted" 
                        color="primary">
                          <div slot="label" v-once v-html="sitePolicyText"></div>
                        </v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex class="pb-5">
                  <v-layout style="width:50%" class="mx-auto" row>
                    <v-flex>
                      <v-btn @click.stop="registerNewUser" :loading="requestSent" :disabled="!captcha || requestSent || !sitePolicyAccepted" color="success">{{ controls[0] }}</v-btn>
                    </v-flex>
                    <v-flex>
                      <v-btn @click.stop="closeBottomSheet" color="primary">{{ controls[1] }}</v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-bottom-sheet>

        <v-snackbar v-model="snackbar">
          {{ snackbarMessage }}
          <v-btn
            color="pink"
            flat
            @click.stop="snackbar = false"
          >
          Close
          </v-btn>
        </v-snackbar>

      </v-stepper>
  `,
  data() {
    const d = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
    const self = this;
    return {
      MAX_STEP: 3,
      snackbar: false,
      showPass: false,
      showBottomSheet: false,
      sitePolicyAccepted: false,
      requestSent: false,
      step: 1,
      menu: false,
      processDone: false,
      lastFormFieldsValid: [],
      currentErrors: {
        step1: {
          name: undefined
        },
        step2: {
          purpose: undefined,
          lookingFor: undefined
        },
        step3: {
          email: undefined,
          place: undefined,
          password: undefined,
          confirmPassword: undefined
        }
      },
      formData: {
        name: undefined,
        gender: 1,
        dateOfBirth: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
        lookingFor: [],
        purpose: undefined,
        place: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined
      },
      
      specialRules: {
        step1: {
          name: val => {
            if (!Helpers.required('')(val)) {
              return (this.currentErrors.step1.name = this.name.errors[0]);
            }else if (!Helpers.minLength('',3)(val)) {
              return (this.currentErrors.step1.name = this.name.errors[1]);
            }else if (!Helpers.maxLength('',20)(val)) {
              return (this.currentErrors.step1.name = this.name.errors[2]);
            }
            this.currentErrors.step1.name = undefined;
            return true;
          }
        },
        step2: {
          purpose: () => {
            if (typeof this.formData.purpose === 'undefined') {
              return (this.currentErrors.step2.purpose = this.purpose.errors[0]);
            }
            this.currentErrors.step2.purpose = undefined;
            return true;
          },
          lookingFor: () => {
            if (!this.formData.lookingFor.length) {
              return (this.currentErrors.step2.lookingFor = this.lookingFor.errors[0]);
            }
            this.currentErrors.step2.lookingFor = undefined;
            return true;
          }
        },
        step3: {
          email: val => {
            let errorMessage;
            const { errors } = this.email;
            if (!Helpers.required('')(val)) {
              errorMessage = errors[0];
            }else if (!Helpers.email('')(val)) {
              errorMessage = errors[1];
            }else if (!Helpers.maxLength('',200)(val)) {
              errorMessage = errors[2];
            }
            if (errorMessage) {
              this.currentErrors.step3.email = errorMessage;
              this.lastFormFieldsValid[0] = undefined;
            }else {
              this.currentErrors.step3.email = undefined;
              this.lastFormFieldsValid[0] = true;
            }
            self.validateProcess();
            return errorMessage || true;
          },
          place: val => {
            let errorMessage;
            const { errors } = this.place;
            if (!Helpers.required('')(val)) {
              errorMessage = errors[0];
            }else if (!Helpers.maxLength('',200)(val)) {
              errorMessage = errors[1];
            }
            if (errorMessage) {
              this.currentErrors.step3.place = errorMessage;
              this.lastFormFieldsValid[1] = undefined;
            }else {
              this.currentErrors.step3.place = undefined;
              this.lastFormFieldsValid[1] = true;
            }
            self.validateProcess();
            return errorMessage || true;
          },
          password: val => {
            let errorMessage;
            const { errors } = this.passwords;
            if (!Helpers.required('')(val)) {
              errorMessage = errors[0];
            }else if (!Helpers.minLength('',6)(val)) {
              errorMessage = errors[1];
            }else if (!Helpers.maxLength('',200)(val)) {
              errorMessage = errors[3];
            }
            if (errorMessage) {
              this.currentErrors.step3.password = errorMessage;
              this.lastFormFieldsValid[2] = undefined;
            }else {
              this.currentErrors.step3.password = undefined;
              this.lastFormFieldsValid[2] = true;
            }
            self.validateProcess();
            return errorMessage || true;
          },
          confirmPassword: val => {
            let errorMessage;
            const { errors } = this.passwords;
            if (!Helpers.required('')(val)) {
              errorMessage = errors[0];
            }else if (self.$data.formData.password !== val) {
              errorMessage = errors[2];
            }
            if (errorMessage) {
              this.currentErrors.step3.confirmPassword = errorMessage;
              this.lastFormFieldsValid[3] = undefined;
            }else {
              this.currentErrors.step3.confirmPassword = undefined;
              this.lastFormFieldsValid[3] = true;
            }
            self.validateProcess();
            return errorMessage || true;
          }
        }
      }
    };
  },
  computed: {
    btnDisabled() {
      if (this.step < 3) return false;
      
      if (this.processDone && this.captcha) return false;
      
      return true;
    },
    snackbarMessage() {
      switch (this.step) {
        case 1: 
          return [this.currentErrors.step1.name][0] || this.successMessage;
        case 2: 
          return [this.currentErrors.step2.lookingFor, this.currentErrors.step2.purpose].filter(el => !!el)[0] || this.successMessage;
        case 3:
          return [this.currentErrors.step3.place, this.currentErrors.step3.email, this.currentErrors.step3.password, this.currentErrors.step3.confirmPassword].filter(el => !!el)[0] || this.successMessage;
      }
    },
    forward() {
      switch (this.step) {
        case 1:
          return this.steps.step2;
        case 2:
          return this.steps.step3;
        case 3:
          return this.steps.step4;
        default:
          return '';
      }
    },
    back() {
      switch (this.step) {
        case 2:
          return this.steps.step1;
        case 3:
          return this.steps.step2;
        default:
          return '';
      }
    }
  },
  props: [
    'controls',
    'name',
    'email',
    'place',
    'passwords',
    'successMessage',
    'gender',
    'birthdayLabel',
    'lookingFor',
    'purpose',
    'steps',
    'sitePolicyText',
    'captcha'
  ],
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    captcha(val) {
      if (!val) {
        this.showBottomSheet = val;
      }
    },
    showBottomSheet(val) {
      if (!val) {
        this.sitePolicyAccepted = false;
      }
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date);
    },
    next(direction) {
      if (direction < 0) return this.step--;
      const form = this.$refs[this.step];

      if (this.step == this.MAX_STEP && form && form.validate()) {
        this.showBottomSheet = true;
        return;
      }
      if (this.step >= 1 && this.step <= this.MAX_STEP-1 && form && form.validate()) {
        return this.step++;
      }
      
      this.snackbar = true;
    },
    validateProcess() {
      this.processDone = this.lastFormFieldsValid.every(e => e);
      //check everithing for sure
      if (this.processDone) {
        for (let i = 1; i < this.MAX_STEP; i++) {
          const form = this.$refs[i];
          if (!form.validate()) {
            this.processDone = false;
            break;
          }
        }
      }
    },
    closeBottomSheet() {
      this.sitePolicyAccepted = this.showBottomSheet = false;
    },
    async registerNewUser() {
      
      if (this.requestSent) return;
      this.requestSent = true;

      this.formData.userDeviceType = Helpers.getOsFlag();
      console.log('New user data ', this.formData);
      try {
        if (!this.captcha) {
          throw {responseInfo:{statusCode: 0}};
        }
        const response = await Cloud.signup.with(this.formData);
        console.log('Response ');
        console.dir(response);
        window.location = '/profile';
      }catch(err) {
        console.log('Error ');
        console.dir(err);
        const { responseInfo } = err;
        
        this.closeBottomSheet();
        this.$emit('output', responseInfo);

      }
      
      this.requestSent = false;
    }
  }
});
