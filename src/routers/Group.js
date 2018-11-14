const express = require('express')
const router = express.Router();
const groupM = require('../service/group')
const { getErrorInfo } = require('../common/utils');

router.post('/', async (req, res) => {
    try {
        await groupM.addGroup(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.put('/', async (req, res) => {
    try {
        await groupM.editGroup(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.delete('/:groupID', async (req, res) => {
    const { groupID } = req.params;
    try {
        await groupM.delGroup(groupID);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

module.exports = router;