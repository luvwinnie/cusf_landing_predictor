import Vue from "vue";
import Vuex from "vuex";
import predictors from "./modules/predictors";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        // mousePos: { lat: 0, lng: 0 },
    },
    mutations: {},
    actions: {},
    modules: { predictors },
});
