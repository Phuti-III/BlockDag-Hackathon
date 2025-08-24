#!/usr/bin/env node

/**
 * BlockDAG File Storage API Test Script
 * 
 * This script tests all API endpoints to ensure they work correctly.
 * Run this after starting the API server and populating demo data.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001/api';
const USER_ADDRESS = '0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c';
const LE_ADDRESS = '0x0a213702b6050FbF645925dAb4a143F0002a4B97';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, testFunc) {
  try {
    log(`\n🧪 Testing: ${name}`, 'blue');
    const result = await testFunc();
    log(`✅ ${name}: PASSED`, 'green');
    return result;
  } catch (error) {
    log(`❌ ${name}: FAILED`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return null;
  }
}

async function testHealthCheck() {
  const response = await axios.get(`${API_BASE}/health`);
  if (response.data.status !== 'healthy') {
    throw new Error('Health check failed');
  }
  log(`   Status: ${response.data.status}`);
  log(`   Contract: ${response.data.contract}`);
  return response.data;
}

async function testPopulateDemo() {
  const response = await axios.post(`${API_BASE}/demo/populate`);
  if (!response.data.success) {
    throw new Error('Demo population failed');
  }
  log(`   Created ${response.data.results.length} entries`);
  return response.data;
}

async function testGetPublicFiles() {
  const response = await axios.get(`${API_BASE}/files/public`);
  if (!response.data.success) {
    throw new Error('Failed to get public files');
  }
  log(`   Found ${response.data.count} public files`);
  response.data.files.forEach(file => {
    log(`   - ${file.fileName} (ID: ${file.id})`);
  });
  return response.data;
}

async function testGetUserFiles() {
  const response = await axios.get(`${API_BASE}/files/user/${USER_ADDRESS}`);
  if (!response.data.success) {
    throw new Error('Failed to get user files');
  }
  log(`   Found ${response.data.count} user files`);
  response.data.files.forEach(file => {
    log(`   - ${file.fileName} (ID: ${file.id}, Private: ${file.isPrivate})`);
  });
  return response.data;
}

async function testGetLEFiles() {
  const response = await axios.get(`${API_BASE}/files/user/${LE_ADDRESS}`);
  if (!response.data.success) {
    throw new Error('Failed to get LE files');
  }
  log(`   Found ${response.data.count} law enforcement files`);
  response.data.files.forEach(file => {
    log(`   - ${file.fileName} (ID: ${file.id}, Private: ${file.isPrivate})`);
  });
  return response.data;
}

async function testGetSharedByUser() {
  const response = await axios.get(`${API_BASE}/files/shared-by/${USER_ADDRESS}`);
  if (!response.data.success) {
    throw new Error('Failed to get shared files');
  }
  log(`   Found ${response.data.count} shared files`);
  response.data.sharedFiles.forEach(file => {
    log(`   - ${file.fileName} shared with ${file.sharedWith.length} users`);
  });
  return response.data;
}

async function testGetSharedWithUser() {
  const response = await axios.get(`${API_BASE}/files/shared-with/${LE_ADDRESS}`);
  if (!response.data.success) {
    throw new Error('Failed to get files shared with user');
  }
  log(`   Found ${response.data.count} files shared with law enforcement`);
  response.data.files.forEach(file => {
    log(`   - ${file.fileName} from ${file.owner}`);
  });
  return response.data;
}

async function testGetFileDetails() {
  // Get the first public file for testing
  const publicFiles = await axios.get(`${API_BASE}/files/public`);
  if (publicFiles.data.files.length === 0) {
    throw new Error('No public files found for testing');
  }
  
  const fileId = publicFiles.data.files[0].id;
  const response = await axios.get(`${API_BASE}/files/${fileId}?userAddress=${USER_ADDRESS}`);
  
  if (!response.data.success) {
    throw new Error('Failed to get file details');
  }
  
  log(`   File: ${response.data.file.fileName}`);
  log(`   Owner: ${response.data.file.owner}`);
  log(`   Size: ${response.data.file.fileSize} bytes`);
  return response.data;
}

async function testFileUpload() {
  // Create a temporary test file
  const testContent = 'This is a test file created by the API test script';
  const testFileName = 'api-test-file.txt';
  const testFilePath = path.join(__dirname, testFileName);
  
  fs.writeFileSync(testFilePath, testContent);
  
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('userAddress', USER_ADDRESS);
    form.append('isPrivate', 'false');
    
    const response = await axios.post(`${API_BASE}/files/upload`, form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 30000 // 30 seconds timeout for upload
    });
    
    if (!response.data.success) {
      throw new Error('File upload failed');
    }
    
    log(`   Uploaded: ${testFileName}`);
    log(`   File ID: ${response.data.fileId}`);
    log(`   IPFS Hash: ${response.data.ipfsHash}`);
    log(`   Transaction: ${response.data.transactionHash}`);
    
    return response.data;
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

async function testFileSharing() {
  // Get user files to find one to share
  const userFiles = await axios.get(`${API_BASE}/files/user/${USER_ADDRESS}`);
  if (userFiles.data.files.length === 0) {
    throw new Error('No user files found for sharing test');
  }
  
  const fileToShare = userFiles.data.files[0];
  
  const response = await axios.post(`${API_BASE}/files/${fileToShare.id}/share`, {
    userAddress: USER_ADDRESS,
    recipientAddress: LE_ADDRESS
  });
  
  if (!response.data.success) {
    throw new Error('File sharing failed');
  }
  
  log(`   Shared: ${fileToShare.fileName} with ${LE_ADDRESS}`);
  log(`   Transaction: ${response.data.transactionHash}`);
  return response.data;
}

async function runAllTests() {
  log('🚀 Starting BlockDAG File Storage API Tests', 'blue');
  log('=' * 50, 'blue');
  
  const results = {};
  
  // Basic functionality tests
  results.health = await testEndpoint('Health Check', testHealthCheck);
  
  // Demo data population (comment out if already populated)
  log('\n⚠️  Populating demo data (this may take a while)...', 'yellow');
  results.populate = await testEndpoint('Populate Demo Data', testPopulateDemo);
  
  // File retrieval tests
  results.publicFiles = await testEndpoint('Get Public Files', testGetPublicFiles);
  results.userFiles = await testEndpoint('Get User Files', testGetUserFiles);
  results.leFiles = await testEndpoint('Get Law Enforcement Files', testGetLEFiles);
  results.fileDetails = await testEndpoint('Get File Details', testGetFileDetails);
  
  // Sharing tests
  results.sharedBy = await testEndpoint('Get Files Shared By User', testGetSharedByUser);
  results.sharedWith = await testEndpoint('Get Files Shared With User', testGetSharedWithUser);
  
  // File operations (these involve blockchain transactions)
  log('\n⚠️  Testing blockchain operations (may take time)...', 'yellow');
  results.upload = await testEndpoint('File Upload', testFileUpload);
  results.sharing = await testEndpoint('File Sharing', testFileSharing);
  
  // Summary
  log('\n📊 Test Summary', 'blue');
  log('=' * 30, 'blue');
  
  const passed = Object.values(results).filter(r => r !== null).length;
  const total = Object.keys(results).length;
  
  log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! API is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the logs above.', 'yellow');
  }
  
  return results;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      log(`\n💥 Test execution failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testEndpoint,
  API_BASE,
  USER_ADDRESS,
  LE_ADDRESS
};