import { convertDMS, getDistanceFromLatLonInKm, parsePrediction } from "@/common/utils";
import axios from "axios";
import moment from "moment-timezone/moment-timezone";

const state = {
    api: process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict_hourly",
    markerPos: [37.4263, 138.8195],
    prediction: [],
    landing_line: [],
    showPaths: [],
    used_model: null,
    selectedPrediction:null,
    datasets:["latest","timestamp"],
    // form_inputs: {
    //     items: ["Kofu", "Chuchill"],
    //     selectDataset:"latest",
    //     months: [
    //         { key: "Jan", value: 1 },
    //         { key: "Feb", value: 2 },
    //         { key: "Mar", value: 3 },
    //         { key: "Apr", value: 4 },
    //         { key: "May", value: 5 },
    //         { key: "Jun", value: 6 },
    //         { key: "Jul", value: 7 },
    //         { key: "Aug", value: 8 },
    //         { key: "Sep", value: 9 },
    //         { key: "Oct", value: 10 },
    //         { key: "Nov", value: 11 },
    //         { key: "Dec", value: 12 },
    //     ],
    //     selectDay: "27",
    //     selectMonth: 11,
    //     selectYear: "2021",
    //     selectHours: "10",
    //     selectMinutes: "00",
    //     numberOfHours: 24,
    //     launchsite: "Kofu",
    //     lat: 37.4263,
    //     lng: 138.8195,
    //     launchAttitude: 300,
    //     burstAttitude: 30600,
    //     ascentRate: 6.3,
    //     descentRate: 4.13,
    // },
};

const actions = {
    async updateMarkerPos({ state,commit,rootState }, e) {
        // console.log("current marker pos:", state.markerPos);
        console.log(e);
        console.log("updateMarkerPos:", state, rootState);
        var newMarkerPos = [e.lat, e.lng];
        rootState.predictors.form_inputs.lat = newMarkerPos[0];
        rootState.predictors.form_inputs.lng = newMarkerPos[1];
        commit("updateMarkerPos", newMarkerPos);
    },
    async clickUpdateMarkerPos({ commit }, e) {
        var newMarkerPos = [e.latlng["lat"], e.latlng["lng"]];
        commit("updateMarkerPos", newMarkerPos);

    },
    async updateLat({ state,commit,rootState }, e) {
        console.log(e);
        // state.markerPos[0] = e;
        var newMarkerPos = [e, state.markerPos[1]];
        rootState.predictors.form_inputs.lat = e;
        commit("updateMarkerPos", newMarkerPos);
    },
    async updateLng({ state, commit, rootState }, e) {
        console.log(e);
        var newMarkerPos = [state.markerPos[0],e];
        rootState.predictors.form_inputs.lng = e;
        commit("updateMarkerPos", newMarkerPos);
    },
    async predictHourly({ commit,rootState }) {
        this.dispatch("setLoading", true, { root: true });
        // var getTime = moment.tz(
        //     `${state.form_inputs.selectYear}-${state.form_inputs.selectMonth}-${state.form_inputs.selectDay} ${state.form_inputs.selectHours}:${state.form_inputs.selectMinutes}`,
        //     "Asia/Tokyo"
        // );
        var getTime = moment(
            `${rootState.predictors.form_inputs.selectYear}-${rootState.predictors.form_inputs.selectMonth}-${rootState.predictors.form_inputs.selectDay} ${rootState.predictors.form_inputs.selectHours}:${rootState.predictors.form_inputs.selectMinutes}+09:00`, // +09:00 to make the time as Asia/Tokyo time
        );
        
        var numberOfHours = rootState.predictors.form_inputs.numberOfHours;
        var launch_time = getTime.utc();
        // state.lat = e.latlng["lat"];
        // state.lng = e.latlng["lng"];
        if (state.markerPos[1] < 0.0) {
            state.markerPos[1] += 360.0;
        }

        rootState.predictors.form_inputs.lat = state.markerPos[0];
        rootState.predictors.form_inputs.lng = state.markerPos[1];
        console.log("state inputs:", state.markerPos);
        var params = {
            profile: "standard_profile",
            dataset: rootState.predictors.form_inputs.selectDataset,
            launch_datetime: launch_time.format(),
            number_of_hours: numberOfHours,
            launch_latitude: rootState.predictors.form_inputs.lat,
            launch_longitude: rootState.predictors.form_inputs.lng,
            launch_altitude: rootState.predictors.form_inputs.launchAttitude,
            ascent_rate: rootState.predictors.form_inputs.ascentRate,
            burst_altitude: rootState.predictors.form_inputs.burstAttitude,
            descent_rate: rootState.predictors.form_inputs.descentRate,
        };
        console.log(params);

        await axios.get(state.api, { params: params }).then((response) => {
            // console.log(response.data);
            var prediction_arr = [];
            var prediction_hourly_line = [];
            var showPaths = [];
            var used_model = null;
            response.data.forEach((element) => {
                var result = parsePrediction(element.prediction);
                console.log("element.prediction:", element)
                used_model = element.used_model;
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
                    launch_time: result.launch.datetime.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
                    flight_time: result.flight_time/3600, //seconds to hours 
                    landing_time: result.landing.datetime.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
                    landing_location: convertDMS(result.landing.latlng.lat,result.landing.latlng.lng),
                    landing_location_dd: `${result.landing.latlng.lat.toFixed(4)}, ${result.landing.latlng.lng.toFixed(4)}`,
                    range: getDistanceFromLatLonInKm(result.launch.latlng.lat, result.launch.latlng.lng, result.landing.latlng.lat, result.landing.latlng.lng).toFixed(2),
                    used_model:used_model
                };
                console.log(prediction);
                prediction_arr.push(prediction);
                prediction_hourly_line.push([
                    result.landing.latlng.lat,
                    result.landing.latlng.lng,
                ]);
                console.log("hourly:", prediction_hourly_line);
                showPaths.push(true);
                // commit("updatePrediction", prediction);
            });

            console.log(this.$store);
            console.log("local:", prediction_hourly_line);
            commit("updatePrediction", prediction_arr);
            commit("updatePredictionLine", prediction_hourly_line);
            commit("updateShowPath", showPaths);
            commit("updateUsedModel", used_model);
            this.dispatch("setLoading", false, { root: false });
        });
    },
    // async showFlightPath({ commit }, index) {
    //     console.log("action:", index);
    //     var tmp = state.showPaths;
    //     tmp[index] = !tmp[index];
    //     commit("updateShowPath", tmp);
    // },
    

};

const mutations = {
    updateMarkerPos: (state, markerPos) => {
        state.markerPos = markerPos;
    },
    updatePrediction: (state, prediction_arr) =>
        (state.prediction = prediction_arr),
    updateSelectPrediction: (state, index) => (state.selectedPrediction = state.prediction[index]),
    updatePredictionLine: (state, prediction_hourly_line) =>
        (state.landing_line = prediction_hourly_line),
    updateShowPath:(state,showPaths) => (state.showPaths = showPaths),
    updateUsedModel:(state,used_model) => (state.used_model = used_model)
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};