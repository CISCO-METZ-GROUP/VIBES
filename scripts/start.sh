#!/usr/bin/env bash

nohup ./geth --datadir testnet/node1 --mine --unlock "0" --password "./testnet/node1/password" > /dev/null 2>&1 &
node server/app.js