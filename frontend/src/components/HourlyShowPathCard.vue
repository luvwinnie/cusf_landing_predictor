<template>
	<LControl :position="'bottomleft'" class="custom-control-watermark">
    <v-responsive max-width="400" class="mx-auto mb-4">
    
    <v-card>
    <v-card-title>Predictions</v-card-title>

    <v-data-table
    :headers="headers">
    </v-data-table>

    </v-card>
        </v-responsive>
	</LControl>
	
</template>
<script>
import { LControl } from "vue2-leaflet";
export default {
    name: "HourlyShowPathCard",
    data: () => ({
        headers: [
        {text:"Launch Date", value: "launch_date"},
        {text:"Launch Time", value: "launch_time"},
        {text:"Duration Date", value: "duration"},
        {text:"Range", value: "range"}
        
        ],
    }),
    components: {
        LControl
    },
    
}
</script>