import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { config } from "./config/wagmi";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 禁用自动重试，减少 CORS 错误日志
      refetchOnWindowFocus: false, // 禁用窗口聚焦时自动刷新
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            enforceSupportedChains: false,
            // 禁用自动获取 ENS 头像等功能，避免 CORS 错误
            walletConnectCTA: "link",
          }}
        >
          <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
