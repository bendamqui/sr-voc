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
  loadAnnotations({ commit }) {
    return Annotation.findAll({ raw: true }).then(annotations =>
      commit("setAnnotations", annotations)
    );
  },
  fetchAnnotation({ commit }, id) {
    return Annotation.findByPk(id, { raw: true }).then(annotation =>
      commit("setAnnotation", annotation)
    );
  },
  deleteAnnotation({ dispatch }, id) {
    return Annotation.findByPk(id).then(model => {
      model.destroy();
      return dispatch("loadAnnotations");
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
    state.annotations = annotations || [];
  },
  setAnnotation(state, annotation) {
    state.annotation = annotation;
  },
  clear(state) {
    console.log("clear");
    state.annotation = {};
    state.annotations = [];
  }
};

export default { namespaced: true, state, getters, actions, mutations };
