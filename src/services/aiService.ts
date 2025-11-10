import axios from 'axios'
import { PlanningRequest, PlanningResponse, TravelPlan, DayItinerary, Activity } from '@/types'

export class AIService {
  private apiKey: string = ''
  private baseURL: string = 'https://api.openai.com/v1'
  private model: string = 'gpt-3.5-turbo'
  private provider: string = 'openai'

  setApiKey(key: string) {
    this.apiKey = key
  }

  setBaseURL(url: string) {
    this.baseURL = url
  }

  setModel(model: string) {
    this.model = model
  }

  setProvider(provider: string) {
    this.provider = provider
  }

  // 配置预设
  configureProvider(provider: 'openai' | 'deepseek' | 'qwen' | 'kimi' | 'other', apiKey: string, customUrl?: string, customModel?: string) {
    this.provider = provider
    this.apiKey = apiKey

    switch (provider) {
      case 'openai':
        this.baseURL = 'https://api.openai.com/v1'
        this.model = customModel || 'gpt-3.5-turbo'
        break
      case 'deepseek':
        this.baseURL = 'https://api.deepseek.com/v1'
        this.model = customModel || 'deepseek-chat'
        break
      case 'qwen':
        this.baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        this.model = customModel || 'qwen-plus'
        break
      case 'kimi':
        this.baseURL = 'https://api.moonshot.cn/v1'
        this.model = customModel || 'moonshot-v1-8k'
        break
      case 'other':
        this.baseURL = customUrl || 'https://api.openai.com/v1'
        this.model = customModel || 'gpt-3.5-turbo'
        break
    }
  }

  // 生成旅行计划
  async generateTravelPlan(request: PlanningRequest): Promise<PlanningResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: '请先在设置页面配置 AI API Key',
      }
    }

    try {
      const prompt = this.buildPlanningPrompt(request)

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的旅行规划师，擅长根据用户需求制定详细的旅行计划。请以 JSON 格式返回旅行计划。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 3000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      const content = response.data.choices[0].message.content
      const planData = this.parsePlanResponse(content, request)

      return {
        success: true,
        plan: planData,
      }
    } catch (error: any) {
      console.error('AI 生成计划失败:', error)
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || '生成旅行计划失败',
      }
    }
  }

  // 构建规划提示词
  private buildPlanningPrompt(request: PlanningRequest): string {
    const days = Math.ceil(
      (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
    ) + 1

    return `
请为以下旅行需求生成详细的旅行计划：

目的地: ${request.destination}
出发日期: ${request.startDate}
返程日期: ${request.endDate}
旅行天数: ${days} 天
预算: ${request.budget} 元
同行人数: ${request.travelers} 人
旅行偏好: ${request.preferences.join('、')}
${request.additionalNotes ? `补充说明: ${request.additionalNotes}` : ''}

请返回以下格式的 JSON 数据：
{
  "title": "旅行计划标题",
  "summary": "行程概述",
  "itinerary": [
    {
      "day": 1,
      "date": "2024-01-01",
      "activities": [
        {
          "time": "09:00",
          "type": "transportation/accommodation/attraction/restaurant/other",
          "title": "活动标题",
          "description": "详细描述",
          "location": {
            "name": "地点名称",
            "address": "详细地址",
            "latitude": 39.9042,
            "longitude": 116.4074
          },
          "cost": 200,
          "duration": 120
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "transportation": 2000,
    "accommodation": 3000,
    "food": 2000,
    "attractions": 2000,
    "other": 1000
  },
  "tips": ["旅行建议1", "旅行建议2"]
}

重要提示：
1. location 中的 latitude 和 longitude 必须是真实有效的坐标值
2. 如果不确定具体坐标，请使用目的地城市的中心坐标
3. 坐标格式：纬度范围 -90 到 90，经度范围 -180 到 180

请确保：
1. 行程安排合理，时间衔接自然
2. 景点选择符合用户偏好
3. 预算分配合理，不超过总预算
4. 包含交通、住宿、餐饮、景点等完整信息
5. 提供实用的旅行建议
`
  }

  // 解析 AI 响应
  private parsePlanResponse(content: string, request: PlanningRequest): TravelPlan {
    try {
      // 尝试提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content
      const data = JSON.parse(jsonStr)

      const itinerary: DayItinerary[] = data.itinerary.map((day: any) => ({
        day: day.day,
        date: day.date,
        activities: day.activities.map((activity: any) => ({
          id: `activity-${Date.now()}-${Math.random()}`,
          time: activity.time,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          location: activity.location,
          cost: activity.cost,
          duration: activity.duration,
          images: activity.images || [],
        })),
        total_cost: day.activities.reduce((sum: number, a: any) => sum + a.cost, 0),
      }))

      // 生成临时 UUID（在保存到数据库时会被数据库生成的 UUID 替换）
      const plan: TravelPlan = {
        id: crypto.randomUUID(), // 使用浏览器原生 UUID 生成
        user_id: '',
        title: data.title || `${request.destination}之旅`,
        destination: request.destination,
        start_date: request.startDate,
        end_date: request.endDate,
        budget: request.budget,
        travelers: request.travelers,
        preferences: request.preferences,
        itinerary,
        expenses: [],
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return plan
    } catch (error) {
      console.error('解析 AI 响应失败:', error)
      throw new Error('解析旅行计划失败')
    }
  }

  // 基于语音输入生成计划
  async generateFromVoiceInput(voiceText: string): Promise<PlanningResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: '请先在设置页面配置 AI API Key',
      }
    }

    try {
      // 先用 AI 理解语音内容，提取结构化信息
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一个旅行规划助手。请从用户的语音输入中提取旅行需求信息，并以 JSON 格式返回。',
            },
            {
              role: 'user',
              content: `请从以下语音输入中提取旅行信息：\n\n"${voiceText}"\n\n请返回 JSON 格式：\n{\n  "destination": "目的地",\n  "startDate": "YYYY-MM-DD",\n  "endDate": "YYYY-MM-DD",\n  "budget": 数字,\n  "travelers": 数字,\n  "preferences": ["偏好1", "偏好2"],\n  "additionalNotes": "其他说明"\n}`,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      const content = response.data.choices[0].message.content
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content
      const request: PlanningRequest = JSON.parse(jsonStr)

      // 生成完整的旅行计划
      return await this.generateTravelPlan(request)
    } catch (error: any) {
      console.error('处理语音输入失败:', error)
      return {
        success: false,
        error: error.message || '处理语音输入失败',
      }
    }
  }
}

export const aiService = new AIService()
