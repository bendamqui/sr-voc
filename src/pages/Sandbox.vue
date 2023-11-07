<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Sandbox</h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-button @click="click">Click</b-button>
      </div>
      <pre>{{ debug }}</pre>
    </div>
  </div>
</template>

<script>
import { ResultsLog } from "@/pouch";

export default {
  async created() {
    this.click();
  },
  data() {
    return { debug: null };
  },
  methods: {
    click() {
      ResultsLog.allDocs({
        include_docs: true
      }).then(docs => {
        this.debug = docs;
      });
    }
  }
};
</script>
