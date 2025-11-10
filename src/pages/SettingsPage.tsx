import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Space,
  Alert,
  Select,
} from 'antd'
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useConfig } from '@/contexts/ConfigContext'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

export default function SettingsPage() {
  const navigate = useNavigate()
  const { config, updateConfig } = useConfig()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    form.setFieldsValue(config)
    // 如果有自定义配置，显示高级选项
    if (config.ai_base_url || config.ai_model) {
      setShowAdvanced(true)
    }
  }, [config, form])

  const handleSave = async (values: any) => {
    try {
      setLoading(true)
      updateConfig(values)
      message.success('配置已保存')
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const aiProviderOptions = [
    {
      label: 'OpenAI (GPT)',
      value: 'openai',
      desc: '支持 GPT-3.5/GPT-4，需要国际网络',
    },
    {
      label: 'DeepSeek',
      value: 'deepseek',
      desc: '国内可用，性价比高，支持 deepseek-chat',
    },
    {
      label: '通义千问 (Qwen)',
      value: 'qwen',
      desc: '阿里云服务，国内访问快，支持多种模型',
    },
    {
      label: 'Kimi (Moonshot)',
      value: 'kimi',
      desc: '月之暗面，支持超长上下文',
    },
    {
      label: '其他兼容 OpenAI 的服务',
      value: 'other',
      desc: '自定义 API 地址',
    },
  ]

  const selectedProvider = Form.useWatch('ai_provider', form)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ marginRight: 16 }}
        />
        <Title level={3} style={{ margin: 0 }}>
          设置
        </Title>
      </Header>

      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Alert
            message="配置说明"
            description={
              <div>
                <Paragraph>
                  为了使用完整功能，您需要配置以下服务：
                </Paragraph>
                <ul>
                  <li>
                    <Text strong>AI 模型:</Text> 用于智能行程规划
                    <br />
                    <Text type="secondary">
                      支持 OpenAI、DeepSeek、通义千问、Kimi 等多种大模型
                    </Text>
                  </li>
                  <li>
                    <Text strong>科大讯飞 API:</Text> 用于语音识别功能
                    <br />
                    <Text type="secondary">
                      获取地址: <a href="https://console.xfyun.cn/" target="_blank" rel="noopener noreferrer">https://console.xfyun.cn/</a>
                    </Text>
                  </li>
                  <li>
                    <Text strong>高德地图 API Key:</Text> 用于地图和导航功能
                    <br />
                    <Text type="secondary">
                      获取地址: <a href="https://console.amap.com/dev/key/app" target="_blank" rel="noopener noreferrer">https://console.amap.com/dev/key/app</a>
                    </Text>
                  </li>
                </ul>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              autoComplete="off"
            >
              <Divider orientation="left">AI 模型配置</Divider>

              <Form.Item
                label="选择 AI 服务商"
                name="ai_provider"
                rules={[{ required: true, message: '请选择 AI 服务商' }]}
              >
                <Select
                  placeholder="选择一个 AI 服务商"
                  options={aiProviderOptions.map(opt => ({
                    label: (
                      <div>
                        <div><Text strong>{opt.label}</Text></div>
                        <div><Text type="secondary" style={{ fontSize: 12 }}>{opt.desc}</Text></div>
                      </div>
                    ),
                    value: opt.value,
                  }))}
                />
              </Form.Item>

              {selectedProvider && (
                <>
                  <Alert
                    message={
                      selectedProvider === 'openai' ? (
                        <span>
                          获取 OpenAI API Key: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">https://platform.openai.com/api-keys</a>
                          <br />需要国际网络访问，费用按使用量计算
                        </span>
                      ) : selectedProvider === 'deepseek' ? (
                        <span>
                          获取 DeepSeek API Key: <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer">https://platform.deepseek.com/</a>
                          <br />国内可直接访问，性价比高，新用户有免费额度
                        </span>
                      ) : selectedProvider === 'qwen' ? (
                        <span>
                          获取通义千问 API Key: <a href="https://dashscope.console.aliyun.com/" target="_blank" rel="noopener noreferrer">https://dashscope.console.aliyun.com/</a>
                          <br />阿里云服务，需要实名认证，有免费额度
                        </span>
                      ) : selectedProvider === 'kimi' ? (
                        <span>
                          获取 Kimi API Key: <a href="https://platform.moonshot.cn/" target="_blank" rel="noopener noreferrer">https://platform.moonshot.cn/</a>
                          <br />月之暗面服务，支持超长上下文
                        </span>
                      ) : (
                        <span>
                          使用兼容 OpenAI API 格式的服务，需要自行配置 API 地址
                        </span>
                      )
                    }
                    type="info"
                    style={{ marginBottom: 16 }}
                  />

                  <Form.Item
                    label="API Key"
                    name="ai_api_key"
                    rules={[{ required: true, message: '请输入 API Key' }]}
                  >
                    <Input.Password
                      placeholder={`输入 ${aiProviderOptions.find(o => o.value === selectedProvider)?.label} API Key`}
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Button
                    type="link"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{ paddingLeft: 0, marginBottom: 16 }}
                  >
                    {showAdvanced ? '隐藏' : '显示'}高级选项
                  </Button>

                  {showAdvanced && (
                    <>
                      <Form.Item
                        label="API 地址 (可选)"
                        name="ai_base_url"
                        tooltip="留空使用默认地址。如果使用代理或自建服务，可在此配置"
                      >
                        <Input
                          placeholder={
                            selectedProvider === 'openai' ? 'https://api.openai.com/v1' :
                            selectedProvider === 'deepseek' ? 'https://api.deepseek.com/v1' :
                            selectedProvider === 'qwen' ? 'https://dashscope.aliyuncs.com/compatible-mode/v1' :
                            selectedProvider === 'kimi' ? 'https://api.moonshot.cn/v1' :
                            '输入自定义 API 地址'
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="模型名称 (可选)"
                        name="ai_model"
                        tooltip="留空使用默认模型"
                      >
                        <Input
                          placeholder={
                            selectedProvider === 'openai' ? 'gpt-3.5-turbo 或 gpt-4' :
                            selectedProvider === 'deepseek' ? 'deepseek-chat' :
                            selectedProvider === 'qwen' ? 'qwen-plus 或 qwen-max' :
                            selectedProvider === 'kimi' ? 'moonshot-v1-8k' :
                            '输入模型名称'
                          }
                        />
                      </Form.Item>
                    </>
                  )}
                </>
              )}

              <Divider orientation="left">语音识别配置</Divider>

              <Form.Item
                label="科大讯飞 APPID"
                name="xunfei_app_id"
                rules={[{ required: true, message: '请输入科大讯飞 APPID' }]}
              >
                <Input placeholder="输入 APPID" />
              </Form.Item>

              <Form.Item
                label="科大讯飞 API Key"
                name="xunfei_api_key"
                rules={[{ required: true, message: '请输入科大讯飞 API Key' }]}
              >
                <Input.Password
                  placeholder="输入 API Key"
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="科大讯飞 API Secret"
                name="xunfei_api_secret"
                rules={[{ required: true, message: '请输入科大讯飞 API Secret' }]}
              >
                <Input.Password
                  placeholder="输入 API Secret"
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Divider orientation="left">地图配置</Divider>

              <Form.Item
                label="高德地图 API Key"
                name="amap_key"
                rules={[{ required: true, message: '请输入高德地图 API Key' }]}
              >
                <Input placeholder="输入高德地图 API Key" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    保存配置
                  </Button>
                  <Button onClick={() => navigate('/')}>
                    返回
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}
