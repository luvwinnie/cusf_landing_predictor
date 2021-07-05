module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 8080,
        public: "0.0.0.0:8080",
    },
    publicPath: "/",
    transpileDependencies: ["vuetify"],
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            config.optimization.minimizer[0].options.terserOptions = Object.assign(
                {},
                config.optimization.minimizer[0].options.terserOptions,
                {
                    ecma: 5,
                    compress: {
                        keep_fnames: true,
                    },
                    warnings: false,
                    mangle: {
                        keep_fnames: true,
                    },
                }
            );
        }
    },
    chainWebpack: (config) => {
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap((options) =>
                Object.assign(options, {
                    transformAssetUrls: {
                        "v-img": ["src", "lazy-src"],
                        "v-card": "src",
                        "v-card-media": "src",
                        "v-responsive": "src",
                    },
                })
            );
    },
};
