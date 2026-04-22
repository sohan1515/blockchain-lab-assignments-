# 📖 Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### Using Remix (Easiest)
```
1. Go to https://remix.ethereum.org
2. Create new file: DAO.sol
3. Copy+paste code from DAO.sol file
4. Click Compile (Solidity Compiler tab)
5. Click Deploy (Deploy & Run Transactions tab)
6. Interact with deployed contract!
```

### Using Hardhat (Development)
```bash
mkdir dao && cd dao
npm init -y
npm install --save-dev hardhat
npx hardhat
# Select: Create JavaScript project
cp DAO.sol contracts/
cp DAO.test.js test/
npx hardhat compile
npx hardhat test
```

---

## 📋 Function Reference

### Create Proposal
```solidity
dao.createProposal(
    "Your Title",
    "Your Description"
)
```
**Parameters**: 
- title (string): Max ~100 chars
- description (string): Max ~500 chars

**Returns**: None (check events)

**Emits**: ProposalCreated event

---

### Vote
```solidity
dao.vote(0, true)   // Proposal ID 0, YES vote
dao.vote(0, false)  // Proposal ID 0, NO vote
```
**Parameters**:
- proposalId (uint256): Which proposal
- vote (bool): true = YES, false = NO

**Requirements**:
- Proposal must exist
- Voting must be open (before deadline)
- You must not have voted already

**Emits**: Voted event

---

### Execute Proposal
```solidity
dao.executeProposal(0)  // Execute proposal 0
```
**Parameters**:
- proposalId (uint256): Which proposal

**Requirements**:
- Voting deadline must have passed
- Proposal must not be executed yet

**Effects**:
- Sets executed = true
- Sets passed = true/false based on votes
- Emits ExecutedProposal event

---

### View Functions (Read-Only)

**Get Proposal Details**
```solidity
Proposal memory p = dao.getProposal(0);
// Returns: title, description, yesVotes, noVotes, passed, executed, etc.
```

**Check if Voting Open**
```solidity
bool isOpen = dao.isVotingOpen(0);
// Returns: true if deadline not passed yet
```

**Get Vote Count**
```solidity
(uint256 yes, uint256 no) = dao.getVoteCount(0);
// Returns: number of YES and NO votes
```

**Get Total Proposals**
```solidity
uint256 total = dao.getTotalProposals();
// Returns: total number of proposals created
```

---

## 🗺️ Proposal Lifecycle

```
┌─────────────────────┐
│  1. CREATE          │
│  createProposal()   │
└──────────┬──────────┘
           │ Creates proposal with deadline
           ▼
┌─────────────────────┐
│  2. VOTING OPEN     │
│  vote(id, choice)   │
└──────────┬──────────┘
           │ Multiple people vote
           │ Each person can vote once
           ▼
┌─────────────────────┐
│  3. DEADLINE        │
│  Wait 3 days        │
└──────────┬──────────┘
           │ Voting period ends
           ▼
┌─────────────────────┐
│  4. EXECUTE         │
│  executeProposal()  │
└──────────┬──────────┘
           │ Compare votes
           │ If YES > NO → PASSED
           ▼
┌─────────────────────┐
│  5. RESULT          │
│  Check outcome      │
└─────────────────────┘
```

---

## 💻 Remix Console Commands

### Create Proposal
```javascript
// In Remix console:
> dao.createProposal("Title", "Description")
```

### Vote
```javascript
> dao.vote(0, true)   // YES vote
```

### Execute
```javascript
> dao.executeProposal(0)
```

### Check Results
```javascript
> await dao.getProposal(0)
> await dao.getVoteCount(0)
```

---

## 🧪 Hardhat Test Commands

### Run All Tests
```bash
npx hardhat test
```

### Run Specific Test File
```bash
npx hardhat test test/DAO.test.js
```

### Run With Gas Report
```bash
REPORT_GAS=true npx hardhat test
```

### Run Single Test
```bash
npx hardhat test --grep "Should create a proposal"
```

---

## ⚙️ Hardhat Common Commands

```bash
# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Clean build artifacts
npx hardhat clean

# Show available tasks
npx hardhat help
```

---

## 🔍 Debugging

### Problem: "Proposal does not exist"
- Solution: Make sure proposal ID is correct
- Check: proposalId should be 0, 1, 2, etc.

### Problem: "You have already voted"
- Solution: Each address votes only once per proposal
- Fix: Use different address to vote

### Problem: "Voting period has not ended yet"
- Solution: Can't execute until 3 days pass
- In Remix: Wait or use blockchain time tools
- In Hardhat: Use `ethers.provider.send("hardhat_mine", [...])`

### Problem: "Title cannot be empty"
- Solution: Provide valid non-empty title
- Fix: `createProposal("", "desc")` → `createProposal("Title", "desc")`

### Problem: Contract won't compile
- Check: Solidity version 0.8.0 or higher
- Check: All brackets are matched
- Check: No typos in keywords

---

## 📊 Data Structure Quick Reference

### Proposal Struct
```solidity
struct Proposal {
    uint256 id;              // 0, 1, 2...
    string title;            // "My Title"
    string description;      // "Description..."
    address proposer;        // 0x123...
    uint256 creationTime;    // Unix timestamp
    uint256 deadline;        // Unix timestamp
    uint256 yesVotes;        // Count (0, 1, 2...)
    uint256 noVotes;         // Count (0, 1, 2...)
    bool executed;           // true/false
    bool passed;             // true/false
}
```

### Mapping Usage
```solidity
// Check if someone voted
hasVoted[0][0x123...] = true/false

// Get proposal
proposals[0] → returns full Proposal struct
```

---

## 🎯 Testing Checklist

- [ ] Can create a proposal
- [ ] Proposal has correct ID
- [ ] Can vote YES
- [ ] Can vote NO  
- [ ] Vote counts are correct
- [ ] Cannot vote twice
- [ ] Cannot vote after deadline
- [ ] Can execute proposal
- [ ] Proposal marked as passed/failed correctly
- [ ] Cannot execute twice
- [ ] Events are emitted
- [ ] All 27 tests pass

---

## 📝 Assignment Completion Checklist

- [ ] **DAO.sol** - Created and compiles ✅
- [ ] **README.md** - Complete documentation ✅
- [ ] **DAO.test.js** - Test cases included ✅
- [ ] **DEPLOYMENT_GUIDE.md** - Step-by-step instructions ✅
- [ ] **EXPLANATION.md** - Detailed explanations ✅
- [ ] **Tested in Remix** - Works correctly ✅
- [ ] **Tested locally with Hardhat** - All tests pass ✅
- [ ] **Code commented** - Well documented ✅
- [ ] **Folder structure correct** - assignment-5/ ✅
- [ ] **Ready for submission** - All files included ✅

---

## 🆘 Getting Help

### Where to Find Answers

1. **README.md** - Overview and concepts
2. **EXPLANATION.md** - Detailed technical explanations
3. **DEPLOYMENT_GUIDE.md** - Setup and deployment
4. **DAO.sol comments** - In-code explanations
5. **DAO.test.js comments** - Test case examples

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Code won't compile | Check Solidity version 0.8.0+ |
| Can't vote | Proposal might not exist or voting ended |
| Can't execute | Wait for 3-day deadline to pass |
| Test fails | Check error message, read test case |
| Gas error | Increase gas limit in Remix |
| Address error | Make sure address format is correct (0x...) |

---

## 📚 Learning Path

1. **Read**: README.md (5 min)
2. **Understand**: EXPLANATION.md (15 min)
3. **Copy Code**: DAO.sol into Remix (2 min)
4. **Deploy**: Deploy to Remix JS VM (3 min)
5. **Test**: Create proposal → vote → execute (10 min)
6. **Run Tests**: `npx hardhat test` (5 min)
7. **Setup Local**: Hardhat setup (20 min)
8. **Review**: All documentation (10 min)

**Total Time**: ~60 minutes

---

## 🎓 Key Concepts Summary

| Concept | What it Does |
|---------|-------------|
| **Struct** | Groups related data together |
| **Mapping** | Fast lookup: key → value |
| **Event** | Logs what happened on blockchain |
| **require()** | Validates before executing |
| **block.timestamp** | Current blockchain time |
| **msg.sender** | Address that called the function |
| **smart contract** | Code that runs on blockchain |
| **DAO** | Org run by smart contract + voting |

---

## 🚀 Next Steps After Assignment

1. **Add Treasury** - Store and distribute funds
2. **Token Voting** - Use tokens for voting power
3. **Multi-sig** - Require multiple approvals
4. **Timelock** - Delay execution for security
5. **Quorum** - Require minimum participation
6. **Delegation** - Allow voting delegation

---

## 🔗 Useful Links

- **Remix IDE**: https://remix.ethereum.org
- **Hardhat Docs**: https://hardhat.org/docs
- **Solidity Docs**: https://docs.soliditylang.org
- **Ethereum**: https://ethereum.org
- **Medium Article**: https://medium.com/@cromewar/decentralized-autonomous-organizations-a-step-by-step-guide-468c11179ced

---

## ✨ Tips for Success

1. ✅ **Read the code comments first**
2. ✅ **Test in Remix before Hardhat**
3. ✅ **Follow the deployment guide step-by-step**
4. ✅ **Run all tests to verify**
5. ✅ **Understand each function before moving on**
6. ✅ **Document your learnings**
7. ✅ **Don't skip the explanations**

---

**Good luck with your DAO assignment! 🚀**

Need help? Read the documentation files in order:
1. README.md
2. EXPLANATION.md
3. DEPLOYMENT_GUIDE.md
4. DAO.sol (with comments)
