# Assignment 4: IPFS Integration

## Overview
This assignment demonstrates how to integrate IPFS (InterPlanetary File System) into a web application. IPFS is a decentralized storage system that allows you to store and retrieve files in a distributed network. We'll use Infura's IPFS service as our provider.

## What is IPFS?
IPFS is like a distributed hard drive where files are stored across many computers worldwide. Instead of storing files on a single server, IPFS breaks files into pieces and stores them on multiple nodes. Each file gets a unique "CID" (Content Identifier) that acts like an address to retrieve the file from anywhere.

## Project Structure
```
assignment-4/
├── backend/
│   ├── ipfsClient.js      # IPFS client configuration
│   ├── upload.js          # Express server with upload endpoint
│   ├── retrieve.js        # Script to retrieve files from IPFS
│   └── package.json       # Node.js dependencies
├── frontend/
│   ├── index.html         # Simple upload interface
│   └── app.js             # Frontend JavaScript
└── README.md              # This file
```

## IPFS Service Used
- **Library**: `ipfs-http-client` (JavaScript library for interacting with IPFS)
- **Provider**: Infura IPFS (Cloud-hosted IPFS service)
- **Why Infura?**: Provides reliable IPFS access without running your own IPFS node

## How Files Are Stored
1. User selects a file through the web interface
2. File is sent to the backend server via HTTP POST
3. Backend uses `multer` to handle the file upload
4. File data is sent to IPFS via `ipfs.add()` method
5. IPFS returns a CID (unique identifier for the file)
6. CID is returned to the user along with a public URL

## How Files Are Retrieved
1. Use the CID to identify which file to retrieve
2. Call `ipfs.cat(CID)` to get file content from IPFS
3. IPFS streams the file content back as chunks
4. Combine chunks and display or save the file

## Setup Instructions

### 1. Get Infura Credentials
1. Go to [https://infura.io/](https://infura.io/)
2. Create a free account
3. Create a new IPFS project
4. Note down your **Project ID** and **Project Secret**

### 2. Configure the Project
1. Open `backend/ipfsClient.js`
2. Replace `'YOUR_INFURA_PROJECT_ID'` with your actual Project ID
3. Replace `'YOUR_INFURA_PROJECT_SECRET'` with your actual Project Secret

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Run the Backend Server
```bash
cd backend
npm start
# or
node upload.js
```
The server will start on `http://localhost:3000`

### 5. Open the Frontend
1. Open `frontend/index.html` in your web browser
2. Select a file to upload
3. Click "Upload to IPFS"
4. Note the CID and URL returned

## Testing File Retrieval

### Using the Retrieve Script
```bash
cd backend
node retrieve.js <CID>
```
Replace `<CID>` with the CID you got from uploading a file.

Example:
```bash
node retrieve.js QmYwAPJzv5CZsnAztECyAQrCsVgdKbSYRvLk3MQMWPMNnS
```

### Viewing Files in Browser
You can also view any IPFS file by visiting:
`https://ipfs.io/ipfs/<CID>`

For example: https://ipfs.io/ipfs/QmYwAPJzv5CZsnAztECyAQrCsVgdKbSYRvLk3MQMWPMNnS

## Sample IPFS CIDs
Here are some sample CIDs you can use to test retrieval:

1. **IPFS Welcome Page**: `QmYwAPJzv5CZsnAztECyAQrCsVgdKbSYRvLk3MQMWPMNnS`
   - URL: https://ipfs.io/ipfs/QmYwAPJzv5CZsnAztECyAQrCsVgdKbSYRvLk3MQMWPMNnS

2. **Simple Text File**: `QmT78zSuBmuS4z925WZcmgqq9bRNwPVBW9TpEh79ZHnUA`
   - Contains: "Hello from IPFS!"

3. **JSON File**: `QmZz6XhQeT8e1p8Vj8VqW4W4W4W4W4W4W4W4W4W4W4W4W`
   - Contains sample JSON data

## API Endpoints

### POST /upload
Uploads a file to IPFS.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (as form data)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "cid": "Qm...",
  "url": "https://ipfs.io/ipfs/Qm..."
}
```

## Screenshots to Take for Assignment

1. **Upload Success**: Screenshot showing the successful upload response with CID and URL
2. **CID Link in Browser**: Screenshot of opening the IPFS URL in a web browser
3. **Console Output**: Screenshot of running the retrieve script and seeing file content
4. **Infura Dashboard** (optional): Screenshot showing your IPFS project in Infura

## Viva Preparation Notes

### Key Concepts to Explain:
- **IPFS vs Traditional Storage**: Decentralized vs centralized
- **CID**: Content addressing, not location addressing
- **Infura**: Why we use it instead of running our own node
- **File Upload Process**: Client → Server → IPFS → CID
- **File Retrieval**: Using CID to fetch from any IPFS node

### Common Questions:
1. What happens if an IPFS node goes offline?
2. How does IPFS ensure file integrity?
3. Difference between IPFS and HTTP URLs?
4. Why do we need Infura for this assignment?

## Troubleshooting

### Common Issues:
1. **"Authorization failed"**: Check your Infura Project ID and Secret
2. **"No file uploaded"**: Make sure you're sending the file in the correct format
3. **CORS errors**: Make sure backend is running on port 3000
4. **File not found**: Verify the CID is correct

### Tips:
- Always check the console for error messages
- Use small files for testing (under 10MB for free tier)
- Wait a few seconds after upload before trying to retrieve

## Bonus Features
- Simple web interface for file uploads
- Commented code for easy understanding
- Error handling and user feedback
- Beginner-friendly structure and documentation

## Technologies Used
- **Backend**: Node.js, Express.js
- **File Handling**: Multer
- **IPFS**: ipfs-http-client, Infura
- **Frontend**: HTML, JavaScript (vanilla)

---

**Note**: This is a educational project for understanding IPFS integration. In production, you would add proper error handling, authentication, and security measures.