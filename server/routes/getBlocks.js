const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const router = express.Router();
let Switch = false;
var sortJsonArray = require('sort-json-array');

router.post('/', function (req, res, next) {
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    const events = [];
    let count = 0;

    web3.eth.getBlockNumber()
        .then(function (result) {
            var blocknumber = result;
            for (i = 0; i < 10; i++) {
                web3.eth.getBlock((blocknumber - i)).then(function (_result) {
                    temp = {
                        Block: {
                            BlockNumber: _result.number,
                            time_stamp: _result.timestamp,
                            size: _result.size,
                            nonce: _result.nonce,
                            Transactions: _result.transactions,
                            miner: _result.miner,
                            gasUsed: _result.gasUsed,
                            gasLimit: _result.gasLimit,
                            current_block_hash: _result.hash
                        }
                    }
                    console.log(temp);
                    events.push(temp);
                    if (count == 9) {
                        l = sortJsonArray(events, 'BlockNumber')

                        return res.status(200).json(l);
                    }else{
                        count++;
                    }

                });
            }

        });
  
});

module.exports = router;
