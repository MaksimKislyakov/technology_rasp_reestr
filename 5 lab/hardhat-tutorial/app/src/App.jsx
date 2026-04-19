import { useState } from 'react'
import './App.css'
import { ethers } from 'ethers';

const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState('')
  const [tokens, setTokens] = useState('no')
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)

  async function transferToken(){
    const address = document.getElementById("address").value;
    const amount = document.getElementById("amount").value;
    console.log("Signer: ", signer);
    console.log("Contract: ", contract);
    const trx = await contract.connect(signer).transfer(address, amount);
    console.log("Transaction: ", trx);
    await trx.wait();
    updateAccount();
  }

  async function updateAccount() {
    try {
      // Создаём provider ВНУТРИ функции, когда он точно нужен
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask не найден! Установи расширение.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      setAccount(account);

      const signer = provider.getSigner();
      setSigner(signer);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contract);
      
      if (contract){
        const tokens = await contract.balanceOf(account);
        setTokens(tokens.toString());
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ошибка: " + err.message);
    }
  }

  return (
    <>
      <h1>Token vending machine</h1>
      <h3>Current account {account} has {tokens} Tokens</h3>
      <button onClick={updateAccount}>
        Update Balance
      </button>
      <div>
      <label>Send to:
        <input type="text" id="address"/>
      </label>
      <label>Amount:
        <input type="text" id="amount"/>
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          transferToken();
        }}
      >
        Transfer
      </button>
    </div>
    </>
  )
}

export default App