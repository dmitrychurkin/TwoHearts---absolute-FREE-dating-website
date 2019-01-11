Vue.component('side-menu', {
  template: `
<v-card>
  <v-list>
    <template v-for="item in menuItems">
      <v-list-tile
        :key="item.id"
        :href="item.link"
        :disabled="item.count == 0 && item.newCount == 0"
        ripple
        @click="">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-layout style="width:100%" align-center>
            <v-flex class="mr-2">
              {{ item.title }}
            </v-flex>
            <v-flex v-if="item.newCount" xs2 class="text-xs-center text-truncate">
              <div class="pa-1 text-truncate" style="background-color:#e21737;border-radius:50%;color:#fff">
                <span>+{{ item.newCount }}</span>
              </div>
            </v-flex>
            <v-flex v-else class="text-xs-right text-truncate">
              <div class="text-truncate">{{ item.count }}</div>
            </v-flex>
          </v-layout>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider v-if="item.divider"></v-divider>
    </template>
  </v-list>
</v-card>
  `,
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  }
});