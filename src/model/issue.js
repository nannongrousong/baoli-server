const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');
const { publicPath } = require('../config/global')

const listIssue = async () => {
    try {
        let sql = `select group1.group_id as GroupID, group1.group_appeal as GroupAppeal, issue.issue_no as IssueNo, issue.issue_appeal as IssueAppeal, 
        issue.rectify_info as RectfyInfo, issue.rectify_last_date as RectifyLastDate, issue.issue_id as IssueID, issue.remark as IssueRemark,
        issue.state as IssueState
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
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
}

const addIssue = async ({ IssueNo, IssueAppeal, RectfyInfo, RectifyLastDate, GroupID, ActualPic, ImagePic, IssueRemark, IssueState }) => {
    let sqlList = [{
        sql: 'insert into tbl_issue(issue_no, issue_appeal, rectify_info, rectify_last_date, remark, state) values(?,?,?,?,?,?)',
        params: [IssueNo, IssueAppeal, RectfyInfo, RectifyLastDate, IssueRemark, IssueState]
    }, {
        sql: 'insert into tbl_issue_rela_group(issue_id, group_id) values(@@issue_id, ?)',
        params: [GroupID]
    }]

    ActualPic.forEach(url => {
        sqlList.push({
            sql: 'insert into tbl_issue_rela_pic(issue_id, pic_url, type) values(@@issue_id,?,?)',
            params: [url, 'actual']
        })
    })

    ImagePic.forEach(url => {
        sqlList.push({
            sql: 'insert into tbl_issue_rela_pic(issue_id, pic_url, type) values(@@issue_id,?,?)',
            params: [url, 'image']
        })
    })

    try {
        await dbHelper.executeTransaction(sqlList, {
            sqlResIndex: 0,
            sqlAfterReplaceStr: '@@issue_id'
        });
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            throw new Error('问题编号不允许重复，请重新再试！');
        }
        throw err || new Error(errorInfo.DB_OPER_ERROR)
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
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
};

const editIssue = async ({ GroupID, IssueAppeal, IssueID, IssueNo, RectfyInfo, RectifyLastDate, ActualPic, ImagePic, IssueRemark, IssueState }) => {
    let sqlList = [{
        sql: 'update tbl_issue set issue_no=?, issue_appeal=?, rectify_info=?, rectify_last_date=?, remark=?, state=? where issue_id = ?',
        params: [IssueNo, IssueAppeal, RectfyInfo, RectifyLastDate, IssueRemark, IssueState, IssueID]
    }]

    if (ActualPic.length || ImagePic.length) {
        sqlList.push({
            sql: 'delete from tbl_issue_rela_pic where issue_id = ?',
            params: [IssueID]
        })
    }

    ActualPic.forEach(url => {
        sqlList.push({
            sql: 'insert into tbl_issue_rela_pic(issue_id, pic_url, type) values(?,?,?)',
            params: [IssueID, url, 'actual']
        })
    })

    ImagePic.forEach(url => {
        sqlList.push({
            sql: 'insert into tbl_issue_rela_pic(issue_id, pic_url, type) values(?,?,?)',
            params: [IssueID, url, 'image']
        })
    })

    try {
        await dbHelper.executeTransaction(sqlList);
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
};

const getPic = async (issueID) => {
    let sql = 'select pic_url as PicName,type as PicType, pic_id as PicID from tbl_issue_rela_pic where issue_id = ?'
    let sqlParams = [issueID]

    try {
        let data = await dbHelper.executeSql(sql, sqlParams)
        return data.map(item => ({
            ...item, PicUrl: publicPath + '/Attach/' + item.PicName
        }));
    } catch (err) {
        throw err || new Error(errorInfo.DB_OPER_ERROR)
    }
}

module.exports = {
    listIssue,
    addIssue,
    delIssue,
    editIssue,
    getPic
}