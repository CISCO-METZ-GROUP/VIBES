const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const sortJsonArray = require('sort-json-array');
const router = express.Router();
let key = false;

router.post('/', function (req, res, next) {
    const from = account.account;
    const gas = 4700000;
    const gasPrice = 18000000000;
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    let temp = [];
    var count = 0;
    let BlockNumber = [];
    let eventName = [];
    let current_block_hash = [];
    let cname = [];
    let dname = [];
    let cpname = [];
    let actoin = [];
    let value = [];
    let timestamp = [];
    const events = [];
    const list = [];
    const Verdictsevents = {
        time_stamp: timestamp,
        OEM: cname,
        vnetDesignName: dname,
        company_name: cpname,
        Action: actoin,
        value: value,
        BlockNumber: BlockNumber
    };
    contract.getPastEvents('newDesign', {
        fromBlock: 0,
        toBlock: 'latest'
    },
        function (error, event) {
            var counter = 0;
            for (i = 0; i < event.length; i++) {
                web3.eth.getBlock(event[i].blockNumber).then(function (result) {
                    timestamp.push(result.timestamp);
                    BlockNumber.push(event[counter].blockNumber);
                    cname.push(stringToHex.arrayToString(event[counter].returnValues[2]));
                    dname.push(stringToHex.arrayToString(event[counter].returnValues[1]));
                    actoin.push(event[counter].event);
                    value.push(event[counter].returnValues[0]);
                    events.push({
                        time_stamp: timestamp[counter],
                        OEM: cname[counter],
                        vnetDesignName: dname[counter],
                        company_name: [],
                        Action: actoin[counter],
                        value: value[counter],
                        BlockNumber: BlockNumber[counter]

                    });

                    if (counter == (event.length - 1)) {
                        contract.getPastEvents('newVerdict', {
                            fromBlock: 0,
                            toBlock: 'latest'
                        },
                            function (error, _event) {
                                counter++;
                                for (j = 0; j < _event.length; j++) {
                                    web3.eth.getBlock(_event[j].blockNumber).then(function (_result) {
                                        timestamp.push(_result.timestamp);
                                        BlockNumber.push(_event[count].blockNumber);
                                        dname.push(stringToHex.arrayToString(_event[count].returnValues[1]));
                                        cpname.push(stringToHex.arrayToString(_event[count].returnValues[0]));
                                        actoin.push(_event[count].event);
                                        value.push(stringToHex.arrayToString(_event[count].returnValues[3]));

                                        for (k = 0; k < event.length; k++) {
                                            if (events[k].vnetDesignName == dname[counter]) {
                                                console.log(events[k].vnetDesignName + " " + events[k].OEM);
                                                cname.push(events[k].OEM);
                                            }
                                        }
                                        console.log(dname[counter] + " " + cname[counter] + " ")
                                        events.push({
                                            time_stamp: timestamp[counter],
                                            OEM: cname[counter],
                                            vnetDesignName: dname[counter],
                                            company_name: cpname[count],
                                            Action: actoin[counter],
                                            value: value[counter],
                                            BlockNumber: BlockNumber[counter]

                                        });
                                        if (count == _event.length - 1) {
                                            l = sortJsonArray(events, 'vnetDesignName')
                                            return res.status(200).json(l);
                                        } else {
                                            count++
                                            counter++;
                                        }

                                    });
                                }
                            });

                    } else {
                        counter++;
                    }
                })
            }


        });

});

module.exports = router;
