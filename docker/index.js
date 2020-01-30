const express = require('express');
const path = require('path');
const proxy =  require('http-proxy-middleware')

const app = express();

// 代理服务器接口
app.use(
    proxy('/graphql', {
        target: 'http://server:3000'
    })
)
app.use(
    proxy('/api', {
        target: 'http://server:3000'
    })
)

// 静态文件
app.use(express.static(path.join(__dirname, './build')));

// 所有路由代理至 build/index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);