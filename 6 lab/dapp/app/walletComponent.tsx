"use client";
import { useState } from "react";
import { ConnectWalletClient, ConnectPublicClient, switchToSepolia } from "./client";
import { Address } from "viem";

export default function WalletComponent() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  async function handleClick() {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        alert("MetaMask is not installed. Please install it.");
        return;
      }

      // Переключаем на Sepolia
      await switchToSepolia();
      
      const walletClient = ConnectWalletClient();
      const publicClient = ConnectPublicClient();
      
      const addresses = await walletClient.requestAddresses();
      
      if (!addresses || addresses.length === 0) {
        alert("No accounts found. Please connect your wallet.");
        return;
      }

      const address = addresses[0] as Address;
      const balance = await publicClient.getBalance({ address });
      
      setAddress(address);
      setBalance(balance);
    } catch (error: any) {
      console.error("Connection error:", error);
      if (error.code === 4001 || error.code === 1001) {
        alert("You rejected the connection request.");
      } else {
        alert(`Connection failed: ${error.message || error}`);
      }
    }
  }

  return (
    <div className="card">
      <Status address={address} balance={balance} />
      <button 
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-blue-500 text-white hover:bg-blue-600" 
        onClick={handleClick}
      >
        <h1 className="mx-auto">Connect Wallet</h1>
      </button>
    </div>
  );
}

function Status({
  address,
  balance,
}: {
  address: string;
  balance: bigint;
}) {
  if (!address) {
    return (
      <div className="flex items-center mb-4">
        <div className="border bg-red-600 border-red-600 rounded-full w-2 h-2 mr-2"></div>
        <div>Disconnected</div>
      </div>
    );
  }
  
  const ethBalance = Number(balance) / 1e18;
  
  return (
    <div className="flex items-center w-full mb-4">
      <div className="border bg-green-500 border-green-500 rounded-full w-2 h-2 mr-2"></div>
      <div className="text-sm md:text-base break-all">
        <div><b>Address:</b> {address}</div>
        <div><b>Balance:</b> {ethBalance.toFixed(4)} ETH ({balance.toString()} Wei)</div>
      </div>
    </div>
  );
}