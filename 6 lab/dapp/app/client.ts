import { createWalletClient, createPublicClient, custom, http } from "viem";
import { sepolia } from "viem/chains";
import "viem/window";

export function ConnectPublicClient() {
  let transport;
  if (typeof window !== "undefined" && window.ethereum) {
    transport = custom(window.ethereum);
  } else {
    transport = http();
  }

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: transport,
  });

  return publicClient;
}

export function ConnectWalletClient() {
  if (typeof window === "undefined") {
    throw new Error("ConnectWalletClient can only be called in the browser");
  }

  if (!window.ethereum) {
    const errorMessage = "Web3 wallet is not installed. Please install one";
    throw new Error(errorMessage);
  }

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  return walletClient;
}

// Функция для переключения на Sepolia
export async function switchToSepolia(): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const sepoliaChainId = "0xaa36a7"; // 11155111 в hex

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: sepoliaChainId }],
    });
  } catch (switchError: any) {
    // Если сеть не добавлена, добавляем её
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: sepoliaChainId,
            chainName: "Sepolia Testnet",
            nativeCurrency: {
              name: "Sepolia ETH",
              symbol: "SepoliaETH",
              decimals: 18,
            },
            rpcUrls: ["https://sepolia.infura.io/v3/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}