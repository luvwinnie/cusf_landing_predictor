<template>
    <div>
        <LCircleMarker
            v-for="(predict,index) in pred"
            :key="predict.name"
            :name="index.toString()"
            :lat-lng="predict.landing_latlng"
            :radius="4"
            color="#ff0000"
            fillColor="#ff0000"
            :fillOpacity=1
            @click="showFlightPath(index,true)"
        >
        <LPopup>
            <p><strong>Launch time:</strong> {{predict.launch_time}}</p>
            <p><strong>Flight time:</strong> {{predict.flight_time.toFixed(2)}} hours</p>
            <p><strong>Landing time:</strong> {{predict.landing_time}}</p>
            <p><strong>Landing location(DD):</strong>{{predict.landing_location_dd}}</p>
            <p><strong>Landing location(DMS):</strong>{{predict.landing_location}}</p>
                    <!-- <p><a href="6ea0225b-4457-4106-8a60-c78c0bf38ac9/output.csv" tabindex="0">Raw output data</a> (opens in new window)</p> -->
        </LPopup>
        </LCircleMarker>
        <LPolyline
            v-model="pred"
            :lat-lngs="landing_line"
            color="#ff0000"
        ></LPolyline>
        <div v-for="(predict,index) in pred" :key="index">
            <div>
                <LMarker :lat-lng="predict.launch_latlng" :icon="launch_icon" v-if="showPaths[index]"/>
                <LPolyline :weight=2 :lat-lngs="predict.flight_path" :color="predict.color" v-if="showPaths[index]" @click="showFlightPath(index,false)"/>
                <LMarker :lat-lng="predict.burst_latlng" :icon="burst_icon" v-if="showPaths[index]"/>
            </div>
            <!-- <LMarker :lat-lng="predict.landing_latlng" :icon="landing_icon"/> -->
        </div>
        
    </div>
</template>

<script>
import { LPopup,LMarker,LCircleMarker, LPolyline } from "vue2-leaflet";
import { icon } from "leaflet";
import {  mapMutations } from "vuex";

export default {
    name: "HourlyPrediction",
    components: {
        LPopup,
        LMarker,
        LCircleMarker,
        LPolyline,
    },
    props: {
        // latlng: Object,
        pred: Array,
        landing_line:Array,
        showPaths:Array,
        selectedPrediction:Object,
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
    methods:{
        // ...mapActions("hourly", ["showFlightPath"]),
        ...mapMutations("hourly",["updateShowPath"]),
        async showFlightPath(index,isShow) {
            console.log("Key:",index);
            // console.log(this.showPath);
            var tmp = this.showPaths;
            tmp[index] = isShow;
            console.log(tmp);
            
            this.$store.commit('hourly/updateShowPath',tmp);
            this.$store.commit("hourly/updateSelectPrediction",index);
            this.$forceUpdate();

            // this.showPaths[index] = !this.showPaths[index];
        
    },
    }
};
</script>
