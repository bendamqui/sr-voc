<template>
  <b-progress class="mt-2" :max="max">
    <b-progress-bar
      v-for="(result, index) in results"
      :key="index"
      :value="1"
      :variant="resultToVariant[result]"
    />
  </b-progress>
</template>

<script>
export default {
  props: {
    results: {
      type: Array,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    resultToVariant: {
      0: "danger",
      1: "success"
    }
  })
};
</script>
