import { expect } from "chai";
import { ethers } from "hardhat";
import { CertificateRegistry } from "../typechain-types";

describe("CertificateRegistry", function () {
  let contract: CertificateRegistry;
  let owner: any;
  let addr1: any;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("CertificateRegistry");
    contract = (await ContractFactory.deploy()) as CertificateRegistry;
    await contract.waitForDeployment();
  });

  it("Should issue a new certificate successfully", async function () {
    await contract.issueCertificate(1, "Ivan Ivanov", "Blockchain Basics");
    const cert = await contract.verifyCertificate(1);
    
    expect(cert.studentName).to.equal("Ivan Ivanov");
    expect(cert.isIssued).to.be.true;
  });

  it("Should emit CertificateIssued event", async function () {
    await expect(contract.issueCertificate(2, "Anna Smith", "Solidity 101"))
      .to.emit(contract, "CertificateIssued")
      .withArgs(2, "Anna Smith", "Solidity 101");
  });

  it("Should revert if non-admin tries to issue", async function () {
    await expect(
      contract.connect(addr1).issueCertificate(3, "Hacker", "Fake Course")
    ).to.be.revertedWith("Only admin can issue certificates");
  });
});