import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { Space, Typography, Tag, Divider } from "antd";
import { bscTestnet } from "wagmi/chains";

const { Text } = Typography;

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  // 获取当前链信息（优先使用 chain，如果没有则根据 chainId 查找）
  const currentChain = chain || (chainId === bscTestnet.id ? bscTestnet : null);

  // Format balance: keep 4 decimal places
  const formatBalance = (value: bigint, decimals: number) => {
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  return (
    <Space size="middle" align="center">
      {isConnected && address && (
        <>
          {/* Network Tag */}
          {currentChain && (
            <Tag
              color={currentChain.id === bscTestnet.id ? "green" : "orange"}
              style={{ margin: 0 }}
            >
              {currentChain.name}
            </Tag>
          )}

          <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />

          {/* Balance */}
          {balance && (
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              {formatBalance(balance.value, balance.decimals)} {balance.symbol}
            </Text>
          )}

          <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
        </>
      )}

      {/* Connect Button */}
      <ConnectKitButton />
    </Space>
  );
}
