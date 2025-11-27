import { Layout, Typography, Row, Col } from "antd";
import { WalletConnect } from "./components/WalletConnect";
import { NetworkSwitcher } from "./components/NetworkSwitcher";
import { RedPacketCreate } from "./components/RedPacketCreate";
import { RedPacketClaimer } from "./components/RedPacketClaimer";
import { RedPacketLog } from "./components/RedPacketLog";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ width: "100%", minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #c31432 0%, #e84545 100%)",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(227, 52, 47, 0.3)",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          🧧 链上抢红包 - BSC Testnet
        </Title>
        <WalletConnect />
      </Header>

      <Content style={{
        padding: "24px",
        background: "linear-gradient(180deg, #fff5f5 0%, #ffe8e8 100%)",
        minHeight: "calc(100vh - 64px)"
      }}>
        <NetworkSwitcher />
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <RedPacketCreate />
          </Col>
          <Col xs={24} lg={12}>
            <RedPacketClaimer />
          </Col>
          <Col xs={24}>
            <RedPacketLog />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
