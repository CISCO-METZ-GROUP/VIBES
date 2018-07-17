const utf8 = require("utf8");

function stringToUTF8InByte32HexArrays(_string) {
    let hex = string2Hex(_string);
    const byte32Array = [];
    const count = Math.floor(hex.length / 64);
    const needResidual = hex.length % 64;
    const residual = 64 - needResidual;
    let addon = 0;
    if (needResidual > 0) {
        for (let j = 0; j < residual; j++) {
            hex += "0";
        }
        addon = 1;
    }
    for (let i = 0; i < count + addon; i++) {
        byte32Array.push("0x" + hex.slice(i * 64, i * 64 + 64));
    }
    return byte32Array;
}

function byte32HexArraysToString(byteArray) {
    let str = '';
    for (let i = 0; i < byteArray.length; i ++) {
        if (byteArray[i].slice(0, 2) === "0x") {
            str += byteArray[i].slice(2, byteArray[i].length);
        } else {
            str += byteArray[i];
        }
    }
    return hexToString(str);
}

function string2Hex(string) {
    const utf8String = utf8.encode(string),
        charList = utf8String.split('');
    let hexString = '';
    for (let i = 0; i < charList.length; i++) {
        hexString += charList[i].charCodeAt(0).toString(16);
    }
    return hexString;
}

function hexToString(hexString) {
    if (hexString.slice(0, 2) === "0x") {
        hexString = hexString.slice(2, hexString.length);
    }
    const uintArray = [];
    for (let i = 0; i < hexString.length - 1; i += 2) {
        uintArray.push(parseInt(hexString.slice(i, i + 2), 16));
    }
    const encodedString = String.fromCharCode.apply(null, uintArray);
    const decoded = utf8.decode(encodedString);
    return decoded.slice(0, decoded.indexOf("\u0000"));
}

exports.stringToArray = stringToUTF8InByte32HexArrays;
exports.arrayToString = byte32HexArraysToString;
exports.zero = "0x0000000000000000000000000000000000000000000000000000000000000000";
