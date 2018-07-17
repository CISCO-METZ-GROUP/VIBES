const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const router = express.Router();
var sortJsonArray = require('sort-json-array');

router.post('/', function (req, res, next) {
    const from = account.account;
    const gas = 4700000;
    const gasPrice = 18000000000;
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    const blockNumber = req.body.blockNumber !== undefined ? req.body.blockNumber : getBlockNumber();
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    const events = [];
    const blocks = [];
    let counter = 0;

    web3.eth.getBlock(blockNumber).then(function (_result) {
        let event = [];
        let OEM = [];
        let dname = [];
        let cname = [];
        let eve = [];
        let value = [];
        let receipt = [];
        if (_result.transactions[0] || _result.logs != undefined) {
            web3.eth.getTransactionReceipt(_result.transactions[0]).then(function (result) {

                temp = result.logs[0].data.slice(129, 192);
                hold = 1;
                key = true;
                while (key) {
                    temp = result.logs[0].data.slice(hold + 1, hold + 64);
                    let temp2 = stringToHex.arrayToString(temp);
                    if (temp2 != "") {
                        event.push(temp2);
                    }

                    hold += 64;
                    if (hold >= result.logs[0].data.length) {
                        key = false;
                        break;
                    }
                }
                if (event.length == 2) {

                    contract.getPastEvents('newDesign', {
                        fromBlock: 0,
                        toBlock: 'latest'
                    },
                        function (error, event) {
                            for (i = 0; i < event.length; i++) {
                                if (event[i].blockNumber == blockNumber) {
                                    OEM = (stringToHex.arrayToString(event[i].returnValues[2]));
                                    dname = (stringToHex.arrayToString(event[i].returnValues[1]));
                                    eve = (event[i].event);
                                    value = (event[i].returnValues[0]);

                                    break;
                                }
                            }
                            receipt = {
                                blockNumber: _result.number,
                                timestamp: _result.timestamp,
                                OEM: OEM,
                                designName: dname,
                                company_name: cname,
                                action: eve,
                                value: value,
                            };
                            return res.status(200).json(receipt);
                        });
                } else {
                    contract.getPastEvents('newVerdict', {
                        fromBlock: 0,
                        toBlock: 'latest'
                    },
                        function (error, event) {
                            for (i = 0; i < event.length; i++) {
                                if (event[i].blockNumber == blockNumber) {
                                    cname = (stringToHex.arrayToString(event[i].returnValues[0]));
                                    dname = (stringToHex.arrayToString(event[i].returnValues[1]));
                                    eve = (event[i].event);
                                    value = (stringToHex.arrayToString(event[i].returnValues[3]));
                                    contract.methods.getOEMNameByDname(event[i].returnValues[1]).call({
                                        from: from,
                                        gas: gas,
                                        gasPrice: gasPrice
                                    }).then(function (result) {
                                        OEM.push(stringToHex.arrayToString(result));
                                        receipt = {
                                            blockNumber: _result.number,
                                            timestamp: _result.timestamp,
                                            OEM: OEM[0],
                                            designName: dname,
                                            company_name: cname,
                                            action: eve,
                                            value: value,
                                        };
                                        return res.status(200).json(receipt);

                                    })
                                }

                            }

                        });

                }
            })
        }else{
            receipt = {
                blockNumber: _result.number,
                timestamp: _result.timestamp,
                OEM: OEM,
                designName: dname,
                company_name: cname,
                action: eve,
                value: value,
            };
            return res.status(200).json(receipt);
        }
    })
});
function getBlockNumber() {
    web3.eth.getBlockNumber().then(function (result) {
        return result;
    });
}

module.exports = router;
