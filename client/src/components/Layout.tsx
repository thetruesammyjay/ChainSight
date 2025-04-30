import { Outlet, Link } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import { 
  DashboardOutlined, 
  WalletOutlined, 
  BarChartOutlined,
  FolderOutlined 
} from '@ant-design/icons'

const { Header, Content, Sider } = Layout

export default function AppLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div className="logo">ChainSight</div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <WalletOutlined />,
              label: <Link to="/wallets">Wallets</Link>,
            },
            {
              key: '3',
              icon: <BarChartOutlined />,
              label: <Link to="/protocols">Protocols</Link>,
            },
            {
              key: '4',
              icon: <FolderOutlined />,
              label: <Link to="/investigations">Investigations</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: colorBgContainer 
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}