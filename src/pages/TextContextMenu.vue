<template>
  <div v-bind:style="style">
    <b-list-group>
      <b-list-group-item @click="$emit('search-wiktionary')"
        >Search</b-list-group-item
      >
      <b-list-group-item @click="$emit('annotate')">Annotate</b-list-group-item>
      <b-list-group-item @click="$emit('cancel')">Cancel</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      required: false,
      default: 0
    },
    y: {
      type: Number,
      required: false,
      default: 0
    }
  },
  computed: {
    style() {
      return {
        position: "absolute",
        top: "0px",
        left: "0px",
        transform: `translate3d(${this.x}px, ${this.y}px, 0px)`,
        "z-index": 999,
        "will-change": "transform",
        overflow: "hidden"
      };
    }
  }
};
</script>
