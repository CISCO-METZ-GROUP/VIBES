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
    const verdict = req.body.verdict;
    const verdictHex = stringToHex.stringToArray(verdict);
    const T1Name = stringToHex.stringToArray(req.body.T1Name);
    if (name !== undefined) {
        contract.methods.addVerdictByName(name[0], verdictHex[0], T1Name[0]).send({
            from: from,
            gas: gas,
            gasPrice: gasPrice
        }).on('receipt', function (_receipt) {
            return res.status(200).json({ _receipt });
        }).on('error', function (error) {
            return next(new Error(error));
        });

    } else if (index !== undefined) {
        contract.methods.addVerdict(index, verdictHex[0], T1Name[0]).send({
            from: from,
            gas: gas,
            gasPrice: gasPrice
        }).on('receipt', function (_receipt) {
            return res.status(200).json({ _receipt });
        }).on('error', function (error) {
            return next(new Error(error));
        });

    } else {
        return next(new Error("input invalid"));
    }

});

module.exports = router;
