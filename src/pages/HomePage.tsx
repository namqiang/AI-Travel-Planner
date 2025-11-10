import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Typography, Card, Row, Col, Alert } from 'antd'
import {
  PlusOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  LogoutOutlined,
  RocketOutlined,
  DollarOutlined,
  AudioOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useConfig } from '@/contexts/ConfigContext'

const { Header, Content } = Layout
const { Title, Paragraph } = Typography

export default function HomePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { isConfigured } = useConfig()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: '智能规划',
      description: 'AI 根据您的需求自动生成个性化旅行路线',
    },
    {
      icon: <AudioOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: '语音交互',
      description: '支持语音输入，让规划更便捷',
    },
    {
      icon: <DollarOutlined style={{ fontSize: 48, color: '#faad14' }} />,
      title: '预算管理',
      description: '实时跟踪旅行开销，合理控制预算',
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          AI 旅行规划师
        </Title>
        <Menu mode="horizontal" style={{ flex: 1, justifyContent: 'flex-end', border: 'none' }}>
          <Menu.Item
            key="settings"
            icon={<SettingOutlined />}
            onClick={() => navigate('/settings')}
          >
            设置
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleSignOut}
          >
            退出
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {!isConfigured && (
            <Alert
              message="请先配置 API Keys"
              description="在开始使用之前，请前往设置页面配置必要的 API Keys（OpenAI、科大讯飞、高德地图）"
              type="warning"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              action={
                <Button size="small" type="primary" onClick={() => navigate('/settings')}>
                  去设置
                </Button>
              }
            />
          )}

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={1}>欢迎回来, {user?.email}</Title>
            <Paragraph style={{ fontSize: 18, color: '#666' }}>
              开始规划您的下一次旅行吧
            </Paragraph>

            <div style={{ marginTop: 32 }}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/planner')}
                style={{ marginRight: 16 }}
              >
                创建新计划
              </Button>
              <Button
                size="large"
                icon={<UnorderedListOutlined />}
                onClick={() => navigate('/trips')}
              >
                我的行程
              </Button>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={24} md={8} key={index}>
                <Card
                  hoverable
                  style={{ textAlign: 'center', height: '100%' }}
                >
                  <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph style={{ color: '#666' }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  )
}
