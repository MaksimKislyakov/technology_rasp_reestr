"use client";
import { getContract, Address } from "viem";
import { erc20Abi } from "./erc20Abi";
import { ConnectWalletClient } from "./client";
import { useState } from "react";

export default function Erc20Component() {
  // По умолчанию стоит адрес USDC в Sepolia
  const [contractAddress, setContractAddress] = useState("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
  // Адрес, чей баланс хотим проверить
  const [walletAddress, setWalletAddress] = useState("");

  const setValue = (setter: any) => (evt: any) => setter(evt.target.value);
  const walletClient = ConnectWalletClient();

  async function buttonClick() {
    try {
      const checkedAddress = contractAddress as Address;
      const checkedWallet = walletAddress as Address;

      const contract = getContract({
        address: checkedAddress,
        abi: erc20Abi,
        client: walletClient,
      });

      // Чтение метаданных
      const symbol = await contract.read.symbol();
      const name = await contract.read.name();
      const decimals = await contract.read.decimals();
      const totalSupply = await contract.read.totalSupply();

      // Чтение баланса конкретного кошелька
      const balance = await contract.read.balanceOf([checkedWallet]);

      console.log(`Name: ${name}, Symbol: ${symbol}, Decimals: ${decimals}`);
      
      alert(`
        Name: ${name}
        Symbol: ${symbol}
        Decimals: ${decimals}
        Total Supply: ${totalSupply.toString()}
        Balance of ${walletAddress}: ${balance.toString()}
      `);
    } catch (error) {
      console.error(error);
      alert("Error getting token info. Check console.");
    }
  }

  return (
    <div className="card">
      <label>
        Contract Address:
        <input
          placeholder="ERC20 Address"
          value={contractAddress}
          onChange={setValue(setContractAddress)}
        ></input>
      </label>
      <br />
      <label>
        Check Balance For:
        <input
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={setValue(setWalletAddress)}
        ></input>
      </label>
      <br />
      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center mt-4 bg-green-500 text-white hover:bg-green-600"
        onClick={buttonClick}
      >
        <h1 className="text-center">Get ERC20 Info</h1>
      </button>
    </div>
  );
}