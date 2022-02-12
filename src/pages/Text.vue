<template>
  <div>
    <b-modal
      class="mh-100"
      size="lg"
      id="annotation-modal"
      title="Annotate"
      @ok="handleSaveAnnotation"
    >
      <form @submit.prevent="handleSaveAnnotation">
        <b-form-group>
          <b-form-textarea
            rows="10"
            v-model="annotationPayload.content"
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal class="mh-100" size="lg" id="wiktionary-modal" title="Wiktionary">
      <template #modal-footer>
        <b-button variant="info" @click="showAddToLessonModal">
          Add to lesson
        </b-button>
      </template>
      <div class="row">
        <iframe
          class="col-md-12"
          v-if="selection !== ''"
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
      <AnnotationPopover
        @close="handleHideAnnotation"
        :id="annotationState.id"
        :show="annotationState.show"
      />

      <TextContextMenu
        v-if="contextMenu.show"
        :x="contextMenu.x"
        :y="contextMenu.y"
        @search-wiktionary="handleSearchOnWiktionary"
        @annotate="
          $bvModal.show('annotation-modal');
          contextMenu.show = false;
        "
        @cancel="contextMenu.show = false"
      />

      <div
        @mouseup="showContextMenu"
        id="selectable"
        ref="selectable"
        v-html="text(id).content"
        class="col-md-12 font-size-lg"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import TextContextMenu from "@/pages/TextContextMenu";
import Vue from "vue";
import AnnotationPopover from "@/components/AnnotationPopover";

const annotationState = Vue.observable({ show: false });

const showAnnotationHandler = evt => {
  annotationState.show = true;
  annotationState.id = evt.target.dataset.annotationId;
  annotationState.selector = evt.target.dataset.selector;
};

const setAnnotationListeners = () => {
  Array.from(document.getElementsByClassName("annotation")).forEach(
    annotation => {
      annotation.removeEventListener("click", showAnnotationHandler);
      annotation.addEventListener("click", showAnnotationHandler);
    }
  );
};

export default {
  components: { AnnotationPopover, TextContextMenu, Multiselect },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  mounted() {
    setAnnotationListeners();
  },
  created() {
    this.loadLessons();
    this.loadTextAnnotations(this.id);
  },
  data: () => ({
    annotationPayload: {
      content: ""
    },
    selection: "",
    range: "",
    contextMenu: {
      show: false,
      x: 0,
      y: 0
    },
    payload: { source: "", target: "", pronunciation: "", lesson: {} }
  }),
  computed: {
    ...mapGetters("texts", ["text"]),
    ...mapGetters("lessons", ["lessonOptions"]),
    ...mapGetters("annotations", ["annotations"]),
    annotationState() {
      return annotationState;
    },
    annotationShowState() {
      return annotationState.show;
    },
    searchUrl() {
      return `https://en.wiktionary.org/wiki/${this.selection}#Persian`;
    }
  },
  methods: {
    ...mapActions("texts", ["updateText"]),
    ...mapActions("lessons", ["loadLessons"]),
    ...mapActions("words", ["createWord"]),
    ...mapActions("annotations", ["loadTextAnnotations", "createAnnotation"]),
    handleHideAnnotation() {
      annotationState.show = false;
    },
    translate() {
      if (this.selection !== "") {
        this.$bvModal.show("wiktionary-modal");
      }
    },

    handleSearchOnWiktionary() {
      this.contextMenu.show = false;
      this.translate();
    },

    handleSaveAnnotation() {
      this.createAnnotation({
        TextId: this.id,
        selector: this.selection,
        content: this.annotationPayload.content
      })
        .then(({ id, selector }) => {
          const span = document.createElement("span");
          span.classList.add("annotation");
          span.setAttribute("ref", "a");
          span.dataset.annotationId = id;
          span.dataset.selector = selector;
          this.range.surroundContents(span);
          return this.$refs.selectable.innerHTML;
        })
        .then(content => {
          return this.updateText({ id: this.id, content });
        })
        .then(() => {
          setAnnotationListeners();
        });
      this.$bvModal.hide("annotation-modal");
    },

    showContextMenu(evt) {
      const selection = document.getSelection();
      this.selection = selection.toString();
      this.range = selection.getRangeAt(0);
      if (this.selection.toString() !== "") {
        this.contextMenu.show = true;
        this.contextMenu.x = evt.clientX - 225;
        this.contextMenu.y = evt.clientY - 50;
      }
    },

    showAddToLessonModal() {
      this.payload = {
        ...this.payload,
        source: "",
        pronunciation: "",
        target: this.selection
      };
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
.annotation {
  color: red;
}
.font-size-lg {
  font-size: 1.5rem;
}
</style>
