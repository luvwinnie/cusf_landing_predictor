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
                            <!-- <v-list-item-title class="text-h5 mb-1">
                                            Headline 5
                                        </v-list-item-title>
                                        <v-list-item-subtitle
                                            >Greyhound divisely hello coldly
                                            fonwderfully</v-list-item-subtitle
                                        > -->
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
            <LControl
                :position="'bottomright'"
                class="custom-control-watermark"
            >
                <v-expansion-panels accordion>
                    <!-- <v-expansion-panel v-for="(item, i) in 5" :key="i"> -->
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            CUSF Predictor
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-card max-width="344" outlined>
                                <v-list-item>
                                    <v-select
                                        style="z-index:1000;"
                                        label="Launch Site"
                                        v-model="launchsite"
                                        :items="items"
                                    ></v-select>
                                </v-list-item>
                                <v-list-item>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model="lat"
                                                label="Latitude"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field
                                                v-model="lng"
                                                label="Longtitude"
                                                required
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                                <v-list-item>
                                    <v-text-field
                                        v-model="launchAttitude"
                                        label="Launch altitude (m)"
                                        required
                                    ></v-text-field>
                                </v-list-item>
                                <v-list-item three-line>
                                    <v-list-item-content>
                                        <v-list-item-title
                                            >Launch
                                            Datetime(UTC)</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            ><v-row>
                                                <v-col cols="4">
                                                    <v-text-field
                                                        v-model="selectDay"
                                                        :count="2"
                                                        label="Day"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-select
                                                        style="z-index:1000;"
                                                        v-model="selectMonth"
                                                        item-text="key"
                                                        item-value="value"
                                                        :items="months"
                                                        menu-props="auto"
                                                        label="Month"
                                                        hide-details
                                                        single-line
                                                    ></v-select>
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-text-field
                                                        v-model="selectYear"
                                                        :count="4"
                                                        label="Year"
                                                        required
                                                    ></v-text-field>
                                                </v-col> </v-row
                                        ></v-list-item-subtitle>
                                        <v-list-item-subtitle>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        v-model="selectHours"
                                                        :count="2"
                                                        label="Hours"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        v-model="selectMinutes"
                                                        :count="2"
                                                        label="Minutes"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item>
                                    <v-text-field
                                        v-model="ascentRate"
                                        label="Ascent Rate (m/s)"
                                        required
                                    ></v-text-field>
                                </v-list-item>
                                <v-list-item>
                                    <v-text-field
                                        v-model="burstAttitude"
                                        label="Burst Altitude (m)"
                                        required
                                    ></v-text-field>

                                    <v-btn
                                        x-small
                                        @click="Reset"
                                        outlined
                                        rounded
                                        text
                                    >
                                        Burst Calculator
                                    </v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <v-text-field
                                        v-model="descentRate"
                                        hint="At sea level"
                                        label="Descent Rate (m/s)"
                                        required
                                    ></v-text-field>
                                </v-list-item>
                                <v-list-item>
                                    <v-btn
                                        small
                                        @click="Reset"
                                        outlined
                                        rounded
                                        text
                                    >
                                        Button
                                    </v-btn>
                                </v-list-item>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </LControl>

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
import AboutDialog from "../components/AboutDialog.vue";
import axios from "axios";
import moment from "moment-timezone/moment-timezone";
import parsePrediction from "../common/utils";

export default {
    name: "Map",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LControlLayers,
        Prediction,
        AboutDialog,
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
            api: "http://localhost:5000/api/v1/",
            params: {},
        };
    },
    methods: {
        getPos(event) {
            this.mousePos["lat"] = event.latlng["lat"].toFixed(4);
            this.mousePos["lng"] = event.latlng["lng"].toFixed(4);
            // this.mousePos["array"] = [
            //     event.latlng["lat"].toFixed(4),
            //     event.latlng["lng"].toFixed(4),
            // ];
            // console.log(this.mousePos);
        },
        async clickPos(event) {
            console.log(this.selectMonth);
            var getTime = moment.tz(
                `${this.selectYear}-${this.selectMonth}-${this.selectDay} ${this.selectHours}:${this.selectMinutes}`,
                "Asia/Tokyo"
            );
            var launch_time = getTime.utc();
            console.log(getTime + " " + launch_time);
            this.params = {
                profile: "standard_profile",
                launch_datetime: launch_time.format(),
                launch_latitude: 52.2135,
                launch_longitude: 0.0964,
                launch_altitude: 0,
                ascent_rate: 5,
                burst_altitude: 30000,
                descent_rate: 5,
            };
            this.lat = event.latlng["lat"].toFixed(4);
            this.lng = event.latlng["lng"].toFixed(4);
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
                    console.log("axios:", this.prediction.flight_path);
                });
        },
        Reset() {
            this.prediction = null;
        },
    },
    mounted() {
        moment.tz.add(
            "Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJJ0 Rc0 1lc0 14o0 1zc0 Oo0 1zc0 Oo0|38e6"
        );
    },
};
</script>
