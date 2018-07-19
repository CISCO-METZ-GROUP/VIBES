# VIBES
Vehicular network designs In a Blockchain - Ethereum Solution

# Team
+ Noha Gazzaz (Lead Software Engineer) noha.gazzaz@gmail.com
+ Rohan Dhesikan
+ Abeer Khalid A Alshubat
+ Aishah Mohammed Najeeb Y Ayoub
+ Zhaoxing (Andrew) Li
+ Christopher Metz

# Content
* [Introduction](#introduction)
* [Solution](#solution)
* [Architecture](#architecture)
* [Usage](#usage)
* [Terminologies](#terminologies)
* [References](#references)

# Introduction
The automotive (OEM) supply chain relies upon efficient OEM management of their Tier1 (T1) suppliers and partners. In one example, the OEM will generate a VNET Design specification and send it to each T1 for validation. The desired outcome is consensus that all T1s can support the specification. Reaching consensus (for this and other validation scenarios) can be slow and costly if success depends on the centralized OEM system. Converting this to a web3 decentralized process can increase efficiency and save money.

# Solution
![Screen Shot](https://github.com/CISCO-METZ-GROUP/VIBES/blob/master/images/Solution.png)

# Architecture
![Screen Shot](https://github.com/CISCO-METZ-GROUP/VIBES/blob/master/images/Architecture.png)

# Usage
1. Install docker-ce on your computer.
2. Start the docker container:
```
sudo ./start_docker.sh
```
3. Consult `VIBES.postman_collection` for API usage details

# Ports
* VIBES Rest API exposed from port 3010
* "newDesign" WebSocket notifications exposed from port 8282
* "newVerdict" WebSocket notifications exposed from port 8383

# Terminologies
* **Blockchain:** It's a type of distributed ledger, across a decentralized network. It is able to make agreements across the whole network, without any central authority.
* **Ethereum:** It's a blockchain technology that could decentralize the internet by creating a platform where applications can be built and run on a decentralized network. Ethereum is fast and flexible without the inherent imitations of the bitcoin protocol.
* **Smart contract:** Scripts that are executed on a global network of public node -the EVM (Ethereum Virtual Machine)-
* **Ethereum node:** a blockchain-based, distributed computing platform that provides scripting functionality through smart contracts.
* **Web3:** It refers to the next generation of the worldwide web. It has been adopted by the Ethereum ecosystem and co-opt to refer to a decentralized web.
* **Web3js:** The Ethereum-compatible Javascript API. It consists of a collection of libraries which allows you to interact with a local or remote ethereum node, using a HTTP or IPC connection.
* **Solidity:** a contract-oriented, high-level language for implementing smart contracts. It was influenced by C++, Python and JavaScript and is designed to target the Ethereum Virtual Machine (EVM). 

# References
* https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2
* https://hackernoon.com/crossing-over-to-web3-an-introduction-to-decentralised-development-5eb09e95edb0
* https://github.com/ethereum/web3.js/
* https://codeburst.io/build-your-first-ethereum-smart-contract-with-solidity-tutorial-94171d6b1c4b
* https://codeburst.io/build-your-first-ethereum-smart-contract-with-solidity-tutorial-94171d6b1c4b
* https://modalduality.org/posts/puppeth/

# License
* Apache License 2.0

