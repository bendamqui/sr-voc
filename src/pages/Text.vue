<template>
  <div>
    <b-modal class="mh-100" size="lg" id="wiktionary-modal" title="Wiktionary">
      <template #modal-footer>
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button variant="info" @click="showAddToLessonModal">
          Add to lesson
        </b-button>
        <!-- Button with custom close trigger value -->
      </template>
      <div class="row">
        <iframe
          class="col-md-12"
          v-if="search !== ''"
          :src="searchUrl"
        ></iframe>
      </div>
    </b-modal>
    <b-modal
      @ok="handleSubmit"
      size="sm"
      id="add-to-lesson-modal"
      title="Add to lesson"
    >
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Source">
              <b-form-input type="text" v-model="payload.source"></b-form-input>
            </b-form-group>
            <b-form-group label="Target">
              <b-form-input type="text" v-model="payload.target"></b-form-input>
            </b-form-group>
            <b-form-group label="Pronunciation">
              <b-form-input
                type="text"
                v-model="payload.pronunciation"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Lesson">
              <Multiselect
                v-model="payload.lesson"
                :options="lessonOptions"
                label="name"
                track-by="id"
              ></Multiselect>
            </b-form-group>
          </div>
        </div>
      </form>
    </b-modal>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">{{ text(id).title }}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button
          @click="$router.push('texts')"
          variant="success"
          class="float-right"
          ><b-icon-back
        /></b-button>
      </div>
    </div>
    <div class="row">
      <div
        @mouseup="translate"
        id="selectable"
        v-html="text(id).content"
        class="col-md-12 font-size-lg"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
export default {
  components: { Multiselect },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  created() {
    this.loadLessons();
  },
  data: () => ({
    search: "",
    payload: { source: "", target: "", pronunciation: "", lesson: {} }
  }),
  computed: {
    ...mapGetters("texts", ["text"]),
    ...mapGetters("lessons", ["lessonOptions"]),
    searchUrl() {
      return `https://en.wiktionary.org/wiki/${this.search}#Persian`;
    }
  },
  methods: {
    ...mapActions("lessons", ["loadLessons"]),
    ...mapActions("words", ["createWord"]),
    translate() {
      this.search = document.getSelection().toString();
      if (this.search !== "") {
        this.$bvModal.show("wiktionary-modal");
      }
    },
    showAddToLessonModal() {
      this.payload.target = this.search;
      this.$bvModal.hide("wiktionary-modal");
      this.$bvModal.show("add-to-lesson-modal");
    },
    handleSubmit() {
      const {
        source,
        target,
        pronunciation,
        lesson: { id }
      } = this.payload;
      this.createWord({ source, target, pronunciation, LessonId: id }).then(
        () => {
          this.$bvModal.hide("add-to-lesson-modal");
        }
      );
    }
  }
};
</script>

<style>
.font-size-lg {
  font-size: 1.5rem;
}
</style>
