# Blockchain Lab Assignments

## Student Details

* Name: Sohan Metil
* Roll Number: 123B1B190
* Course: Blockchain Technology Lab

---

## Overview

This repository contains all blockchain lab assignments. Each assignment focuses on different concepts such as smart contracts, deployment, Web3 integration, decentralized storage, and DAO implementation.

---

## Tech Stack

* Solidity
* Hardhat
* JavaScript / React
* ethers.js
* MetaMask
* IPFS

---

## How to Run

### Install dependencies

```bash
npm install
```

### Compile contract

```bash
npx hardhat compile
```

### Deploy contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## Assignment 1: Smart Contract Development

### Objective

To create and deploy a basic smart contract using Solidity.

### Description

A simple contract is created to store and retrieve data on the blockchain.

### Functions

* setData() → stores value
* getData() → retrieves value

### Steps

1. Write contract in Solidity
2. Compile using Hardhat
3. Deploy locally

### Output

* Contract deployed successfully
* Data stored and retrieved

---

## Assignment 2: Polygon Deployment

### Objective

Deploy smart contract on Polygon testnet.

### Network Used

* Polygon Mumbai Testnet

### Steps

1. Configure network in Hardhat
2. Add private key and RPC URL
3. Deploy contract

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### Output

* Contract deployed successfully
* Transaction visible on explorer

### Contract Address

0xFb420D0066301a26eA10b215636c705720C9Cd8A 

---

## Assignment 3: Web Interface + MetaMask

### Objective

Connect frontend with blockchain using MetaMask.

### Description

A web interface is created where users can connect their wallet and perform transactions.

### How It Works

* Frontend uses ethers.js
* MetaMask connects wallet
* Transactions are signed and sent

### Features

* Wallet connection
* Balance display
* Transaction execution

### Output

* Wallet connected successfully
* Transactions completed

---

## Assignment 4: IPFS Integration

### Objective

Store and retrieve files using IPFS.

### Description

Files are uploaded to IPFS and accessed using CID.

### IPFS Tool Used

* IPFS Desktop
* ipfs-http-client

### Code Example

```javascript
const result = await ipfs.add(file);
console.log(result.path);
```

### Process

1. Upload file
2. Get CID
3. Retrieve file using CID

### Output

* File uploaded successfully
* CID generated

---

## Assignment 5: DAO Smart Contract

### Objective

Build a DAO with voting and proposal system.

### Description

A smart contract allows users to create proposals and vote.

### Proposal Creation

Users can create proposals with details.

### Voting Mechanism

Members vote on proposals and majority decides the result.

### Workflow

1. Deploy contract
2. Create proposal
3. Vote
4. Execute result

### Output

* DAO deployed successfully
* Voting completed
* Results executed

---

## Screenshots

* Assignment 1: Compilation and Deployment
* Assignment 2: Polygon Deployment
* Assignment 3: Wallet Connection and Transaction
* Assignment 4: IPFS Upload and CID
* Assignment 5: DAO Execution

---

## Conclusion

This lab helped in understanding blockchain development including smart contracts, decentralized applications, storage systems, and DAO governance.

---

## Notes

* Code is written independently
* Screenshots are included
* Repository is public and structured properly
