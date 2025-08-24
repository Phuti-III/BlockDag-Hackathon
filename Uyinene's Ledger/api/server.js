const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 3000;
// Middleware
app.use(cors());
app.use(express.json());

// IPFS Setup with fallback to mock
let ipfs;
let usingMockIPFS = true;

async function setupIPFS() {
  try {
    // Try to connect to real IPFS first
    const { create } = require('ipfs-http-client');
    
    // Check if IPFS daemon is running
    ipfs = create({
      host: process.env.IPFS_HOST || 'localhost',
      port: process.env.IPFS_PORT || 3000,
      protocol: process.env.IPFS_PROTOCOL || 'http'
    });
    
    // Test connection
    await ipfs.version();
    console.log('✅ Connected to IPFS daemon');
    usingMockIPFS = false;
    
  } catch (error) {
    console.log('⚠️  IPFS daemon not available, using mock IPFS');
    console.log('   IPFS connection error:', error.message);
    usingMockIPFS = true;
    
    // Mock IPFS implementation
    ipfs = {
      async add(file) {
        const hash = 'Qm' + crypto.createHash('sha256')
          .update(file.content || file)
          .digest('hex')
          .substring(0, 44);
        
        console.log(`📁 Mock IPFS: Generated hash ${hash} for file ${file.path || 'unknown'}`);
        
        return {
          cid: { toString: () => hash },
          path: file.path || 'unknown',
          size: Buffer.isBuffer(file.content) ? file.content.length : file.length
        };
      },
      
      async version() {
        return { version: '0.22.0-mock' };
      }
    };
  }
}

// Initialize IPFS on startup
setupIPFS().catch(console.error);

// Check if private keys are valid
function checkPrivateKeys() {
  try {
    // Check user private key
    if (DEMO_ACCOUNTS.user.privateKey.startsWith('0x') && DEMO_ACCOUNTS.user.privateKey.length === 66) {
      // This is likely a valid private key format
      console.log('✅ User private key format appears valid');
    } else if (DEMO_ACCOUNTS.user.privateKey === '0x' + '0'.repeat(64)) {
      console.log('⚠️  User private key is using mock/fallback value (all zeros)');
    } else {
      console.log('⚠️  User private key format may be invalid');
    }
    
    // Check law enforcement private key
    if (DEMO_ACCOUNTS.lawEnforcement.privateKey.startsWith('0x') && DEMO_ACCOUNTS.lawEnforcement.privateKey.length === 66) {
      // This is likely a valid private key format
      console.log('✅ Law enforcement private key format appears valid');
    } else if (DEMO_ACCOUNTS.lawEnforcement.privateKey === '0x' + '0'.repeat(64)) {
      console.log('⚠️  Law enforcement private key is using mock/fallback value (all zeros)');
    } else {
      console.log('⚠️  Law enforcement private key format may be invalid');
    }
  } catch (error) {
    console.log('⚠️  Error checking private keys:', error.message);
  }
}

// Run the private key check
checkPrivateKeys();

// Contract configuration
const CONTRACT_ADDRESS = "0xf5ea995aEE58B09dD9fbe2f8228a97c74129685A";
const CONTRACT_ABI = [
  "function uploadFile(string ipfsHash, string fileName, bool isPrivate, uint256 fileSize, string fileType, string encryptionKey) external returns (uint256)",
  "function getFile(uint256 fileId) external view returns (tuple(uint256 id, string ipfsHash, string fileName, address owner, uint256 uploadTime, bool isPrivate, bool isDeleted, uint256 fileSize, string fileType, string encryptionKey))",
  "function shareFile(uint256 fileId, address recipient) external",
  "function deleteFile(uint256 fileId) external",
  "function getUserFiles(address user) external view returns (uint256[])",
  "function getSharedFiles(address user) external view returns (uint256[])",
  "function getPublicFiles() external view returns (tuple(uint256 id, string ipfsHash, string fileName, address owner, uint256 uploadTime, bool isPrivate, bool isDeleted, uint256 fileSize, string fileType, string encryptionKey)[])",
  "function fileSharedWith(uint256 fileId, uint256 index) external view returns (address)",
  "function fileCounter() external view returns (uint256)",
  "function isSharedWith(uint256 fileId, address user) external view returns (bool)",
  "event FileUploaded(uint256 indexed fileId, address indexed owner, string ipfsHash, string fileName, bool isPrivate)",
  "event FileShared(uint256 indexed fileId, address indexed owner, address indexed recipient)",
  "event FileDeleted(uint256 indexed fileId, address indexed owner)"
];

// Blockchain connection
const provider = new ethers.JsonRpcProvider("https://rpc.primordial.bdagscan.com");

// Demo user accounts
const DEMO_ACCOUNTS = {
  user: {
    address: "0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c",
    privateKey: process.env.USER_PRIVATE_KEY 
  },
  lawEnforcement: {
    address: "0x0a213702b6050FbF645925dAb4a143F0002a4B97",
    privateKey: process.env.LAW_ENFORCEMENT_PRIVATE_KEY 
  }
};

// Helper function to get contract instance
function getContractInstance(privateKey) {
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
}

// Helper function to upload to IPFS (real or mock)
async function uploadToIPFS(buffer, filename) {
  try {
    const result = await ipfs.add({
      content: buffer,
      path: filename
    });
    
    const hash = result.cid.toString();
    
    if (usingMockIPFS) {
      console.log(`📁 Mock IPFS: Uploaded ${filename} with hash ${hash}`);
    } else {
      console.log(`📁 IPFS: Uploaded ${filename} with hash ${hash}`);
    }
    
    return hash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`Failed to upload to ${usingMockIPFS ? 'mock ' : ''}IPFS`);
  }
}

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// API Routes

/**
 * System status check
 * GET /api/status
 */
app.get('/api/status', async (req, res) => {
  try {
    let ipfsStatus;
    try {
      const version = await ipfs.version();
      ipfsStatus = {
        connected: true,
        mock: usingMockIPFS,
        version: version.version
      };
    } catch (error) {
      ipfsStatus = {
        connected: false,
        error: error.message
      };
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      contract: CONTRACT_ADDRESS,
      network: 'BlockDAG Primordial',
      ipfs: ipfsStatus,
      demoAccounts: {
        user: DEMO_ACCOUNTS.user.address,
        lawEnforcement: DEMO_ACCOUNTS.lawEnforcement.address
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

/**
 * Upload a file to the blockchain
 * POST /api/files/upload
 */
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    const { userAddress, isPrivate = false, encryptionKey = '' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    // Get user's private key
    let privateKey;
    if (userAddress.toLowerCase() === DEMO_ACCOUNTS.user.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.user.privateKey;
    } else if (userAddress.toLowerCase() === DEMO_ACCOUNTS.lawEnforcement.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.lawEnforcement.privateKey;
    } else {
      return res.status(403).json({ error: 'Unauthorized user address' });
    }

    // Upload to IPFS (real or mock)
    const ipfsHash = await uploadToIPFS(req.file.buffer, req.file.originalname);
    
    // Upload to blockchain
    const contract = getContractInstance(privateKey);
    
    const tx = await contract.uploadFile(
      ipfsHash,
      req.file.originalname,
      isPrivate === 'true' || isPrivate === true,
      req.file.size,
      req.file.mimetype,
      encryptionKey
    );

    const receipt = await tx.wait().catch(error => {
      console.error('Transaction failed:', error);
      throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
    });
    
    // Extract file ID from events
    const event = receipt.logs.find(log => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog.name === 'FileUploaded';
      } catch {
        return false;
      }
    });

    let fileId;
    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      fileId = parsedEvent.args.fileId.toString();
    }

    res.json({
      success: true,
      fileId: fileId,
      ipfsHash: ipfsHash,
      transactionHash: tx.hash,
      message: `File uploaded successfully${usingMockIPFS ? ' (using mock IPFS)' : ''}`,
      mockIPFS: usingMockIPFS
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file', 
      details: error.message 
    });
  }
});

/**
 * Get all files owned by a user
 * GET /api/files/user/:address
 */
app.get('/api/files/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const contract = getContractInstance(DEMO_ACCOUNTS.user.privateKey);
    
    const fileIds = await contract.getUserFiles(address);
    const files = [];
    
    for (const fileId of fileIds) {
      try {
        const file = await contract.getFile(fileId);
        if (!file.isDeleted) {
          files.push({
            id: file.id.toString(),
            ipfsHash: file.ipfsHash,
            fileName: file.fileName,
            owner: file.owner,
            uploadTime: new Date(Number(file.uploadTime) * 1000).toISOString(),
            isPrivate: file.isPrivate,
            fileSize: file.fileSize.toString(),
            fileType: file.fileType
          });
        }
      } catch (error) {
        console.error(`Error getting file ${fileId}:`, error);
      }
    }
    
    res.json({
      success: true,
      files: files,
      count: files.length
    });

  } catch (error) {
    console.error('Get user files error:', error);
    res.status(500).json({ 
      error: 'Failed to get user files', 
      details: error.message 
    });
  }
});

/**
 * Get all public files
 * GET /api/files/public
 */
app.get('/api/files/public', async (req, res) => {
  try {
    const contract = getContractInstance(DEMO_ACCOUNTS.user.privateKey);
    
    const publicFiles = await contract.getPublicFiles();
    
    const files = publicFiles.map(file => ({
      id: file.id.toString(),
      ipfsHash: file.ipfsHash,
      fileName: file.fileName,
      owner: file.owner,
      uploadTime: new Date(Number(file.uploadTime) * 1000).toISOString(),
      fileSize: file.fileSize.toString(),
      fileType: file.fileType
    }));
    
    res.json({
      success: true,
      files: files,
      count: files.length
    });

  } catch (error) {
    console.error('Get public files error:', error);
    res.status(500).json({ 
      error: 'Failed to get public files', 
      details: error.message 
    });
  }
});

/**
 * Share a file with another user
 * POST /api/files/:fileId/share
 */
app.post('/api/files/:fileId/share', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userAddress, recipientAddress } = req.body;

    if (!userAddress || !recipientAddress) {
      return res.status(400).json({ error: 'User address and recipient address are required' });
    }

    let privateKey;
    if (userAddress.toLowerCase() === DEMO_ACCOUNTS.user.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.user.privateKey;
    } else if (userAddress.toLowerCase() === DEMO_ACCOUNTS.lawEnforcement.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.lawEnforcement.privateKey;
    } else {
      return res.status(403).json({ error: 'Unauthorized user address' });
    }

    const contract = getContractInstance(privateKey);
    
    const tx = await contract.shareFile(fileId, recipientAddress);
    await tx.wait().catch(error => {
      console.error('Share transaction failed:', error);
      throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
    });
    
    res.json({
      success: true,
      transactionHash: tx.hash,
      message: 'File shared successfully'
    });

  } catch (error) {
    console.error('Share file error:', error);
    res.status(500).json({ 
      error: 'Failed to share file', 
      details: error.message 
    });
  }
});

/**
 * Delete a file
 * DELETE /api/files/:fileId
 */
app.delete('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    let privateKey;
    if (userAddress.toLowerCase() === DEMO_ACCOUNTS.user.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.user.privateKey;
    } else if (userAddress.toLowerCase() === DEMO_ACCOUNTS.lawEnforcement.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.lawEnforcement.privateKey;
    } else {
      return res.status(403).json({ error: 'Unauthorized user address' });
    }

    const contract = getContractInstance(privateKey);
    
    const tx = await contract.deleteFile(fileId);
    await tx.wait().catch(error => {
      console.error('Delete transaction failed:', error);
      throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
    });
    
    res.json({
      success: true,
      transactionHash: tx.hash,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file', 
      details: error.message 
    });
  }
});

/**
 * Get files shared by a user
 * GET /api/files/shared-by/:address
 */
app.get('/api/files/shared-by/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const contract = getContractInstance(DEMO_ACCOUNTS.user.privateKey);
    
    const fileIds = await contract.getUserFiles(address);
    const sharedFiles = [];
    
    for (const fileId of fileIds) {
      try {
        const file = await contract.getFile(fileId);
        if (!file.isDeleted) {
          const sharedWith = [];
          let index = 0;
          
          try {
            while (true) {
              const recipient = await contract.fileSharedWith(fileId, index);
              if (recipient === ethers.ZeroAddress) break;
              sharedWith.push(recipient);
              index++;
            }
          } catch (error) {
            // End of shared list
          }
          
          if (sharedWith.length > 0) {
            sharedFiles.push({
              id: file.id.toString(),
              fileName: file.fileName,
              ipfsHash: file.ipfsHash,
              fileType: file.fileType,
              fileSize: file.fileSize.toString(),
              uploadTime: new Date(Number(file.uploadTime) * 1000).toISOString(),
              sharedWith: sharedWith
            });
          }
        }
      } catch (error) {
        console.error(`Error processing file ${fileId}:`, error);
      }
    }
    
    res.json({
      success: true,
      sharedFiles: sharedFiles,
      count: sharedFiles.length
    });

  } catch (error) {
    console.error('Get shared files error:', error);
    res.status(500).json({ 
      error: 'Failed to get shared files', 
      details: error.message 
    });
  }
});

/**
 * Get files shared with a user
 * GET /api/files/shared-with/:address
 */
app.get('/api/files/shared-with/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const contract = getContractInstance(DEMO_ACCOUNTS.user.privateKey);
    
    const sharedFileIds = await contract.getSharedFiles(address);
    const files = [];
    
    for (const fileId of sharedFileIds) {
      try {
        const file = await contract.getFile(fileId);
        if (!file.isDeleted) {
          files.push({
            id: file.id.toString(),
            ipfsHash: file.ipfsHash,
            fileName: file.fileName,
            owner: file.owner,
            uploadTime: new Date(Number(file.uploadTime) * 1000).toISOString(),
            isPrivate: file.isPrivate,
            fileSize: file.fileSize.toString(),
            fileType: file.fileType
          });
        }
      } catch (error) {
        console.error(`Error getting shared file ${fileId}:`, error);
      }
    }
    
    res.json({
      success: true,
      files: files,
      count: files.length
    });

  } catch (error) {
    console.error('Get files shared with user error:', error);
    res.status(500).json({ 
      error: 'Failed to get files shared with user', 
      details: error.message 
    });
  }
});

/**
 * Get file details by ID
 * GET /api/files/:fileId
 */
app.get('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userAddress } = req.query;

    let privateKey = DEMO_ACCOUNTS.user.privateKey;
    if (userAddress && userAddress.toLowerCase() === DEMO_ACCOUNTS.lawEnforcement.address.toLowerCase()) {
      privateKey = DEMO_ACCOUNTS.lawEnforcement.privateKey;
    }

    const contract = getContractInstance(privateKey);
    
    const file = await contract.getFile(fileId);
    
    res.json({
      success: true,
      file: {
        id: file.id.toString(),
        ipfsHash: file.ipfsHash,
        fileName: file.fileName,
        owner: file.owner,
        uploadTime: new Date(Number(file.uploadTime) * 1000).toISOString(),
        isPrivate: file.isPrivate,
        isDeleted: file.isDeleted,
        fileSize: file.fileSize.toString(),
        fileType: file.fileType
      }
    });

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ 
      error: 'Failed to get file', 
details: error.message 
    });
  }
});

/**
 * Demo data population endpoint
 * POST /api/demo/populate
 */
app.post('/api/demo/populate', async (req, res) => {
  try {
    const results = [];
    
    console.log(`📊 Populating demo data${usingMockIPFS ? ' (using mock IPFS)' : ''}...`);
    
    const userFiles = [
      { name: 'Personal_Document.pdf', content: 'This is a personal document', private: false },
      { name: 'Private_Contract.docx', content: 'This is a private contract document', private: true },
      { name: 'Public_Report.txt', content: 'This is a public report available to everyone', private: false },
      { name: 'Confidential_Data.xlsx', content: 'This contains confidential business data', private: true }
    ];

    const leFiles = [
      { name: 'Case_File_001.pdf', content: 'Law enforcement case file #001', private: true },
      { name: 'Public_Notice.txt', content: 'Public safety notice from law enforcement', private: false },
      { name: 'Evidence_Log.csv', content: 'Evidence tracking log', private: true }
    ];

    // Upload user files
    const userContract = getContractInstance(DEMO_ACCOUNTS.user.privateKey);
    for (const file of userFiles) {
      try {
        const buffer = Buffer.from(file.content);
        const ipfsHash = await uploadToIPFS(buffer, file.name);
        
        const tx = await userContract.uploadFile(
          ipfsHash,
          file.name,
          file.private,
          buffer.length,
          'text/plain',
          file.private ? 'demo_encryption_key' : ''
        );
        
        const receipt = await tx.wait().catch(error => {
          console.error('Demo data upload transaction failed:', error);
          throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
        });
        results.push({
          user: 'demo_user',
          fileName: file.name,
          txHash: tx.hash,
          status: 'success'
        });
        
        // Add delay to avoid nonce issues
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          user: 'demo_user',
          fileName: file.name,
          status: 'error',
          error: error.message
        });
      }
    }

    // Upload law enforcement files
    const leContract = getContractInstance(DEMO_ACCOUNTS.lawEnforcement.privateKey);
    for (const file of leFiles) {
      try {
        const buffer = Buffer.from(file.content);
        const ipfsHash = await uploadToIPFS(buffer, file.name);
        
        const tx = await leContract.uploadFile(
          ipfsHash,
          file.name,
          file.private,
          buffer.length,
          'text/plain',
          file.private ? 'le_encryption_key' : ''
        );
        
        await tx.wait().catch(error => {
          console.error('Demo data upload transaction failed:', error);
          throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
        });
        results.push({
          user: 'law_enforcement',
          fileName: file.name,
          txHash: tx.hash,
          status: 'success'
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          user: 'law_enforcement',
          fileName: file.name,
          status: 'error',
          error: error.message
        });
      }
    }

    // Create some file sharing examples
    try {
      // User shares a public document with law enforcement
      const shareUserToLE = await userContract.shareFile(1, DEMO_ACCOUNTS.lawEnforcement.address);
      await shareUserToLE.wait().catch(error => {
        console.error('Demo data share transaction failed:', error);
        throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
      });
      results.push({
        action: 'share',
        from: 'demo_user',
        to: 'law_enforcement',
        fileId: 1,
        status: 'success'
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Law enforcement shares public notice with user
      const shareLEToUser = await leContract.shareFile(6, DEMO_ACCOUNTS.user.address);
      await shareLEToUser.wait().catch(error => {
        console.error('Demo data share transaction failed:', error);
        throw new Error('Blockchain transaction failed. This may be due to invalid private keys.');
      });
      results.push({
        action: 'share',
        from: 'law_enforcement',
        to: 'demo_user',
        fileId: 6,
        status: 'success'
      });
    } catch (error) {
      results.push({
        action: 'share',
        status: 'error',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: `Demo data populated successfully${usingMockIPFS ? ' (using mock IPFS)' : ''}`,
      mockIPFS: usingMockIPFS,
      results: results
    });

  } catch (error) {
    console.error('Demo populate error:', error);
    res.status(500).json({ 
      error: 'Failed to populate demo data', 
      details: error.message 
    });
  }
});

// Health check endpoint (legacy)
app.get('/api/health', (req, res) => {
  res.redirect('/api/status');
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 BlockDAG File Storage API running on port ${PORT}`);
  console.log(`📋 Status check: http://localhost:${PORT}/api/status`);
  console.log(`📁 Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`👤 Demo User: ${DEMO_ACCOUNTS.user.address}`);
  console.log(`🚔 Demo Law Enforcement: ${DEMO_ACCOUNTS.lawEnforcement.address}`);
  
  // Show IPFS status
  if (usingMockIPFS) {
    console.log(`🔧 Using Mock IPFS (real IPFS daemon not found)`);
    console.log(`💡 To use real IPFS: install and run 'ipfs daemon'`);
  } else {
    console.log(`✅ Connected to IPFS daemon`);
  }
  
  // Show private key status
  if (DEMO_ACCOUNTS.user.privateKey === '0x' + '0'.repeat(64) ||
      DEMO_ACCOUNTS.lawEnforcement.privateKey === '0x' + '0'.repeat(64)) {
    console.log(`⚠️  Using Mock Private Keys (blockchain operations will fail)`);
    console.log(`💡 To enable blockchain operations: set valid private keys in .env file`);
  } else {
    console.log(`✅ Using Valid Private Keys (blockchain operations should work)`);
  }
  
  console.log('\n📖 Available Endpoints:');
  console.log('  POST /api/files/upload - Upload a file');
  console.log('  GET /api/files/user/:address - Get user files');
  console.log('  GET /api/files/public - Get all public files');
  console.log('  GET /api/files/:fileId - Get file details');
  console.log('  POST /api/files/:fileId/share - Share a file');
  console.log('  DELETE /api/files/:fileId - Delete a file');
  console.log('  GET /api/files/shared-by/:address - Get files shared by user');
  console.log('  GET /api/files/shared-with/:address - Get files shared with user');
  console.log('  POST /api/demo/populate - Populate demo data');
  console.log('  GET /api/status - System status');
});

module.exports = app;
