const express = require('express')
const router = express.Router();
const groupM = require('../model/group')
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

module.exports = router;