"use client";
import { useState } from "react";
import { parseGwei, Address } from "viem";
import { ConnectWalletClient, switchToSepolia } from "./client";

export default function TransactionComponent() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter: any) => (evt: any) => setter(evt.target.value);

  async function handleClick() {
    try {
      // Проверяем и переключаем сеть на Sepolia
      await switchToSepolia();
      
      const walletClient = ConnectWalletClient();
      const [address] = await walletClient.getAddresses();
      
      if (!address) {
        alert("No account connected. Please connect your wallet first.");
        return;
      }

      if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
        alert("Please enter a valid recipient address");
        return;
      }

      if (!amount || isNaN(Number(amount))) {
        alert("Please enter a valid amount");
        return;
      }

      const hash = await walletClient.sendTransaction({
        account: address,
        to: recipient as Address,
        value: parseGwei(amount),
      });
      
      alert(`Transaction successful!\nHash: ${hash}`);
      console.log("Transaction hash:", hash);
    } catch (error: any) {
      console.error("Transaction error:", error);
      
      if (error.code === 4001) {
        alert("Transaction rejected by user");
      } else if (error.message?.includes("insufficient funds")) {
        alert("Insufficient funds. Get Sepolia ETH from faucet: https://sepoliafaucet.com/");
      } else {
        alert(`Transaction failed: ${error.message || error}`);
      }
    }
  }

  return (
    <div className="card">
      <label>
        Amount:
        <input
          placeholder="GWei"
          value={amount}
          onChange={setValue(setAmount)}
        ></input>
      </label>
      <br />
      <label>
        Recipient:
        <input
          placeholder="Address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleClick}
      >
        Send Transaction
      </button>
    </div>
  );
}