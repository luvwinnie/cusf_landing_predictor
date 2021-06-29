<template>
    <div style="height: 100%">
        <LMap
            @click="clickPos"
            @mousemove="getPos"
            ref="map"
            :zoom="zoom"
            :center="center"
        >
            <LControlLayers position="topleft"></LControlLayers>
            <LControl :position="'topright'" class="custom-control-watermark">
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
            <PredictForm
                :form_inputs="this.form_inputs"
                :prediction="this.prediction"
                @clear="prediction = $event"
            />
            <!-- <LTileLayer :url="url"> -->
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
import Prediction from "../components/Prediction.vue";
import PredictForm from "../components/PredictForm.vue";
import AboutDialog from "../components/AboutDialog.vue";
import axios from "axios";
import moment from "moment-timezone/moment-timezone";
import { parsePrediction } from "../common/utils";

export default {
    name: "Map",
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
    props: {
        api_url: String,
    },
    data() {
        return {
            mousePos: { lat: "?", lng: "?" },
            prediction: null,
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
            form_inputs: {
                items: ["Kofu", "Chuchill"],
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
                selectDay: "16",
                selectMonth: 6,
                selectYear: "2021",
                selectHours: "10",
                selectMinutes: "10",
                launchsite: "Kofu",
                lat: 52.2135,
                lng: 0.0964,
                launchAttitude: 0,
                burstAttitude: 30000,
                ascentRate: 5,
                descentRate: 5,
            },
            api: this.api_url,
            params: {},
        };
    },
    methods: {
        getPos(event) {
            this.mousePos["lat"] = event.latlng["lat"].toFixed(4);
            this.mousePos["lng"] = event.latlng["lng"].toFixed(4);
        },
        async clickPos(event) {
            // console.log(this.selectMonth);
            console.log(process.env);
            var getTime = moment.tz(
                `${this.form_inputs.selectYear}-${this.form_inputs.selectMonth}-${this.form_inputs.selectDay} ${this.form_inputs.selectHours}:${this.form_inputs.selectMinutes}`,
                "Asia/Tokyo"
            );
            var launch_time = getTime.utc();
            // console.log(getTime + " " + launch_time);
            this.lat = event.latlng["lat"].toFixed(4);
            this.lng = event.latlng["lng"].toFixed(4);
            this.form_inputs.lat = this.lat;
            this.form_inputs.lng = this.lng;
            this.params = {
                profile: "standard_profile",
                launch_datetime: launch_time.format(),
                launch_latitude: event.latlng["lat"].toFixed(4),
                launch_longitude: event.latlng["lng"].toFixed(4),
                launch_altitude: this.form_inputs.launchAttitude,
                ascent_rate: this.form_inputs.ascentRate,
                burst_altitude: this.form_inputs.burstAttitude,
                descent_rate: this.form_inputs.descentRate,
            };

            await axios
                .get(this.api, { params: this.params })
                .then((response) => {
                    console.log(response.data);
                    var result = parsePrediction(response.data.prediction);
                    console.log(result);
                    this.prediction = {
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
                    };
                });
        },
    },
    mounted() {
        moment.tz.add(
            "Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJJ0 Rc0 1lc0 14o0 1zc0 Oo0 1zc0 Oo0|38e6"
        );
    },
};
</script>
