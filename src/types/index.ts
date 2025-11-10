// 用户类型
export interface User {
  id: string
  email: string
  created_at: string
}

// 旅行计划类型
export interface TravelPlan {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  travelers: number
  preferences: string[]
  itinerary: DayItinerary[]
  expenses: Expense[]
  status: 'draft' | 'confirmed' | 'completed'
  created_at: string
  updated_at: string
}

// 每日行程
export interface DayItinerary {
  day: number
  date: string
  activities: Activity[]
  total_cost: number
}

// 活动项目
export interface Activity {
  id: string
  time: string
  type: 'transportation' | 'accommodation' | 'attraction' | 'restaurant' | 'other'
  title: string
  description: string
  location: Location
  cost: number
  duration: number // 分钟
  images?: string[]
}

// 地理位置
export interface Location {
  name: string
  address: string
  latitude: number
  longitude: number
}

// 费用记录
export interface Expense {
  id: string
  plan_id: string
  category: string
  amount: number
  description: string
  date: string
  payment_method?: string
  created_at: string
}

// API 配置
export interface ApiConfig {
  // AI 模型配置
  ai_provider?: 'openai' | 'deepseek' | 'qwen' | 'kimi' | 'other'
  ai_api_key?: string
  ai_base_url?: string
  ai_model?: string

  // 语音识别配置
  xunfei_app_id?: string
  xunfei_api_key?: string
  xunfei_api_secret?: string

  // 地图配置
  amap_key?: string
}

// 语音识别结果
export interface VoiceRecognitionResult {
  text: string
  confidence: number
}

// AI 规划请求
export interface PlanningRequest {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  additionalNotes?: string
}

// AI 规划响应
export interface PlanningResponse {
  success: boolean
  plan?: TravelPlan
  error?: string
}
