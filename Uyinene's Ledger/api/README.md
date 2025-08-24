BlockDAG File Storage API
A RESTful API for interacting with the BlockDAG File Storage System smart contract. This API provides endpoints for file upload, sharing, deletion, and retrieval with role-based access control.

🚀 Quick Start
Prerequisites
Node.js (v16 or higher)
IPFS node running locally
Access to BlockDAG Primordial network
Private keys for demo accounts
Installation
Clone and setup:
bash
git clone <repository-url>
cd api
npm install
Setup environment:
bash
cp .env.example .env
# Edit .env with your private keys and configuration
Start IPFS daemon:
bash
# Install IPFS if not already installed
# https://docs.ipfs.tech/install/command-line/
ipfs daemon
Start the API:
bash
npm run dev
The API will be available at http://localhost:3000

Environment Configuration
Edit the .env file with your actual values:

env
# Server
PORT=3000

# Demo Account Private Keys (REQUIRED)
USER_PRIVATE_KEY=0x1234567890abcdef...
LAW_ENFORCEMENT_PRIVATE_KEY=0xfedcba0987654321...

# IPFS (optional if running locally)
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
⚠️ Security Warning: Never commit actual private keys to version control!

🧪 Demo Data
Populate the blockchain with demo files for testing:

bash
npm run populate-demo
Or manually:

bash
curl -X POST http://localhost:3000/api/demo/populate
This creates:

User files: Personal documents, contracts, reports
Law Enforcement files: Case files, public notices, evidence logs
Sharing relationships: Cross-sharing between accounts
📖 API Endpoints
File Operations
Method	Endpoint	Description
POST	/api/files/upload	Upload a new file
GET	/api/files/:fileId	Get file details
DELETE	/api/files/:fileId	Delete a file
POST	/api/files/:fileId/share	Share file with user
File Queries
Method	Endpoint	Description
GET	/api/files/public	Get all public files
GET	/api/files/user/:address	Get user's files
GET	/api/files/shared-by/:address	Files shared by user
GET	/api/files/shared-with/:address	Files shared with user
System
Method	Endpoint	Description
GET	/api/health	API health check
POST	/api/demo/populate	Populate demo data
🔧 Usage Examples
Upload a File
bash
curl -X POST \
  -F "file=@document.pdf" \
  -F "userAddress=0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c" \
  -F "isPrivate=false" \
  http://localhost:3000/api/files/upload
Get Public Files
bash
curl http://localhost:3000/api/files/public
Share a File
bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c",
    "recipientAddress": "0x0a213702b6050FbF645925dAb4a143F0002a4B97"
  }' \
  http://localhost:3000/api/files/1/share
Get User Files
bash
curl http://localhost:3000/api/files/user/0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c
🧪 Testing
Run the comprehensive test suite:

bash
node test-api.js
This will test all endpoints and provide a detailed report.

Manual Testing
Health Check:
bash
curl http://localhost:3000/api/health
Populate Demo Data:
bash
curl -X POST http://localhost:3000/api/demo/populate
Test File Retrieval:
bash
curl http://localhost:3000/api/files/public
📊 Demo Accounts
The system uses two demo accounts:

User Account
Address: 0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c
Role: Regular user
Can: Upload files, share own files, access public files
Law Enforcement Account
Address: 0x0a213702b6050FbF645925dAb4a143F0002a4B97
Role: Law enforcement
Can: Upload files, access all files, view system statistics
🔍 Demo Files Created
After populating demo data:

User Files
Personal_Document.pdf (Public)
Private_Contract.docx (Private)
Public_Report.txt (Public)
Confidential_Data.xlsx (Private)
Law Enforcement Files
Case_File_001.pdf (Private)
Public_Notice.txt (Public)
Evidence_Log.csv (Private)
Sharing Examples
User shares personal document with LE
LE shares public notice with user
🔧 Troubleshooting
Common Issues
IPFS Connection Error
bash
# Make sure IPFS is running
ipfs daemon
Private Key Error
bash
# Check .env file has valid private keys
echo $USER_PRIVATE_KEY
Network Connection
bash
# Test BlockDAG connectivity
curl https://rpc.primordial.bdagscan.com
Port Already in Use
bash
# Change port in .env or kill existing process
lsof -ti:3000 | xargs kill
Debug Mode
Start with verbose logging:

bash
DEBUG=* npm run dev
🔒 Security Notes
Private Keys: Use environment variables, never hardcode
Production: Implement proper authentication/authorization
HTTPS: Always use HTTPS in production
Rate Limiting: Add rate limiting for public APIs
Input Validation: All inputs are validated, but add more as needed
File Size: Current limit is 50MB per file
📁 Project Structure
api/
├── server.js              # Main API server
├── package.json           # Dependencies and scripts
├── .env.example          # Environment template
├── test-api.js           # Test script
├── README.md             # This file
└── docs/
    └── api-documentation.md  # Detailed API docs
🔗 Related Components
Smart Contract: ../contracts/hardhat/contracts/FileStorageManager.sol
Frontend: (To be developed)
IPFS: Local or remote IPFS node
BlockDAG: Primordial testnet
📚 Additional Resources
API Documentation
Smart Contract Documentation
BlockDAG Documentation
IPFS Documentation
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests
Submit a pull request
📄 License
MIT License - see LICENSE file for details.

🆘 Support
For issues or questions:

Check the troubleshooting section
Review the API documentation
Test with the provided test script
Check IPFS and blockchain connectivity
Happy coding! 🚀

