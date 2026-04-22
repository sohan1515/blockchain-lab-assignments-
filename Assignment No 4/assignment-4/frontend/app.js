// app.js
// Frontend JavaScript for handling file upload to IPFS
// This script sends the selected file to the backend API

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file to upload');
    return;
  }

  // Create FormData object to send file
  const formData = new FormData();
  formData.append('file', file);

  // Show loading message
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<p>Uploading file to IPFS...</p>';

  try {
    // Send POST request to backend upload endpoint
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Display success result
    resultDiv.innerHTML = `
      <h3>Upload Successful! 🎉</h3>
      <p><strong>CID (Content Identifier):</strong> ${result.cid}</p>
      <p><strong>IPFS URL:</strong> <a href="${result.url}" target="_blank">${result.url}</a></p>
      <p>You can access your file using this CID or URL.</p>
      <p><em>Note: Take a screenshot of this result for your assignment!</em></p>
    `;

  } catch (error) {
    console.error('Upload error:', error);
    resultDiv.innerHTML = `
      <h3>Upload Failed ❌</h3>
      <p>Error: ${error.message}</p>
      <p>Make sure the backend server is running on port 3000.</p>
    `;
  }
});