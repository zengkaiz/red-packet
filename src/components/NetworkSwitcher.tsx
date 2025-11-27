import { Alert, Button } from "antd";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { bscTestnet } from "wagmi/chains";

export function NetworkSwitcher() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // 如果未连接钱包，不显示
  if (!isConnected) {
    return null;
  }

  // 如果已经在正确的网络上，不显示
  if (chainId === bscTestnet.id) {
    return null;
  }

  return (
    <Alert
      message="⚠️ 网络错误"
      description={
        <div>
          <div style={{ marginBottom: 8, fontSize: "14px" }}>
            请切换到 BSC Testnet 网络才能使用红包功能
          </div>
          <Button
            type="primary"
            size="small"
            loading={isPending}
            onClick={() => switchChain({ chainId: bscTestnet.id })}
            style={{
              background: "linear-gradient(135deg, #f64f59 0%, #c31432 100%)",
              borderColor: "transparent",
              fontWeight: "bold",
            }}
          >
            切换到 BSC Testnet
          </Button>
        </div>
      }
      type="warning"
      showIcon
      style={{
        marginBottom: 16,
        borderRadius: "8px",
        borderColor: "#faad14",
      }}
    />
  );
}
