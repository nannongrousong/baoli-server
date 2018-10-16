const express = require('express')
const router = express.Router();
const userM = require('../model/user')
const { getErrorInfo } = require('../common/utils');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/global');

router.post('/', async (req, res) => {
    try {
        let { LoginName } = req.body;
        let isOK = await userM.checkUser(req.body);
        if (isOK) {
            const token = jwt.sign({
                LoginName
            }, secret, {
                    expiresIn: '1d'
                }
            );
            res.json({ Code: true, Data: token });
        } else {
            res.json({ Code: false, Info: '请检查登录名或密码！' })
        }

        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

module.exports = router;