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
    const index = req.body.index;
    const verdict = req.body.verdict;
    const verdictHex = stringToHex.stringToArray(verdict);
    contract.methods.addOEMVerdict(index,verdictHex[0]).send({
        from: from,
        gas: gas,
        gasPrice: gasPrice
    }).on('receipt', function (_receipt) {
        return res.status(200).json({_receipt});
    }).on('error', function (error) {
        return next(new Error(error));
    });
});

module.exports = router;
