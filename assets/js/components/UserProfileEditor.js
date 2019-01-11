Vue.component('user-profile-editor', {
  template: `
<header-with-edit-btn
  :styles="dialogSettings.titleStyles || ({color:'#FF9800',fontSize:'18px',cursor:'context-menu'})"
  :title="title"
  :tooltip="tooltip"
  @edit="onOpen">
  <v-dialog v-model="dialog" scrollable persistent lazy :max-width="dialogSettings.maxWidth || '600px'">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <template v-if="notification">
        <v-divider></v-divider>
        <alert-notification :dismissible="dialogSettings.controls.dismissible" :response-data="notification || responseInfo"></alert-notification>
      </template>
      <v-divider></v-divider>
      <v-card-text>
        <v-form :ref="formRef" lazy-validation>
          <slot></slot>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="requestSent" flat @click.stop="onClose">{{ dialogSettings.controls.cancel }}</v-btn>
        <v-btn color="primary" :loading="requestSent" :disabled="isModelUntouched || requestSent || !!disableBtn || !!notification || (formRef && $refs[formRef] && !$refs[formRef].validate())" flat @click.stop="onSave">{{ dialogSettings.controls.save }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</header-with-edit-btn>`,
  data() {
    return {
      dialog: false,
      responseInfo: null,
      requestSent: false
    };
  },
  props: {
  // first element in errors Array must be always validation text error
    errors: {
      type: Array
    },
    model: {
      type: Object
    },
    formRef: {
      type: String,
      required: true
    },
    cancelCb: {
      type: Function
    },
    saveCb: {
      type: Function
    },
    onOpenCb: {
      type: Function
    },
    onBeforeSaveCb: {
      type: Function
    },
    notification: {
      type: Object
    },
    dialogSettings: {
      maxWidth: {
        type: String
      },
      titleStyles: {
        type: Object
      },
      controls: ['cancel', 'save','dismissible']
    },
    title: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      required: true
    },
    disableBtn: {
      type: Boolean
    }
  },
  computed: {
    isModelUntouched() {
      return JSON.stringify(this.model.cache) === JSON.stringify(this.model.data);
    }
  },
  methods: {
    onOpen() {
      if (!this.model) return;
      if ('data' in this.model) {
        const clone = JSON.stringify(this.model.data);
        this.model.cache = JSON.parse(clone);
      }
      typeof this.onOpenCb === 'function' && this.onOpenCb(this.model.cache);
      this.dialog = true;
    },
    onClose() {
      if (!this.model) return;
      if ('cache' in this.model) {
        this.model.cache = {};
      }
      this.$emit('update:notification', null);
      this.dialog = (typeof this.cancelCb === 'function' ? !this.cancelCb() : false);
    },
    async onSave() {
      if (!this.model || this.requestSent || this.isModelUntouched || (typeof this.onBeforeSaveCb === 'function' && !this.onBeforeSaveCb(this.model.cache))) return;

      if (this.formRef && this.$refs[this.formRef].validate()) {
        this.requestSent = true;
        const defaultResponseInfo = { responseInfo: { statusCode: 0 } };
        try {
          const res = await Cloud.updateProfile.with(this.model.cache);
          if ('cache' in this.model) {
            this.model.data = {...this.model.cache};
            this.model.cache = {};
          }
          typeof this.saveCb === 'function' && this.saveCb(this.model.data, res);
          this.dialog = !!(this.responseInfo = null);
        }catch(error) {
          console.dir(error);
          this.responseInfo = error && error.responseInfo ? error.responseInfo : defaultResponseInfo;
        }
        this.requestSent = false;
      }else {
        this.responseInfo = Array.isArray(this.errors) && this.errors[0] ? this.errors[0] : defaultResponseInfo;
      }

    }
  }
});