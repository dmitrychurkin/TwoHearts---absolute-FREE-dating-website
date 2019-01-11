
Vue.component('language-selector', {
  template: `
  <v-layout :column="!!mode" :justify-space-between="!mode" :align-center="!mode">
    <v-flex :xs5="!mode">
      <template v-for="(language, index) in model">
        <v-checkbox
          :label="checkboxLabel[language.value]"
          :input-value="true"
          :key="language.value"
          color="primary"
          @change="deleteLanguage(model,index)"
        ></v-checkbox>
        <v-select
          v-model.trim="language.skill"
          :items="skillsData.items"
          :label="skillsData.label"
        ></v-select>
      </template>
    </v-flex>
    <v-flex :xs5="!mode">
      <v-select
        :class="{'mt-5': !!(mode && model && model.length)}"
        :value="0"
        :label="languagesData.label"
        :items="languagesData.items"
        return-object
        @input="onLanguageSelected($event, model)"
      ></v-select>
    </v-flex>
  </v-layout>`,
  props: {
    mode: {
      type: Number,
      default: 1
    },
    model: {
      //type: [Array],
      // example [{value:1,skill:0}]
      required: true
    },
    languagesData: {
      // {
      //  items: [{text:'Выберите язык',value:0},{text:'Английский',value:1,skill:0},{text:'Немецкий',value:2,skill:0},{text:'Французский',value:3,skill:0},{text:'Итальянский',value:4,skill:0},{text:'Испанский',value:5,skill:0},{text:'Португальский',value:6,skill:0},{text:'Украинский',value:7,skill:0},{text:'Русский',value:8,skill:0},{text:'Иврит',value:9,skill:0},{text:'Арабский',value:10,skill:0}],
      //  label: ...
      // }
      type: Object,
      required: true
    },
    skillsData: {
      // {
      //  items: [{text:'начальный',value:0},{text:'средний',value:1},{text:'продвинутый',value:2},{text:'родной',value:3}],
      //  label: ...
      // }
      type: Object,
      required: true
    }
  },
  computed: {
    checkboxLabel() {
      const langs = this.languagesData.items.map(item => item.value == 0 ? '' : item.text);
      return langs[0] ? ['',...langs] : langs;
    }
  },
  methods: {
    onLanguageSelected({ value, skill }, model) {
      if (value && !model.find(t => value == t.value)) {
        model.push({value, skill});
        this.$emit('update:model', model);
      }
    },
    deleteLanguage(model, index) {
      model.splice(index,1);
      this.$emit('update:model', model);
    }
    // sortLanguages(modelData) {
    //   modelData.languages.sort((a,b) => b.skill - a.skill);
    // },
  }
});