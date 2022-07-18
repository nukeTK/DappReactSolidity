const main = async () => {
  const Contract = await ethers.getContractFactory("Lottery");
  const contractDeploy = await Contract.deploy();
  console.log("Contract address:", contractDeploy.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
