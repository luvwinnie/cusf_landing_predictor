// import axios from "axios";

const state = {
    mousePos: { lat: 0, lng: 0 },
};

const getters = {
    currentMousePos: (state) => state.mousePos,
};

const actions = {
    async updateMousePos({ commit }, e) {
        var mousePos = {
            lat: e.latlng["lat"].toFixed(4),
            lng: e.latlng["lng"],
        };
        if (mousePos["lng"] < 0.0) {
            mousePos["lng"] += 360.0;
        }
        mousePos["lng"] = mousePos["lng"].toFixed(4);
        commit("updateMousePos", mousePos);
    },
};

const mutations = {
    updateMousePos: (state, mousePos) => (state.mousePos = mousePos),
};
export default {
    state,
    getters,
    actions,
    mutations,
};
