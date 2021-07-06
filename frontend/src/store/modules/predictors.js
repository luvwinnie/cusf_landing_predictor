import axios from "axios";
import moment from "moment-timezone/moment-timezone";
import { parsePrediction } from "@/common/utils";

const state = {
    api: process.env.VUE_APP_TAWHIRI_API_URL_2,
    mousePos: { lat: 0, lng: 0 },
    prediction: null,
    form_inputs: {
        items: ["Kofu", "Chuchill"],
        months: [
            { key: "Jan", value: 1 },
            { key: "Feb", value: 2 },
            { key: "Mar", value: 3 },
            { key: "Apr", value: 4 },
            { key: "May", value: 5 },
            { key: "Jun", value: 6 },
            { key: "Jul", value: 7 },
            { key: "Aug", value: 8 },
            { key: "Sep", value: 9 },
            { key: "Oct", value: 10 },
            { key: "Nov", value: 11 },
            { key: "Dec", value: 12 },
        ],
        selectDay: "16",
        selectMonth: 6,
        selectYear: "2021",
        selectHours: "10",
        selectMinutes: "10",
        launchsite: "Kofu",
        lat: 52.2135,
        lng: 0.0964,
        launchAttitude: 0,
        burstAttitude: 30000,
        ascentRate: 5,
        descentRate: 5,
    },
};

// const getters = {
// currentMousePos: (state) => state.mousePos,
// };

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
    async clickPos({ state, commit }, e) {
        // console.log(rootState);
        // rootState.isLoading = true;
        this.dispatch("setLoading", true, { root: true });
        var getTime = moment.tz(
            `${state.form_inputs.selectYear}-${state.form_inputs.selectMonth}-${state.form_inputs.selectDay} ${state.form_inputs.selectHours}:${state.form_inputs.selectMinutes}`,
            "Asia/Tokyo"
        );
        var launch_time = getTime.utc();
        state.lat = e.latlng["lat"];
        state.lng = e.latlng["lng"];
        if (state.lng < 0.0) {
            state.lng += 360.0;
        }
        state.form_inputs.lat = state.lat;
        state.form_inputs.lng = state.lng;
        var params = {
            profile: "standard_profile",
            launch_datetime: launch_time.format(),
            launch_latitude: state.lat.toFixed(4),
            launch_longitude: state.lng.toFixed(4),
            launch_altitude: state.form_inputs.launchAttitude,
            ascent_rate: state.form_inputs.ascentRate,
            burst_altitude: state.form_inputs.burstAttitude,
            descent_rate: state.form_inputs.descentRate,
        };
        await axios.get(state.api, { params: params }).then((response) => {
            console.log(response.data);
            var result = parsePrediction(response.data.prediction);
            console.log(result);
            var prediction = {
                launch_latlng: {
                    lat: result.launch.latlng.lat.toFixed(4),
                    lng: result.launch.latlng.lng.toFixed(4),
                },
                flight_path: result.flight_path,
                color: "black",
                burst_latlng: {
                    lat: result.burst.latlng.lat.toFixed(4),
                    lng: result.burst.latlng.lng.toFixed(4),
                },
                landing_latlng: {
                    lat: result.landing.latlng.lat.toFixed(4),
                    lng: result.landing.latlng.lng.toFixed(4),
                },
            };
            // this.isLoading = false;
            console.log(this.$store);
            commit("updatePrediction", prediction);
            this.dispatch("setLoading", false, { root: false });
        });
    },
    async clearPrediction({ commit }) {
        commit("updatePrediction", null);
    },
};

const mutations = {
    updateMousePos: (state, mousePos) => (state.mousePos = mousePos),
    updatePrediction: (state, prediction) => (state.prediction = prediction),
};
export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations,
};
