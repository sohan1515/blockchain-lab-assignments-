// retrieve.js
// This script demonstrates how to retrieve a file from IPFS using its CID (Content Identifier).
// Run this script with: node retrieve.js <CID>
// The file content will be printed to the console.

const ipfs = require('./ipfsClient');

// Function to retrieve and display file content from IPFS
async function retrieveFile(cid) {
  try {
    console.log(`Retrieving file with CID: ${cid}`);

    // ipfs.cat() returns an async iterator of chunks
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }

    // Concatenate chunks into a single buffer and convert to string
    const content = Buffer.concat(chunks).toString();

    console.log('File retrieved successfully!');
    console.log('Content:');
    console.log(content);

  } catch (error) {
    console.error('Error retrieving file from IPFS:', error.message);
  }
}

// Get CID from command line arguments
// Usage: node retrieve.js <CID>
const cid = process.argv[2];

if (!cid) {
  console.log('Please provide a CID as an argument.');
  console.log('Usage: node retrieve.js <CID>');
  console.log('Example: node retrieve.js QmYourCIDHere');
  process.exit(1);
}

// Call the retrieve function
retrieveFile(cid);