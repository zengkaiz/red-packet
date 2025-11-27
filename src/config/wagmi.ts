import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { bscTestnet } from "wagmi/chains";

// 使用备用 RPC URL
const BSC_TESTNET_RPC = import.meta.env.VITE_RPC_URL || "https://data-seed-prebsc-1-s1.bnbchain.org:8545";

export const config = createConfig(
  getDefaultConfig({
    chains: [bscTestnet],
    transports: {
      [bscTestnet.id]: http(BSC_TESTNET_RPC),
    },
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    appName: "RedPacket DApp",
    appDescription: "A Web3 RedPacket Application on BSC Testnet",
    appUrl: "https://redpacket.example.com",
    appIcon: "https://redpacket.example.com/icon.png",
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
