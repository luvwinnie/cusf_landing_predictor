import { convertDMS, getDistanceFromLatLonInKm, parsePrediction } from "@/common/utils";
import axios from "axios";
import moment from "moment-timezone/moment-timezone";
// import state from "./form_states";


const state = {
    api: process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict",
    mousePos: { lat: 0, lng: 0 },
    prediction: null,
    distance: null,
    used_model: null,
    datasets:["latest","timestamp"],
    form_inputs: {
        items: ["Kofu", "Chuchill"],
        selectDataset:"latest",
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
        selectDay: "27",
        selectMonth: 11,
        selectYear: "2021",
        selectHours: "10",
        selectMinutes: "00",
        numberOfHours: 24,
        launchsite: "Kofu",
        lat: 37.4263,
        lng: 138.8195,
        launchAttitude: 0,
        burstAttitude: 30600,
        ascentRate: 6.3,
        descentRate: 4.13,
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
        if (state.prediction !== null) {
            getDistanceFromLatLonInKm()
        }
    },
    async clickPos({ state, commit }, e) {
        // console.log(rootState);
        // rootState.isLoading = true;
        this.dispatch("setLoading", true, { root: true });
        // var getTime = moment.tz(
        //     `${state.form_inputs.selectYear}-${state.form_inputs.selectMonth}-${state.form_inputs.selectDay} ${state.form_inputs.selectHours}:${state.form_inputs.selectMinutes}`,
        //     "Asia/Tokyo"
        // );
        var getTime = moment(
            `${state.form_inputs.selectYear}-${state.form_inputs.selectMonth}-${state.form_inputs.selectDay} ${state.form_inputs.selectHours}:${state.form_inputs.selectMinutes}+09:00`, // +09:00 to make the time as Asia/Tokyo time
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
            // var used_model = "";
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
                flight_time: result.flight_time / 3600, //seconds to hours 
                landing_location: convertDMS(result.landing.latlng.lat,result.landing.latlng.lng),
                landing_location_dd: `${result.landing.latlng.lat.toFixed(4)}, ${result.landing.latlng.lng.toFixed(4)}`,
                range: getDistanceFromLatLonInKm(result.launch.latlng.lat, result.launch.latlng.lng, result.landing.latlng.lat, result.landing.latlng.lng).toFixed(2),
                used_model:response.data.used_model
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
    async updateLat({ state,rootState }, e) {
        console.log(e,rootState.hourly);
        // state.markerPos[0] = e;
        var newMarkerPos = [e, rootState.hourly.markerPos[1]];
        state.form_inputs.lat = e;
        rootState.hourly.commit("updateMarkerPos", newMarkerPos);
    },
    async updateLng({ state,  rootState }, e) {
        console.log(e);
        var newMarkerPos = [rootState.hourly.markerPos[0],e];
        state.form_inputs.lng = e;
        rootState.hourly.commit("updateMarkerPos", newMarkerPos);
        
    },
};

const mutations = {
    updateMousePos: (state, mousePos) => (state.mousePos = mousePos),
    updatePrediction: (state, prediction) => (state.prediction = prediction),
    updateUsedModel:(state,used_model) => (state.used_model = used_model)
};
export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations,
};
