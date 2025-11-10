import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Card,
  List,
  Button,
  Typography,
  Space,
  Tag,
  Empty,
  Spin,
  Modal,
  message,
  Tabs,
  Timeline,
  Statistic,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
} from 'antd'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  DeleteOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuth } from '@/contexts/AuthContext'
import { databaseService } from '@/services/databaseService'
import { TravelPlan, Expense } from '@/types'
import MapView from '@/components/MapView'
import VoiceInput from '@/components/VoiceInput'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

export default function TripsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [expenseModalVisible, setExpenseModalVisible] = useState(false)
  const [expenseForm] = Form.useForm()

  useEffect(() => {
    loadPlans()
  }, [user])

  const loadPlans = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userPlans = await databaseService.getUserPlans(user.id)
      setPlans(userPlans)
    } catch (error: any) {
      message.error('加载行程失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async (planId: string) => {
    try {
      const planExpenses = await databaseService.getPlanExpenses(planId)
      setExpenses(planExpenses)
    } catch (error: any) {
      message.error('加载费用记录失败: ' + error.message)
    }
  }

  const handleViewPlan = async (plan: TravelPlan) => {
    setSelectedPlan(plan)
    await loadExpenses(plan.id)
    setDetailModalVisible(true)
  }

  const handleDeletePlan = (planId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个行程吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await databaseService.deletePlan(planId)
          message.success('删除成功')
          loadPlans()
        } catch (error: any) {
          message.error('删除失败: ' + error.message)
        }
      },
    })
  }

  const handleAddExpense = () => {
    expenseForm.resetFields()
    setExpenseModalVisible(true)
  }

  const handleVoiceExpense = async (text: string) => {
    // 简单的语音解析示例
    message.info(`语音输入: ${text}`)
    // 可以使用 AI 来解析语音文本并填充表单
  }

  const handleSaveExpense = async (values: any) => {
    if (!selectedPlan) return

    try {
      const expense: Omit<Expense, 'id' | 'created_at'> = {
        plan_id: selectedPlan.id,
        category: values.category,
        amount: values.amount,
        description: values.description,
        date: values.date.format('YYYY-MM-DD'),
        payment_method: values.payment_method,
      }

      await databaseService.addExpense(expense)
      message.success('费用记录已添加')
      setExpenseModalVisible(false)
      await loadExpenses(selectedPlan.id)
    } catch (error: any) {
      message.error('添加失败: ' + error.message)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await databaseService.deleteExpense(expenseId)
      message.success('删除成功')
      if (selectedPlan) {
        await loadExpenses(selectedPlan.id)
      }
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0)

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
        <Title level={3} style={{ margin: 0, flex: 1 }}>
          我的行程
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/planner')}
        >
          创建新计划
        </Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : plans.length === 0 ? (
          <Empty
            description="还没有旅行计划"
            style={{ marginTop: 100 }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/planner')}>
              创建第一个计划
            </Button>
          </Empty>
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={plans}
            renderItem={(plan) => (
              <List.Item>
                <Card
                  hoverable
                  actions={[
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewPlan(plan)}
                    >
                      查看
                    </Button>,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={plan.title}
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text>
                          <EnvironmentOutlined /> {plan.destination}
                        </Text>
                        <Text type="secondary">
                          <CalendarOutlined /> {plan.start_date} 至 {plan.end_date}
                        </Text>
                        <Text type="secondary">
                          <DollarOutlined /> 预算: ¥{plan.budget}
                        </Text>
                        <Text type="secondary">
                          <UserOutlined /> {plan.travelers} 人
                        </Text>
                        <div>
                          <Tag
                            color={
                              plan.status === 'draft' ? 'default' :
                              plan.status === 'confirmed' ? 'blue' :
                              'green'
                            }
                          >
                            {plan.status === 'draft' ? '草稿' :
                             plan.status === 'confirmed' ? '已确认' :
                             '已完成'}
                          </Tag>
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Content>

      {/* 行程详情弹窗 */}
      <Modal
        title={selectedPlan?.title}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1200}
        footer={null}
      >
        {selectedPlan && (
          <Tabs defaultActiveKey="itinerary">
            <TabPane tab="行程详情" key="itinerary">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Statistic
                    title="目的地"
                    value={selectedPlan.destination}
                    prefix={<EnvironmentOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="总预算"
                    value={selectedPlan.budget}
                    prefix="¥"
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="同行人数"
                    value={selectedPlan.travelers}
                    suffix="人"
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="旅行天数"
                    value={selectedPlan.itinerary.length}
                    suffix="天"
                  />
                </Col>
              </Row>

              <Timeline>
                {selectedPlan.itinerary.map((day, dayIndex) => (
                  <Timeline.Item key={dayIndex}>
                    <Title level={5}>第 {day.day} 天 - {day.date}</Title>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {day.activities.map((activity, actIndex) => (
                        <Card key={actIndex} size="small">
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong>
                              {getActivityIcon(activity.type)} {activity.time} - {activity.title}
                            </Text>
                            <Paragraph type="secondary" style={{ margin: 0 }}>
                              {activity.description}
                            </Paragraph>
                            <div>
                              <Text type="secondary">
                                <EnvironmentOutlined /> {activity.location.name}
                              </Text>
                              <Text type="secondary" style={{ marginLeft: 16 }}>
                                <ClockCircleOutlined /> {activity.duration} 分钟
                              </Text>
                              <Text type="secondary" style={{ marginLeft: 16 }}>
                                <DollarOutlined /> ¥{activity.cost}
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TabPane>

            <TabPane tab="费用管理" key="expenses">
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Statistic
                    title="预算"
                    value={selectedPlan.budget}
                    prefix="¥"
                  />
                  <Statistic
                    title="已花费"
                    value={totalExpense}
                    prefix="¥"
                    valueStyle={{ color: totalExpense > selectedPlan.budget ? '#cf1322' : '#3f8600' }}
                  />
                  <Statistic
                    title="剩余"
                    value={selectedPlan.budget - totalExpense}
                    prefix="¥"
                  />
                </Space>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddExpense}
                style={{ marginBottom: 16 }}
              >
                添加费用
              </Button>

              <List
                dataSource={expenses}
                renderItem={(expense) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteExpense(expense.id)}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      title={`${expense.category} - ¥${expense.amount}`}
                      description={
                        <Space direction="vertical" size="small">
                          <Text>{expense.description}</Text>
                          <Text type="secondary">{expense.date}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="地图" key="map">
              <MapView
                locations={selectedPlan.itinerary.flatMap(day =>
                  day.activities.map(a => a.location)
                )}
                height={500}
              />
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* 添加费用弹窗 */}
      <Modal
        title="添加费用记录"
        open={expenseModalVisible}
        onCancel={() => setExpenseModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <VoiceInput onResult={handleVoiceExpense} />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            或使用语音输入
          </Text>
        </div>

        <Form
          form={expenseForm}
          layout="vertical"
          onFinish={handleSaveExpense}
          initialValues={{
            date: dayjs(),
          }}
        >
          <Form.Item
            label="类别"
            name="category"
            rules={[{ required: true, message: '请选择类别' }]}
          >
            <Select
              options={[
                { label: '交通', value: '交通' },
                { label: '住宿', value: '住宿' },
                { label: '餐饮', value: '餐饮' },
                { label: '景点', value: '景点' },
                { label: '购物', value: '购物' },
                { label: '其他', value: '其他' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="金额"
            name="amount"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              prefix="¥"
            />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="支付方式"
            name="payment_method"
          >
            <Select
              options={[
                { label: '现金', value: '现金' },
                { label: '信用卡', value: '信用卡' },
                { label: '支付宝', value: '支付宝' },
                { label: '微信', value: '微信' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setExpenseModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}
