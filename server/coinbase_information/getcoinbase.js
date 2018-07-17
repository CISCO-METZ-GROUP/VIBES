const fs   = require('fs');
const yaml = require('js-yaml');
const path = require('path');



class Account {
    constructor(account, password) {
        this.account = account;
        this.password = password;
    }
}

function getCoinBase() {
    const ymlPath = path.join(__dirname, 'coinbase.yml');
    const doc = yaml.safeLoad(fs.readFileSync(ymlPath, 'utf8'));
    return new Account(doc.account, doc.password);
}

exports.getCoinBase = getCoinBase;
