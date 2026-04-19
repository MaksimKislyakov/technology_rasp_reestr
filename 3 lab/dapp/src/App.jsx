import { ethers } from "ethers";
import './App.css'
import BalanceReader from './BalanceReader';
import BlockExplorer from './BlockExplorer';
import VendingMachine from './VendingMachine';

const providerUrl = 'https://ethereum-sepolia.publicnode.com';
const provider = new ethers.JsonRpcProvider(providerUrl);

const network = await provider.getNetwork();

function App() {
  console.log(network);
  return (
    <>
    <BalanceReader provider={provider} />
    <BlockExplorer provider={provider} />
    <VendingMachine provider={provider} />
    {}
    </>
  )
}

export default App