const fs = require('fs');
const solc = require('solc');
const path = require('path');

const ymlPath = path.join(__dirname, 'vibes.sol');
const code = fs.readFileSync(ymlPath, 'utf-8');
const output = solc.compile(code.toString(), 1);

const vibesBytecode = output.contracts[':Vibes'].bytecode;
const vibesABI = JSON.parse(output.contracts[':Vibes'].interface);
let vibesAddress = undefined;


function getVibesABI() {
    return vibesABI;
}

function getVibesBytecode() {
    return vibesBytecode;
}

function getVibesAddress() {
    return vibesAddress;
}

function setVibesAddress(_vibesAddress) {
    vibesAddress = _vibesAddress;
}

exports.getVibesAddress = getVibesAddress;
exports.getVibesABI = getVibesABI;
exports.getVibesBytecode = getVibesBytecode;
exports.setVibesAddress = setVibesAddress;
