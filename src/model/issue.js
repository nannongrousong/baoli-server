const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');
const { publicPath } = require('../config/global')

const listIssue = async () => {
    try {
        let sql = `select group1.group_id as GroupID, group1.group_appeal as GroupAppeal, issue.issue_no as IssueNo, issue.issue_appeal as IssueAppeal, 
        issue.rectify_info as RectfyInfo, issue.rectify_last_date as RectifyLastDate, issue.remark as Remark, issue.issue_id as IssueID
        from tbl_issue_group group1
        left join tbl_issue_rela_group rela on group1.group_id = rela.group_id
        left join tbl_issue issue on issue.issue_id = rela.issue_id
        order by group1.create_time, issue.issue_id`;
        let data = await dbHelper.executeSql(sql, []);
        let fixData = [];
        let groupSet = new Set();

        data.forEach(item => {
            const { GroupID, GroupAppeal, IssueNo } = item;
            if (!groupSet.has(GroupID)) {
                fixData.push({
                    GroupID,
                    IssueNo: GroupID,
                    GroupAppeal,
                    IsGroup: true
                });
                groupSet.add(GroupID);
            }

            delete item.GroupAppeal;

            IssueNo && fixData.push(item);
        })

        return fixData;
    } catch (err) {
        throw new Error(errorInfo.DB_OPER_ERROR)
    }
}

const addIssue = async ({ IssueNo, IssueAppeal, RectfyInfo, RectifyLastDate, GroupID }) => {
    // issue_no 唯一  插入group对应关系
    let sqlList = [{
        sql: 'insert into tbl_issue(issue_no, issue_appeal, rectify_info, rectify_last_date) values(?,?,?,?)',
        params: [IssueNo, IssueAppeal, RectfyInfo, RectifyLastDate]
    }, {
        sql: 'insert into tbl_issue_rela_group(issue_id, group_id) values(@@issue_id, ?)',
        params: [GroupID]
    }]

    try {
        await dbHelper.executeTransaction(sqlList, {
            sqlResIndex: 0,
            sqlAfterReplaceStr: '@@issue_id'
        });
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            throw new Error('问题编号不允许重复，请重新再试！');
        }
        throw new Error(errorInfo.DB_OPER_ERROR)
    }
};

const delIssue = async (issueID) => {
    let sqlList = [{
        sql: 'delete from tbl_issue where issue_id = ?',
        params: [issueID]
    }, {
        sql: 'delete from tbl_issue_rela_group where issue_id = ?',
        params: [issueID]
    }]

    try {
        await dbHelper.executeTransaction(sqlList)
    } catch (err) {
        throw new Error(errorInfo.DB_OPER_ERROR)
    }
};

const editIssue = async ({ GroupID, IssueAppeal, IssueID, IssueNo, RectfyInfo, RectifyLastDate }) => {
    let sql = 'update tbl_issue set issue_no=?, issue_appeal=?, rectify_info=?, rectify_last_date=? where issue_id = ?';
    let sqlParams = [IssueNo, IssueAppeal, RectfyInfo, RectifyLastDate, IssueID];

    try {
        await dbHelper.executeSql(sql, sqlParams);
    } catch (err) {
        throw new Error(errorInfo.DB_OPER_ERROR)
    }
};

const getPic = async (issueID) => {
    let sql = 'select pic_url as PicUrl,type as PicType from tbl_issue_rela_pic where issue_id = ?'
    let sqlParams = [issueID]

    let data = await dbHelper.executeSql(sql, sqlParams)
    let imageList = [];
    let actualList = [];
    data.forEach(item => {
        item.PicUrl = publicPath + '/BAOLI/Attach/' + item.PicUrl;
        item.PicType == 'image' ? imageList.push(item) : actualList.push(item);
    })

    return {
        Image: imageList,
        Actual: actualList
    };
}

module.exports = {
    listIssue,
    addIssue,
    delIssue,
    editIssue,
    getPic
}