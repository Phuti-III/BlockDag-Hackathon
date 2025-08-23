import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BDAG");

  if (balance == 0n){
    throw new Error("Deployer account has no BDAG tokens. Please fund the account before deployment.");
  }

  console.log("Deploying Greeter contract...");

  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello BlockDAG!", {
    gasLimit: 1000000,
  });
  console.log("Waiting for deployment transaction to be mined...");
  await greeter.waitForDeployment();

  const address = await greeter.getAddress();
  console.log("Greeter deployed to:", address);

  try{
    const greeting = await greeter.greet();
    console.log("Contract verification - Greeting:", greeting);
  }catch (error){
    console.error("Contract verification failed:", error);
  }
  //Deployment details
  console.log("\n Deployment Summary:");
  console.log("Contract Address:", address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("Deployer:", deployer.address);
}

main()
  .then(() =>{
    console.log("Deployment completed successfully");
   process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
