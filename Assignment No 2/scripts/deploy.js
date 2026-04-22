/**
 * Deployment Script for SimpleStorage Contract
 * @notice Deploys the SimpleStorage contract to Polygon Amoy Testnet
 * @dev This script uses ethers.js v6 for deployment
 */

const hre = require("hardhat");

async function main() {
  console.log("======================================");
  console.log("Deploying SimpleStorage to Polygon Amoy...");
  console.log("======================================\n");

  // Get the contract factory
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");

  // Deploy the contract
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorage.deploy();

  // Wait for deployment to be confirmed
  await simpleStorage.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await simpleStorage.getAddress();

  console.log("\n======================================");
  console.log("DEPLOYMENT SUCCESSFUL!");
  console.log("======================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log("======================================\n");

  console.log("Next steps:");
  console.log("1. Add Polygon Amoy to MetaMask");
  console.log("2. Get test POL from faucet");
  console.log("3. Verify contract on PolygonScan");
}

/**
 * Handle errors and exit
 */
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });