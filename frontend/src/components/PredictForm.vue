<template>
    <div>
        <LControl :position="'bottomright'" class="custom-control-watermark">
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
                                    v-model="form_inputs.launchsite"
                                    :items="form_inputs.items"
                                ></v-select>
                            </v-list-item>
                            <v-list-item>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model="form_inputs.lat"
                                            label="Latitude"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field
                                            v-model="form_inputs.lng"
                                            label="Longtitude"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                            <v-list-item>
                                <v-text-field
                                    v-model="form_inputs.launchAttitude"
                                    label="Launch altitude (m)"
                                    required
                                ></v-text-field>
                            </v-list-item>
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title
                                        >Launch Datetime(UTC)</v-list-item-title
                                    >
                                    <v-list-item-subtitle
                                        ><v-row>
                                            <v-col cols="4">
                                                <v-text-field
                                                    v-model="
                                                        form_inputs.selectDay
                                                    "
                                                    :count="2"
                                                    label="Day"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-select
                                                    style="z-index:1000;"
                                                    v-model="
                                                        form_inputs.selectMonth
                                                    "
                                                    item-text="key"
                                                    item-value="value"
                                                    :items="form_inputs.months"
                                                    menu-props="auto"
                                                    label="Month"
                                                    hide-details
                                                    single-line
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field
                                                    v-model="
                                                        form_inputs.selectYear
                                                    "
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
                                                    v-model="
                                                        form_inputs.selectHours
                                                    "
                                                    :count="2"
                                                    label="Hours"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                    v-model="
                                                        form_inputs.selectMinutes
                                                    "
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
                                    v-model="form_inputs.ascentRate"
                                    label="Ascent Rate (m/s)"
                                    required
                                ></v-text-field>
                            </v-list-item>
                            <v-list-item>
                                <v-text-field
                                    v-model="form_inputs.burstAttitude"
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
                                    v-model="form_inputs.descentRate"
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
                                    Reset
                                </v-btn>
                            </v-list-item>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </LControl>
    </div>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
    name: "PredictForm",
    components: {
        LControl,
    },
    props: {
        form_inputs: Object,
        prediction: Object,
    },
    data() {
        return { preds: this.prediction };
    },
    methods: {
        Reset() {
            this.preds = null;
            this.$emit("clear", this.preds);
        },
    },
};
</script>
