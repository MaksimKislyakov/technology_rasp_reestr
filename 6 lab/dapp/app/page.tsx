import TokenComponent from "./tokenComponent";
import TransactionComponent from "./transactionComponent";
import WalletComponent from "./walletComponent";
import Erc20Component from "./erc20Component";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <WalletComponent />
        <TransactionComponent />
        <TokenComponent />
        <Erc20Component /> {}
      </div>
    </main>
  );
}