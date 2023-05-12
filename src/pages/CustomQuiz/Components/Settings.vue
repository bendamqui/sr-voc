<template>
  <div>
    <b-form @submit.prevent="$emit('start', settings)">
      <div class="row">
        <div class="col-md-2">
          <b-form-group label="Number of questions">
            <b-form-input
              type="number"
              v-model="settings.questionCount"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <b-form-group label="Direction">
            <b-form-radio
              v-model="settings.direction"
              :value="direction.SOURCE_TO_TARGET"
              >Source -> Target</b-form-radio
            >
            <b-form-radio
              v-model="settings.direction"
              :value="direction.TARGET_TO_SOURCE"
              >Target -> Source</b-form-radio
            >
          </b-form-group>
        </div>
        <div class="col-md-12">
          <b-form-group label="Retry incorrect answers">
            <b-form-radio v-model="settings.retryErrors" :value="true"
              >Yes</b-form-radio
            >
            <b-form-radio v-model="settings.retryErrors" :value="false"
              >No</b-form-radio
            >
          </b-form-group>
        </div>
      </div>
      <b-button @click="$emit('start', settings)" variant="success"
        >Start</b-button
      >
    </b-form>
  </div>
</template>

<script>
import { DIRECTION } from "@/modules/quiz/types";

export default {
  data() {
    return {
      direction: DIRECTION,
      settings: {
        questionCount: 10,
        direction: DIRECTION.SOURCE_TO_TARGET,
        retryErrors: true
      }
    };
  }
};
</script>
