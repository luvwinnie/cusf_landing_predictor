<template>
  <v-dialog width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text color="primary" dark v-bind="attrs" v-on="on"> About </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="subtitle-1"
          >Cambridge University Spaceflight Landing Predictor (<a
            href="https://github.com/jonsowman/cusf-standalone-predictor"
            >github</a
          >)</span
        >
      </v-card-title>
      <v-card-text>
        <p>
          A tool to predict the flight path and landing location of latex
          sounding balloons.
        </p>
        <p>
          Written by
          <a href="http://github.com/jonsowman" target="_blank">Jon Sowman</a>,
          <a href="http://github.com/adamgreig" target="_blank">Adam Greig</a>
          and
          <a href="http://github.com/danielrichman">Daniel Richman</a>
          for
          <a href="http://www.cuspaceflight.co.uk" target="_blank">CUSF</a>.
          Credit also to
          <a href="http://github.com/rjw57" target="_blank">Rich Wareham</a>
          for work on the predictor. Some parts of code taken from old landing
          prediction software, credit to Rob Anderson, Fergus Noble and Ed
          Moore.
        </p>
        <p>This predictor uses data from the NOAA GFS models.</p>
        <p>
          No guarantee is given for the accuracy, precision or reliability of
          the data produced by this software, and you use it entirely at your
          own risk. For more information, see #highaltitude on irc.freenode.net.
        </p>
        <p>Copyright 2013 Cambridge University Space Flight</p>
        <h3>Burst Calculator</h3>
        <p>
          <a href="http://cusf.co.uk/calc">Burst Calculator Web Page</a>
        </p>
        <h4>Usage</h4>
        <p>
          This calculator is designed to help you find how much gas to put into
          a high altitude balloon to achieve a desired burst altitude or ascent
          rate. You have to know the payload mass (including parachute) and
          balloon mass.
        </p>
        <p>
          Usage is very straightforward: enter the payload mass into the first
          box, select the balloon mass from the second box, and type in either a
          desired burst altitude in meters or ascent rate in meters per second
          in the relevent box. Pressing enter or clicking away from the box you
          are typing into will run the calculations, displaying the results in
          the box at the bottom.
        </p>
        <p>
          The 'Constants' box can be used to adjust constants used by the
          calculator. These include selecting a type of gas (or entering a
          custom gas density), adjusting modelling parameters or entering a
          custom burst diameter or drag coefficient for your balloon. Click the
          tick box next to the burst diameter or drag coefficient boxes to use a
          custom value, otherwise the appropriate value for your selected
          balloon will be used.
        </p>
        <h4>About</h4>
        <p>
          Written by Adam Greig for CUSF in March 2010. Maths derived from
          `burst1a` spreadsheet by Steve Randall. Balloon information from
          Kaymont Totex sounding balloon data.
        </p>
        <p>
          No guarantee is given for the accuracy of any data included or
          produced by this program, use at your own risk.
        </p>
        <p>Copyright 2010 Cambridge University Space Flight</p>
        <!-- <p>
          This software is fork from Cambridge University Space Flight and
          maintaining by Artibrains LLC and Space Entertainment Laboratory
        </p> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AboutDialog",
  computed: {
    ...mapState("hourly", ["prediction", "form_inputs"]),
  },
};
</script>
