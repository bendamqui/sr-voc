<template>
  <div>
    <b-modal
      size="lg"
      id="context-menu"
      title="context menu"
      cancel-title="Delete"
      cancel-variant="danger"
    >
      <div>yo</div>
    </b-modal>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Sandbox</h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque eum
          excepturi fugiat incidunt iste minus obcaecati, perspiciatis. Aut
          deserunt dignissimos dolorum earum maxime necessitatibus, qui quod,
          repellat sed tempora voluptas!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import contextMenu from "electron-context-menu";
import { mapActions } from "vuex";

export default {
  created() {
    contextMenu({
      showLookUpSelection: false,
      showSearchWithGoogle: false,
      prepend: (defaultActions, parameters) => [
        {
          label: "Search Hayyim Dictionary",
          visible: parameters.selectionText.trim().length > 0,
          click: () => {
            this.$bvModal.show("context-menu");
          }
        }
      ]
    });
  },
  methods: {
    ...mapActions("hayyimDictionary", { searchHayyim: "search" })
  }
};
</script>
