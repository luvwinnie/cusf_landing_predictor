<template>
    <div style="height: 100%">
        <LMap
            @click="clickPos"
            @mousemove="updateMousePos($event)"
            ref="map"
            :zoom="zoom"
            :center="center"
        >
            <LControlLayers position="topleft"></LControlLayers>
            <LControl :position="'topright'" class="custom-control-watermark">
                <v-dialog
                    v-model="isLoading"
                    hide-overlay
                    persistent
                    width="300"
                >
                    <v-card color="primary" dark>
                        <v-card-text>
                            Loading...
                            <v-progress-linear
                                indeterminate
                                color="white"
                                class="mb-0"
                            ></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-card class="mx-auto" max-width="344" outlined>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">
                                Current mouse position
                                <p>
                                    Lat:{{ mousePos["lat"] }} Lon:{{
                                        mousePos["lng"]
                                    }}
                                </p>
                            </div>
                            <v-row align="center" justify="space-around">
                                <v-btn text>
                                    Show Debug
                                </v-btn>
                                <AboutDialog />
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </LControl>
            <PredictForm />
            <LTileLayer
                v-for="tileProvider in tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                :attribution="tileProvider.attribution"
                layer-type="base"
            >
            </LTileLayer>
            <LMarker :lat-lng="[52.2135, 1.0964]"></LMarker>

            <Prediction
                v-if="prediction !== null"
                :pred="this.prediction"
            ></Prediction>
        </LMap>
    </div>
</template>

<script>
import {
    LMap,
    LTileLayer,
    LControlLayers,
    LMarker,
    LControl,
} from "vue2-leaflet";
import Prediction from "@/components/Prediction.vue";
import PredictForm from "@/components/PredictForm.vue";
import AboutDialog from "@/components/AboutDialog.vue";
import moment from "moment-timezone/moment-timezone";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
    name: "Predictor",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LControlLayers,
        PredictForm,
        Prediction,
        AboutDialog,
    },
    data() {
        return {
            // isLoading: false,
            url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
            zoom: 8,
            center: [52.2135, 0.0964],
            bounds: null,
            tileProviders: [
                {
                    name: "OpenStreetMap",
                    visible: true,
                    attribution:
                        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                },
                {
                    name: "OpenTopoMap",
                    visible: false,
                    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                },
                {
                    name: "ESRI SatelliteMap",
                    visible: false,
                    url:
                        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    attribution:
                        '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                },
            ],
        };
    },
    methods: {
        ...mapActions("predictors", ["updateMousePos", "clickPos"]),
    },
    computed: {
        ...mapState("predictors", [
            "api",
            "mousePos",
            "prediction",
            "form_inputs",
        ]),
        // ...mapState(["isLoading"]),
        ...mapGetters(["isLoading"]),
    },
    mounted() {
        moment.tz.add(
            "Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJJ0 Rc0 1lc0 14o0 1zc0 Oo0 1zc0 Oo0|38e6"
        );
    },
};
</script>
