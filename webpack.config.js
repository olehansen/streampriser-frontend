// const ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// const extractSass = new ExtractTextPlugin({
//     filename: "./dist/streampriser.css",
//     // disable: process.env.NODE_ENV === "development"
// });

module.exports = {
    entry: "./src/index.ts",

    mode: "development",

    output: {
        filename: "./dist/streampriser.js",
        library: "streampriser"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            // {
            //     test: /\.scss$/,
            //     use: extractSass.extract({
            //         use: [
            //             {
            //                 loader: "css-loader"
            //             }, {
            //                 loader: "sass-loader"
            //             }
            //         ],
            //         // use style-loader in development
            //         fallback: "style-loader"
            //     })
            // },
            {
                test: /\.(png|gif)$/,
                use: [
                    {
                        loader: "url-loader?limit=100000"
                    }
                ]
            },
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    plugins: [
        // extractSass,
        new CopyPlugin({
            patterns: [
                "demo/index.html"
                // { from: "demo/**/*", to: "dist" },
            ],
        }),
    ]
};