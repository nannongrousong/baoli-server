const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');

const addGroup = async (groupInfo) => {
    let { GroupAppeal } = groupInfo;
    let sqlParams = [GroupAppeal];

    try {
        await dbHelper.executeSql('insert into tbl_issue_group(group_id, group_appeal) values(uuid(), ?)', sqlParams)
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR);
    }
};

const delGroup = async (userID) => {
    let sql = 'delete from tbl_test_user where user_id = ?';
    let sqlParams = [userID];

    try {
        await dbHelper.executeSql(sql, sqlParams);
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
};

const editGroup = async ({ GroupAppeal, GroupID }) => {
    let sql = 'update tbl_issue_group set group_appeal=? where group_id = ?';
    let sqlParams = [GroupAppeal, GroupID];

    try {
        await dbHelper.executeSql(sql, sqlParams);
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
};

module.exports = {
    addGroup,
    delGroup,
    editGroup
}