#!/usr/bin/env node

/**
 * BlockDAG File Storage API Startup Script
 * 
 * This script provides multiple options for running the API:
 * 1. With Mock IPFS (no IPFS installation needed)
 * 2. With Docker IPFS
 * 3. With Local IPFS installation
 * 4. Start Mock IPFS server separately
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkEnvFile() {
  if (!checkFileExists('.env')) {
    log('⚠️  .env file not found!', 'yellow');
    log('Creating .env from .env.example...', 'yellow');
    
    if (checkFileExists('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      log('✅ .env file created. Please edit it with your private keys.', 'green');
      log('📝 Edit .env file with: nano .env', 'cyan');
      return false;
    } else {
      log('❌ .env.example not found. Please create .env manually.', 'red');
      return false;
    }
  }
  return true;
}

function checkDockerInstalled() {
  return new Promise((resolve) => {
    exec('docker --version', (error) => {
      resolve(!error);
    });
  });
}

function checkIPFSRunning() {
  return new Promise((resolve) => {
    exec('curl -s http://localhost:3000/api/v0/version', (error) => {
      resolve(!error);
    });
  });
}

async function startMockIPFS() {
  log('🚀 Starting Mock IPFS Server...', 'cyan');
  
  const mockIPFSScript = `
const express = require('express');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = 3000;
const mockStorage = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

function generateMockHash(data) {
  return 'Qm' + crypto.createHash('sha256').update(data).digest('hex').substring(0, 44);
}

app.post('/api/v0/add', upload.single('file'), (req, res) => {
  try {
    let fileData, fileName = 'unknown';
    if (req.file) {
      fileData = req.file.buffer;
      fileName = req.file.originalname || 'uploaded-file';
    } else if (req.body && req.body.data) {
      fileData = Buffer.from(req.body.data);
    } else {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const hash = generateMockHash(fileData);
    mockStorage.set(hash, { data: fileData, name: fileName, size: fileData.length });
    
    console.log(\`📁 Mock IPFS: Added "\${fileName}" with hash \${hash}\`);
    res.json({ Name: fileName, Hash: hash, Size: fileData.length.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add file' });
  }
});

app.get('/api/v0/cat', (req, res) => {
  const hash = req.query.arg;
  const file = mockStorage.get(hash);
  if (!file) return res.status(404).json({ error: 'File not found' });
  res.send(file.data);
});

app.post('/api/v0/version', (req, res) => {
  res.json({ Version: '0.22.0-mock' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', type: 'mock-ipfs', files: mockStorage.size });
});

app.listen(PORT, () => {
  console.log(\`🚀 Mock IPFS Server running on port \${PORT}\`);
});
`;

  // Write temporary mock IPFS server
  fs.writeFileSync('temp-mock-ipfs.js', mockIPFSScript);
  
  const mockProcess = spawn('node', ['temp-mock-ipfs.js'], {
    stdio: 'pipe'
  });

  mockProcess.stdout.on('data', (data) => {
    process.stdout.write(`[Mock IPFS] ${data}`);
  });

  mockProcess.stderr.on('data', (data) => {
    process.stderr.write(`[Mock IPFS Error] ${data}`);
  });

  // Wait a bit for mock IPFS to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return mockProcess;
}

async function startDockerIPFS() {
  log('🐳 Starting Docker IPFS...', 'cyan');
  
  const dockerCompose = `version: '3.8'
services:
  ipfs:
    image: ipfs/kubo:latest
    container_name: blockdag-ipfs
    ports:
      - "4001:4001"
      - "3000:3000"
      - "8080:8080"
    volumes:
      - ./ipfs-data:/data/ipfs
    environment:
      - IPFS_PROFILE=server
    restart: unless-stopped`;
  
  fs.writeFileSync('docker-compose-ipfs.yml', dockerCompose);
  
  return new Promise((resolve, reject) => {
    const dockerProcess = spawn('docker-compose', ['-f', 'docker-compose-ipfs.yml', 'up', '-d'], {
      stdio: 'pipe'
    });
    
    dockerProcess.on('close', (code) => {
      if (code === 0) {
        log('✅ Docker IPFS started successfully', 'green');
        resolve();
      } else {
        reject(new Error(`Docker IPFS failed to start (exit code: ${code})`));
      }
    });
  });
}

async function startAPI() {
  log('🚀 Starting BlockDAG File Storage API...', 'cyan');
  
  const apiProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  return apiProcess;
}

async function main() {
  log('🎯 BlockDAG File Storage API Startup', 'blue');
  log('=' * 40, 'blue');
  
  // Check prerequisites
  if (!checkEnvFile()) {
    log('❌ Please configure .env file first', 'red');
    process.exit(1);
  }
  
  log('\n📋 Select startup option:', 'yellow');
  log('1. 🔧 Mock IPFS (Recommended - No IPFS installation needed)');
  log('2. 🐳 Docker IPFS (Requires Docker)');
  log('3. 📁 Local IPFS (Requires IPFS installed)');
  log('4. 🚀 API Only (IPFS already running)');
  log('5. 🧪 Start Mock IPFS Server Only');
  
  // Get user choice
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const choice = await new Promise((resolve) => {
    rl.question('\nEnter your choice (1-5): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
  
  let ipfsProcess = null;
  
  switch (choice) {
    case '1':
      log('\n🔧 Starting with Mock IPFS...', 'cyan');
      log('✅ No IPFS installation required!', 'green');
      // Mock IPFS is handled automatically in the API
      break;
      
    case '2':
      const hasDocker = await checkDockerInstalled();
      if (!hasDocker) {
        log('❌ Docker not found. Please install Docker first.', 'red');
        process.exit(1);
      }
      await startDockerIPFS();
      // Wait for Docker IPFS to be ready
      await new Promise(resolve => setTimeout(resolve, 10000));
      break;
      
    case '3':
      log('\n📁 Using Local IPFS...', 'cyan');
      const isIPFSRunning = await checkIPFSRunning();
      if (!isIPFSRunning) {
        log('❌ IPFS not running. Please start with: ipfs daemon', 'red');
        process.exit(1);
      }
      log('✅ IPFS daemon detected', 'green');
      break;
      
    case '4':
      log('\n🚀 Starting API only...', 'cyan');
      break;
      
    case '5':
      ipfsProcess = await startMockIPFS();
      log('✅ Mock IPFS Server started on port 3000', 'green');
      log('🔗 Health check: http://localhost:3000/health', 'cyan');
      log('Press Ctrl+C to stop', 'yellow');
      
      // Keep process alive
      process.on('SIGINT', () => {
        log('\n🛑 Stopping Mock IPFS Server...', 'yellow');
        ipfsProcess.kill();
        fs.unlinkSync('temp-mock-ipfs.js');
        process.exit(0);
      });
      
      return; // Don't start API, just mock IPFS
      
    default:
      log('❌ Invalid choice. Exiting.', 'red');
      process.exit(1);
  }
  
  // Start the main API
  log('\n🚀 Starting API Server...', 'cyan');
  const apiProcess = await startAPI();
  
  // Handle cleanup
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down...', 'yellow');
    
    if (apiProcess) apiProcess.kill();
    if (ipfsProcess) ipfsProcess.kill();
    
    // Cleanup temp files
    ['temp-mock-ipfs.js', 'docker-compose-ipfs.yml'].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
    
    log('👋 Goodbye!', 'green');
    process.exit(0);
  });
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(error => {
    log(`💥 Startup failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main };