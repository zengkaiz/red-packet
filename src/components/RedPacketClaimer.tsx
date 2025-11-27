import { useState, useEffect } from "react";
import { Card, Button, Typography, Space, message, Row, Col, Alert, Empty } from "antd";
import { GiftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { RED_PACKET_ADDRESS, RED_PACKET_ABI } from "../lib/redpacket-contract";
import { fetchRedPackets } from "../lib/graphClient";
import type { RedPacketStats } from "../lib/graphClient";

const { Text, Title } = Typography;

export function RedPacketClaimer() {
  const [redPackets, setRedPackets] = useState<RedPacketStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    loadRedPackets();
  }, [isConfirmed]);

  const loadRedPackets = async () => {
    setLoading(true);
    try {
      const packets = await fetchRedPackets();
      const availablePackets = packets.filter(
        (p) => BigInt(p.claimedCount) < BigInt(p.totalCount)
      );
      setRedPackets(availablePackets);
    } catch (error) {
      console.error("Failed to load red packets:", error);
      message.error("加载红包失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRedPackets();
    setRefreshing(false);
  };

  const handleClaim = async (redPacketId: string) => {
    if (!isConnected) {
      message.warning("请先连接钱包");
      return;
    }

    try {
      writeContract({
        address: RED_PACKET_ADDRESS,
        abi: RED_PACKET_ABI,
        functionName: "claimRedPacket",
        args: [BigInt(redPacketId)],
      });
    } catch (error) {
      console.error("Failed to claim red packet:", error);
      message.error("领取失败");
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      message.success("🎉 恭喜发财，红包领取成功！");
      loadRedPackets();
    }
  }, [isConfirmed]);

  return (
    <Card
      title={
        <Space>
          <GiftOutlined style={{ color: "#e84545" }} />
          <span style={{ color: "#e84545", fontWeight: "bold" }}>抢红包</span>
        </Space>
      }
      extra={
        <Button
          onClick={handleRefresh}
          loading={refreshing}
          style={{ borderColor: "#e84545", color: "#e84545" }}
        >
          <ReloadOutlined /> 刷新
        </Button>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(227, 52, 47, 0.1)",
      }}
    >
      {!isConnected && (
        <Alert
          message="请先连接钱包才能抢红包"
          type="warning"
          showIcon
          style={{
            marginBottom: 16,
            borderColor: "#faad14",
            background: "#fffbe6"
          }}
        />
      )}

      {redPackets.length === 0 && !loading ? (
        <Empty
          description="暂无可抢的红包"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "40px 0" }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {redPackets.map((packet) => (
            <Col key={packet.id} xs={24} sm={12} lg={8}>
              <RedPacketCard
                packet={packet}
                onClaim={handleClaim}
                userAddress={address}
                isClaiming={isPending || isConfirming}
              />
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
}

interface RedPacketCardProps {
  packet: RedPacketStats;
  onClaim: (redPacketId: string) => void;
  userAddress?: `0x${string}`;
  isClaiming: boolean;
}

function RedPacketCard({ packet, onClaim, userAddress, isClaiming }: RedPacketCardProps) {
  const remainingCount = BigInt(packet.totalCount) - BigInt(packet.claimedCount);
  const isFullyClaimed = remainingCount === BigInt(0);

  const { data: hasClaimed } = useReadContract({
    address: RED_PACKET_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: "hasUserClaimed",
    args: userAddress ? [BigInt(packet.redPacketId), userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const userAlreadyClaimed = hasClaimed === true;
  const canClaim = !isFullyClaimed && !userAlreadyClaimed && userAddress;

  // 格式化金额显示，保留4位小数
  const formatAmount = (amount: string) => {
    const value = formatUnits(BigInt(amount), 18);
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  return (
    <Card
      hoverable={!isFullyClaimed}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "none",
        background: isFullyClaimed
          ? "linear-gradient(135deg, #d3d3d3 0%, #a8a8a8 100%)"
          : "linear-gradient(135deg, #f64f59 0%, #c31432 100%)",
        boxShadow: isFullyClaimed
          ? "0 2px 8px rgba(0,0,0,0.1)"
          : "0 8px 16px rgba(227, 52, 47, 0.3)",
        position: "relative",
        height: "280px",
        display: "flex",
        flexDirection: "column",
      }}
      bodyStyle={{
        padding: "24px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 装饰性元素 */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />

      {/* 红包内容 */}
      <Space direction="vertical" size="large" style={{ width: "100%", position: "relative", zIndex: 1 }}>
        {/* 顶部：红包编号 */}
        <div style={{ textAlign: "center" }}>
          <Title
            level={4}
            style={{
              color: "white",
              margin: 0,
              fontSize: "18px",
              fontWeight: "bold"
            }}
          >
            🧧 红包 #{packet.redPacketId}
          </Title>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "12px"
            }}
          >
            {packet.creator.slice(0, 6)}...{packet.creator.slice(-4)}
          </Text>
        </div>

        {/* 中间：金额显示 */}
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)"
          }}>
            <Title
              level={3}
              style={{
                color: "white",
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold"
              }}
            >
              {formatAmount(packet.remainingAmount)}
            </Title>
            <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}>
              BNB
            </Text>
          </div>
        </div>

        {/* 底部：剩余数量和按钮 */}
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>
              剩余 <span style={{ fontWeight: "bold", fontSize: "16px" }}>{remainingCount.toString()}</span> / {packet.totalCount} 个
            </Text>
          </div>

          {isFullyClaimed ? (
            <Button
              size="large"
              disabled
              block
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "24px",
                background: "#666",
                borderColor: "#666",
                color: "#ccc",
              }}
            >
              🎊 已抢光
            </Button>
          ) : userAlreadyClaimed ? (
            <Button
              size="large"
              disabled
              block
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.3)",
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "white",
              }}
            >
              ✅ 已领取
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              block
              onClick={() => onClaim(packet.redPacketId)}
              disabled={!canClaim || isClaiming}
              loading={isClaiming}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                borderColor: "transparent",
                color: "#c31432",
                boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
              }}
            >
              🎁 点击领取
            </Button>
          )}
        </Space>
      </Space>
    </Card>
  );
}
