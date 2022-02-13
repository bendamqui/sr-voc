<template>
  <div class="green" @click="test">{{ msg }}</div>
</template>

<script>
/**
 * - on mounted transform span into component
 */
export default {
  props: ["msg"],
  methods: {
    test() {
      console.log("yeah");
    }
  }
};
</script>

<style>
.green {
  color: green;
}
</style>
