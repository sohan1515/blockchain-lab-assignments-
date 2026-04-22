/**
 * Interaction Script for SimpleDAO
 * 
 * Demonstrates how to interact with the SimpleDAO contract
 * Shows creating proposals, voting, and executing
 * 
 * Usage:
 * 1. Start local blockchain: npx hardhat node
 * 2. Deploy contract: npx hardhat run scripts/deploy.js --network localhost
 * 3. Update CONTRACT_ADDRESS below with deployed address
 * 4. Run: npx hardhat run scripts/interact.js --network localhost
 */

// ⚠️ UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c91ff5f"; // Replace this!

async function main() {
    console.log("🔗 SimpleDAO Interaction Script\n");
    console.log("=".repeat(50));

    // Get contract instance
    const dao = await ethers.getContractAt("SimpleDAO", CONTRACT_ADDRESS);
    
    // Get signers (test accounts)
    const [owner, voter1, voter2, voter3] = await ethers.getSigners();
    
    console.log(`\n👤 Owner Address: ${owner.address}`);
    console.log(`👥 Voter1 Address: ${voter1.address}`);
    console.log(`👥 Voter2 Address: ${voter2.address}`);
    console.log(`👥 Voter3 Address: ${voter3.address}`);

    // ============ STEP 1: CREATE PROPOSALS ============
    
    console.log("\n" + "=".repeat(50));
    console.log("📝 STEP 1: Creating Proposals");
    console.log("=".repeat(50));

    console.log("\n📌 Proposal 1: Increase Marketing Budget");
    let tx = await dao.createProposal(
        "Increase Marketing Budget",
        "Allocate 500 ETH for Q2 2024 marketing campaign including digital ads, conferences, and partnerships"
    );
    await tx.wait();
    console.log("✅ Created successfully!");

    console.log("\n📌 Proposal 2: Implement Dark Mode");
    tx = await dao.createProposal(
        "Implement Dark Mode",
        "Add dark mode feature to the DAO interface for better user experience"
    );
    await tx.wait();
    console.log("✅ Created successfully!");

    console.log("\n📌 Proposal 3: Community Events");
    tx = await dao.createProposal(
        "Organize Community Events",
        "Fund monthly community meetups and hackathons to engage members"
    );
    await tx.wait();
    console.log("✅ Created successfully!");

    // ============ STEP 2: DISPLAY PROPOSALS ============

    console.log("\n" + "=".repeat(50));
    console.log("📋 STEP 2: Viewing Proposals");
    console.log("=".repeat(50));

    const totalProposals = await dao.getTotalProposals();
    console.log(`\n📊 Total Proposals: ${totalProposals}\n`);

    for (let i = 0; i < totalProposals; i++) {
        const proposal = await dao.getProposal(i);
        const isOpen = await dao.isVotingOpen(i);
        
        console.log(`\n🎯 Proposal #${i}`);
        console.log(`   Title: ${proposal.title}`);
        console.log(`   Description: ${proposal.description}`);
        console.log(`   Proposer: ${proposal.proposer}`);
        console.log(`   Status: ${isOpen ? "🟢 Voting Open" : "🔴 Voting Closed"}`);
    }

    // ============ STEP 3: VOTING ============

    console.log("\n" + "=".repeat(50));
    console.log("🗳️  STEP 3: Voting on Proposals");
    console.log("=".repeat(50));

    // Vote on Proposal 0
    console.log("\n📌 Voting on Proposal #0: Marketing Budget");
    console.log("   Owner voting: YES");
    tx = await dao.vote(0, true);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    console.log("   Voter1 voting: YES");
    tx = await dao.connect(voter1).vote(0, true);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    console.log("   Voter2 voting: NO");
    tx = await dao.connect(voter2).vote(0, false);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    console.log("   Voter3 voting: YES");
    tx = await dao.connect(voter3).vote(0, true);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    // Vote on Proposal 1
    console.log("\n📌 Voting on Proposal #1: Dark Mode");
    console.log("   Owner voting: YES");
    tx = await dao.vote(1, true);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    console.log("   Voter1 voting: YES");
    tx = await dao.connect(voter1).vote(1, true);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    // Vote on Proposal 2
    console.log("\n📌 Voting on Proposal #2: Community Events");
    console.log("   Owner voting: NO");
    tx = await dao.vote(2, false);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    console.log("   Voter1 voting: NO");
    tx = await dao.connect(voter1).vote(2, false);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    console.log("   Voter2 voting: YES");
    tx = await dao.connect(voter2).vote(2, true);
    await tx.wait();
    console.log("   ✅ Vote recorded");

    // ============ STEP 4: CHECK VOTE COUNTS ============

    console.log("\n" + "=".repeat(50));
    console.log("📊 STEP 4: Current Vote Counts");
    console.log("=".repeat(50));

    for (let i = 0; i < 3; i++) {
        const [yes, no] = await dao.getVoteCount(i);
        console.log(`\n📌 Proposal #${i}:`);
        console.log(`   YES votes: ${yes}`);
        console.log(`   NO votes: ${no}`);
        console.log(`   Leading: ${yes > no ? "YES ✅" : "NO ❌"}`);
    }

    // ============ STEP 5: SIMULATE TIME PASSAGE ============

    console.log("\n" + "=".repeat(50));
    console.log("⏰ STEP 5: Simulating Time Passage (3 days)");
    console.log("=".repeat(50));

    console.log("\n⏱️  Fast-forwarding blockchain time by 3 days...");
    // Move forward 3 days + 1 second
    await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);
    console.log("✅ Time passed!");

    // ============ STEP 6: EXECUTE PROPOSALS ============

    console.log("\n" + "=".repeat(50));
    console.log("⚙️  STEP 6: Executing Proposals");
    console.log("=".repeat(50));

    for (let i = 0; i < 3; i++) {
        const [yes, no] = await dao.getVoteCount(i);
        const result = yes > no ? "PASSED ✅" : "FAILED ❌";
        
        console.log(`\n📌 Executing Proposal #${i}...`);
        console.log(`   Final Votes: ${yes} YES, ${no} NO`);
        
        tx = await dao.executeProposal(i);
        await tx.wait();
        
        console.log(`   Result: ${result}`);
    }

    // ============ STEP 7: VIEW FINAL STATE ============

    console.log("\n" + "=".repeat(50));
    console.log("✅ STEP 7: Final Proposal Status");
    console.log("=".repeat(50));

    for (let i = 0; i < 3; i++) {
        const proposal = await dao.getProposal(i);
        const [yes, no] = await dao.getVoteCount(i);
        
        console.log(`\n🎯 Proposal #${i}: ${proposal.title}`);
        console.log(`   Status: ${proposal.executed ? "🔴 EXECUTED" : "🟢 PENDING"}`);
        console.log(`   Result: ${proposal.passed ? "✅ PASSED" : "❌ FAILED"}`);
        console.log(`   Final Votes: ${yes} YES, ${no} NO`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Interaction Complete!");
    console.log("=".repeat(50) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
