<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
    <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#"
      >SrVoc v{{ version }}</a
    >
    <ul class="navbar-nav nav-actions px-3">
      <li class="nav-item">
        <b-button
          disabled
          size="sm"
          @click.prevent="importData"
          variant="warning"
          class="mt-1 mr-2 text-white"
          ><b-icon icon="upload" aria-label="Help"></b-icon> Import</b-button
        >
      </li>
      <li class="nav-item">
        <b-button
          disabled
          size="sm"
          @click.prevent="exportData"
          variant="success"
          class="mt-1"
          ><b-icon icon="download" aria-label="Help"></b-icon> Export</b-button
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import { remote } from "electron";
import { format } from "date-fns";
const { dialog } = remote;
import { version } from "@/../package.json";
export default {
  data: () => ({
    version: version
  }),
  methods: {
    importData() {
      dialog.showOpenDialog({}).then(({ canceled, filePaths }) => {
        if (!canceled) {
          alert(filePaths);
        }
      });
    },
    exportData() {
      dialog
        .showSaveDialog({
          buttonLabel: "Export",
          defaultPath: format(new Date(), "yyyy_MM_dd_HH_mm_ss") + ".json"
        })
        .then(({ canceled, filePath }) => {
          if (!canceled) {
            alert(filePath);
          }
        });
    }
  }
};
</script>
