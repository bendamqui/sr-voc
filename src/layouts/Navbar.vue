<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
    <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">SrVoc</a>
    <ul class="navbar-nav nav-actions px-3">
      <li class="nav-item">
        <b-button
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
import { exportData } from "@/modules/exportData";
import { importData } from "@/modules/importData";

export default {
  methods: {
    importData() {
      dialog.showOpenDialog({}).then(({ canceled, filePaths }) => {
        if (!canceled) {
          importData(filePaths);
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
            exportData(filePath);
          }
        });
    }
  }
};
</script>
