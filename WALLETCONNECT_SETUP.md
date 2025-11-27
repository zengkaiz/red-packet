# WalletConnect 配置说明

## 问题描述

如果你在 ConnectKit 弹框中看到网络显示为 "undefined" 或网络切换一直 loading，这是因为缺少 WalletConnect Project ID。

## 解决方案

### 方案 1: 获取 WalletConnect Project ID（推荐）

1. **访问 WalletConnect Cloud**:
   - 打开 https://cloud.walletconnect.com
   - 使用 GitHub、Google 或 Email 登录

2. **创建新项目**:
   - 点击 "Create New Project"
   - 输入项目名称（例如：RedPacket DApp）
   - 选择项目类型：App

3. **获取 Project ID**:
   - 在项目详情页面，复制 "Project ID"
   - 它应该是一个类似这样的字符串：`a1b2c3d4e5f6g7h8i9j0...`

4. **配置到项目**:
   - 打开 `.env` 文件
   - 将 Project ID 填入：
     ```
     VITE_WALLETCONNECT_PROJECT_ID=你的_PROJECT_ID
     ```
   - 重启开发服务器

### 方案 2: 使用备用钱包连接方式

如果不想配置 WalletConnect Project ID，可以：

1. **使用浏览器插件钱包**（推荐）:
   - MetaMask
   - Trust Wallet
   - Coinbase Wallet
   - 这些钱包不需要 WalletConnect Project ID 也能正常工作

2. **手动添加 BSC Testnet 网络**:
   - 在钱包中手动添加网络信息：
     - **网络名称**: BSC Testnet
     - **RPC URL**: https://data-seed-prebsc-1-s1.bnbchain.org:8545
     - **Chain ID**: 97
     - **符号**: tBNB
     - **区块浏览器**: https://testnet.bscscan.com

3. **在钱包内切换网络**:
   - 不使用应用内的网络切换功能
   - 直接在钱包中切换到 BSC Testnet

## 验证配置

配置完成后：

1. **重启开发服务器**:
   ```bash
   pnpm dev
   ```

2. **清除浏览器缓存** (可选但推荐)

3. **测试连接**:
   - 刷新页面
   - 点击"连接钱包"
   - 检查网络是否正确显示

## 常见问题

### Q: 为什么需要 WalletConnect Project ID？

A: WalletConnect 是一个用于连接移动钱包的协议。Project ID 用于：
- 身份验证和跟踪
- 改善连接稳定性
- 访问高级功能

### Q: 不配置会影响使用吗？

A: 对于浏览器插件钱包（如 MetaMask），**不会影响基本使用**。只有使用移动钱包通过 WalletConnect 连接时才必需。

### Q: Project ID 安全吗？

A: 是的，Project ID 是**公开的**，不是私钥或敏感信息。它只用于标识你的应用，可以安全地公开。

### Q: 网络仍然显示 undefined？

A: 尝试以下方法：
1. 清除浏览器缓存
2. 在钱包中手动切换网络
3. 使用 MetaMask 等浏览器插件钱包
4. 检查 wagmi 和 connectkit 版本是否兼容

## 相关链接

- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [ConnectKit 文档](https://docs.family.co/connectkit)
- [Wagmi 文档](https://wagmi.sh)
- [BSC Testnet 水龙头](https://testnet.bnbchain.org/faucet-smart)
