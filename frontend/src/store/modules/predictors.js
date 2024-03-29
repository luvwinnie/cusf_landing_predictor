import { convertDMS, distHaversine, getDistanceFromLatLonInKm, parsePrediction, parseQueryParams, zeroPad } from "@/common/utils";
import router from '@/router';
import axios from "axios";
import moment from "moment-timezone/moment-timezone";
// import state from "./form_states";
var currentDate = new Date();
var timezone = "Asia/Tokyo";
var currentDateJst = moment(currentDate).tz(timezone);

const state = {
    api: process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict",
    latest_dataset: "",
    mousePos: { lat: 0, lng: 0 },
    prediction: null,
    distance: null,
    used_model: null,
    datasets: ["latest", "timestamp"],
    center: [37.850000, 141.057023],
    launch_distance: null,
    landing_distance: null,
    form_inputs: {
        items: [
            { key: "Point A", postition: { lat: 37.850000, lng: 141.057023 } },
            { key: "Point B", postition: { lat: 37.798937, lng: 140.766633 } },
            { key: "Point C", postition: { lat: 37.503035, lng: 140.020144 } },
            { key: "Point D", postition: { lat: 37.687305, lng: 139.430333 } },
            { key: "Point E", postition: { lat: 37.307931, lng: 139.641069 } },
            { key: "Point F", postition: { lat: 37.095971, lng: 138.258866 } },
            { key: "Point G", postition: { lat: 36.357852, lng: 139.380919 } },
            { key: "Point H", postition: { lat: 36.195191, lng: 138.437223 } },
        ],
        dataset: "latest",
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
        selectDay: currentDateJst.add(1, "days").format("D"),
        selectMonth: parseInt(currentDateJst.format("M")),
        selectYear: currentDateJst.format("YYYY"),
        selectHours: "10",
        selectMinutes: "00",
        numberOfHours: 24,
        launchsite: { key: "Point A", postition: { lat: 37.850000, lng: 141.057023 } },
        lat: 37.850000,
        lng: 141.057023,
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
            // state.prediction.landing_latlng

            let lauch_distance = distHaversine(state.prediction.launch_latlng, mousePos);
            let landing_distance = distHaversine(state.prediction.landing_latlng, mousePos);
            // console.log("distance:", lauch_distance, landing_distance);
            commit("updateCursorDistance", { launch_dis: lauch_distance, landing_dis: landing_distance });

        }

    },
    async selectPosition({ state, commit, rootState }, e) {
        state.form_inputs.lat = e.lat;
        state.form_inputs.lng = e.lng;
        state.center = [e.lat, e.lng];
        rootState.hourly.markerPos = [e.lat, e.lng];
    },

    async runPrediction({ state, commit }, e) {
        this.dispatch("setLoading", true, { root: true });
        var dateStr = `${state.form_inputs.selectYear}-${zeroPad(state.form_inputs.selectMonth, 2)}-${zeroPad(state.form_inputs.selectDay, 2)}T${zeroPad(state.form_inputs.selectHours, 2)}:${zeroPad(state.form_inputs.selectMinutes, 2)}:00`;
        console.log(dateStr);
        var currentDate = new Date(dateStr + 'Z');
        currentDate.setHours(currentDate.getHours() - 9);
        console.log("japan time:", currentDate);
        var getTime = moment(
            currentDate,// +09:00 to make the time as Asia/Tokyo time
        );


        var launch_time = getTime.utc();

        // if (state.lng < 0.0) {
        //     state.lng += 360.0;
        // }
        // state.form_inputs.lat = state.lat;
        // state.form_inputs.lng = state.lng;
        var params = {
            profile: "standard_profile",
            launch_datetime: launch_time.format(),
            launch_latitude: state.form_inputs.lat.toFixed(4),
            launch_longitude: state.form_inputs.lng.toFixed(4),
            launch_altitude: state.form_inputs.launchAttitude,
            ascent_rate: state.form_inputs.ascentRate,
            burst_altitude: state.form_inputs.burstAttitude,
            descent_rate: state.form_inputs.descentRate,
            dataset: state.form_inputs.dataset,
        };
        router.push({ path: 'predictor', query: params });

        console.log("params:", params);
        await axios.get(state.api, { params: params }).then((response) => {
            // console.log(response.data);
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
                landing_location: convertDMS(result.landing.latlng.lat, result.landing.latlng.lng),
                landing_location_dd: `${result.landing.latlng.lat.toFixed(4)}, ${result.landing.latlng.lng.toFixed(4)}`,
                range: getDistanceFromLatLonInKm(result.launch.latlng.lat, result.launch.latlng.lng, result.landing.latlng.lat, result.landing.latlng.lng).toFixed(2),
                used_model: response.data.used_model,
                google_link: `https://www.google.com/maps?q=loc:${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)}`,
                // google_link: `https://www.google.com/maps/@${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)},15z`,

            };
            // this.isLoading = false;
            console.log(this.$store);
            commit("updatePrediction", prediction);
            this.dispatch("setLoading", false, { root: false });
        });

    },
    async downloadPrediction({ state, commit }, format) {
        // this.dispatch("setLoading", true, { root: true });
        var dateStr = `${state.form_inputs.selectYear}-${zeroPad(state.form_inputs.selectMonth, 2)}-${zeroPad(state.form_inputs.selectDay, 2)}T${zeroPad(state.form_inputs.selectHours, 2)}:${zeroPad(state.form_inputs.selectMinutes, 2)}:00`;
        console.log(dateStr);
        var currentDate = new Date(dateStr + 'Z');
        currentDate.setHours(currentDate.getHours() - 9);
        console.log("japan time:", currentDate);
        var getTime = moment(
            currentDate,// +09:00 to make the time as Asia/Tokyo time
        );

        var launch_time = getTime.utc();
        var params = {
            profile: "standard_profile",
            launch_datetime: launch_time.format(),
            launch_latitude: state.form_inputs.lat.toFixed(4),
            launch_longitude: state.form_inputs.lng.toFixed(4),
            launch_altitude: state.form_inputs.launchAttitude,
            ascent_rate: state.form_inputs.ascentRate,
            burst_altitude: state.form_inputs.burstAttitude,
            descent_rate: state.form_inputs.descentRate,
            dataset: state.form_inputs.dataset,
            data_format: format
        };
        await axios.get(state.api, { params: params }).then((response) => {
            console.log(response);
            let blob = new Blob([response.data], { type: response.headers['content-type'] });
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = url;
            link.download = response.headers["content-disposition"].split("=")[1];
            link.click();
        });

    },


    async clickPos({ state, commit }, e) {
        state.lat = e.latlng["lat"];
        state.lng = e.latlng["lng"];
        state.center = [state.lat, state.lng];
        this.dispatch("setLoading", true, { root: true });


        var dateStr = `${state.form_inputs.selectYear}-${zeroPad(state.form_inputs.selectMonth, 2)}-${zeroPad(state.form_inputs.selectDay, 2)}T${zeroPad(state.form_inputs.selectHours, 2)}:${zeroPad(state.form_inputs.selectMinutes, 2)}:00`;
        console.log("dateStr:", dateStr);
        var currentDate = new Date(dateStr + 'Z');
        currentDate.setHours(currentDate.getHours() - 9);
        console.log("japan time:", currentDate);
        var getTime = moment(
            currentDate,// +09:00 to make the time as Asia/Tokyo time
        );

        var launch_time = getTime.utc();

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
            dataset: state.form_inputs.dataset,
        };
        router.push({ path: 'predictor', query: params });
        console.log("params:", params);
        await axios.get(state.api, { params: params }).then((response) => {
            console.log(response.data);
            var result = parsePrediction(response.data.prediction);
            var used_model = response.data.used_model;
            console.log
            let usedModelDate = new Date(`${used_model.substring(0, 4)}-${used_model.substring(4, 6)}-${used_model.substring(6, 8)}T${used_model.substring(8, 10)}:00:00Z`);
            // currentDate.setHours(currentDate.getHours() - 9);
            let usedModelJST = moment(usedModelDate).format("yyyy/MM/DD HH:00");
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
                landing_location: convertDMS(result.landing.latlng.lat, result.landing.latlng.lng),
                landing_location_dd: `${result.landing.latlng.lat.toFixed(4)}, ${result.landing.latlng.lng.toFixed(4)}`,
                range: getDistanceFromLatLonInKm(result.launch.latlng.lat, result.launch.latlng.lng, result.landing.latlng.lat, result.landing.latlng.lng).toFixed(2),
                used_model: used_model,
                used_model_jst: usedModelJST,
                google_link: `https://www.google.com/maps?q=loc:${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)}`,

                // google_link: `https://www.google.com/maps/@${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)},15z`,

            };
            // this.isLoading = false;
            console.log(this.$store);
            commit("updatePrediction", prediction);
            this.dispatch("setLoading", false, { root: false });
        });
    },
    async clearPrediction({ commit }) {
        // router.push({ path: 'predictor', })
        commit("updatePrediction", null);
    },
    async updateLat({ state, rootState }, e) {
        console.log(e, rootState.hourly);
        // state.markerPos[0] = e;
        var newMarkerPos = [parseFloat(e), rootState.hourly.markerPos[1]];
        state.form_inputs.lat = parseFloat(e);
        state.center = [parseFloat(e), state.form_inputs.lng];
        rootState.hourly.markerPos = newMarkerPos;

    },
    async updateLng({ state, rootState }, e) {
        console.log(e);
        var newMarkerPos = [rootState.hourly.markerPos[0], parseFloat(e)];
        state.form_inputs.lng = parseFloat(e);
        state.center = [state.form_inputs.lat, parseFloat(e)];
        rootState.hourly.markerPos = newMarkerPos;


    },
};

const mutations = {
    updateMousePos: (state, mousePos) => (state.mousePos = mousePos),
    updateCursorDistance: (state, obj) => {
        state.launch_distance = obj.launch_dis;
        state.landing_distance = obj.landing_dis;
    },
    updatePrediction: (state, prediction) => (state.prediction = prediction),
    updateUsedModel: (state, used_model) => (state.used_model = used_model),
    updateLatestModel: (state, latest_dataset) => (state.latest_dataset = latest_dataset),
    setStates: (state, obj) => {
        console.log(obj);
        console.log(state);
        var newparams = parseQueryParams(obj);

        // var currentDate = new Date(dateStr + 'Z');
        // var curTime = moment.utc(obj.launch_datetime).tz(timezone);
        // console.log(curTime);

        state.form_inputs.selectDay = newparams.selectDay;
        state.form_inputs.selectMonth = newparams.selectMonth;
        state.form_inputs.selectYear = newparams.selectYear;
        state.form_inputs.selectHours = newparams.selectHours;
        state.form_inputs.selectMinutes = newparams.selectMinutes;
        state.form_inputs.lat = newparams.lat;
        state.form_inputs.lng = newparams.lng;
        state.form_inputs.launchAttitude = newparams.launchAttitude;
        state.form_inputs.burstAttitude = newparams.burstAttitude;
        state.form_inputs.ascentRate = newparams.ascentRate;
        state.form_inputs.descentRate = newparams.descentRate;
        state.center = [newparams.lat, newparams.lng];
        // this.dispatch('predictors/runPrediction');
        // runPrediction();
        // this.dispatch("runPrediction", { state });
    }
};
export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations,
};
