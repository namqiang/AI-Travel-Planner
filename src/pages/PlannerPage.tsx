import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Card,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Typography,
  Space,
  message,
  Spin,
  Timeline,
  Descriptions,
  Tag,
  Modal,
} from 'antd'
import {
  ArrowLeftOutlined,
  RocketOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuth } from '@/contexts/AuthContext'
import { aiService } from '@/services/aiService'
import { databaseService } from '@/services/databaseService'
import VoiceInput from '@/components/VoiceInput'
import MapView from '@/components/MapView'
import { TravelPlan, Location } from '@/types'

const { Header, Content, Sider } = Layout
const { Title, Paragraph, Text } = Typography
const { RangePicker } = DatePicker
const { TextArea } = Input

export default function PlannerPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlan | null>(null)
  const [mapLocations, setMapLocations] = useState<Location[]>([])

  const preferencesOptions = [
    '美食',
    '文化',
    '历史',
    '自然',
    '购物',
    '摄影',
    '冒险',
    '休闲',
    '亲子',
    '动漫',
    '艺术',
  ]

  const handleVoiceInput = (text: string) => {
    message.info(`识别结果: ${text}`)
    // 可以进一步解析语音文本并填充表单
    generateFromVoice(text)
  }

  const generateFromVoice = async (voiceText: string) => {
    try {
      setLoading(true)
      const result = await aiService.generateFromVoiceInput(voiceText)

      if (result.success && result.plan) {
        setGeneratedPlan(result.plan)
        extractLocations(result.plan)
        message.success('AI 规划完成！')
      } else {
        message.error(result.error || '生成失败')
      }
    } catch (error: any) {
      message.error(error.message || '生成失败')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (values: any) => {
    try {
      setLoading(true)

      const request = {
        destination: values.destination,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        budget: values.budget,
        travelers: values.travelers,
        preferences: values.preferences || [],
        additionalNotes: values.notes,
      }

      const result = await aiService.generateTravelPlan(request)

      if (result.success && result.plan) {
        setGeneratedPlan(result.plan)
        extractLocations(result.plan)
        message.success('AI 规划完成！')
      } else {
        message.error(result.error || '生成失败')
      }
    } catch (error: any) {
      message.error(error.message || '生成失败')
    } finally {
      setLoading(false)
    }
  }

  const extractLocations = (plan: TravelPlan) => {
    const locations: Location[] = []
    plan.itinerary.forEach(day => {
      day.activities.forEach(activity => {
        if (activity.location) {
          locations.push(activity.location)
        }
      })
    })
    setMapLocations(locations)
  }

  const handleSavePlan = async () => {
    if (!generatedPlan || !user) return

    try {
      setLoading(true)
      const planToSave = {
        ...generatedPlan,
        user_id: user.id,
      }
      await databaseService.createPlan(planToSave)
      message.success('行程已保存')
      navigate('/trips')
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      transportation: '🚗',
      accommodation: '🏨',
      attraction: '🎯',
      restaurant: '🍽️',
      other: '📍',
    }
    return icons[type] || '📍'
  }

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
          创建旅行计划
        </Title>
      </Header>

      <Layout>
        <Sider width={400} style={{ background: '#fff', padding: '24px', overflowY: 'auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>智能规划</Title>
              <Paragraph type="secondary">
                填写您的旅行需求，AI 将为您生成详细的行程计划
              </Paragraph>
            </div>

            <div style={{ textAlign: 'center' }}>
              <VoiceInput onResult={handleVoiceInput} />
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                点击使用语音输入
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleGenerate}
              initialValues={{
                travelers: 2,
                budget: 10000,
              }}
            >
              <Form.Item
                label="目的地"
                name="destination"
                rules={[{ required: true, message: '请输入目的地' }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="例如: 日本东京"
                />
              </Form.Item>

              <Form.Item
                label="出行日期"
                name="dateRange"
                rules={[{ required: true, message: '请选择出行日期' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="预算 (元)"
                name="budget"
                rules={[{ required: true, message: '请输入预算' }]}
              >
                <InputNumber
                  prefix={<DollarOutlined />}
                  style={{ width: '100%' }}
                  min={0}
                  step={1000}
                />
              </Form.Item>

              <Form.Item
                label="同行人数"
                name="travelers"
                rules={[{ required: true, message: '请输入同行人数' }]}
              >
                <InputNumber
                  prefix={<UserOutlined />}
                  style={{ width: '100%' }}
                  min={1}
                  max={20}
                />
              </Form.Item>

              <Form.Item
                label="旅行偏好"
                name="preferences"
              >
                <Select
                  mode="multiple"
                  placeholder="选择您的偏好"
                  options={preferencesOptions.map(p => ({ label: p, value: p }))}
                />
              </Form.Item>

              <Form.Item
                label="补充说明"
                name="notes"
              >
                <TextArea
                  rows={3}
                  placeholder="例如: 带孩子、喜欢动漫、需要无障碍设施等"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<RocketOutlined />}
                  loading={loading}
                  block
                  size="large"
                >
                  生成旅行计划
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Sider>

        <Content style={{ position: 'relative' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <Spin size="large" tip="AI 正在为您生成旅行计划..." />
            </div>
          ) : generatedPlan ? (
            <Layout style={{ height: '100%' }}>
              <Sider
                width={400}
                style={{
                  background: '#fff',
                  padding: '24px',
                  overflowY: 'auto',
                  borderLeft: '1px solid #f0f0f0',
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={4}>{generatedPlan.title}</Title>
                    <Space wrap>
                      <Tag icon={<CalendarOutlined />} color="blue">
                        {generatedPlan.start_date} 至 {generatedPlan.end_date}
                      </Tag>
                      <Tag icon={<DollarOutlined />} color="green">
                        预算: ¥{generatedPlan.budget}
                      </Tag>
                      <Tag icon={<UserOutlined />} color="orange">
                        {generatedPlan.travelers} 人
                      </Tag>
                    </Space>
                  </div>

                  <Timeline>
                    {generatedPlan.itinerary.map((day, dayIndex) => (
                      <Timeline.Item key={dayIndex}>
                        <Title level={5}>第 {day.day} 天 - {day.date}</Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          {day.activities.map((activity, actIndex) => (
                            <Card
                              key={actIndex}
                              size="small"
                              style={{ marginBottom: 8 }}
                            >
                              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div>
                                  <Text strong>
                                    {getActivityIcon(activity.type)} {activity.time} - {activity.title}
                                  </Text>
                                  <Tag
                                    color={
                                      activity.type === 'transportation' ? 'blue' :
                                      activity.type === 'accommodation' ? 'purple' :
                                      activity.type === 'attraction' ? 'green' :
                                      activity.type === 'restaurant' ? 'orange' :
                                      'default'
                                    }
                                    style={{ marginLeft: 8 }}
                                  >
                                    {activity.type}
                                  </Tag>
                                </div>
                                <Paragraph
                                  type="secondary"
                                  style={{ margin: 0, fontSize: 12 }}
                                  ellipsis={{ rows: 2, expandable: true }}
                                >
                                  {activity.description}
                                </Paragraph>
                                <div>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    <EnvironmentOutlined /> {activity.location.name}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 16 }}>
                                    <ClockCircleOutlined /> {activity.duration} 分钟
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 16 }}>
                                    <DollarOutlined /> ¥{activity.cost}
                                  </Text>
                                </div>
                              </Space>
                            </Card>
                          ))}
                          <Text type="secondary">
                            当日费用: ¥{day.total_cost}
                          </Text>
                        </Space>
                      </Timeline.Item>
                    ))}
                  </Timeline>

                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSavePlan}
                    block
                    size="large"
                  >
                    保存行程
                  </Button>
                </Space>
              </Sider>

              <Content style={{ padding: '24px' }}>
                <MapView locations={mapLocations} />
              </Content>
            </Layout>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#999',
            }}>
              <RocketOutlined style={{ fontSize: 64, marginBottom: 16 }} />
              <Text type="secondary">填写左侧信息，开始生成您的旅行计划</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
