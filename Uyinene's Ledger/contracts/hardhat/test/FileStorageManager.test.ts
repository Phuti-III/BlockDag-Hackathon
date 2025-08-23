import { expect } from "chai";
import { ethers } from "hardhat";
import { FileStorageManager } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("FileStorageManager", function () {
  let fileStorageManager : FileStorageManager;
  let admin : HardhatEthersSigner;
  let user1 : HardhatEthersSigner;
  let user2 : HardhatEthersSigner;
  let lawEnforcement : HardhatEthersSigner;
  let unauthorizedUser : HardhatEthersSigner;

  // Test data constants
  const MOCK_IPFS_HASH = "QmTest123456789abcdef";
  const MOCK_FILE_NAME = "test-document.pdf";
  const MOCK_FILE_SIZE = 1024;
  const MOCK_FILE_TYPE = "application/pdf";
  const MOCK_ENCRYPTION_KEY = "encrypted_key_123";

  beforeEach(async function () {
    // Get signers
    [admin, user1, user2, lawEnforcement, unauthorizedUser] = await ethers.getSigners();

    // Deploy FileStorageManager
    const FileStorageManager = await ethers.getContractFactory("FileStorageManager");
    fileStorageManager = await FileStorageManager.deploy();
    await fileStorageManager.waitForDeployment();

    // Setup roles
    const LE_ROLE = await fileStorageManager.LAW_ENFORCEMENT_ROLE();
    await fileStorageManager.connect(admin).grantLawEnforcementRole(lawEnforcement.address);
    
    console.log("Contract deployed at:", await fileStorageManager.getAddress());
    console.log("Admin:", admin.address);
    console.log("Law Enforcement:", lawEnforcement.address);
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial state", async function () {
      expect(await fileStorageManager.fileCounter()).to.equal(0);
      expect(await fileStorageManager.totalStorageUsed()).to.equal(0);
      
      // Check admin role
      const adminRole = await fileStorageManager.ADMIN_ROLE();
      expect(await fileStorageManager.hasRole(adminRole, admin.address)).to.be.true;
    });

    it("Should grant law enforcement role correctly", async function () {
      const leRole = await fileStorageManager.LAW_ENFORCEMENT_ROLE();
      expect(await fileStorageManager.hasRole(leRole, lawEnforcement.address)).to.be.true;
    });
  });

  describe("File Upload", function () {
    it("Should allow users to upload public files", async function () {
      const tx = await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        false, // public
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );

      await expect(tx)
        .to.emit(fileStorageManager, "FileUploaded")
        .withArgs(1, user1.address, MOCK_IPFS_HASH, MOCK_FILE_NAME, false);

      expect(await fileStorageManager.fileCounter()).to.equal(1);
      expect(await fileStorageManager.totalStorageUsed()).to.equal(MOCK_FILE_SIZE);
    });

    it("Should allow users to upload private files", async function () {
      const tx = await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        true, // private
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );

      await expect(tx)
        .to.emit(fileStorageManager, "FileUploaded")
        .withArgs(1, user1.address, MOCK_IPFS_HASH, MOCK_FILE_NAME, true);

      const file = await fileStorageManager.connect(user1).getFile(1);
      expect(file.isPrivate).to.be.true;
      expect(file.encryptionKey).to.equal(MOCK_ENCRYPTION_KEY);
    });

    it("Should reject invalid file uploads", async function () {
      // Empty IPFS hash
      await expect(
        fileStorageManager.connect(user1).uploadFile("", MOCK_FILE_NAME, false, MOCK_FILE_SIZE, MOCK_FILE_TYPE, "")
      ).to.be.revertedWith("IPFS hash cannot be empty");

      // Empty file name
      await expect(
        fileStorageManager.connect(user1).uploadFile(MOCK_IPFS_HASH, "", false, MOCK_FILE_SIZE, MOCK_FILE_TYPE, "")
      ).to.be.revertedWith("File name cannot be empty");

      // Zero file size
      await expect(
        fileStorageManager.connect(user1).uploadFile(MOCK_IPFS_HASH, MOCK_FILE_NAME, false, 0, MOCK_FILE_TYPE, "")
      ).to.be.revertedWith("File size must be greater than 0");
    });
  });

  describe("File Retrieval", function () {
    beforeEach(async function () {
      // Upload test files
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "1",
        "public-file.pdf",
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
      
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "2",
        "private-file.pdf",
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
    });

    it("Should allow file owner to retrieve their files", async function () {
      const file1 = await fileStorageManager.connect(user1).getFile(1);
      const file2 = await fileStorageManager.connect(user1).getFile(2);

      expect(file1.owner).to.equal(user1.address);
      expect(file1.fileName).to.equal("public-file.pdf");
      expect(file2.owner).to.equal(user1.address);
      expect(file2.fileName).to.equal("private-file.pdf");
    });

    it("Should allow anyone to view public files", async function () {
      const file = await fileStorageManager.connect(user2).getFile(1);
      expect(file.fileName).to.equal("public-file.pdf");
      expect(file.isPrivate).to.be.false;
    });

    it("Should prevent unauthorized access to private files", async function () {
      await expect(
        fileStorageManager.connect(user2).getFile(2)
      ).to.be.revertedWith("Unauthorized access");
    });

    it("Should allow law enforcement to view all files", async function () {
      const publicFile = await fileStorageManager.connect(lawEnforcement).getFile(1);
      const privateFile = await fileStorageManager.connect(lawEnforcement).getFile(2);

      expect(publicFile.fileName).to.equal("public-file.pdf");
      expect(privateFile.fileName).to.equal("private-file.pdf");
    });
  });

  describe("File Sharing", function () {
    beforeEach(async function () {
      // Upload a private file
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
    });

    it("Should allow file owner to share files", async function () {
      const tx = await fileStorageManager.connect(user1).shareFile(1, user2.address);
      
      await expect(tx)
        .to.emit(fileStorageManager, "FileShared")
        .withArgs(1, user1.address, user2.address);

      // Check if user2 can now access the file
      const file = await fileStorageManager.connect(user2).getFile(1);
      expect(file.fileName).to.equal(MOCK_FILE_NAME);
    });

    it("Should prevent non-owners from sharing files", async function () {
      await expect(
        fileStorageManager.connect(user2).shareFile(1, unauthorizedUser.address)
      ).to.be.revertedWith("Not file owner");
    });

    it("Should prevent sharing with invalid addresses", async function () {
      await expect(
        fileStorageManager.connect(user1).shareFile(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should prevent sharing with self", async function () {
      await expect(
        fileStorageManager.connect(user1).shareFile(1, user1.address)
      ).to.be.revertedWith("Cannot share with yourself");
    });
  });

  describe("File Deletion", function () {
    beforeEach(async function () {
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
    });

    it("Should allow file owner to delete files", async function () {
      const tx = await fileStorageManager.connect(user1).deleteFile(1);
      
      await expect(tx)
        .to.emit(fileStorageManager, "FileDeleted")
        .withArgs(1, user1.address);

      // File should be marked as deleted
      await expect(
        fileStorageManager.connect(user1).getFile(1)
      ).to.be.revertedWith("File has been deleted");

      // Storage should be updated
      expect(await fileStorageManager.totalStorageUsed()).to.equal(0);
    });

    it("Should prevent non-owners from deleting files", async function () {
      await expect(
        fileStorageManager.connect(user2).deleteFile(1)
      ).to.be.revertedWith("Not file owner");
    });
  });

  describe("Law Enforcement Functions", function () {
    beforeEach(async function () {
      // Upload multiple files for testing
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "1",
        "user1-file1.pdf",
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
      
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "2",
        "user1-file2.pdf",
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
      
      await fileStorageManager.connect(user2).uploadFile(
        MOCK_IPFS_HASH + "3",
        "user2-file1.pdf",
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
    });

    it("Should allow law enforcement to view all files", async function () {
      const allFiles = await fileStorageManager.connect(lawEnforcement).getAllFiles();
      
      expect(allFiles.length).to.equal(3);
      expect(allFiles[0].fileName).to.equal("user1-file1.pdf");
      expect(allFiles[1].fileName).to.equal("user1-file2.pdf");
      expect(allFiles[2].fileName).to.equal("user2-file1.pdf");
    });

    it("Should prevent regular users from accessing getAllFiles", async function () {
      await expect(
        fileStorageManager.connect(user1).getAllFiles()
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role`);
    });

    it("Should allow law enforcement to view access logs", async function () {
      // Access a file to generate logs
      await fileStorageManager.connect(user1).getFile(1);
      
      const accessLogs = await fileStorageManager.connect(lawEnforcement).getFileAccessLogs(1);
      expect(accessLogs.length).to.be.greaterThan(0);
      expect(accessLogs[0].accessor).to.equal(user1.address);
    });

    it("Should allow law enforcement to get system statistics", async function () {
      const [totalFiles, totalStorage, activeFiles] = await fileStorageManager
        .connect(lawEnforcement)
        .getSystemStats();
      
      expect(totalFiles).to.equal(3);
      expect(totalStorage).to.equal(MOCK_FILE_SIZE * 3);
      expect(activeFiles).to.equal(3);
      
      // Delete a file and check stats again
      await fileStorageManager.connect(user1).deleteFile(1);
      
      const [, newTotalStorage, newActiveFiles] = await fileStorageManager
        .connect(lawEnforcement)
        .getSystemStats();
      
      expect(newTotalStorage).to.equal(MOCK_FILE_SIZE * 2);
      expect(newActiveFiles).to.equal(2);
    });

    it("Should prevent regular users from accessing law enforcement functions", async function () {
      await expect(
        fileStorageManager.connect(user1).getFileAccessLogs(1)
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role`);
      
      await expect(
        fileStorageManager.connect(user1).getSystemStats()
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role`);
    });
  });

  describe("User File Management", function () {
    beforeEach(async function () {
      // User1 uploads files
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "1",
        "user1-doc1.pdf",
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
      
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "2",
        "user1-doc2.pdf",
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
      
      // User2 uploads a file
      await fileStorageManager.connect(user2).uploadFile(
        MOCK_IPFS_HASH + "3",
        "user2-doc1.pdf",
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
      
      // Share user1's first file with user2
      await fileStorageManager.connect(user1).shareFile(1, user2.address);
    });

    it("Should return correct user files", async function () {
      const user1Files = await fileStorageManager.getUserFiles(user1.address);
      const user2Files = await fileStorageManager.getUserFiles(user2.address);
      
      expect(user1Files.length).to.equal(2);
      expect(user1Files[0]).to.equal(1);
      expect(user1Files[1]).to.equal(2);
      
      expect(user2Files.length).to.equal(1);
      expect(user2Files[0]).to.equal(3);
    });

    it("Should return correct shared files", async function () {
      const user2SharedFiles = await fileStorageManager.getSharedFiles(user2.address);
      
      expect(user2SharedFiles.length).to.equal(1);
      expect(user2SharedFiles[0]).to.equal(1);
    });

    it("Should return empty arrays for users with no files", async function () {
      const noFiles = await fileStorageManager.getUserFiles(unauthorizedUser.address);
      const noSharedFiles = await fileStorageManager.getSharedFiles(unauthorizedUser.address);
      
      expect(noFiles.length).to.equal(0);
      expect(noSharedFiles.length).to.equal(0);
    });
  });

  describe("Public Files", function () {
    beforeEach(async function () {
      // Upload public and private files
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "1",
        "public-doc1.pdf",
        false, // public
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
      
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH + "2",
        "private-doc1.pdf",
        true, // private
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
      
      await fileStorageManager.connect(user2).uploadFile(
        MOCK_IPFS_HASH + "3",
        "public-doc2.pdf",
        false, // public
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
    });

    it("Should return only public files", async function () {
      const publicFiles = await fileStorageManager.getPublicFiles();
      
      expect(publicFiles.length).to.equal(2);
      expect(publicFiles[0].fileName).to.equal("public-doc1.pdf");
      expect(publicFiles[0].isPrivate).to.be.false;
      expect(publicFiles[1].fileName).to.equal("public-doc2.pdf");
      expect(publicFiles[1].isPrivate).to.be.false;
    });

    it("Should not include deleted public files", async function () {
      // Delete a public file
      await fileStorageManager.connect(user1).deleteFile(1);
      
      const publicFiles = await fileStorageManager.getPublicFiles();
      expect(publicFiles.length).to.equal(1);
      expect(publicFiles[0].fileName).to.equal("public-doc2.pdf");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to grant law enforcement roles", async function () {
      const newLE = unauthorizedUser;
      
      await fileStorageManager.connect(admin).grantLawEnforcementRole(newLE.address);
      
      const leRole = await fileStorageManager.LAW_ENFORCEMENT_ROLE();
      expect(await fileStorageManager.hasRole(leRole, newLE.address)).to.be.true;
    });

    it("Should allow admin to revoke law enforcement roles", async function () {
      await fileStorageManager.connect(admin).revokeLawEnforcementRole(lawEnforcement.address);
      
      const leRole = await fileStorageManager.LAW_ENFORCEMENT_ROLE();
      expect(await fileStorageManager.hasRole(leRole, lawEnforcement.address)).to.be.false;
    });

    it("Should allow admin to pause and unpause contract", async function () {
      await fileStorageManager.connect(admin).pause();
      expect(await fileStorageManager.paused()).to.be.true;
      
      // Should prevent file uploads when paused
      await expect(
        fileStorageManager.connect(user1).uploadFile(
          MOCK_IPFS_HASH,
          MOCK_FILE_NAME,
          false,
          MOCK_FILE_SIZE,
          MOCK_FILE_TYPE,
          ""
        )
      ).to.be.revertedWith("Pausable: paused");
      
      await fileStorageManager.connect(admin).unpause();
      expect(await fileStorageManager.paused()).to.be.false;
    });

    it("Should prevent non-admins from using admin functions", async function () {
      await expect(
        fileStorageManager.connect(user1).grantLawEnforcementRole(user2.address)
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role`);
      
      await expect(
        fileStorageManager.connect(user1).pause()
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role`);
    });
  });

  describe("Access Logging", function () {
    beforeEach(async function () {
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
    });

    it("Should log file access correctly", async function () {
      // Access the file
      await fileStorageManager.connect(user2).getFile(1);
      
      const accessLogs = await fileStorageManager.connect(lawEnforcement).getFileAccessLogs(1);
      
      // Should have upload log and access log
      expect(accessLogs.length).to.be.greaterThan(0);
      
      const accessLog = accessLogs.find(log => log.action === "upload");
      expect(accessLog?.accessor).to.equal(user1.address);
    });

    it("Should emit FileAccessed event", async function () {
      await expect(fileStorageManager.connect(user2).getFile(1))
        .to.emit(fileStorageManager, "FileAccessed");
    });

    it("Should emit LawEnforcementAccess event for LE users", async function () {
      await expect(fileStorageManager.connect(lawEnforcement).getFile(1))
        .to.emit(fileStorageManager, "LawEnforcementAccess")
        .withArgs(1, lawEnforcement.address, "upload");
    });
  });

  describe("Edge Cases and Error Handling", function () {
    it("Should handle non-existent file IDs", async function () {
      await expect(
        fileStorageManager.connect(user1).getFile(999)
      ).to.be.revertedWith("File does not exist");
    });

    it("Should handle sharing non-existent files", async function () {
      await expect(
        fileStorageManager.connect(user1).shareFile(999, user2.address)
      ).to.be.revertedWith("File does not exist");
    });

    it("Should handle deleting non-existent files", async function () {
      await expect(
        fileStorageManager.connect(user1).deleteFile(999)
      ).to.be.revertedWith("File does not exist");
    });

    it("Should prevent duplicate sharing", async function () {
      // Upload a file and share it
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
      
      await fileStorageManager.connect(user1).shareFile(1, user2.address);
      
      // Try to share again
      await expect(
        fileStorageManager.connect(user1).shareFile(1, user2.address)
      ).to.be.revertedWith("File already shared with recipient");
    });
  });

  describe("Gas Usage Tests", function () {
    it("Should use reasonable gas for file upload", async function () {
      const tx = await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        false,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        ""
      );
      
      const receipt = await tx.wait();
      console.log("Gas used for file upload:", receipt?.gasUsed.toString());
      
      // Assert reasonable gas usage (adjust threshold as needed)
      expect(receipt?.gasUsed).to.be.lessThan(500000);
    });

    it("Should use reasonable gas for file sharing", async function () {
      // First upload a file
      await fileStorageManager.connect(user1).uploadFile(
        MOCK_IPFS_HASH,
        MOCK_FILE_NAME,
        true,
        MOCK_FILE_SIZE,
        MOCK_FILE_TYPE,
        MOCK_ENCRYPTION_KEY
      );
      
      const tx = await fileStorageManager.connect(user1).shareFile(1, user2.address);
      const receipt = await tx.wait();
      
      console.log("Gas used for file sharing:", receipt?.gasUsed.toString());
      expect(receipt?.gasUsed).to.be.lessThan(200000);
    });
  });
});