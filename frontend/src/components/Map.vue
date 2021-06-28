<template>
    <div style="height: 100%">
        <LMap @mousemove="getPos" ref="map" :zoom="zoom" :center="center">
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
            <LMarker :lat-lng="[47.41322, -1.219482]"></LMarker>
            <LMarker :lat-lng="[46.19322, 4.82]"></LMarker>
            <LMarker :lat-lng="[45.19322, 6.82]"></LMarker>
            <LMarker :lat-lng="[47.0322, -0.9482]"></LMarker>
            <LMarker :lat-lng="[46.0322, 2.9482]"></LMarker>
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
                            <v-card class="mx-auto" max-width="344" outlined>
                                <v-list-item three-line>
                                    <v-list-item-content>
                                        <div class="text-overline mb-4">
                                            OVERLINE
                                        </div>
                                        <v-list-item-title class="text-h5 mb-1">
                                            Headline 5
                                        </v-list-item-title>
                                        <v-list-item-subtitle
                                            >Greyhound divisely hello coldly
                                            fonwderfully</v-list-item-subtitle
                                        >
                                    </v-list-item-content>

                                    <v-list-item-avatar
                                        tile
                                        size="80"
                                        color="grey"
                                    ></v-list-item-avatar>
                                </v-list-item>

                                <v-card-actions>
                                    <v-btn outlined rounded text>
                                        Button
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </LControl>
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

export default {
    name: "Map",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LControlLayers,
    },
    data() {
        return {
            mousePos: { lat: "?", lng: "?" },
            url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
            zoom: 6,
            center: [46.5322, 2.9482],
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
        getPos(event) {
            this.mousePos["lat"] = event.latlng["lat"].toFixed(4);
            this.mousePos["lng"] = event.latlng["lng"].toFixed(4);
            //     console.log(this.mousePos);
            //this.markers.push(event.latlng);
        },
    },
};
</script>
