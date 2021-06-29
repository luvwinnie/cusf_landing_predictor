import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

// axios
// import axios from "axios"; //追記
// import VueAxios from "vue-axios"; //追記

// Import the Icon
import { Icon } from "leaflet";
// Import the whole Leaflet CSS
import "leaflet/dist/leaflet.css";

Vue.config.productionTip = false;

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
// app.use(VueAxios, axios);
// Vue.component('prediction',require("./components/Prediction.vue"))
