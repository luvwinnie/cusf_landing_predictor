<template>
    <div id="app">
        <v-app>
            <v-app-bar app color="black" dark>
                <v-app-bar-nav-icon
                    @click.stop="drawer = !drawer"
                    class="hidden-md-and-up"
                ></v-app-bar-nav-icon>


                <v-spacer></v-spacer>
                
                    <v-tabs
                        dark
                        v-model="this.selectedTab"
                        align-with-title
                        class="hidden-sm-and-down">
                        <v-tab
                            v-for="tab_item in items"
                            :key="tab_item.id"
                            :to="tab_item.route"
                            exact>
                            {{ tab_item.name }}
                        </v-tab>
                    </v-tabs>
                
                <v-spacer></v-spacer>
            </v-app-bar>

            <v-main>
                <v-navigation-drawer v-model="drawer" absolute bottom dark>
                    <v-list nav dense>
                        <v-list-item-group v-model="group">
                            <v-list-item
                                v-for="tab_item in items"
                                :key="tab_item.id"
                                :to="tab_item.route">
                                <v-list-item-title>{{
                                    tab_item.name
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-navigation-drawer>
                <v-slide-x-transition mode="out-in">
                    <router-view />
                </v-slide-x-transition>
            </v-main>
        </v-app>
    </div>
</template>

<script>
export default {
    name: "App",
    data: () => ({
        selectedTab: "/",
        drawer: false,
        group: null,
        items: [
            { id: 1, name: "Predictor", route: `/` },
            { id: 2, name: "Hourly", route: `/hourly` },
        ],
    }),
    watch: {
        group() {
            this.drawer = false;
        }

    },
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    // padding: 0px;
    // margin:0px;
    overflow:hidden;
}

#nav {
    // padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

// .map-wrapper { width: 100%; height:100%; position: absolute;}
// #map { width: 100%; height:100%; position: relative;}

.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}

</style>
