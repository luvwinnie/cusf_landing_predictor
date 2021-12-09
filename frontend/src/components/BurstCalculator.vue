<template>
  <div class="d-flex align-center justify-center">
      <v-dialog v-model="dialog" persistent max-width="600px">
          <template class="align-center justify-center" v-slot:activator="{ on, attrs }">
              <v-btn x-small outlined rounded text v-bind="attrs" v-on="on">
                  Burst Calculator
              </v-btn>
          </template>
          <v-card>
              <v-card-title>
                  <span class="text-h5">Burst Calculator</span>
              </v-card-title>
              <v-card-text>
                  <v-container>
                      <v-row>
                          <v-col cols="5" sm="5" md="4">
                              <v-text-field
                                  label="Payload Mass (g)"
                                  required
                              ></v-text-field>
                          </v-col>
                          <v-col cols=2 sm="2" md="4">
                              <h2>AND</h2>
                          </v-col>
                          <v-col cols="5" sm="5" md="4">
                              <v-select
                              v-model="balloon_mass_select"
                              :items="items"
                              item-text="name" item-value="value" return-object
                              label="Balloon Mass (g)"
                              required
                              ></v-select>
                          </v-col>
                      </v-row>
                      <v-spacer></v-spacer>
                      <v-row>
                          <v-col cols="5" sm="5" md="4">
                              <v-text-field
                                  label="Payload Mass (g)"
                                  required
                              ></v-text-field>
                          </v-col>
                          <v-col cols=2 sm="2" md="4">
                              <h3>OR</h3>
                          </v-col>
                          <v-col cols="5" sm="5" md="4">
                              <v-select
                              v-model="balloon_mass_select"
                              :items="items"
                              item-text="name" item-value="value" return-object
                              label="Balloon Mass (g)"
                              required
                              ></v-select>
                          </v-col>
                      </v-row>
                  </v-container>
                  
              </v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="advanced_dialog = !advanced_dialog">
                      Advanced
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                      Use Values
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                      Close
                  </v-btn>
                  <v-spacer></v-spacer>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog
      v-model="advanced_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span>Constants</span>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="() => {}"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="advanced_dialog = false">
            Back
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name: "BurstCalculator",
    data: () => ({
        dialog: false,
        advanced_dialog: false,
        balloon_mass_select:{name:"Kaymont - 200", value:"k200"},
        items: [
          {name:"Kaymont - 200", value:"k200"},
          {name:"Kaymont - 300", value:"k300"},
          {name:"Kaymont - 350", value:"k350"},
          {name:"Kaymont - 450", value:"k450"},
          {name:"Kaymont - 500", value:"k500"},
          {name:"Kaymont - 600", value:"k600"},
          {name:"Kaymont - 700", value:"k700"},
          {name:"Kaymont - 800", value:"k800"},
          {name:"Kaymont - 1000", value:"k1000"},
          {name:"Kaymont - 1200", value:"k1200"},
          {name:"Kaymont - 1500", value:"k1500"},
          {name:"Kaymont - 2000", value:"k2000"},
          {name:"Kaymont - 3000", value:"k3000"},

          {name:"Hwoyee - 200", value:"h200"},
          {name:"Hwoyee - 300", value:"h300"},
          {name:"Hwoyee - 350", value:"h350"},
          {name:"Hwoyee - 400", value:"h400"},
          {name:"Hwoyee - 500", value:"h500"},
          {name:"Hwoyee - 600", value:"h600"},
          {name:"Hwoyee - 750", value:"h750"},
          {name:"Hwoyee - 800", value:"h800"},
          {name:"Hwoyee - 950", value:"h950"},
          {name:"Hwoyee - 1000", value:"h1000"},
          {name:"Hwoyee - 1200", value:"h1200"},
          {name:"Hwoyee - 1500", value:"h1500"},
          {name:"Hwoyee - 1600", value:"h1600"},
          {name:"Hwoyee - 2000", value:"h2000"},
          {name:"PAWAN - 1200", value:"p1200"}
        //   'Design',
        //   'Vue',
        //   'Vuetify',
        ],
    }),
};
</script>
