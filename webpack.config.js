module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: './release/myui.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,   // 正则表达式，表示.css后缀的文件
            exclude: /(node_modules)/,
            use: ['style-loader','css-loader']   // 针对css文件使用的loader，注意有先后顺序，数组项越靠后越先执行
        }]
    },
    watch: true   // 监听修改自动打包
}
