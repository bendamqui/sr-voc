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
import { version } from "@/../package.json";
//import { ipcRenderer } from "electron";
import * as fs from "fs";
import { Lessons, ResultsLog, Words } from "@/pouch";
export default {
  created() {},
  data: () => ({
    version: version,
    debug: {}
  }),
  methods: {
    async importData() {
      //const path = `${ipcRenderer.sendSync("get-user-data-path")}`;
      //await this.importLessons(path);
      //await this.importWords(path);
      //await this.importResults(path);
    },
    importResults(path) {
      const results = JSON.parse(
        fs.readFileSync(`${path}/results.json`).toString()
      ).reduce((acc, { WordId, result, type, createdAt }) => {
        if (!acc[WordId]) {
          acc[WordId] = {
            _id: `sqlite-${WordId}`,
            log: [],
            created_at: new Date(createdAt).getTime()
          };
        }

        acc[WordId].log.push({
          result: !!result,
          answer: "",
          type,
          created_at: new Date(createdAt).getTime()
        });
        return acc;
      }, {});

      return ResultsLog.bulkDocs(
        // eslint-disable-next-line no-unused-vars
        Object.entries(results).map(([_, value]) => value)
      )
        .then(() => {
          console.log("Results imported");
        })
        .catch(error => {
          console.log("error while importing results", error);
        });
    },
    importWords(path) {
      const words = JSON.parse(
        fs.readFileSync(`${path}/words.json`).toString()
      ).map(
        ({
          id,
          source,
          target,
          pronunciation,
          level,
          lastAttempt,
          LessonId,
          createdAt,
          updatedAt
        }) => {
          return {
            _id: `sqlite-${id}`,
            lesson_id: `sqlite-${LessonId}`,
            source,
            target,
            pronunciation,
            level,
            last_attempt: new Date(lastAttempt).getTime(),
            created_at: new Date(createdAt).getTime(),
            updated_at: new Date(updatedAt).getTime()
          };
        }
      );

      return Words.bulkDocs(words)
        .then(() => {
          console.log("words imported");
        })
        .catch(error => {
          console.log("error while importing words", error);
        });
    },
    importLessons(path) {
      const lessons = JSON.parse(
        fs.readFileSync(`${path}/lessons.json`).toString()
      ).map(({ id, name, completed, createdAt, updatedAt }) => {
        return {
          _id: `sqlite-${id}`,
          name,
          completed: !!completed,
          created_at: new Date(createdAt).getTime(),
          updated_at: new Date(updatedAt).getTime()
        };
      });
      return Lessons.bulkDocs(lessons)
        .then(() => {
          console.log("lessons imported");
        })
        .catch(error => {
          console.log("error while importing lessons", error);
        });
    },
    exportData() {}
  }
};
</script>
