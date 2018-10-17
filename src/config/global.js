const path = require('path');
const debugMode = true;

module.exports = {
    serverPort: 10002,
    mysql: {
        host: '',
        user: '',
        password: '',
        port: '',
        database: ''
    },
    secret: 'abcdefgh12345678',
    debugMode,
    homePath: path.resolve(__dirname, '../../'),
    publicPath: debugMode ? 'http://localhost:10002' : 'https://nannongrousong.xin/baoli/api',
    //  用户重置密码
    defaultPwd: 'passok'
}