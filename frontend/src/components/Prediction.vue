<template>
  <div>
    <LMarker v-model="pred" :lat-lng="pred.launch_latlng" :icon="launch_icon">
    </LMarker>
    <LPolyline
      v-model="pred"
      :lat-lngs="pred.flight_path"
      :color="pred.color"
    ></LPolyline>
    <LMarker v-model="pred" :lat-lng="pred.burst_latlng" :icon="burst_icon">
    </LMarker>
    <LMarker v-model="pred" :lat-lng="pred.landing_latlng" :icon="landing_icon">
    </LMarker>
  </div>
</template>

<script>
import { LMarker, LPolyline } from "vue2-leaflet";
import { icon } from "leaflet";

export default {
  name: "Prediction",
  components: {
    LMarker,
    LPolyline,
  },
  props: {
    // latlng: Object,
    pred: Object,
  },
  data() {
    return {
      launch_icon: icon({
        iconUrl: require("@/assets/target-1-sm.png"),
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
      burst_icon: icon({
        iconUrl: require("@/assets/pop-marker.png"),
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
      landing_icon: icon({
        iconUrl: require("@/assets/target-8-sm.png"),
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    };
  },
  // method: {

  // },
};
</script>
