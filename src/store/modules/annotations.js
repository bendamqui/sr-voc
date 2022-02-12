import { Annotation } from "@/sqlite";

const state = () => ({
  annotations: [],
  annotation: {}
});

const getters = {
  annotations(state) {
    return state.annotations;
  },
  annotation(state) {
    return state.annotation;
  }
};

const actions = {
  // @todo use relationship from Text
  loadTextAnnotations({ commit }, TextId) {
    return Annotation.findAll({
      where: { TextId },
      raw: true
    }).then(annotations => commit("setAnnotations", annotations));
  },
  fetchAnnotation({ commit }, id) {
    return Annotation.findByPk(id, { raw: true }).then(annotation =>
      commit("setAnnotation", annotation)
    );
  },
  deleteAnnotation({ dispatch }, id) {
    return Annotation.findByPk(id).then(model => {
      model.destroy();
      dispatch("loadTextAnnotations", model.TextId);
    });
  },

  createAnnotation({ dispatch }, payload) {
    return Annotation.create(payload).then(model => {
      dispatch("loadTextAnnotations", payload.TextId);
      return model;
    });
  }
};

const mutations = {
  setAnnotations(state, annotations) {
    state.annotations = annotations;
  },
  setAnnotation(state, annotation) {
    state.annotation = annotation;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
