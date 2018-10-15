const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');

const server = http.createServer(app);
const serverConfig = require('./config/global')
const issueRouter = require('./routers/Issue')
const groupRouter = require('./routers/Group')
const attachRouter = require('./routers/Attach')

const log4js = require('./common/log4js')

server.listen(serverConfig.serverPort, () => {
    console.log(`正在监听${serverConfig.serverPort}端口`);
});

log4js.init(app);

app.use(bodyParser.json());

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/BAOLI/Issue', issueRouter)
app.use('/BAOLI/Group', groupRouter)
app.use('/BAOLI/Attach', attachRouter)


app.get('/error', (req, res, next) => {
    console.error('内部服务器错误[内部跳转]');
    res.send('');
})

app.use((req, res) => {
    res.status(404)
    res.send('页面不存在！')
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ Code: false, Info: 'TOKEN过期或丢失，请尝试重新登录！' });
    } else {
        res.status(err.status || 500).send('内部服务器错误');
    }
})