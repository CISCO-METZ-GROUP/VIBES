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
    const results = [];
    let counter = 0;
    contract.getPastEvents('newDesign', {
        fromBlock: 0,
        toBlock: 'latest'
    },
        function (error, event) {
            for (i = 0; i < event.length; i++) {
                console.log(event[i].returnValues[1]);
               let DesignName = stringToHex.arrayToString(event[i].returnValues[1]);
                web3.eth.getBlock(event[i].blockNumber).then(function (result) {
                    temp = {
                        timeStamp: result.timestamp,
                        DesignName: DesignName
                    }
                    results.push(temp);

                    if (counter == (event.length - 1)) {
                        return res.status(200).json(results);
                    }
                    counter++;
                });
            }
        })
});

module.exports = router;
