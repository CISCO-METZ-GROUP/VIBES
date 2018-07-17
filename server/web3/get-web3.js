let web3 = undefined;
let Web3 = require("web3");
let net = require('net');

function getWeb3() {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        return web3;
    } else {
        web3 = new Web3(new Web3.providers.IpcProvider("/usr/app/testnet/node1/geth.ipc", net));
        return web3;
    }
}

exports.getWeb3 = getWeb3;
