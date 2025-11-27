import { SendOutlined, GiftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Space } from "antd";
import { useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { RED_PACKET_ADDRESS, RED_PACKET_ABI } from "../lib/redpacket-contract";

interface FormValues {
  totalAmount: string;
  totalCount: string;
}

export function RedPacketCreate() {
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const { isConnected } = useAccount();
  const {
    writeContract,
    isPending,
    error: writeError,
    data: hash
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({
    hash,
  });

  // 处理交易成功
  useEffect(() => {
    if (isConfirmed && hash) {
      messageApi.success({
        content: `🎊 红包创建成功！交易哈希: ${hash.slice(0, 10)}...`,
        duration: 5,
      });
      form.resetFields();
    }
  }, [isConfirmed, hash, messageApi, form]);

  // 处理错误
  useEffect(() => {
    if (writeError) {
      messageApi.error({
        content: `创建失败: ${writeError.message}`,
        duration: 5,
      });
    }
  }, [writeError, messageApi]);

  const handleSubmit = (values: FormValues) => {
    try {
      const totalAmount = parseEther(values.totalAmount);
      const totalCount = BigInt(values.totalCount);

      writeContract({
        address: RED_PACKET_ADDRESS,
        abi: RED_PACKET_ABI,
        functionName: "createRedPacket",
        args: [totalCount],
        value: totalAmount,
      });
    } catch (error) {
      messageApi.error({
        content: `参数错误: ${error instanceof Error ? error.message : '未知错误'}`,
        duration: 5,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Card
        title={
          <Space>
            <GiftOutlined style={{ color: "#e84545" }} />
            <span style={{ color: "#e84545", fontWeight: "bold" }}>发红包</span>
          </Space>
        }
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(227, 52, 47, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={!isConnected || isPending || isConfirming}
        >
          <Form.Item
            name="totalAmount"
            label={<span style={{ fontWeight: 600, color: "#333" }}>红包总金额 (BNB)</span>}
            rules={[
              { required: true, message: "请输入红包总金额" },
              {
                pattern: /^\d+\.?\d*$/,
                message: "请输入有效的金额（例如：0.001）",
              },
              {
                validator: (_, value) => {
                  if (value && parseFloat(value) <= 0) {
                    return Promise.reject("金额必须大于 0");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="0.001"
              suffix="BNB"
              style={{
                borderColor: "#ffa39e",
                borderRadius: "8px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="totalCount"
            label={<span style={{ fontWeight: 600, color: "#333" }}>红包数量</span>}
            rules={[
              { required: true, message: "请输入红包数量" },
              {
                pattern: /^[1-9]\d*$/,
                message: "请输入有效的数量（正整数）",
              },
              {
                validator: (_, value) => {
                  if (value && parseInt(value) < 1) {
                    return Promise.reject("红包数量至少为 1");
                  }
                  if (value && parseInt(value) > 100) {
                    return Promise.reject("红包数量不能超过 100");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              size="large"
              placeholder="3"
              suffix="个"
              style={{
                borderColor: "#ffa39e",
                borderRadius: "8px",
              }}
            />
          </Form.Item>

          {hash && (
            <Form.Item>
              <div style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
                borderRadius: '8px',
                fontSize: '12px',
                wordBreak: 'break-all',
                border: '1px solid #ffa39e'
              }}>
                <strong style={{ color: "#e84545" }}>交易哈希:</strong>
                <br />
                <span style={{ color: "#666" }}>{hash}</span>
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={isPending || isConfirming}
              disabled={!isConnected}
              block
              size="large"
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #f64f59 0%, #c31432 100%)",
                borderColor: "transparent",
                boxShadow: "0 4px 12px rgba(227, 52, 47, 0.3)",
              }}
            >
              {isPending
                ? "等待钱包确认..."
                : isConfirming
                ? "交易处理中..."
                : "🎁 塞钱进红包"}
            </Button>
          </Form.Item>

          {!isConnected && (
            <div style={{
              textAlign: 'center',
              color: '#e84545',
              fontSize: '14px',
              fontWeight: 500
            }}>
              请先连接钱包
            </div>
          )}
        </Form>
      </Card>
    </>
  );
}
