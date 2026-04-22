// ipfsClient.js
// This file sets up the IPFS client using Infura's IPFS service.
// IPFS (InterPlanetary File System) is a decentralized storage system.
// We're using Infura as our IPFS provider for this assignment.

const { create } = require('ipfs-http-client');

// Replace these with your actual Infura Project ID and Secret
// You can get these from https://infura.io/
const projectId = 'YOUR_INFURA_PROJECT_ID'; // TODO: Add your Infura Project ID here
const projectSecret = 'YOUR_INFURA_PROJECT_SECRET'; // TODO: Add your Infura Project Secret here

// Create authorization header for Infura
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// Create IPFS client instance
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

module.exports = ipfs;