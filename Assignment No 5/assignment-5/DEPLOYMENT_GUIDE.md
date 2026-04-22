# 🚀 DAO Smart Contract Deployment Guide

## Complete Step-by-Step Instructions

### 📋 Table of Contents
1. [Using Remix IDE (Easiest)](#remix-ide)
2. [Using Hardhat (Local Development)](#hardhat)
3. [Using Truffle (Alternative)](#truffle)
4. [Common Issues & Solutions](#troubleshooting)

---

## 🌐 Remix IDE

**Difficulty Level**: ⭐⭐ (Easy)
**Best For**: Beginners, quick testing, no local setup needed

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- MetaMask wallet (optional, for testnet deployment)

### Step-by-Step Guide

#### Step 1: Open Remix
```
1. Go to https://remix.ethereum.org
2. You'll see the Remix IDE homepage
3. Click on "Create New File" in the left sidebar
4. Name it: DAO.sol
```

#### Step 2: Copy Contract Code
```
1. Open DAO.sol from this folder
2. Copy ALL the code
3. Paste it into the Remix editor
4. The file will auto-compile (watch the compiler icon)
```

#### Step 3: Compile the Contract
```
1. Click on "Solidity Compiler" tab (left sidebar)
   - It looks like a file with text
   
2. In the compiler settings:
   - Compiler Version: Select 0.8.20 or any 0.8.x version
   - EVM Version: Leave as default
   
3. Click blue "Compile DAO.sol" button
   - You should see a green checkmark
   - If you see red X, there's an error (unlikely with provided code)
```

#### Step 4: Deploy the Contract
```
1. Click "Deploy & Run Transactions" tab (left sidebar)
   - It looks like a computer/server icon

2. Configuration:
   - Environment: Select "JavaScript VM" (for testing) or "Injected Provider" (for testnet)
   - Account: Shows your current account
   - Gas limit: Leave as default
   
3. Under "Contract" dropdown:
   - Select "SimpleDAO"
   
4. Click orange "Deploy" button
   - Wait for confirmation
   - You'll see the deployed contract in "Deployed Contracts"
```

#### Step 5: Interact with the Contract

**CREATE A PROPOSAL**
```
1. In "Deployed Contracts" section, expand "SimpleDAO"
2. Find the "createProposal" function
3. Enter parameters:
   - _title (string): "Increase Treasury Budget"
   - _description (string): "Allocate 500 ETH for community development"
4. Click "transact" button
5. Transaction is sent! Check the console for events
```

**VOTE ON THE PROPOSAL**
```
1. Find the "vote" function
2. Enter parameters:
   - _proposalId (uint256): 0
   - _vote (bool): true (for YES) or false (for NO)
3. Click "transact" button
4. Your vote is recorded!
```

**EXECUTE THE PROPOSAL**
```
1. Find the "executeProposal" function
2. Enter parameter:
   - _proposalId (uint256): 0
3. IMPORTANT: Voting must be finished (3 days must pass)
   - In JavaScript VM, you can manually set time
   - Go to the bottom, find "block" number input
   - Change timestamp
4. Click "transact" button
5. Proposal executed!
```

**VIEW PROPOSAL DETAILS**
```
1. Find "getProposal" view function
2. Enter: 0 (for proposal ID)
3. Click "call" button
4. You'll see all proposal details returned
```

### 🖼️ Remix UI Screenshots Guide

**Where to find things:**
- Left Sidebar: File explorer (top), Compiler (2nd), Deploy (3rd)
- Center: Code editor
- Bottom: Console/output
- Right: Settings

---

## 💻 Hardhat (Local Development)

**Difficulty Level**: ⭐⭐⭐ (Intermediate)
**Best For**: Development, testing, automation

### Prerequisites
- Node.js (v12 or higher): https://nodejs.org/
- npm (comes with Node.js)
- Code editor (VS Code recommended)
- Terminal/Command Prompt

### Complete Installation Guide

#### Step 1: Create Project Directory
```bash
# Create folder
mkdir dao-project
cd dao-project

# Initialize npm
npm init -y
```

#### Step 2: Install Hardhat
```bash
# Install Hardhat as dev dependency
npm install --save-dev hardhat

# Initialize Hardhat project
npx hardhat

# When prompted, select:
# ✓ Create a JavaScript project
# ✓ Accept defaults for everything
```

#### Step 3: Install Required Dependencies
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-network-helpers
```

#### Step 4: Add the Contract
```bash
# Copy DAO.sol to contracts folder
cp DAO.sol contracts/

# Or manually:
# 1. Open contracts/ folder
# 2. Delete Counter.sol
# 3. Create DAO.sol
# 4. Paste the contract code
```

#### Step 5: Compile the Contract
```bash
npx hardhat compile

# You should see:
# Successfully compiled 1 Solidity file
```

#### Step 6: Run Tests
```bash
# Copy test file
cp DAO.test.js test/

# Run all tests
npx hardhat test

# You should see all 27 tests pass ✓
```

#### Step 7: Deploy Locally

**Create Deployment Script**

Create file: `scripts/deploy.js`
```javascript
async function main() {
    console.log("Deploying SimpleDAO...");
    
    const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
    const dao = await SimpleDAO.deploy();
    
    await dao.deployed();
    
    console.log("SimpleDAO deployed to:", dao.address);
    
    // Show functions available
    console.log("\nContract Functions Available:");
    console.log("- createProposal(title, description)");
    console.log("- vote(proposalId, vote)");
    console.log("- executeProposal(proposalId)");
    console.log("- getProposal(proposalId)");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

**Start Local Blockchain**
```bash
# Terminal 1: Start local blockchain node
npx hardhat node

# You'll see 20 test accounts with private keys
# Keep this running
```

**Deploy Contract**
```bash
# Terminal 2: Deploy to local blockchain
npx hardhat run scripts/deploy.js --network localhost

# You'll see:
# SimpleDAO deployed to: 0x5FbDB2315678afccb333f8a9c91ff5f
```

#### Step 8: Interactive Testing

**Create Interactive Script**

Create file: `scripts/interact.js`
```javascript
async function main() {
    const daoAddress = "0x5FbDB2315678afccb333f8a9c91ff5f"; // Use address from deploy
    const dao = await ethers.getContractAt("SimpleDAO", daoAddress);
    
    const [owner, voter1, voter2] = await ethers.getSigners();
    
    // Create proposal
    console.log("Creating proposal...");
    let tx = await dao.createProposal(
        "Budget Increase",
        "Allocate 100 ETH for development"
    );
    await tx.wait();
    console.log("✓ Proposal created!");
    
    // Vote
    console.log("Voting...");
    tx = await dao.vote(0, true);
    await tx.wait();
    console.log("✓ Owner voted YES");
    
    tx = await dao.connect(voter1).vote(0, true);
    await tx.wait();
    console.log("✓ Voter1 voted YES");
    
    tx = await dao.connect(voter2).vote(0, false);
    await tx.wait();
    console.log("✓ Voter2 voted NO");
    
    // Check votes
    let [yes, no] = await dao.getVoteCount(0);
    console.log(`\nCurrent votes: ${yes} YES, ${no} NO`);
    
    // Get proposal details
    let proposal = await dao.getProposal(0);
    console.log(`\nProposal Status:`);
    console.log(`- Title: ${proposal.title}`);
    console.log(`- Proposer: ${proposal.proposer}`);
    console.log(`- Executed: ${proposal.executed}`);
    console.log(`- Passed: ${proposal.passed}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

**Run Interaction Script**
```bash
# Terminal 2 (still in project directory):
npx hardhat run scripts/interact.js --network localhost

# You should see output showing successful interactions
```

---

## 🔗 Hardhat Configuration

**File: hardhat.config.js**

The default configuration should work, but here's what to know:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",  // Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // You can add testnets here later
    sepolia: {
      url: "YOUR_SEPOLIA_RPC_URL",
      accounts: ["YOUR_PRIVATE_KEY"],
    },
  },
};
```

---

## 🧪 Truffle Alternative

**Difficulty Level**: ⭐⭐ (Easy)
**Best For**: Alternative framework, similar to Hardhat

### Quick Setup
```bash
# Install Truffle
npm install -g truffle

# Create project
truffle init
cd truffle-project

# Copy contracts
cp DAO.sol contracts/

# Compile
truffle compile

# Deploy
truffle migrate
```

---

## 🌍 Deploy to Testnet (Sepolia)

### Step 1: Get Test ETH
```
1. Go to https://sepoliafaucet.com
2. Connect your MetaMask wallet
3. Request 0.5 ETH
4. Wait for confirmation (1-2 minutes)
```

### Step 2: Configure Hardhat
```
1. Create .env file:
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   PRIVATE_KEY=your_wallet_private_key
   
2. Install dotenv:
   npm install --save-dev dotenv
```

### Step 3: Update hardhat.config.js
```javascript
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### Step 4: Deploy
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🐛 Troubleshooting

### Issue 1: "Contract not compiling"
```
Solution:
- Check Solidity version is 0.8.0 or higher
- Look for red squiggly lines in editor
- Ensure all brackets { } are matched
- Check for typos in keyword names
```

### Issue 2: "Insufficient gas"
```
Solution:
- Increase gas limit in Remix settings
- For local network (Hardhat), gas is unlimited
- For testnet, make sure you have ETH
```

### Issue 3: "Voting period has not ended"
```
Solution:
- You must wait 3 days OR
- In Hardhat, use hardhat_mine to simulate time
- Example: await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)])
```

### Issue 4: "Account already voted"
```
Solution:
- Try voting from a different account
- In Remix, switch account in dropdown
- In Hardhat, use: dao.connect(differentAddress).vote(0, true)
```

### Issue 5: "No compiled contracts found"
```
Solution:
- Make sure you ran: npx hardhat compile
- Check contracts/ folder exists
- Verify DAO.sol is in contracts/ folder
```

### Issue 6: "Cannot find module 'hardhat'"
```
Solution:
- Make sure you're in project directory
- Run: npm install --save-dev hardhat
- Check node_modules exists
```

---

## ✅ Verification Checklist

- [ ] Contract compiles without errors
- [ ] Can create a proposal
- [ ] Can vote on proposal
- [ ] Can view proposal details
- [ ] Vote counts are correct
- [ ] Can execute proposal after deadline
- [ ] Events are emitted
- [ ] Multiple proposals work independently
- [ ] Cannot vote twice
- [ ] Tests all pass (27/27)

---

## 📞 Quick Reference

### Remix
```
URL: https://remix.ethereum.org
Compile: Solidity Compiler tab
Deploy: Deploy & Run Transactions tab
```

### Hardhat Commands
```bash
npx hardhat compile      # Compile contracts
npx hardhat test        # Run tests
npx hardhat node        # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### Common Function Calls
```javascript
// Create
await dao.createProposal("Title", "Description");

// Vote
await dao.vote(0, true);  // 0 = proposal ID, true = YES

// Execute
await dao.executeProposal(0);

// View
await dao.getProposal(0);
await dao.getVoteCount(0);
```

---

**Happy Deploying! 🚀**
