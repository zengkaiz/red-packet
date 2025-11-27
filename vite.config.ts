import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["events", "buffer", "process"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  build: {
    // 优化构建输出
    rollupOptions: {
      output: {
        manualChunks: {
          // 分离第三方库
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', 'viem', '@tanstack/react-query'],
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
    // 增加 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
});
