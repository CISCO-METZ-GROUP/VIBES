const express = require('express');
const web3 = require('../web3/get-web3').getWeb3();
const vibes = require('../VIBES-contract/get-topo-info');
const account = require('../coinbase_information/getcoinbase').getCoinBase();
const router = express.Router();

router.post('/', function (req, res, next) {
    const gas = 4700000;
    const gasPrice = 18000000000;
    const from = account.account;
    const contract = new web3.eth.Contract(vibes.getVibesABI());
    contract.deploy({ data: '0x' + vibes.getVibesBytecode() }).send(
        {
            from: from,
            gas: gas,
            gasPrice: gasPrice
        }).on('error', function (_error) {
            return next(new Error(_error));
        })
        .on('receipt', function (_receipt) {
            let libraryAddress = _receipt.contractAddress;
            const vibesBytecode = "0x" + vibes.getVibesBytecode();
            contract.deploy({ data: vibesBytecode }).send(
                {
                    from: from,
                    gas: gas,
                    gasPrice: gasPrice
                })

                .on('error', function (_error) {
                    return next(new Error(_error));
                })
                .on('receipt', function (receipt) {
                    vibes.setVibesAddress(receipt.contractAddress);
                    contract._address = vibes.getVibesAddress();
                    return res.json({
                        receipts: [
                            {
                                library: _receipt
                            },
                            {
                                vibes: receipt
                            }
                        ]
                    });
                });
        });
});

module.exports = router;
