<template>
  <LControl :position="'bottomright'" class="custom-control-watermark">
    <v-responsive max-width="600" class="mx-auto mb-4">
      <v-expansion-panels popout>
        <v-expansion-panel>
          <v-expansion-panel-header> CUSF Predictor </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="6">
                <v-select
                  label="Launch Site"
                  v-model="form_inputs.launchsite"
                  :items="form_inputs.items"
                  item-text="key"
                  item-value="postition"
                  @change="selectPosition($event)"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-combobox
                  v-model="form_inputs.dataset"
                  :items="datasets"
                  label="Select should use latest dataset"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="form_inputs.lat"
                  label="Latitude"
                  required
                  @change="updateLat"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="form_inputs.lng"
                  label="Longtitude"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="form_inputs.launchAttitude"
                  label="LaunchAltitude (m)"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-text-field
                  v-model="form_inputs.selectDay"
                  :count="2"
                  label="Day"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="form_inputs.selectMonth"
                  item-text="key"
                  item-value="value"
                  :items="form_inputs.months"
                  menu-props="auto"
                  label="Month"
                  hide-details
                  hide-spin-buttons:true
                  single-line
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="form_inputs.selectYear"
                  :count="4"
                  label="Year"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="form_inputs.selectHours"
                  :count="2"
                  label="Hours"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="form_inputs.selectMinutes"
                  :count="2"
                  label="Minutes"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="form_inputs.ascentRate"
                  label="Ascent Rate (m/s)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="form_inputs.burstAttitude"
                  label="Burst Altitude (m)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="form_inputs.descentRate"
                  hint="At sea level"
                  label="Descent Rate (m/s)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <BurstCalculator />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-spacer></v-spacer>
              <v-col cols="6">
                <v-btn
                  @click="clearPrediction($event)"
                  small
                  outlined
                  rounded
                  text
                >
                  Reset
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  @click="runPrediction($event)"
                  small
                  outlined
                  rounded
                  text
                >
                  Run Prediction
                </v-btn>
              </v-col>

              <v-spacer></v-spacer>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-responsive>
  </LControl>
</template>

<script>
import { LControl } from "vue2-leaflet";
import { mapActions, mapState } from "vuex";
import BurstCalculator from "@/components/BurstCalculator.vue";

export default {
  name: "PredictForm",
  components: {
    LControl,
    BurstCalculator,
  },
  data() {
    return { preds: this.prediction };
  },

  methods: {
    ...mapActions("predictors", [
      "clearPrediction",
      "updateLat",
      "updateLng",
      "runPrediction",
      "selectPosition",
    ]),
  },
  computed: {
    ...mapState("predictors", ["prediction", "form_inputs", "datasets"]),
  },
};
</script>
