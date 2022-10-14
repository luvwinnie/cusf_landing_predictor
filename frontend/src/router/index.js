import { convertDMS, getDistanceFromLatLonInKm, parsePrediction } from "@/common/utils";
import axios from "axios";
import moment from "moment-timezone/moment-timezone";
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Predictor from "../views/Predictor.vue";
Vue.use(VueRouter);

const routes = [
    {
        path: "/", name: "Predictor", component: Predictor,
        meta: {
            title: "Predictor"
        },

        // beforeEnter: (to, from, next) => {
        //     // do something with to.query and then save it in store
        //     next(Object.assign({}, to, { query: {} }))
        // }
    },
    {
        path: "/predictor",
        name: "Predictor",
        component: Predictor,
        meta: {
            title: "Predictor"
        }
    },
    {
        path: "/hourly",
        name: "Hourly",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/Hourly.vue"),
        meta: {
            title: "Hourly Predictor"
        }
    },

];

const router = new VueRouter({
    mode: 'history',
    routes,
});
router.beforeEach((to, from, next) => {
    axios.get(process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/dataset-list").then((response) => {
        // console.log("response:", response.data.dataset[0]);
        let latest_model = response.data.dataset[0];
        let usedModelDate = new Date(`${latest_model.substring(0, 4)}-${latest_model.substring(4, 6)}-${latest_model.substring(6, 8)}T${latest_model.substring(8, 10)}:00:00Z`);
        let usedModelJST = moment(usedModelDate).format("yyyy/MM/DD HH:00");

        store.commit("predictors/updateLatestModel", `${response.data.dataset[0]} (JST:${usedModelJST})`);
    })
    if (to.path == '/predictor') {
        if (to.query) {
            // console.log(process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict?" + to.fullPath.replace("/predictor?", ""));
            store.commit("predictors/setStates", to.query);
            axios.get(process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict?" + to.fullPath.replace("/predictor?", "")).then((response) => {
                //     console.log(response.data);
                var result = parsePrediction(response.data.prediction);
                var used_model = response.data.used_model;
                let usedModelDate = new Date(`${used_model.substring(0, 4)}-${used_model.substring(4, 6)}-${used_model.substring(6, 8)}T${used_model.substring(8, 10)}:00:00Z`);
                // currentDate.setHours(currentDate.getHours() - 9);
                let usedModelJST = moment(usedModelDate).format("yyyy/MM/DD HH:00");
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
                    // used_model: response.data.used_model,
                    used_model: used_model,
                    used_model_jst: usedModelJST,
                    google_link: `https://www.google.com/maps?q=loc:${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)}`,
                    // google_link: `https://www.google.com/maps/@${result.landing.latlng.lat.toFixed(4)},${result.landing.latlng.lng.toFixed(4)},15z`,
                };
                // this.isLoading = false;
                store.commit("predictors/updatePrediction", prediction);
                let lauch_distance = distHaversine(state.prediction.launch_latlng, mousePos);
                let landing_distance = distHaversine(state.prediction.landing_latlng, mousePos);
                commit("updateCursorDistance", { launch_dis: lauch_distance, landing_dis: landing_distance });
            });
        }

        // console.log(store.dispath("predictors/runPrediction"));
    }
    else if (to.path == 'hourly') {
        console.log(to.path);
        console.log(store);
    }
    else {
        // router.replace()
    }
    // else {
    // Object.assign({}, to, { query: {} })
    // next
    // router.push("/")
    // next({
    //     // 
    //     path: '#',
    //     replace: true
    // })

    // }
    // console.log("router:", router.currentRoute.query);
    document.title = to.meta.title || 'Predictor';
    next();
});

export default router;
