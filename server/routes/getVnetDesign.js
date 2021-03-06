const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const router = express.Router();

router.post('/', function (req, res, next) {
    const from = account.account;
    const gas = 4700000;
    const gasPrice = 18000000000;
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    const index = req.body.index !== undefined ? req.body.index : undefined;
    const name = req.body.name !== undefined ? stringToHex.stringToArray(req.body.name) : undefined;
    if (name !== undefined) {
        contract.methods.getDataByName(name[0]).call({
            from: from,
            gas: gas,
            gasPrice: gasPrice
        }).then(function (result) {
            if (result.error !== undefined) {
                return next(new Error(result.error));
            } else {
                if (result.length != 0) {
                    //json = JSON.parse(result)
                    return res.status(200).json(result);
                } else {
                    return res.status(200).json(result);
                }

            }
        });
    } else if (index !== undefined) {
        contract.methods.getData(index).call({
            from: from,
            gas: gas,
            gasPrice: gasPrice
        }).then(function (result) {
            if (result.error !== undefined) {
                return next(new Error(result.error));
            } else {
                if (result.length != 0) {
                    //json = JSON.parse(result)
                    return res.status(200).json(result);
                } else {
                    return res.status(200).json(result);
                }
            }
        });
    } else {
        return next(new Error("input invalid"));
    }
});

module.exports = router;
