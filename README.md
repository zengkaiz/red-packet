# 🧧 链上抢红包 DApp - BSC Testnet

一个基于 BSC Testnet 的去中心化红包应用，支持创建红包、随机领取红包，并通过 The Graph 索引链上事件。

## ✨ 功能特性

- 🎁 **创建红包**: 发送 BNB 创建红包，指定红包数量
- 🎲 **随机金额**: 每个红包金额随机分配，增加趣味性
- 🔍 **历史查询**: 通过 The Graph 查询所有红包历史和领取记录
- 🌐 **网络检测**: 自动检测并提示切换到 BSC Testnet
- 💰 **余额显示**: 实时显示钱包 BNB 余额

## 🎯 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | 前端框架 |
| TypeScript | 5.9 | 类型安全 |
| Vite | 7.x | 构建工具 |
| Ant Design | 6.x | UI 组件库 |
| Wagmi | 3.x | Web3 React Hooks |
| Viem | 2.x | 以太坊交互库 |
| ConnectKit | 1.x | 钱包连接 UI |
| GraphQL Request | 7.x | The Graph 客户端 |

## 📁 项目结构

```
src/
├── components/
│   ├── WalletConnect.tsx       # 钱包连接组件
│   ├── NetworkSwitcher.tsx     # 网络切换组件
│   ├── RedPacketCreate.tsx     # 创建红包组件
│   ├── RedPacketClaimer.tsx    # 领取红包组件
│   └── RedPacketLog.tsx        # 红包历史组件
├── config/
│   └── wagmi.ts                # Wagmi 配置
├── lib/
│   ├── redpacket-contract.ts   # 合约 ABI 和地址
│   └── graphClient.ts          # GraphQL 客户端
├── main.tsx                    # 入口文件
└── App.tsx                     # 主应用
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
VITE_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
VITE_SUBGRAPH_URL=https://api.studio.thegraph.com/query/YOUR_SUBGRAPH
VITE_WALLETCONNECT_PROJECT_ID=  # 可选
```

**关于 WalletConnect Project ID**:
- 如果你遇到网络显示 "undefined" 的问题，请查看 [WalletConnect 配置说明](./WALLETCONNECT_SETUP.md)
- 使用浏览器插件钱包（如 MetaMask）不需要此配置

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 获取测试币

访问 [BSC Testnet Faucet](https://testnet.bnbchain.org/faucet-smart) 获取 tBNB 测试币

## 📝 使用说明

### 创建红包

1. 连接钱包（确保在 BSC Testnet 网络）
2. 在左侧"创建红包"卡片中：
   - 输入红包总金额（BNB）
   - 输入红包数量
3. 点击"创建红包"并在钱包中确认交易
4. 等待交易确认

### 领取红包

1. 在右侧"Claim Red Packets"卡片中查看可领取的红包
2. 点击"Claim Now"领取红包
3. 领取金额随机分配
4. 每个地址每个红包只能领取一次

### 查看历史

在"Red Packet History"区域可以：
- 查看所有创建的红包
- 展开查看详细的领取记录
- 查看每个领取者的地址和金额

## 🔧 合约信息

- **合约地址**: `0xb9364ccA32368416660A561822C9f7798c81EE18`
- **网络**: BSC Testnet (Chain ID: 97)
- **区块浏览器**: [BSCScan Testnet](https://testnet.bscscan.com/address/0xb9364ccA32368416660A561822C9f7798c81EE18)

## ⚠️ 常见问题

### 网络显示 "undefined"？

查看 [WalletConnect 配置说明](./WALLETCONNECT_SETUP.md) 了解解决方案。

简单解决方法：
1. 使用 MetaMask 等浏览器插件钱包
2. 在钱包中手动切换到 BSC Testnet
3. 刷新页面

### 如何添加 BSC Testnet？

在 MetaMask 中添加网络：
- **网络名称**: BSC Testnet
- **RPC URL**: https://data-seed-prebsc-1-s1.bnbchain.org:8545
- **Chain ID**: 97
- **符号**: tBNB
- **区块浏览器**: https://testnet.bscscan.com

### 交易失败？

常见原因：
1. 钱包余额不足（需要 tBNB 支付 gas）
2. 网络不正确（需要在 BSC Testnet）
3. 合约调用参数错误

## 📚 相关项目

- **合约仓库**: [contract-redpacket](../contract-redpacket)
- **Subgraph 仓库**: [subgraph-redpacket](../subgraph-redpacket)

## 🔗 相关链接

- [BSC Testnet 水龙头](https://testnet.bnbchain.org/faucet-smart)
- [BSCScan Testnet](https://testnet.bscscan.com)
- [The Graph](https://thegraph.com)
- [Wagmi 文档](https://wagmi.sh)
- [ConnectKit 文档](https://docs.family.co/connectkit)

## 📄 许可证

MIT
