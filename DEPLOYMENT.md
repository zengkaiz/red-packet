# 🚀 Cloudflare Pages 部署指南

本文档介绍如何将红包 DApp 部署到 Cloudflare Pages。

## 📋 前置要求

- GitHub 账号
- Cloudflare 账号
- 已将项目推送到 GitHub 仓库

## 🔧 部署步骤

### 1. 连接 GitHub 仓库

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 **Pages** → **Create a project**
3. 点击 **Connect to Git**
4. 授权 Cloudflare 访问你的 GitHub 账号
5. 选择你的红包 DApp 仓库

### 2. 配置构建设置

在构建配置页面，填写以下信息：

| 配置项 | 值 |
|--------|-----|
| **项目名称** | red-packet-dapp（或自定义） |
| **生产分支** | main |
| **框架预设** | Vite |
| **构建命令** | `pnpm build` |
| **构建输出目录** | `dist` |
| **根目录** | `/` |
| **Node 版本** | 20（自动从 `.node-version` 读取） |

### 3. 配置环境变量

在 **Environment variables** 部分添加以下变量：

#### 生产环境变量（Production）

```
VITE_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
VITE_SUBGRAPH_URL=https://api.studio.thegraph.com/query/1715990/red-packet/v0.0.1
VITE_WALLETCONNECT_PROJECT_ID=（可选）
```

**重要提示**：
- ✅ 所有以 `VITE_` 开头的变量会被打包到前端代码中
- ⚠️ 不要在这里放置任何私钥或敏感信息
- 🔄 修改环境变量后需要重新部署才能生效

### 4. 开始部署

1. 点击 **Save and Deploy**
2. Cloudflare 会自动拉取代码并开始构建
3. 构建完成后，你会得到一个 `*.pages.dev` 域名

## 🌐 自定义域名（可选）

### 添加自定义域名

1. 在 Cloudflare Pages 项目页面，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（例如：redpacket.example.com）
4. 按照指示配置 DNS 记录

### DNS 配置示例

```
Type: CNAME
Name: redpacket
Content: your-project.pages.dev
Proxy status: Proxied（橙色云朵）
```

## 🔄 自动部署

配置完成后，每次推送到 GitHub 的 `main` 分支都会自动触发部署：

```bash
git add .
git commit -m "Update: 优化红包卡片显示"
git push origin main
```

Cloudflare Pages 会自动：
1. 检测到新的提交
2. 拉取最新代码
3. 运行构建命令
4. 部署到生产环境

## 📊 查看部署状态

### 在 Cloudflare Dashboard

1. 进入你的 Pages 项目
2. 查看 **Deployments** 标签
3. 每次部署都会显示：
   - 构建日志
   - 部署状态（成功/失败）
   - 预览链接

### 部署日志

如果部署失败，查看构建日志可以帮助定位问题：
- 点击失败的部署
- 查看 **Build logs**
- 根据错误信息修复问题

## 🐛 常见问题

### 问题 1: 环境变量未生效

**症状**: 应用显示环境变量为 undefined

**解决方案**:
1. 确保环境变量以 `VITE_` 开头
2. 在 Cloudflare Pages 设置中重新检查环境变量
3. 重新部署（Deployments → Retry deployment）

### 问题 2: 页面刷新后 404

**症状**: 直接访问子路由（如 `/about`）返回 404

**解决方案**:
- 已配置 `public/_redirects` 文件，确保它被包含在构建输出中
- 检查 `dist` 目录是否包含 `_redirects` 文件

### 问题 3: 构建失败 - Node 版本不兼容

**症状**: 构建日志显示 Node 版本错误

**解决方案**:
- 确保项目根目录有 `.node-version` 文件
- 内容设置为 `20`
- 或在 Cloudflare Pages 设置中手动指定 Node 版本

### 问题 4: 钱包连接问题

**症状**: WalletConnect 显示 "undefined" 网络

**解决方案**:
1. 获取 WalletConnect Project ID（https://cloud.walletconnect.com）
2. 添加到环境变量 `VITE_WALLETCONNECT_PROJECT_ID`
3. 重新部署
4. 或参考 [WALLETCONNECT_SETUP.md](./WALLETCONNECT_SETUP.md)

## 🔒 安全建议

### 环境变量安全

- ✅ RPC URL: 公开可见，安全
- ✅ Subgraph URL: 公开可见，安全
- ✅ WalletConnect Project ID: 公开可见，安全
- ❌ 私钥: **绝对不要**放在前端环境变量中

### Content Security Policy

已在 `public/_headers` 中配置基本的安全头：
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 📈 性能优化

### 已实现的优化

1. **代码分割**:
   - React/ReactDOM 单独打包
   - Wagmi/Viem 单独打包
   - Ant Design 单独打包

2. **静态资源缓存**:
   - `/assets/*` 设置 1 年缓存
   - 通过 `public/_headers` 配置

3. **Cloudflare 优化**:
   - 自动启用 Brotli/Gzip 压缩
   - 全球 CDN 加速
   - HTTP/3 支持

## 🔗 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [项目 README](./README.md)
- [WalletConnect 配置](./WALLETCONNECT_SETUP.md)

## 💡 提示

### 预览部署

Cloudflare Pages 会为每个 PR 和分支创建预览部署：
- PR 部署：每个 Pull Request 都会有独立的预览链接
- 分支部署：非生产分支的提交会创建预览环境

### 回滚部署

如果新部署有问题：
1. 进入 **Deployments** 页面
2. 找到之前的成功部署
3. 点击 **...** → **Rollback to this deployment**

### 监控和分析

Cloudflare 提供免费的分析功能：
- **Web Analytics**: 访问量、性能指标
- **Speed**: Core Web Vitals
- **Traffic**: 流量来源分析

## 🎉 部署完成

部署成功后，你的红包 DApp 将：
- ✅ 可通过 `*.pages.dev` 域名访问
- ✅ 享受全球 CDN 加速
- ✅ 自动 HTTPS 证书
- ✅ 无限流量（Free Plan）
- ✅ 自动部署

祝你部署顺利！🚀
