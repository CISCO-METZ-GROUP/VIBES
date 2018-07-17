const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const router = express.Router();
let results = [];

var Switch = false;
var currentV = undefined;
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8282 });

router.post('/', function (req, res, next) {
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    const event = contract.events.newDesign();
    subscribe(event);
    succeful = "succeful"
    return res.status(200).json({ Subscribe: succeful });

});

function subscribe(event) {
    wss.on('connection', function connection(ws) {
        event.subscribe(function (error, result) {
            if (!error) {
                if (result.returnValues[0] != currentV) {
                    Switch = true;
                }
                if (Switch) {
                    let t1name = [];
                    let dname = [];
                    let verdict = []

                    dname = stringToHex.arrayToString(result.returnValues[1]);
                    cname = stringToHex.arrayToString(result.returnValues[2]);


                    results = ({
                        OEM: cname,
                        VNETDesignName: dname
                    });
                    currentV = result.returnValues[0];

                    ws.send(JSON.stringify(results));


                    Switch = false;
                }
            } else {
                console.log(error);
            }
        });
    })
}

module.exports = router;
