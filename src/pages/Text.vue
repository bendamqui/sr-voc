<template>
  <div>
    <b-modal class="mh-100" size="lg" id="hayyim-modal" title="Hayyim">
      <template #modal-footer>
        <b-button variant="primary" @click="showAddToLessonModal">
          Add to lesson
        </b-button>
        <b-button variant="info" @click="showAnnotateModal">
          Annotate
        </b-button>
      </template>
      <div class="row" v-if="hayyimWords.length !== 0">
        <div
          v-for="word in hayyimWords"
          :key="word.id"
          v-html="word.html"
        ></div>
      </div>
      <div v-else>No results for {{ selection }}</div>
    </b-modal>
    <b-modal
      class="mh-100"
      size="lg"
      id="show-annotation-modal"
      :title="annotation.selector"
      cancel-title="Delete"
      cancel-variant="danger"
      @cancel="handleDeleteAnnotation"
    >
      <div v-html="annotation.content"></div>
    </b-modal>
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
        <b-button variant="primary" @click="showAddToLessonModal">
          Add to lesson
        </b-button>
        <b-button
          variant="info"
          @click="
            $bvModal.hide('wiktionary-modal');
            $bvModal.show('annotation-modal');
          "
        >
          Annotate
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
      <div
        id="selectable"
        ref="selectable"
        v-html="text(id).content"
        class="col-md-12 font-size-lg"
      ></div>
    </div>
  </div>
</template>

<script>
import { annotateNode } from "@/utils/annotations";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Multiselect from "vue-multiselect";
import Vue from "vue";
import Annotation from "@/components/Annotation";
import contextMenu from "electron-context-menu";

export default {
  components: { Multiselect },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  async mounted() {
    await this.loadAnnotations();
    this.parseDom();
  },
  destroyed() {
    // The return value of `contextMenu()` is a function that disposes of the created event listeners
    this.contextMenu();
  },
  created() {
    this.loadLessons();
    this.contextMenu = contextMenu({
      showLookUpSelection: false,
      showSearchWithGoogle: false,
      prepend: (defaultActions, { selectionText }) => [
        {
          label: "Search Hayyim Dictionary",
          visible: selectionText.trim().length > 0,
          click: () => this.handleSearchHayyim(selectionText)
        },
        {
          label: "Search Wiktionary",
          visible: selectionText.trim().length > 0,
          click: () => {
            this.selection = selectionText.trim();
            this.$bvModal.show("wiktionary-modal");
          }
        }
      ]
    });
  },
  data: () => ({
    annotationPayload: {
      content: ""
    },
    selection: "",
    range: "",
    contextMenu: null,
    payload: { source: "", target: "", pronunciation: "", lesson: {} }
  }),
  computed: {
    ...mapGetters("hayyimDictionary", { hayyimWords: "words" }),
    ...mapGetters("texts", ["text"]),
    ...mapGetters("lessons", ["lessonOptions"]),
    ...mapGetters("annotations", ["annotations", "annotation"]),

    searchUrl() {
      return `https://en.wiktionary.org/wiki/${this.selection}#Persian`;
    }
  },
  methods: {
    ...mapActions("hayyimDictionary", { searchHayyim: "search" }),
    ...mapActions("texts", ["updateText"]),
    ...mapActions("lessons", ["loadLessons"]),
    ...mapActions("words", ["createWord"]),
    ...mapMutations("annotations", ["clear"]),
    ...mapActions("annotations", [
      "loadAnnotations",
      "createAnnotation",
      "fetchAnnotation",
      "deleteAnnotation"
    ]),
    clearOrphanAnnotations() {
      const nodes = document.getElementsByClassName("annotation");
      const selectors = this.annotations.map(annotation => annotation.selector);
      Array.from(nodes).forEach(node => {
        if (!selectors.includes(node.dataset.selector)) {
          const text = document.createTextNode(node.innerText);
          node.replaceWith(text);
        }
      });
    },
    handleDeleteAnnotation() {
      this.deleteAnnotation(this.annotation.id).then(this.parseDom);
    },
    showAnnotation(evt, annotation) {
      this.$bvModal.show("show-annotation-modal");
      this.fetchAnnotation(annotation.id);
    },
    spanToAnnotationComponent(annotation) {
      const instance = this.getAnnotationInstance({
        id: annotation.dataset.id,
        selector: annotation.dataset.selector,
        content: annotation.innerHTML
      });
      annotation.parentNode.replaceChild(instance.$el, annotation);
    },
    getAnnotationInstance(propsData) {
      const component = Vue.extend(Annotation);
      const instance = new component({
        propsData
      });
      instance.$ref = propsData.selector;
      instance.$mount();
      instance.$on("click", this.showAnnotation);
      return instance;
    },
    parseDom() {
      this.clearOrphanAnnotations();
      annotateNode(this.annotations, "selectable");
      Array.from(document.getElementsByClassName("annotation")).forEach(
        this.spanToAnnotationComponent
      );
    },
    async handleSearchHayyim(selectionText) {
      this.selection = selectionText.trim();
      await this.searchHayyim(this.selection);
      this.$bvModal.show("hayyim-modal");
    },
    handleSaveAnnotation() {
      if (this.selection.length === 0) {
        return;
      }
      this.createAnnotation({
        TextId: this.id,
        selector: this.selection,
        content: this.annotationPayload.content
      })
        .then(this.loadAnnotations)
        .then(this.parseDom)
        .catch(e => console.log(e));
      this.$bvModal.hide("annotation-modal");
    },
    showAnnotateModal() {
      this.$bvModal.hide("hayyim-modal");
      this.$bvModal.show("annotation-modal");
    },
    showAddToLessonModal() {
      this.payload = {
        ...this.payload,
        source: "",
        pronunciation: "",
        target: this.selection
      };
      this.$bvModal.hide("wiktionary-modal");
      this.$bvModal.hide("hayyim-modal");
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
