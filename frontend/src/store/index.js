import Vue from "vue";
import Vuex from "vuex";
import hourly from "./modules/hourly";
import predictors from "./modules/predictors";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        // mousePos: { lat: 0, lng: 0 },
    },
    getters: {
        isLoading: (state) => state.isLoading,
    },
    mutations: {
        updateIsLoading: (state, isLoading) => (state.isLoading = isLoading),
    },
    actions: {
        async setLoading({ commit }, isLoading) {
            commit("updateIsLoading", isLoading);
        },
    },
    modules: { predictors, hourly },
});
