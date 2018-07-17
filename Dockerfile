FROM node:9
WORKDIR /usr/app

ADD server ./server

ADD ethereum/geth-linux-amd64-1.8.7-66432f38/geth .
ADD ethereum/testnet ./testnet
ADD scripts/start.sh .

RUN ./geth --datadir testnet/node1 init testnet/testnet.json

WORKDIR /usr/app/server

RUN npm install

EXPOSE 8282
EXPOSE 8383
EXPOSE 3010

WORKDIR /usr/app

CMD ./start.sh
