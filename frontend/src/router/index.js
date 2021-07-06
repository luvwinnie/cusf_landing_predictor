import Vue from "vue";
import VueRouter from "vue-router";
import Predictor from "../views/Predictor.vue";

Vue.use(VueRouter);

const routes = [
    { path: "/", name: "Predictor", component: Predictor },
    {
        path: "/predictor",
        name: "Predictor",
        component: Predictor,
    },
    {
        path: "/hourly",
        name: "Hourly",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
