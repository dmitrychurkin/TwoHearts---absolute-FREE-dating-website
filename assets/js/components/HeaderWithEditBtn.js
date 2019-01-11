Vue.component('header-with-edit-btn', {
  template: `
  <span>
    <span v-text="title" :style="styles"></span>
    <v-tooltip bottom lazy :z-index="1">
      <v-btn slot="activator" @click="$emit('edit')" color="primary" fab small dark>
        <v-icon>edit</v-icon>
      </v-btn>
      <span v-once v-text="tooltip"></span>
    </v-tooltip>
    <slot></slot>
  </span>
  `,
  props: {
    title: {
      required: true,
      type: String
    },
    styles: {
      type: Object,
      default: () => {
        return {
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '.02em',
          fontFamily: 'Roboto,sans-serif'
        };
      }
    },
    tooltip: {
      required: true,
      type: String
    }
  }
});