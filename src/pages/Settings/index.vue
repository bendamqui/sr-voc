<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Settings</h1>
    </div>

    <b-form @submit.prevent="handleSubmit">
      <div class="form-group row" v-for="setting in payload" :key="setting.id">
        <label class="col-sm-1 col-form-label"
          >Level {{ setting.operator }} {{ setting.level }}</label
        >
        <div class="col-sm-2">
          <b-form-input type="number" v-model="setting.value" />
        </div>
        <div class="col-md-2">
          <b-form-select
            v-model="setting.period"
            :options="['hour', 'day', 'month', 'year']"
          ></b-form-select>
        </div>
      </div>
      <b-button variant="info" :disabled="disabled" type="submit"
        >Save</b-button
      >
    </b-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  async created() {
    await this.fetch();
    this.payload = this.review;
  },
  data() {
    return {
      disabled: false,
      payload: {}
    };
  },
  computed: {
    ...mapGetters("settings", ["review"])
  },
  methods: {
    ...mapActions("settings", ["fetch", "save"]),
    async handleSubmit() {
      this.disabled = true;
      await this.save(this.payload);
      await this.fetch();
      this.payload = this.review;
      this.disabled = false;
    }
  }
};
</script>
