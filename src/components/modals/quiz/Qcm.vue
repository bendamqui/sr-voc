<template>
  <div>
    <h1>{{ question.source }}</h1>
    <b-list-group>
      <b-list-group-item
        v-for="(choice, index) in question.choices"
        :key="index"
        @click="$emit('click', choice.target)"
        >{{ `${index + 1}. ${choice.target}` }}</b-list-group-item
      >
    </b-list-group>
    <div v-if="hasError" class="mt-2">
      <b class="text-danger">{{ question.target }}</b>
      <b-button @click="$emit('next')" class="float-right">Next</b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    hasError: {
      type: Boolean,
      require: true
    }
  }
};
</script>
