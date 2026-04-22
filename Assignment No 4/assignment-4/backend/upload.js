// upload.js
// This is the main Express server for the IPFS integration assignment.
// It provides an API endpoint to upload files to IPFS using Infura.

const express = require('express');
const multer = require('multer');
const ipfs = require('./ipfsClient');

const app = express();
const port = 3000;

// Configure multer for handling file uploads
// memoryStorage stores files in memory as Buffer objects
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse JSON requests
app.use(express.json());

// POST /upload endpoint
// This endpoint accepts a file upload and stores it on IPFS
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    // Check if a file was provided
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Add the file buffer to IPFS
    // ipfs.add() returns an object with cid (Content Identifier)
    const result = await ipfs.add(file.buffer);

    // Convert CID to string
    const cid = result.cid.toString();

    // Create a public URL using the IPFS gateway
    const url = `https://ipfs.io/ipfs/${cid}`;

    // Return success response with CID and URL
    res.json({
      message: 'File uploaded successfully',
      cid: cid,
      url: url
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file to IPFS' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`IPFS Upload Server running on http://localhost:${port}`);
  console.log('Upload endpoint: POST /upload');
});