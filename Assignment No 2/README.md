# Assignment 2: Polygon Deployment

## Objective

This project demonstrates a complete smart contract deployment to Polygon Mumbai Testnet using Hardhat and Solidity. The SimpleStorage contract stores and retrieves a uint256 value, emitting events on value changes.

## Tools Used

- **Solidity** (^0.8.0) - Smart contract programming language
- **Hardhat** - Ethereum development environment
- ** ethers.js** - Library for interacting with Ethereum
- **Polygon Mumbai** - Testnet for Polygon blockchain
- **MetaMask** - Crypto wallet for browser
- **PolygonScan** - Block explorer for Polygon

## Project Structure

```
polygon-deployment/
├── contracts/
│   └── SimpleStorage.sol    # Smart contract
├── scripts/
│   └── deploy.js            # Deployment script
├── .env.example             # Environment variables template
├── hardhat.config.js        # Hardhat configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Prerequisites

Before starting, make sure you have:
- Node.js installed (v14 or higher)
- A MetaMask wallet
- Basic understanding of blockchain

## Deployment Steps

### Step 1: Install Dependencies

Open your terminal and run:

```bash
npm install
```

This installs all required packages (Hardhat, ethers.js, dotenv).

### Step 2: Configure Environment Variables

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your values:

- **PRIVATE_KEY**: Export from MetaMask
  - Open MetaMask
  - Click account icon > Account Details
  - Click "Export Private Key"
  - Enter password and copy key (without 0x prefix)

- **POLYGON_RPC_URL**: Use public RPC or get from Alchemy/Infura
  - Public: `https://rpc.mumbai.polygonscan.com`

- **POLYGONSCAN_API_KEY**: Get free key from https://polygonscan.com/

### Step 3: Compile the Contract

```bash
npx hardhat compile
```

This compiles your Solidity contract to bytecode.

### Step 4: Deploy to Mumbai Testnet

```bash
npx hardhat run scripts/deploy.js --network polygonMumbai
```

If successful, you'll see the contract address in the terminal.

## MetaMask Setup

### Adding Polygon Mumbai Network

1. Open MetaMask
2. Click "Add Network"
3. Enter these details:

| Field | Value |
|-------|-------|
| Network Name | Polygon Mumbai |
| New RPC URL | https://rpc.mumbai.polygonscan.com |
| Chain ID | 80001 |
| Currency Symbol | MATIC |
| Block Explorer | https://mumbai.polygonscan.com |

4. Click Save

### Getting Test MATIC

1. Visit: https://faucet.polygon.technology/
2. Paste your MetaMask wallet address
3. Wait for MATIC to arrive (may take a few minutes)

## Contract Address

After deployment, your contract address will appear here:

```
Contract Address: [PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS]
```

Example: `0x1234567890abcdef1234567890abcdef12345678`

## Verification on PolygonScan

### Why Verify?

Verifying your contract:
- Shows your source code on PolygonScan
- Users can read your contract
- Builds trust in your project

### How to Verify

1. Go to https://mumbai.polygonscan.com/
2. Search for your contract address
3. Click "Contract" > "Verify and Publish"
4. Fill in:
   - Contract address
   - Solidity code (SimpleStorage.sol)
   - Compiler version: v0.8.0
   - License: MIT
5. Click Verify

### Verification Links

- Transaction: `https://mumbai.polygonscan.com/tx/YOUR_TX_HASH`
- Contract: `https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS`

## Screenshots Guide

Take screenshots at these points:

### 1. Terminal Deployment Success

After running deploy, capture:
- Terminal showing "DEPLOYMENT SUCCESSFUL!"
- Contract address displayed
- Network name (polygonMumbai)

### 2. PolygonScan Transaction

After verification, capture:
- Contract page on PolygonScan
- Source code visible
- Read/Write contract buttons working

## Understanding the Contract

### SimpleStorage.sol

```
- stores a uint256 value
- only owner can change the value
- emits ValueChanged event on update
- getValue() returns the stored value
```

Key functions:
- `setValue(uint256 _value)` - Store a new value (owner only)
- `getValue()` - Retrieve the current value

### Events

- `ValueChanged(uint256 newValue)` - Emitted when value updates

## Common Issues

### "Insufficient funds"
- Get more MATIC from faucet
- Check your wallet balance

### "Transaction rejected"
- Increase gas limit in MetaMask
- Check network settings

### "Private key error"
- Make sure .env has no quotes around the key
- Don't include "0x" prefix

## Conclusion

This project shows the complete lifecycle of:
1. Writing a Solidity smart contract
2. Configuring Hardhat for Polygon
3. Deploying to Mumbai Testnet
4. Interacting via MetaMask
5. Verifying on PolygonScan

The SimpleStorage contract is now live on Polygon Mumbai Testnet and anyone can interact with it through PolygonScan.

## License

MIT