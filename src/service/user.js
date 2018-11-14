const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');
const { encryptData } = require('../common/utils')

const checkUser = async ({ LoginName, Password }) => {
    let sql = 'select count(1) as count from tbl_user where login_name = ? and password = ?';
    let params = [LoginName, encryptData(Password)]
    try {
        let data = await dbHelper.executeSql(sql, params);
        return data[0].count == 1;
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
}

module.exports = {
    checkUser
}