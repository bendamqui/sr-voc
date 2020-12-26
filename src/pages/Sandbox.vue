<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Sandbox</h1>
    </div>
    {{ error }}
    <p>
      <b-button @click="handleClick">Run</b-button>
    </p>
    {{ debug }}
  </div>
</template>

<script>
export default {
  data: () => ({
    debug: "",
    error: ""
  }),
  methods: {
    async handleClick() {}
  }
};
</script>
