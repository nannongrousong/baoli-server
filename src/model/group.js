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

const editGroup = async ({ GroupAppeal, GroupID }) => {
    let sql = 'update tbl_issue_group set group_appeal=? where group_id = ?';
    let sqlParams = [GroupAppeal, GroupID];

    try {
        await dbHelper.executeSql(sql, sqlParams);
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
};

const delGroup = async (groupID) => {
    let sql = 'select count(1) as count from tbl_issue_rela_group where group_id = ?';
    let params = [groupID]

    try {
        let res = await dbHelper.executeSql(sql, params);
        if (res[0].count != 0) {
            throw new Error('该分组下还有存在的问题，不允许删除。')
        }

        let sqlList = [{
            sql: 'delete from tbl_issue_group where group_id = ?',
            params
        }, {
            sql: 'delete from tbl_issue_rela_group where group_id = ?',
            params
        }]

        await dbHelper.executeTransaction(sqlList)
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
}

module.exports = {
    addGroup,
    editGroup,
    delGroup
}