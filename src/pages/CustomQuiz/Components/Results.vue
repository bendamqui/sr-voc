<template>
  <div>
    <b-table :items="items"></b-table>
  </div>
</template>

<script>
export default {
  props: {
    results: {
      required: true,
      type: Array
    }
  },
  computed: {
    items() {
      return this.results.map(
        ({ id, source, target, LessonId, level, result }) => ({
          id,
          source,
          target,
          LessonId,
          level,
          _rowVariant: result ? "success" : "danger"
        })
      );
    }
  }
};
</script>
