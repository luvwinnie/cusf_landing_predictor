<template>
        <LMap
            @mousemove="updateMousePos($event)"
            @click="clickUpdateMarkerPos($event)"
            ref="map"
            :zoom="zoom"
            :center="center"
            style="z-index:0;height:100%;"
        >
            <LControlLayers position="topleft"></LControlLayers>
            <LControl :position="'topright'" class="custom-control-watermark">
                <v-dialog
                    v-model="isLoading"
                    hide-overlay
                    persistent
                    width="300">
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
                <v-card max-width="344" outlined>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="mb-4">
                                <h4>Scenario Information</h4>
                                Mouse position: Lat:{{ mousePos["lat"] }} Lon:{{mousePos["lng"]}}
                                <p v-if="selectedPrediction !== null">
                                <span>
                                Landing(DMS):{{selectedPrediction.landing_location}}
                                </span>
                                <br>
                                <span>
                                Landing(DD):{{selectedPrediction.landing_location_dd}}
                                </span>
                                <br>
                                <span>
                                Range: {{selectedPrediction.range}} km, Flight Time:{{selectedPrediction.flight_time.toFixed(2)}}hours
                                </span>
                                <br>
                                <span>
                                Using model: {{selectedPrediction.used_model}}
                                </span>
                                </p>
                                
                            </div>
                            <v-row align="center" justify="space-around">
                                <!-- <v-btn text>
                                    Show Debug
                                </v-btn> -->
                                <AboutDialog />
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </LControl>
            <HourlyPredictForm/>
            <HourlyShowPathCard/>
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
            <Vue2LeafletGoogleMutant
                v-for="googletileProvider in googleMapProviders"
                :key="googletileProvider.name"
                :name="googletileProvider.name"
                :lang="googletileProvider.language"
                :region="googletileProvider.region"
                :visible="googletileProvider.visible"
                :options="googletileProvider.options"
                layerType="base"
            />
            <LMarker
                :latLng="markerPos"
                :draggable="this.draggable"
                @update:latLng="updateMarkerPos"
            ></LMarker>

            <HourlyPrediction
                v-if="prediction !== null"
                :pred="this.prediction"
                :landing_line="this.landing_line"
                :showPaths="this.showPaths"
            ></HourlyPrediction>
        </LMap>
</template>

<script>
import {
    LMap,
    LTileLayer,
    LControlLayers,
    LMarker,
    LControl,
} from "vue2-leaflet";
import HourlyShowPathCard from "@/components/HourlyShowPathCard.vue";
import HourlyPrediction from "@/components/HourlyPrediction.vue";
import HourlyPredictForm from "@/components/HourlyPredictForm.vue";
import AboutDialog from "@/components/AboutDialog.vue";
import moment from "moment-timezone/moment-timezone";
import { mapActions, mapState, mapGetters } from "vuex";
import Vue2LeafletGoogleMutant from "vue2-leaflet-googlemutant";

export default {
    name: "HourlyPredictor",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LControlLayers,
        HourlyShowPathCard,
        HourlyPredictForm,
        HourlyPrediction,
        AboutDialog,
        Vue2LeafletGoogleMutant,
    },
    data() {
        return {
            // isLoading: false,
            url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
            zoom: 5,
            center: [37.4263, 138.8195],
            bounds: null,
            draggable: true,
            // googleOption: {
            //     name: "Google Map",
            //     region: "JP",
            //     language: "jp",
            //     visible: false,
            //     options: {
            //         type: "satellite",
            //     },
            // },
            googleMapProviders: [
                {
                    name: "GoogleMap RoadMap",
                    region: "JP",
                    language: "jp",
                    visible: false,
                    options: {
                        type: "roadmap",
                        streetViewControl: true,
                        streetViewControlOptions: {
                            position: 1,
                        },
                    },
                },
                {
                    name: "GoogleMap Satellite",
                    region: "JP",
                    language: "jp",
                    visible: false,
                    options: {
                        type: "satellite",
                        streetViewControl: true,
                    },
                },
                {
                    name: "GoogleMap Hybrid",
                    region: "JP",
                    language: "jp",
                    visible: false,
                    options: {
                        type: "hybrid",
                        streetViewControl: true,
                    },
                },
                {
                    name: "GoogleMap Terrain",
                    region: "JP",
                    language: "jp",
                    visible: false,
                    options: {
                        type: "terrain",
                        streetViewControl: true,
                    },
                },
            ],
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
        ...mapActions("predictors", ["updateMousePos"]),
        ...mapActions("hourly", ["updateMarkerPos","clickUpdateMarkerPos"]),
    },
    computed: {
        ...mapState("predictors", ["mousePos", "form_inputs"]),
        ...mapState("hourly", [
            "api",
            "prediction",
            "landing_line",
            "markerPos",
            "showPaths",
            "selectedPrediction"
        ]),
        ...mapGetters(["isLoading"]),
    },
    mounted() {
        moment.tz.add(
            "Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJJ0 Rc0 1lc0 14o0 1zc0 Oo0 1zc0 Oo0|38e6"
        );
    },
};
</script>


<style>
span {
    padding:5px 0 0 5px;
}
</style>