const express = require('express');
const getWeb3 = require('../web3/get-web3');
const web3 = getWeb3.getWeb3();
const getCoinBase = require('../coinbase_information/getcoinbase.js');
const account = getCoinBase.getCoinBase();
const router = express.Router();

router.post('/', function(req, res, next) {
    const time = req.body.time;
    web3.eth.personal.unlockAccount(account.account, account.password, time)
        .then((response) => {
            return res.status(200).json({
                unlocked: response
            });
        })
        .catch((error) => {
            return next(new Error(error));
        });
});

module.exports = router;
