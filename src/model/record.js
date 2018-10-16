const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');

const addRecord = async (loginName, desc) => {
    try {
        let sql = `insert into tbl_record(login_name, desc) values(?,?)`;
        let params = [loginName, desc]
        return dbHelper.executeSql(sql, params);
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
}

module.exports = {
    addRecord
}