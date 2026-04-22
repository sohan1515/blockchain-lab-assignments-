# 📌 Assignment 5: DAO Smart Contract

## 🎯 Overview

This assignment implements a **Simple DAO (Decentralized Autonomous Organization)** smart contract in Solidity. A DAO is a blockchain-based organization governed by smart contracts and community voting rather than a central authority.

### What is a DAO?

A **Decentralized Autonomous Organization (DAO)** is:
- **Decentralized**: No single person or entity has control
- **Autonomous**: Runs automatically through smart contracts
- **Organization**: Members vote on proposals and decisions
- **Transparent**: All transactions and votes are recorded on-chain
- **Democratic**: One address = one vote (in this simplified version)

**Real-world examples**: Uniswap DAO, MakerDAO, Aave

---

## 🔄 DAO Workflow

### Step 1: 📝 Proposal Creation
**What happens**: Any member can create a proposal
- Proposer writes a title and description
- Proposal gets a unique ID
- Voting deadline is set (3 days from creation)
- ProposalCreated event is emitted

```
User calls createProposal("Increase marketing budget", "Allocate 100 ETH for marketing...")
↓
Proposal ID: 0
Title: "Increase marketing budget"
Proposer: 0xABC123...
Deadline: Current timestamp + 3 days
```

### Step 2: 🗳️ Voting Phase
**What happens**: Members vote YES or NO on the proposal
- Each address can vote only ONCE per proposal
- Votes are counted in real-time
- Voting continues until deadline
- Voted event is emitted for each vote

```
Member 1 calls vote(0, true)   → YES vote counted
Member 2 calls vote(0, false)  → NO vote counted
Member 3 calls vote(0, true)   → YES vote counted
↓
Final: 2 YES votes, 1 NO vote
```

### Step 3: ⚙️ Execution
**What happens**: After voting deadline, proposal is executed
- Anyone can execute the proposal
- Smart contract compares YES vs NO votes
- If YES > NO → Proposal PASSES
- If NO ≥ YES → Proposal FAILS
- ExecutedProposal event is emitted with results

```
After 3 days, someone calls executeProposal(0)
↓
YES votes: 2
NO votes: 1
Result: PASSED ✅
↓
Smart contract can now execute the approved action
```

---

## 🗳️ Voting Mechanism Explained

### How Voting Works

1. **One Vote Per Person**: Each blockchain address can only vote once per proposal
   ```solidity
   require(!hasVoted[_proposalId][msg.sender], "Already voted");
   hasVoted[_proposalId][msg.sender] = true;
   ```

2. **Vote Counting**: Votes are stored and counted
   ```solidity
   if (_vote) {
       proposal.yesVotes++;
   } else {
       proposal.noVotes++;
   }
   ```

3. **Vote Validation**: Checks ensure fair voting
   - Proposal must exist
   - Voting period must still be open
   - Voter hasn't already voted
   - Proposal hasn't been executed

4. **Proposal Outcome**:
   ```
   If YES votes > NO votes → Proposal PASSES ✅
   Otherwise → Proposal FAILS ❌
   ```

### Vote Storage (Data Structure)

```solidity
// Track votes per proposal per voter
mapping(uint256 => mapping(address => bool)) public hasVoted;

// Example:
// hasVoted[0][0xABC...] = true   (Member voted on proposal 0)
// hasVoted[1][0xDEF...] = true   (Member voted on proposal 1)
```

---

## 📋 Proposal Creation Explained

### How to Create a Proposal

**Function**: `createProposal(string _title, string _description)`

**Parameters**:
- `_title`: Brief name of the proposal (e.g., "Increase marketing budget")
- `_description`: Detailed explanation (e.g., "We should allocate 100 ETH for Q2 marketing campaign")

**What the contract does**:
1. Validates title and description are not empty
2. Creates a new Proposal with:
   - Unique ID (proposalCount)
   - Proposer address
   - Current timestamp
   - Deadline (current time + 3 days)
   - Initial vote counts (0 YES, 0 NO)
3. Increments proposalCount
4. Emits ProposalCreated event

**Example**:
```
createProposal(
    "Add new feature",
    "Implement dark mode in the DAO interface"
)
```

---

## 📊 Data Structures

### Proposal Struct
```solidity
struct Proposal {
    uint256 id;                    // Unique ID
    string title;                  // Proposal name
    string description;            // Detailed description
    address proposer;              // Who created it
    uint256 creationTime;          // When it was created
    uint256 deadline;              // When voting ends
    uint256 yesVotes;              // Count of YES votes
    uint256 noVotes;               // Count of NO votes
    bool executed;                 // Has it been executed?
    bool passed;                   // Did it pass?
}
```

### Main Mappings
```solidity
mapping(uint256 => Proposal) proposals;           // All proposals
mapping(uint256 => mapping(address => bool)) hasVoted;  // Voting records
```

---

## 🔧 Smart Contract Functions

### Create Functions
| Function | Purpose | Returns |
|----------|---------|---------|
| `createProposal(title, description)` | Create new proposal | Emits ProposalCreated |

### Voting Functions
| Function | Purpose | Returns |
|----------|---------|---------|
| `vote(proposalId, vote)` | Cast a vote (true=YES, false=NO) | Emits Voted |
| `executeProposal(proposalId)` | Execute after deadline | Emits ExecutedProposal |

### View Functions
| Function | Purpose | Returns |
|----------|---------|---------|
| `getProposal(proposalId)` | Get proposal details | Proposal struct |
| `isVotingOpen(proposalId)` | Check if voting still open | Boolean |
| `getVoteCount(proposalId)` | Get current vote counts | (yesVotes, noVotes) |
| `getTotalProposals()` | Get total proposals created | uint256 |

---

## 📥 Deployment Instructions

### Option 1: Using Remix IDE (Web-Based, Easiest)

**Step 1**: Open Remix
- Go to https://remix.ethereum.org
- Create new file: Click "Create New File" button

**Step 2**: Copy the Contract
- Copy all code from `DAO.sol`
- Paste into Remix editor
- File will auto-compile

**Step 3**: Deploy the Contract
```
1. Click "Solidity Compiler" tab (left sidebar)
2. Select compiler version 0.8.0 or higher
3. Click "Compile DAO.sol"
4. Click "Deploy & Run Transactions" tab
5. Select "Injected Provider" or "JavaScript VM" as Environment
6. Click "Deploy" button
7. Contract deployed! You'll see it in "Deployed Contracts"
```

**Step 4**: Interact with Contract
```
In "Deployed Contracts" section:

CREATE PROPOSAL:
1. Find "createProposal" function
2. Enter title: "Increase Treasury"
3. Enter description: "Add funds to community treasury"
4. Click "transact" button
5. See ProposalCreated event in logs

VOTE:
1. Find "vote" function
2. Enter proposalId: 0
3. Enter vote: true (for YES)
4. Click "transact"
5. See Voted event in logs

EXECUTE:
1. Wait for deadline to pass (3 days)
2. Find "executeProposal" function
3. Enter proposalId: 0
4. Click "transact"
5. See ExecutedProposal event with results
```

---

### Option 2: Using Hardhat (Local Development, Recommended for Testing)

**Step 1**: Setup Hardhat Project
```bash
# Create project directory
mkdir dao-project
cd dao-project

# Initialize npm project
npm init -y

# Install Hardhat
npm install --save-dev hardhat

# Create Hardhat project
npx hardhat
# Select: "Create a JavaScript project"
# Accept all defaults
```

**Step 2**: Add the Contract
```bash
# Copy DAO.sol to contracts folder
cp DAO.sol contracts/
```

**Step 3**: Compile
```bash
npx hardhat compile
```

**Step 4**: Create Deployment Script
Create file: `scripts/deploy.js`
```javascript
async function main() {
    const DAO = await ethers.getContractFactory("SimpleDAO");
    const dao = await DAO.deploy();
    await dao.deployed();
    console.log("DAO deployed to:", dao.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

**Step 5**: Deploy to Local Network
```bash
# Start local blockchain
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.js --network localhost
```

---

## 📸 Example Transactions

### Example 1: Create a Proposal

**Action**: User creates a proposal for team voting

```
Function: createProposal
Parameters:
  - title: "Allocate 100 ETH for Development"
  - description: "Fund development team for Q2 2024"

Result:
  - Proposal ID: 0
  - Status: ✅ Created
  - Voting Deadline: April 24, 2024 (3 days from now)
```

**Event Log**:
```
ProposalCreated
  - proposalId: 0
  - title: "Allocate 100 ETH for Development"
  - proposer: 0x742d35Cc6634C0532925a3b844Bc2e7aa3a5D...
  - deadline: 1713960000 (Unix timestamp)
```

---

### Example 2: Members Vote

**User 1 - Votes YES**
```
Function: vote(0, true)
Status: ✅ Vote Recorded
Event:
  Voted - proposalId: 0, voter: 0x123..., vote: YES
  Current: 1 YES, 0 NO
```

**User 2 - Votes NO**
```
Function: vote(0, false)
Status: ✅ Vote Recorded
Event:
  Voted - proposalId: 0, voter: 0x456..., vote: NO
  Current: 1 YES, 1 NO
```

**User 3 - Votes YES**
```
Function: vote(0, true)
Status: ✅ Vote Recorded
Event:
  Voted - proposalId: 0, voter: 0x789..., vote: YES
  Current: 2 YES, 1 NO
```

---

### Example 3: Execute Proposal

**Action**: After 3 days, proposal is executed

```
Function: executeProposal(0)

Before:
  - Proposal Status: Active
  - YES Votes: 2
  - NO Votes: 1

After:
  - Proposal Status: ✅ EXECUTED
  - Result: PASSED ✅
  - Final Votes: 2 YES > 1 NO
```

**Event Log**:
```
ExecutedProposal
  - proposalId: 0
  - passed: true
  - yesVotes: 2
  - noVotes: 1
```

---

## 🧪 Test Cases

### Test Scenario 1: Create Proposal
```javascript
it("Should create a proposal", async () => {
    await dao.createProposal("Test", "Description");
    const proposal = await dao.getProposal(0);
    expect(proposal.title).to.equal("Test");
});
```

### Test Scenario 2: Vote YES
```javascript
it("Should vote YES on proposal", async () => {
    await dao.createProposal("Test", "Description");
    await dao.vote(0, true);
    const [yes, no] = await dao.getVoteCount(0);
    expect(yes).to.equal(1);
    expect(no).to.equal(0);
});
```

### Test Scenario 3: Vote NO
```javascript
it("Should vote NO on proposal", async () => {
    await dao.createProposal("Test", "Description");
    await dao.vote(0, false);
    const [yes, no] = await dao.getVoteCount(0);
    expect(yes).to.equal(0);
    expect(no).to.equal(1);
});
```

### Test Scenario 4: Prevent Double Voting
```javascript
it("Should not allow voting twice", async () => {
    await dao.createProposal("Test", "Description");
    await dao.vote(0, true);
    await expect(dao.vote(0, true)).to.be.revertedWith("Already voted");
});
```

### Test Scenario 5: Execute Passing Proposal
```javascript
it("Should execute passing proposal", async () => {
    await dao.createProposal("Test", "Description");
    await dao.vote(0, true);
    // Wait for deadline
    await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60).toString(16)]);
    await dao.executeProposal(0);
    const proposal = await dao.getProposal(0);
    expect(proposal.passed).to.be.true;
});
```

---

## 🔑 Key Concepts Explained

### Smart Contract
- Code that runs on blockchain
- Executes exactly as written
- Cannot be changed after deployment
- Automates DAO decisions

### Solidity
- Programming language for Ethereum
- Similar to JavaScript syntax
- Runs on blockchain

### Gas
- Cost to execute transactions
- Measured in wei (smallest ETH unit)
- More complex operations = more gas

### Events
- Logs that are permanent on blockchain
- Help track what happened
- Allow frontend to see updates

### Voting Power
- In this version: 1 address = 1 vote
- Could be enhanced with token-based voting
- More tokens = more voting power

---

## 📚 Resources

- [Ethereum Docs](https://ethereum.org/en/developers/docs/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

## ✅ Checklist for Submission

- [x] Smart contract with all required features
- [x] Proposal creation functionality
- [x] Voting mechanism
- [x] Execution logic
- [x] Detailed comments in code
- [x] Structs defined (Proposal)
- [x] Mappings for data storage
- [x] Events for logging
- [x] View functions
- [x] Input validation with require()
- [x] README with workflow explanation
- [x] Deployment instructions (Remix & Hardhat)
- [x] Example transactions documented
- [x] Test cases included

---

## 📞 Troubleshooting

### Contract won't compile
- Check Solidity version matches pragma
- Ensure no syntax errors in code
- Verify all brackets are closed

### Transaction fails
- Check you have enough gas
- Verify proposal ID exists
- Make sure voting deadline hasn't passed
- Confirm you haven't already voted

### Can't see events
- Check Remix console/logs
- Make sure transaction was successful
- Look for contract address in deployment
- Verify event name matches code

---

**Author**: Blockchain Student
**Created**: April 2024
**Assignment**: DAO Smart Contract Implementation
