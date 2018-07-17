const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const stringToHex = require('../utils/string-to-hex');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const ivnInfo = require('../VIBES-contract/get-topo-info');
const router = express.Router();
let results = []
var W3CWebSocket = require('websocket').w3cwebsocket;
var client = new W3CWebSocket('ws://localhost:8383/', 'echo-protocol');
var Switch = false;
var currentV = undefined;
const eventDetails = [];

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8383 });

router.post('/', function (req, res, next) {
    const address = req.body.address !== undefined ? req.body.address : ivnInfo.getVibesAddress();
    if (address === undefined || address.length !== 42) {
        return next(new Error("Expected an 'address' json object with 20 bytes long hex string specifying the contract address"));
    }
    const contract = new web3.eth.Contract(ivnInfo.getVibesABI(), address);
    const event = contract.events.newVerdict();
    subscribe(event);
    succeful = "succeful"
    return res.status(200).json({ Subscribe: succeful });

});


function subscribe(event) {
    wss.on('connection', function connection(ws) {
        event.subscribe(function (error, result) {
            if (!error) {
                if (result.returnValues[2] != currentV) {
                    Switch = true;
                }
                if (Switch) {
                    let t1name = [];
                    let dname = [];
                    let verdict = []

                    t1name = stringToHex.arrayToString(result.returnValues[0]);
                    dname = stringToHex.arrayToString(result.returnValues[1]);
                    verdict = stringToHex.arrayToString(result.returnValues[3]);


                    results = ({
                        T1name: t1name,
                        VNETDesignName: dname,
                        Verdict: verdict
                    });

                    currentV = result.returnValues[2];

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
