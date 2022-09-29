import Vue from "vue";
import VueRouter from "vue-router";
import Predictor from "../views/Predictor.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/", name: "Predictor", component: Predictor,
        meta: {
            title: "Predictor"
        }
    },
    {
        path: "/predictor",
        name: "PredictorPage",
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
    routes,
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Predictor';
    next();
});
export default router;
