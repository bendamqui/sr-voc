<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Dashboard</h1>
    </div>

    <div class="row">
      <div class="col-md-12">
        <Bar :styles="{ height: '400px' }" :chart-data="wordsByLevelToChart" />
      </div>
    </div>
  </div>
</template>

<script>
import Bar from "@/components/Charts/Bar";
import { mapActions, mapGetters } from "vuex";
export default {
  components: { Bar },
  created() {
    this.fetchWordsByLevel();
  },
  computed: {
    ...mapGetters("words", ["wordsByLevelToChart"])
  },
  methods: {
    ...mapActions("words", ["fetchWordsByLevel"])
  }
};
</script>
