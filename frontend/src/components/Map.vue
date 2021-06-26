<template>
    <div style="height: 100%">
        <LMap :zoom="zoom" :center="center">
            <LTileLayer :url="url"></LTileLayer>
            <LMarker :lat-lng="[47.41322, -1.219482]"></LMarker>
            <LMarker :lat-lng="[46.19322, 4.82]"></LMarker>
            <LMarker :lat-lng="[45.19322, 6.82]"></LMarker>
            <LMarker :lat-lng="[47.0322, -0.9482]"></LMarker>
            <LMarker :lat-lng="[46.0322, 2.9482]"></LMarker>
            <LControl
                :position="'bottomright'"
                class="custom-control-watermark"
            >
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
            </LControl>
        </LMap>
    </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LControl } from "vue2-leaflet";

export default {
    name: "Map",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
    },
    data() {
        return {
            url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
            zoom: 6,
            center: [46.5322, 2.9482],
            bounds: null,
        };
    },
};
</script>
