require('dotenv').config()
var HtmlWebpackPlugin =  require('html-webpack-plugin')

module.exports = {
    entry : './app/index.js',
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    plugins : [
        new HtmlWebpackPlugin ({
            favicon: 'app/favicon.png',
            template : 'app/index.html'
        })
    ]

}
