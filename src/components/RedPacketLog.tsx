import { useState, useEffect } from "react";
import { Card, Typography, Space, message, Statistic, Row, Col, Button, Tag, Collapse, Table } from "antd";
import { GiftOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { formatUnits } from "viem";
import { fetchRedPackets, fetchRedPacketClaims } from "../lib/graphClient";
import type { RedPacketStats, RedPacketClaimed } from "../lib/graphClient";

const { Text } = Typography;
const { Panel } = Collapse;

export function RedPacketLog() {
  const [redPackets, setRedPackets] = useState<RedPacketStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPacket, setExpandedPacket] = useState<string | null>(null);
  const [claimHistory, setClaimHistory] = useState<Record<string, RedPacketClaimed[]>>({});

  useEffect(() => {
    loadRedPackets();
  }, []);

  const loadRedPackets = async () => {
    setLoading(true);
    try {
      const packets = await fetchRedPackets();
      setRedPackets(packets);
    } catch (error) {
      console.error("Failed to load red packets:", error);
      message.error("Failed to load red packets");
    } finally {
      setLoading(false);
    }
  };

  const loadClaimHistory = async (redPacketId: string) => {
    try {
      const claims = await fetchRedPacketClaims(redPacketId);
      setClaimHistory((prev) => ({
        ...prev,
        [redPacketId]: claims,
      }));
    } catch (error) {
      console.error("Failed to load claim history:", error);
      message.error("Failed to load claim history");
    }
  };

  const handlePanelChange = (key: string | string[]) => {
    const activeKey = Array.isArray(key) ? key[0] : key;
    if (activeKey !== undefined) {
      loadClaimHistory(activeKey);
    }
    setExpandedPacket(activeKey || null);
  };

  const claimColumns = [
    {
      title: "Claimer",
      dataIndex: "claimer",
      key: "claimer",
      render: (address: string) => (
        <Text copyable={{ text: address }}>
          {address.slice(0, 10)}...{address.slice(-8)}
        </Text>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <Text strong>{formatUnits(BigInt(amount), 18)} BNB</Text>
      ),
    },
    {
      title: "Time",
      dataIndex: "blockTimestamp",
      key: "blockTimestamp",
      render: (timestamp: string) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleString();
      },
    },
    {
      title: "Transaction",
      dataIndex: "transactionHash",
      key: "transactionHash",
      render: (hash: string) => (
        <a
          href={`https://testnet.bscscan.com/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <GiftOutlined style={{ color: "#e84545" }} />
          <span style={{ color: "#e84545", fontWeight: "bold" }}>红包记录</span>
        </Space>
      }
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={loadRedPackets}
          loading={loading}
          style={{ borderColor: "#e84545", color: "#e84545" }}
        >
          刷新
        </Button>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(227, 52, 47, 0.1)",
      }}
    >
      {redPackets.length === 0 && !loading ? (
        <Text type="secondary">暂无红包记录</Text>
      ) : (
        <Collapse
          accordion
          onChange={handlePanelChange}
          activeKey={expandedPacket || undefined}
        >
          {redPackets.map((packet) => {
            const remainingCount = BigInt(packet.totalCount) - BigInt(packet.claimedCount);
            const progressPercent = packet.totalCount === "0"
              ? 0
              : Number((BigInt(packet.claimedCount) * BigInt(100)) / BigInt(packet.totalCount));
            const isFullyClaimed = remainingCount === BigInt(0);

            return (
              <Panel
                key={packet.redPacketId}
                header={
                  <Row gutter={16} align="middle" style={{ width: "100%" }}>
                    <Col xs={24} sm={8}>
                      <Space direction="vertical" size={0}>
                        <Text strong>Red Packet #{packet.redPacketId}</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Creator: {packet.creator.slice(0, 6)}...{packet.creator.slice(-4)}
                        </Text>
                      </Space>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title="Total Amount"
                        value={formatUnits(BigInt(packet.totalAmount), 18)}
                        suffix="BNB"
                        precision={4}
                        valueStyle={{ fontSize: "14px" }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title="Claimed"
                        value={`${packet.claimedCount} / ${packet.totalCount}`}
                        valueStyle={{ fontSize: "14px" }}
                      />
                    </Col>
                    <Col xs={24} sm={4} style={{ textAlign: "right" }}>
                      {isFullyClaimed ? (
                        <Tag color="default">已完成</Tag>
                      ) : (
                        <Tag color="red">进行中</Tag>
                      )}
                      <div style={{ fontSize: "12px", marginTop: "4px" }}>
                        {progressPercent.toFixed(0)}% claimed
                      </div>
                    </Col>
                  </Row>
                }
              >
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  {/* Red Packet Details */}
                  <Card size="small" title="Details" type="inner">
                    <Row gutter={[16, 16]}>
                      <Col xs={12} md={6}>
                        <Statistic
                          title="Red Packet ID"
                          value={packet.redPacketId}
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <Statistic
                          title="Total Amount"
                          value={formatUnits(BigInt(packet.totalAmount), 18)}
                          suffix="BNB"
                          precision={6}
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <Statistic
                          title="Remaining Amount"
                          value={formatUnits(BigInt(packet.remainingAmount), 18)}
                          suffix="BNB"
                          precision={6}
                        />
                      </Col>
                      <Col xs={12} md={6}>
                        <Statistic
                          title="Remaining Count"
                          value={remainingCount.toString()}
                          suffix={`/ ${packet.totalCount}`}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 16 }}>
                      <Col span={24}>
                        <Text type="secondary">Creator: </Text>
                        <Text copyable={{ text: packet.creator }}>{packet.creator}</Text>
                      </Col>
                    </Row>
                  </Card>

                  {/* Claim History */}
                  <Card
                    size="small"
                    title={
                      <Space>
                        <UserOutlined />
                        <span>Claim History ({packet.claimedCount} claims)</span>
                      </Space>
                    }
                    type="inner"
                  >
                    {claimHistory[packet.redPacketId] ? (
                      claimHistory[packet.redPacketId].length > 0 ? (
                        <Table
                          dataSource={claimHistory[packet.redPacketId]}
                          columns={claimColumns}
                          rowKey="id"
                          pagination={{
                            pageSize: 5,
                            size: "small",
                          }}
                          size="small"
                        />
                      ) : (
                        <Text type="secondary">No claims yet</Text>
                      )
                    ) : (
                      <Text type="secondary">Loading claim history...</Text>
                    )}
                  </Card>

                  {/* Claimers List */}
                  {packet.claimers && packet.claimers.length > 0 && (
                    <Card size="small" title="Claimers" type="inner">
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {packet.claimers.map((claimer, index) => (
                          <Text key={index} copyable={{ text: claimer }}>
                            {index + 1}. {claimer}
                          </Text>
                        ))}
                      </Space>
                    </Card>
                  )}
                </Space>
              </Panel>
            );
          })}
        </Collapse>
      )}
    </Card>
  );
}
