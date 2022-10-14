import { convertDMS, distHaversine, getDistanceFromLatLonInKm, parsePrediction, zeroPad } from "@/common/utils";
import axios from "axios";
import moment from "moment-timezone/moment-timezone";
var currentDate = new Date();
var timezone = "Asia/Tokyo";
var currentDateJst = moment(currentDate).tz(timezone);

const state = {
    api: process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict_hourly",
    mousePos: { lat: 0, lng: 0 },
    markerPos: [37.850000, 141.057023],
    landing_distance: null,
    launch_distance: null,
    prediction: [],
    landing_line: [],
    showPaths: [],
    used_model: null,
    selectedPrediction: null,
    datasets: ["latest", "timestamp"],
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
        if (state.selectedPrediction !== null) {
            // getDistanceFromLatLonInKm()
            // state.prediction.landing_latlng

            let lauch_distance = distHaversine(state.selectedPrediction.launch_latlng, mousePos);
            let landing_distance = distHaversine(state.selectedPrediction.landing_latlng, mousePos);
            // console.log("distance:", lauch_distance, landing_distance);
            commit("updateCursorDistance", { launch_dis: lauch_distance, landing_dis: landing_distance });

        }

    },
    async selectPosition({ state, commit, rootState }, e) {
        rootState.predictors.form_inputs.lat = e.lat;
        rootState.predictors.form_inputs.lng = e.lng;
        rootState.predictors.center = [e.lat, e.lng];
        var newMarkerPos = [e.lat, e.lng];
        // this.dispatch("updateMarkerPos", newMarkerPos);
        commit("updateMarkerPos", newMarkerPos);
    },
    async updateMarkerPos({ state, commit, rootState }, e) {
        // console.log("current marker pos:", state.markerPos);
        console.log(e);
        console.log("updateMarkerPos:", state, rootState);
        var newMarkerPos = [e.lat, e.lng];
        rootState.predictors.form_inputs.lat = newMarkerPos[0];
        rootState.predictors.form_inputs.lng = newMarkerPos[1];

        rootState.predictors.center = [newMarkerPos[0], newMarkerPos[1]];
        commit("updateMarkerPos", newMarkerPos);
    },
    async clickUpdateMarkerPos({ state, commit, rootState }, e) {
        var newMarkerPos = [e.latlng["lat"], e.latlng["lng"]];
        commit("updateMarkerPos", newMarkerPos);

    },
    async updateLat({ state, commit, rootState }, e) {
        console.log(e);
        // state.markerPos[0] = e;
        var newMarkerPos = [e, state.markerPos[1]];
        rootState.predictors.form_inputs.lat = e;
        commit("updateMarkerPos", newMarkerPos);
    },
    async updateLng({ state, commit, rootState }, e) {
        console.log(e);
        var newMarkerPos = [state.markerPos[0], e];
        rootState.predictors.form_inputs.lng = e;
        commit("updateMarkerPos", newMarkerPos);
    },
    async clearPrediction({ state, commit, rootState }, e) {
        var prediction_arr = [];
        var prediction_hourly_line = [];
        var showPaths = [];
        var used_model = null;
        commit("updatePrediction", prediction_arr);
        commit("updatePredictionLine", prediction_hourly_line);
        commit("updateShowPath", showPaths);
        commit("updateUsedModel", used_model);
    },
    async predictHourly({ commit, rootState }) {
        this.dispatch("setLoading", true, { root: true });
        // var getTime = moment.tz(
        //     `${state.form_inputs.selectYear}-${state.form_inputs.selectMonth}-${state.form_inputs.selectDay} ${state.form_inputs.selectHours}:${state.form_inputs.selectMinutes}`,
        //     "Asia/Tokyo"
        // );
        // if (rootState.predictors.form_inputs.selectHours < 9) {
        //     var hour = 7 - rootState.predictors.form_inputs.selectHours;
        // }
        // else {
        var hour = rootState.predictors.form_inputs.selectHours;
        // }
        var dateStr = `${rootState.predictors.form_inputs.selectYear}-${zeroPad(rootState.predictors.form_inputs.selectMonth, 2)}-${zeroPad(rootState.predictors.form_inputs.selectDay, 2)}T${zeroPad(hour, 2)}:${zeroPad(rootState.predictors.form_inputs.selectMinutes, 2)}:00`;
        console.log("dateStr:", dateStr);
        var currentDate = new Date(dateStr + 'Z');
        currentDate.setHours(currentDate.getHours() - 9);
        console.log("japan time:", currentDate);
        var getTime = moment(
            currentDate
            // `${rootState.predictors.form_inputs.selectYear}-${rootState.predictors.form_inputs.selectMonth}-${rootState.predictors.form_inputs.selectDay} ${rootState.predictors.form_inputs.selectHours}:${rootState.predictors.form_inputs.selectMinutes}+09:00`, // +09:00 to make the time as Asia/Tokyo time
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
                let usedModelDate = new Date(`${used_model.substring(0, 4)}-${used_model.substring(4, 6)}-${used_model.substring(6, 8)}T${used_model.substring(8, 10)}:00:00Z`);
                // currentDate.setHours(currentDate.getHours() - 9);
                let usedModelJST = moment(usedModelDate).format("yyyy/MM/DD HH:00");
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
                    flight_time: result.flight_time / 3600, //seconds to hours 
                    landing_time: result.landing.datetime.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
                    landing_location: convertDMS(result.landing.latlng.lat, result.landing.latlng.lng),
                    landing_location_dd: `${result.landing.latlng.lat.toFixed(4)}, ${result.landing.latlng.lng.toFixed(4)}`,
                    range: getDistanceFromLatLonInKm(result.launch.latlng.lat, result.launch.latlng.lng, result.landing.latlng.lat, result.landing.latlng.lng).toFixed(2),
                    used_model: used_model,
                    used_model_jst: usedModelJST,
                    google_link: `https://www.google.com/maps?q=loc:${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)}`,
                    // google_link: `https://www.google.com/maps/@${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)},15z`,
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
    updateMousePos: (state, mousePos) => (state.mousePos = mousePos),
    updateMarkerPos: (state, markerPos) => {
        state.markerPos = markerPos;
    },
    updateCursorDistance: (state, obj) => {
        state.launch_distance = obj.launch_dis;
        state.landing_distance = obj.landing_dis;
    },
    updatePrediction: (state, prediction_arr) =>
        (state.prediction = prediction_arr),
    updateSelectPrediction: (state, index) => (state.selectedPrediction = state.prediction[index]),
    updatePredictionLine: (state, prediction_hourly_line) =>
        (state.landing_line = prediction_hourly_line),
    updateShowPath: (state, showPaths) => (state.showPaths = showPaths),
    updateUsedModel: (state, used_model) => (state.used_model = used_model)
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
