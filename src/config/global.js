const path = require('path');

module.exports = {
    serverPort: 81,
    mysql: {
        host: '',
        user: '',
        password: '',
        port: '',
        database: ''
    },
    secret: 'abcdefgh12345678',
    debugMode: true,
    homePath: path.resolve(__dirname, '../../'),
    publicPath: 'http://localhost:81',
    //  用户重置密码
    defaultPwd: 'passok'
}