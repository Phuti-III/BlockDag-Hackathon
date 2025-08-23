import { ethers } from "hardhat";
import {FileStorageManager} from "../typechain-types"

interface DeploymentResults{
  contractAddress: string;
  deploymentTxHash: string;
  blockNumber: number;
  gasUsed: string;
  deployer: string;
}

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  console.log(" Starting deployment to BlockDAG Primordial...");
  console.log(" Network:", (await ethers.provider.getNetwork()).name);
  console.log(" Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BDAG");

  if (balance == 0n){
    throw new Error("Deployer account has no BDAG tokens. Please fund the account before deployment.");
  }
  try{
    console.log("Deploying FileStorageManager contract...");

    const FileStorageManager = await ethers.getContractFactory("FileStorageManager");

    const deploymentTx = await FileStorageManager.getDeployTransaction();
    const estimatedGas = await ethers.provider.estimateGas(deploymentTx);
    console.log("Estimated gas for deployment:", estimatedGas.toString());
    
    const fileStorageManager: FileStorageManager = await FileStorageManager.deploy(
      {
        gasLimit: estimatedGas + BigInt(50000),
        gasPrice: ethers.parseUnits("50", "gwei")
      }
    );

    console.log("Waiting for deployment confirmation...");
    const deploymentReceipt = await fileStorageManager.waitForDeployment();
    
    const contractAddress = await fileStorageManager.getAddress();
   const deploymentTxReceipt = await fileStorageManager.deploymentTransaction();

    if (!deploymentTxReceipt){
      throw new Error("Deployment transaction not found");
    }
    const receipt = await deploymentTxReceipt.wait();
    if (!receipt) {
      throw new Error("Transaction receipt not found");
    }
    console.log(" FileStorageManager deployed successfully!");
    console.log(" Contract address:", contractAddress);
    console.log(" Transaction hash:", deploymentTxReceipt.hash);
    console.log("  Block number:", receipt.blockNumber);
    console.log(" Gas used:", receipt.gasUsed.toString());
    
    // Verify contract is working
    console.log("\n Verifying contract deployment...");

    const fileCounter = await fileStorageManager.fileCounter();
    console.log("Initial file counter:", fileCounter.toString());

    const hasAdminRole = await fileStorageManager.hasRole(
      await fileStorageManager.DEFAULT_ADMIN_ROLE(),
      deployer.address
    );
    console.log("Deployer has admin role:", hasAdminRole); 

    const deploymentInfo: DeploymentResults = {
      contractAddress,
      deploymentTxHash: deploymentTxReceipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      deployer: deployer.address
    }
    
    const fs = require('fs');
    const path = require('path');
    
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    const deploymentPath = path.join(deploymentsDir, 'primordial.json');
    fs.writeFileSync(deploymentPath, JSON.stringify({
      ...deploymentInfo,
      network: "primordial",
      chainId: 1043,
      timestamp: new Date().toISOString(),
      contractName: "FileStorageManager"
    }, null, 2));

    console.log("Deployment info saved to:", deploymentPath);

    await setupInitialRoles(fileStorageManager, deployer);

    console.log("\n Deployment completed successfully!");
    console.log("\n Next Steps:");
    console.log("1. Verify the contract on the explorer");
    console.log("2. Set up law enforcement roles using scripts/setup-roles.ts");
    console.log("3. Test the contract functionality");
    console.log("4. Deploy frontend application");
  }catch (error) {
    console.error(" Deployment failed:", error);
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("insufficient funds")) {
        console.log(" Solution: Add more BDAG to your account");
      } else if (error.message.includes("gas")) {
        console.log(" Solution: Increase gas limit or gas price");
      } else if (error.message.includes("nonce")) {
        console.log(" Solution: Wait a moment and try again");
      }
    }
    process.exit(1);
  }
}

async function setupInitialRoles(contract:FileStorageManager, deployer: any): Promise<void>{
  console.log("\n Setting up initial roles...");
  try{
    const lawEnforcementAddressses = [
      "0xDF4fb5A45a042A1c174e4A55e32207Ca4B8DA43E",
      "0x0a213702b6050FbF645925dAb4a143F0002a4B97"
    ]
    for (const address of lawEnforcementAddressses){
      const tx = await contract.grantLawEnforcementRole(address);
      await tx.wait();
      console.log(` Granted LAW_ENFORCEMENT_ROLE to ${address}`);
    }
    console.log("Initial roles setup completed.");
  }catch (error) {
    console.error("Warning: Could not set up initial roles:", error);
  }
}

function formatGasPrice(gasPrice: bigint): string {
  return `${ethers.formatUnits(gasPrice, "gwei")} gwei`;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal Error:", error);
      process.exit(1);
    });
}

export {main as deployFileStorage};