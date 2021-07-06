<template>
    <div id="app">
        <v-app>
            <v-app-bar app color="black" dark>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
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
                <template>
                    <v-tabs dark v-model="tab" align-with-title>
                        <v-tab
                            v-for="tab in items"
                            :key="tab.id"
                            :to="tab.route"
                            exact
                        >
                            {{ tab.name }}
                        </v-tab>
                    </v-tabs>
                </template>
                <v-spacer></v-spacer>
            </v-app-bar>

            <v-main>
                <router-view />
                <!-- <Map :api_url="api_url" /> -->
            </v-main>
        </v-app>
    </div>
</template>

<script>
export default {
    name: "App",
    data: () => ({
        tab: "/",
        items: [
            { id: 1, name: "Predictor", route: `/` },
            { id: 2, name: "Houlr", route: `/hourly` },
        ],
    }),
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
