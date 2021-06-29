<template>
    <v-app>
        <v-app-bar app color="black" dark>
            <div class="d-flex align-center">
                <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                    transition="scale-transition"
                    width="40"
                />

                <v-img
                    alt="Vuetify Name"
                    class="shrink mt-1 hidden-sm-and-down"
                    contain
                    min-width="100"
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                    width="100"
                />
            </div>

            <v-spacer></v-spacer>
        </v-app-bar>

        <v-main>
            <Map :api_url="api_url" />
        </v-main>
    </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import Map from "./components/Map";

export default {
    name: "App",

    components: {
        Map,
    },

    data: () => ({
        api_url: process.env.VUE_APP_TAWHIRI_API_URL,
    }),
};
</script>
