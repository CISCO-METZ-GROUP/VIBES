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
    const topo = req.body.topo;
    const name = req.body.name;
    const tempName = stringToHex.stringToArray(name);
    const cname = stringToHex.stringToArray(req.body.cname);
    
    contract.methods.addData(topo,tempName[0], cname[0]).send({
        from: from,
        gas: gas,
        gasPrice: gasPrice
    }).on('receipt', function (_receipt) {
        const newDesignList = [];
        const receipt = {
            receipt: {
                blockHash: _receipt.blockHash,
                blockNumber: _receipt.blockNumber,
                transactionHash: _receipt.transactionHash,
                transactionIndex: _receipt.transactionIndex,
                contractAddress: _receipt.to,
                status: _receipt.status,
                from: _receipt.from,
                gasUsed: _receipt.gasUsed,
                newDesign: newDesignList
            }
        };
        const event_list = _receipt.events.newDesign;
        console.log(_receipt);
        if (event_list !== undefined ) {
            if (event_list instanceof Array) {
                for (let i = 0; i < event_list.length; i++) {
                    newDesignList.push({
                        index: event_list[i].logIndex,
                        returnValues: {
                            datanumber: event_list[i].returnValues.datanumber
                        }
                    })
                }
            } else {
                newDesignList.push({
                    index: event_list.logIndex,
                    returnValues: {
                        datanumber: event_list.returnValues.datanumber,
                        DesignName: stringToHex.arrayToString(event_list.returnValues.name),
                        OEMName: stringToHex.arrayToString(event_list.returnValues.cname)
                    }
                })
            }
        }
        
        return res.status(200).json(receipt);
    }).on('error', function (error) {
        return next(new Error(error));
    });
});

module.exports = router;
