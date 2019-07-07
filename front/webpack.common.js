require('dotenv').config()
var path = require('path')
var HtmlWebpackPlugin =  require('html-webpack-plugin')

module.exports = {
    entry : './app/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'scorebase.bundle.js',
        publicPath: process.env.PUBLIC_PATH
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins : [
        new HtmlWebpackPlugin ({
            favicon: 'app/favicon.png',
            template : 'app/index.html'
        })
    ]

}
