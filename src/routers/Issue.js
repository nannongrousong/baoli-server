const express = require('express')
const router = express.Router();
const issueM = require('../model/issue')
const { getErrorInfo } = require('../common/utils');

router.get('/', async (req, res) => {
    try {
        let Data = await issueM.listIssue();
        res.json({ Code: true, Data });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.post('/', async (req, res) => {
    try {
        await issueM.addIssue(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.delete('/:issueID', async (req, res) => {
    const { issueID } = req.params;
    try {
        await issueM.delIssue(issueID);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.put('/', async (req, res) => {
    try {
        await issueM.editIssue(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

module.exports = router;