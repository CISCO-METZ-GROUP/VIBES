const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const router = express.Router();
var sortJsonArray = require('sort-json-array');
var S, S1 = false;
router.post('/', function (req, res, next) {
    const from = account.account;
    const gas = 4700000;
    const gasPrice = 18000000000;
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    let temp = [];
    var count = 0;
    let events = [];
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    contract.getPastEvents('newDesign', {
        fromBlock: 0,
        toBlock: 'latest'
    },
        function (error, event) {
            for (i = 0; i < event.length; i++) {
                const data = [];
                let timestamp = [];
                const returnV = [];
                returnV.push(event[i].returnValues[0]);
                let blockNum = event[i].blockNumber;
                const verdict = [];
                const designName = [];
                designName.push(stringToHex.arrayToString(event[i].returnValues[1]));
                contract.methods.getData(returnV[0]).call({
                    from: from,
                    gas: gas,
                    gasPrice: gasPrice
                }).then(function (_Result) {
                    data.push(JSON.parse(_Result));
                    contract.methods.getVerdict(returnV[0], 0).call({
                        from: from,
                        gas: gas,
                        gasPrice: gasPrice
                    }).then(function (Result) {
                        verdict.push(stringToHex.arrayToString(Result));
                        web3.eth.getBlock(blockNum).then(function (_result) {
                            timestamp.push(_result.timestamp);
                            temp = {
                                Event: {
                                    DesignName: designName[0],
                                    timestamp: timestamp[0],
                                    Design: data[0],
                                    Verdict: verdict[0]
                                }
                            };
                            console.log(count + " " + data);

                            console.log(count + " " + verdict);
                            events.push(temp);
                            if (count == event.length - 1) {
                                return res.status(200).json(events);
                            }
                            count++;
                        })
                    })
                });
            }
        })
});

module.exports = router;
