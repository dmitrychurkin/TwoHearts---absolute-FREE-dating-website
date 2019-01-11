Vue.component('partner-selector', {
  template: `
<v-card>
  <v-form method="POST" action="/search">
  <input type="hidden" name="_csrf" :value="security" />
  <input type="hidden" name="gender" :value="JSON.stringify(partnerSelector.gender)" />
  <input type="hidden" name="lookingFor" :value="JSON.stringify(partnerSelector.lookingFor)" />
  <input type="hidden" name="place" :value="JSON.stringify(partnerSelector.place)" />
  <input type="hidden" name="purpose" :value="JSON.stringify(partnerSelector.purpose)" />
  <input type="hidden" name="ageRange" :value="JSON.stringify(partnerSelector.ageRange)" />
  <input type="hidden" name="newUsers" :value="JSON.stringify(partnerSelector.newUsers)" />
  <input type="hidden" name="online" :value="JSON.stringify(partnerSelector.online)" />
  <input type="hidden" name="nearMe" :value="JSON.stringify(partnerSelector.nearMe)" />
  <input type="hidden" name="interests" :value="JSON.stringify(partnerSelector.interests)" />
  <input type="hidden" name="weightRange" :value="JSON.stringify(partnerSelector.weight)" />
  <input type="hidden" name="heightRange" :value="JSON.stringify(partnerSelector.height)" />
  <input type="hidden" name="languages" :value="JSON.stringify(partnerSelector.languages)" />
  <input type="hidden" name="relation" :value="JSON.stringify(partnerSelector.relation)" />
  <input type="hidden" name="children" :value="JSON.stringify(partnerSelector.children)" />
  <input type="hidden" name="education" :value="JSON.stringify(partnerSelector.education)" />
  <input type="hidden" name="income" :value="JSON.stringify(partnerSelector.income)" />
  <input type="hidden" name="smoke" :value="JSON.stringify(partnerSelector.smoke)" />
  <input type="hidden" name="drink" :value="JSON.stringify(partnerSelector.drink)" />
  <input type="hidden" name="zodiac" :value="JSON.stringify(partnerSelector.zodiac)" />
  <input type="hidden" name="body" :value="JSON.stringify(partnerSelector.body)" />
  <input type="hidden" name="eyes" :value="JSON.stringify(partnerSelector.eyes)" />
  <input type="hidden" name="hair" :value="JSON.stringify(partnerSelector.hair)" />
  <input type="hidden" name="extras" :value="JSON.stringify(partnerSelector.extras)" />
  <input type="hidden" name="sponsore" :value="JSON.stringify(partnerSelector.sponsore)" />
  <input type="hidden" name="car" :value="JSON.stringify(partnerSelector.car)" />
  <input type="hidden" name="sport" :value="JSON.stringify(partnerSelector.sport)" />
  <input type="hidden" name="mortgage" :value="JSON.stringify(partnerSelector.mortgage)" />
  <input type="hidden" name="orientation" :value="JSON.stringify(partnerSelector.orientation)" />
  <input type="hidden" name="datingAs" :value="JSON.stringify(partnerSelector.datingAs)" />
  <input type="hidden" name="lookingAs" :value="JSON.stringify(partnerSelector.lookingAs)" />
  <input type="hidden" name="sexRole" :value="JSON.stringify(partnerSelector.sexRole)" />
  <input type="hidden" name="sexLikeIn" :value="JSON.stringify(partnerSelector.sexLikeIn)" />
  <input type="hidden" name="sexOral" :value="JSON.stringify(partnerSelector.sexOral)" />
  <input type="hidden" name="sexGroup" :value="JSON.stringify(partnerSelector.sexGroup)" />
  <input type="hidden" name="sexBdsm" :value="JSON.stringify(partnerSelector.sexBdsm)" />
  <input type="hidden" name="sexFetish" :value="JSON.stringify(partnerSelector.sexFetish)" />

  <v-container grid-list-xs>
    <v-layout column>
      <v-flex>
        <v-layout align-end row>
          <v-flex xs3 class="pr-2">
            <v-select 
              v-model="partnerSelector.gender" 
              :items="gender.items" 
              :label="gender.label" 
              ></v-select>
          </v-flex>
          <v-flex xs4 class="pr-2">
            <v-select 
              v-model="partnerSelector.lookingFor" 
              :items="lookingFor.items" 
              :label="lookingFor.label" 
              :deletable-chips="!!userData.lookingFor"
              :clearable="!!userData.lookingFor" 
              :chips="!!userData.lookingFor" 
              :multiple="!!userData.lookingFor"
              ></v-select>
          </v-flex>
          <v-flex xs5>
            <v-combobox 
              v-model="partnerSelector.place" 
              clearable 
              chips 
              solo 
              :label="place.label">
              <template 
                v-if="partnerSelector.place == null" 
                slot="no-data">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title v-once v-html="place.misc[0]"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <template 
                slot="selection" 
                slot-scope="data">
                <v-chip 
                  :selected="data.selected" 
                  color="blue-grey" 
                  class="white--text">
                    <v-icon left>location_city</v-icon>
                    <span v-text="data.item"></span>
                </v-chip>
              </template>
            </v-combobox>
          </v-flex>
        </v-layout>
        <v-layout row align-end>
          <v-flex class="pr-3">
            <v-subheader v-once v-text="ageRange.head"></v-subheader>
            <v-layout>
              <v-flex shrink style="width: 60px">
                <v-text-field 
                  v-model="partnerSelector.ageRange[0]" 
                  class="mt-0" 
                  single-line 
                  type="number"></v-text-field>
              </v-flex>
              <v-flex class="px-3">
                <v-range-slider 
                  v-model="partnerSelector.ageRange" 
                  :max="99" 
                  :min="18" 
                  thumb-label 
                  always-dirty></v-range-slider>
              </v-flex>
              <v-flex shrink style="width:60px">
                <v-text-field 
                  v-model="partnerSelector.ageRange[1]" 
                  class="mt-0" 
                  single-line 
                  type="number"></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs5>
            <v-select 
              v-model="partnerSelector.purpose" 
              :items="purpose.items"
              :label="purpose.label" 
              :deletable-chips="!!userData.purpose"
              :clearable="!!userData.purpose" 
              :chips="!!userData.purpose" 
              :multiple="!!userData.purpose">
              </v-select>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row>
          <v-flex>
            <v-checkbox 
              v-model="partnerSelector.newUsers"
              color="primary" 
              :label="newUsers.label" 
              :value="false"></v-checkbox>
            <v-checkbox 
              v-model="partnerSelector.online" 
              color="primary" 
              :label="online.label" 
              :value="false"></v-checkbox>
          </v-flex>
          <v-flex>
            <v-checkbox 
              v-model="partnerSelector.nearMe" 
              color="primary" 
              :label="nearMe.label" 
              :value="false" 
              disabled></v-checkbox>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="userData.uuid">
        <v-expansion-panel 
          class="elevation-0" 
          expand>
          <v-expansion-panel-content>
            <div slot="header">
              <v-btn flat v-once v-text="expansionPanel.head"></v-btn>
            </div>
            <v-container grid-list-xs>
              <v-layout column>
                <v-flex>
                  <v-combobox 
                    v-model="partnerSelector.interests" 
                    :label="interests.label"
                    clearable 
                    deletable-chips 
                    multiple 
                    chips
                    solo>
                    <template slot="no-data">
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title 
                            v-if="partnerSelector.interests.length == 0"
                            v-html="place.misc[0]"></v-list-tile-title>
                          <v-list-tile-title 
                            v-else-if="partnerSelector.interests.length < 5"
                            v-text="interests.hint"></v-list-tile-title>
                          <v-list-tile-title 
                            v-else
                            v-html="interests.misc[0]"></v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-combobox>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs4>
                      <v-subheader v-once v-text="weight.head"></v-subheader>
                      <v-range-slider 
                        v-model="partnerSelector.weight" 
                        :min="40" 
                        :max="150"
                        always-dirty 
                        thumb-label="always">
                      </v-range-slider>
                    </v-flex>
                    <v-flex offset-xs4 xs4>
                      <v-subheader v-once v-text="height.head"></v-subheader>
                      <v-range-slider 
                        v-model="partnerSelector.height" 
                        :min="140" 
                        :max="220"
                        always-dirty 
                        thumb-label="always">
                      </v-range-slider>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <language-selector
                    :model.sync="partnerSelector.languages"
                    :mode="0"
                    :languages-data="{label:languages.label,items:languages.items}"
                    :skills-data="{label:skills.label,items:skills.items}"
                  ></language-selector>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.relation" 
                        :items="relation.items"
                        :label="relation.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.children" 
                        :items="children.items"
                        :label="children.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.education" 
                        :items="education.items"
                        :label="education.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.income" 
                        :items="income.items"
                        :label="income.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.smoke" 
                        :items="smoke.items"
                        clearable 
                        deletable-chips
                        chips 
                        multiple 
                        :label="smoke.label"></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.drink" 
                        :items="drink.items"
                        :label="drink.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.zodiac" 
                        :items="zodiac.items"
                        :label="zodiac.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.body" 
                        :items="body.items"
                        :label="body.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.hair" 
                        :items="hair.items"
                        :label="hair.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.eyes" 
                        :items="eyes.items"
                        :label="eyes.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.extras" 
                        :items="extras.items"
                        :label="extras.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.sponsore" 
                        :items="sponsore.items"
                        :label="sponsore.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.car" 
                        :items="car.items" 
                        :label="car.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.sport" 
                        :items="sport.items"
                        :label="sport.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.mortgage" 
                        :items="mortgage.items"
                        :label="mortgage.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.orientation" 
                        :items="orientation.items"
                        :label="orientation.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.datingAs" 
                        :items="datingAs.items"
                        :label="datingAs.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.lookingAs" 
                        :items="lookingAs.items"
                        :label="lookingAs.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.sexRole" 
                        :items="sexRole.items"
                        :label="sexRole.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.sexLikeIn" 
                        :items="sexLikeIn.items"
                        :label="sexLikeIn.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.sexOral" 
                        :items="sexOral.items"
                        :label="sexOral.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.sexGroup" 
                        :items="sexGroup.items"
                        :label="sexGroup.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout align-end row>
                    <v-flex xs5>
                      <v-select 
                        v-model="partnerSelector.sexBdsm" 
                        :items="sexBdsm.items"
                        :label="sexBdsm.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                    <v-flex offset-xs2 xs5>
                      <v-select 
                        v-model="partnerSelector.sexFetish" 
                        :items="sexFetish.items"
                        :label="sexFetish.label"
                        clearable 
                        deletable-chips
                        chips 
                        multiple></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex>
        <v-btn 
          @click.stop="search"
          :disabled="loading" 
          :loading="loading" 
          type="submit"
          large
          color="warning">
            <v-icon left>my_location</v-icon>
            {{ controls[0] }}
          </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
  </v-form>
</v-card>
`,
  data() {
    let { gender, lookingFor, place, purpose, ageRange } = this.userData;

    return {
      loading: false,
      partnerSelector: {
        gender,
        lookingFor,

        place,

        purpose: purpose || -1,
        ageRange: ageRange || [18,99],
        newUsers: false,
        online: false,
        nearMe: false,

        interests: [],

        weight: [40,150],
        height: [140,220],
        languages: [],
        relation: [],
        children: [],
        education: [],
        income: [],
        smoke: [],
        drink: [],
        zodiac: [],

        body: [],
        eyes: [],
        hair: [],
        extras: [],
        sponsore: [],
        car: [],
        sport: [],
        mortgage: [],
        orientation: [],
        datingAs: [],
        lookingAs: [],
        sexRole: [],
        sexLikeIn: [],
        sexOral: [],
        sexGroup: [],
        sexBdsm: [],
        sexFetish: []
      }
    };
  },
  props: [
    'gender',
    'lookingFor',
    'place',
    'ageRange',
    'purpose',
    'newUsers',
    'online',
    'nearMe',
    'expansionPanel',
    'interests',
    'weight',
    'height',
    'languages',
    "skills",
    'relation',
    'children',
    'education',
    'income',
    'smoke',
    'drink',
    'zodiac',
    'body',
    'eyes',
    'hair',
    'extras',
    'sponsore',
    'car',
    'sport',
    'mortgage',
    'orientation',
    'datingAs',
    'lookingAs',
    'sexRole',
    'sexLikeIn',
    'sexOral',
    'sexGroup',
    'sexBdsm',
    'sexFetish',
    'controls',

    'security',
    'userData'
  ],
  watch: {
    'partnerSelector.interests'() {
      if (this.partnerSelector.interests.length > 5) {
        this.$nextTick(() => this.partnerSelector.interests.pop());
      }
    },
    'partnerSelector.purpose'(purpose) {
      if (this.userData.uuid && purpose.includes(-1) && purpose.length > 1) {
        this.$nextTick(() => this.partnerSelector.purpose = [-1]);
      }
    }
  },
  methods: {
    search() {
      this.loading = true;
      //setTimeout(() => this.loading = !this.loading, 2000);
    }
  }
});