<template>
  <span
    class="orange annotation"
    @click="$emit('click', $event, $props)"
    :data-id="id"
    :data-selector="selector"
  >
    {{ content }}</span
  >
</template>

<script>
export default {
  props: {
    content: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: String
    },
    selector: {
      required: true,
      type: String
    }
  }
};
</script>

<style>
.orange {
  color: orange;
}
</style>
