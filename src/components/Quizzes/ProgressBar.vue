<template>
  <b-progress class="mt-2" :max="stats.max">
    <b-progress-bar
      v-for="(result, index) in stats.results"
      :key="index"
      :value="1"
      :variant="result ? 'success' : 'danger'"
    />
  </b-progress>
</template>

<script>
export default {
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
};
</script>
