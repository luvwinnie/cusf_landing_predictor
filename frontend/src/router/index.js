import { convertDMS, getDistanceFromLatLonInKm, parsePrediction } from "@/common/utils";
import axios from "axios";
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
    console.log(to, from, next);
    if (to.path == '/predictor') {
        if (to.query) {
            // console.log(process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict?" + to.fullPath.replace("/predictor?", ""));
            store.commit("predictors/setStates", to.query);

            axios.get(process.env.VUE_APP_TAWHIRI_API_URL + "/predictor/predict?" + to.fullPath.replace("/predictor?", "")).then((response) => {
                //     console.log(response.data);
                var result = parsePrediction(response.data.prediction);
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
                    used_model: response.data.used_model
                };
                // this.isLoading = false;
                store.commit("predictors/updatePrediction", prediction);
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
