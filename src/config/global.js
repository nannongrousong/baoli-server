const path = require('path');

module.exports = {
    serverPort: 10002,
    mysql: {
        host: '',
        user: '',
        password: '',
        port: '',
        database: ''
    },
    secret: '',
    homePath: path.resolve(__dirname, '../../'),
    publicPath: (process.env.NODE_ENV == 'devlopment') ? 'http://localhost:10002' : 'https://nannongrousong.xin/baoli/api',
    //  用户重置密码
    defaultPwd: 'passok'
}