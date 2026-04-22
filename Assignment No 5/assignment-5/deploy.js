/**
 * Deployment Script for SimpleDAO
 * 
 * Usage:
 * npx hardhat run scripts/deploy.js --network localhost
 * 
 * This script deploys the SimpleDAO contract to the specified network
 */

async function main() {
    console.log("🚀 Starting SimpleDAO deployment...\n");

    // Get the contract factory
    const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
    
    // Deploy the contract
    console.log("📝 Deploying SimpleDAO contract...");
    const dao = await SimpleDAO.deploy();

    // Wait for deployment
    await dao.deployed();

    console.log("✅ SimpleDAO deployed successfully!");
    console.log(`📍 Contract Address: ${dao.address}\n`);

    // Display contract information
    console.log("📊 Contract Information:");
    console.log(`   - Network: ${(await ethers.provider.getNetwork()).name}`);
    console.log(`   - Deployer: ${(await ethers.getSigners())[0].address}`);
    console.log(`   - Total Proposals: ${await dao.getTotalProposals()}`);

    console.log("\n📚 Available Functions:");
    console.log("   - createProposal(title, description)");
    console.log("   - vote(proposalId, vote)");
    console.log("   - executeProposal(proposalId)");
    console.log("   - getProposal(proposalId)");
    console.log("   - getVoteCount(proposalId)");
    console.log("   - isVotingOpen(proposalId)");
    console.log("   - getTotalProposals()");

    console.log("\n💡 Next Steps:");
    console.log(`   1. Save the contract address: ${dao.address}`);
    console.log("   2. Run: npx hardhat run scripts/interact.js --network localhost");
    console.log("   3. Interact with the DAO!\n");

    return dao.address;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
