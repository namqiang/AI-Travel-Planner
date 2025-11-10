# 项目架构文档

本文档详细说明 AI 旅行规划师的技术架构、设计模式和关键实现。

## 目录

- [整体架构](#整体架构)
- [技术栈详解](#技术栈详解)
- [目录结构](#目录结构)
- [数据流](#数据流)
- [核心模块](#核心模块)
- [API 集成](#api-集成)
- [状态管理](#状态管理)
- [安全设计](#安全设计)

---

## 整体架构

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  登录页  │  │  首页    │  │  规划页  │  │  行程页  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      组件层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  地图    │  │  语音    │  │  路由    │  │  表单    │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      状态管理层                           │
│  ┌──────────────┐           ┌──────────────┐            │
│  │  AuthContext │           │ ConfigContext│            │
│  └──────────────┘           └──────────────┘            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      服务层                               │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ Auth │  │  AI  │  │ Voice│  │ Map  │  │  DB  │     │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      外部服务层                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Supabase │  │  OpenAI  │  │  讯飞    │  │ 高德    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 架构特点

1. **分层架构**: 清晰的层次划分，职责明确
2. **组件化**: 高度可复用的组件设计
3. **服务化**: 业务逻辑封装在服务层
4. **类型安全**: 全面的 TypeScript 类型定义

---

## 技术栈详解

### 前端框架

**React 18.2**
- 选择原因：
  - 生态成熟，社区活跃
  - 组件化开发，代码复用性高
  - Hooks API 简化状态管理
  - 虚拟 DOM 提供高性能

**TypeScript 5.3**
- 选择原因：
  - 静态类型检查，减少运行时错误
  - 优秀的 IDE 支持
  - 代码可维护性高
  - 重构更安全

### 构建工具

**Vite 5.0**
- 选择原因：
  - 极快的冷启动速度
  - 热模块替换 (HMR) 即时响应
  - 开箱即用的 TypeScript 支持
  - 优化的生产构建

### UI 框架

**Ant Design 5.13**
- 选择原因：
  - 企业级 UI 设计
  - 丰富的组件库
  - 良好的 TypeScript 支持
  - 国际化支持

**Tailwind CSS 3.4**
- 选择原因：
  - 实用优先的 CSS 框架
  - 快速原型开发
  - 高度可定制
  - 优秀的响应式设计

### 后端服务

**Supabase**
- 功能：
  - PostgreSQL 数据库
  - 用户认证
  - 实时订阅
  - 行级安全策略 (RLS)

- 选择原因：
  - 开源，可自托管
  - 开发体验优秀
  - 免费额度慷慨
  - 与 Firebase 类似但更强大

---

## 目录结构

```
src/
├── components/          # 可复用组件
│   ├── MapView.tsx          # 地图视图组件
│   ├── ProtectedRoute.tsx   # 路由保护
│   └── VoiceInput.tsx       # 语音输入
│
├── contexts/            # React Context
│   ├── AuthContext.tsx      # 认证状态
│   └── ConfigContext.tsx    # 配置管理
│
├── lib/                 # 第三方库封装
│   └── supabase.ts          # Supabase 客户端
│
├── pages/               # 页面组件
│   ├── HomePage.tsx         # 首页
│   ├── LoginPage.tsx        # 登录页
│   ├── PlannerPage.tsx      # 行程规划页
│   ├── RegisterPage.tsx     # 注册页
│   ├── SettingsPage.tsx     # 设置页
│   └── TripsPage.tsx        # 我的行程页
│
├── services/            # 业务逻辑服务
│   ├── aiService.ts         # AI 规划服务
│   ├── authService.ts       # 认证服务
│   ├── databaseService.ts   # 数据库操作
│   ├── mapService.ts        # 地图服务
│   └── voiceService.ts      # 语音识别
│
├── types/               # TypeScript 类型定义
│   └── index.ts
│
├── App.tsx              # 应用根组件
├── App.css              # 应用样式
├── index.css            # 全局样式
└── main.tsx             # 应用入口
```

### 设计原则

1. **按功能分层**: 每层有明确职责
2. **单一职责**: 每个文件专注一个功能
3. **依赖注入**: 服务间通过接口通信
4. **开闭原则**: 易于扩展，无需修改现有代码

---

## 数据流

### 用户认证流程

```
用户输入账号密码
    ↓
LoginPage 调用 authService.signIn()
    ↓
authService 调用 Supabase Auth API
    ↓
Supabase 返回用户信息和 token
    ↓
AuthContext 更新用户状态
    ↓
应用重定向到首页
```

### 行程规划流程

```
用户输入旅行需求（文字/语音）
    ↓
PlannerPage 收集表单数据
    ↓
调用 aiService.generateTravelPlan()
    ↓
aiService 调用 OpenAI API
    ↓
AI 返回 JSON 格式的行程计划
    ↓
解析并格式化数据
    ↓
在地图上显示行程路线
    ↓
用户确认后保存到 Supabase
```

### 语音识别流程

```
用户点击语音按钮
    ↓
VoiceInput 请求麦克风权限
    ↓
voiceService.startRecording()
    ↓
建立 WebSocket 连接到讯飞 API
    ↓
实时传输音频流
    ↓
接收识别结果
    ↓
回调函数处理识别文本
```

---

## 核心模块

### 1. 认证模块

**文件**: `src/services/authService.ts`

**功能**:
- 用户注册
- 用户登录
- 用户登出
- 获取当前用户
- 监听认证状态

**实现**:
```typescript
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },
  // ... 其他方法
}
```

**安全措施**:
- 密码使用 bcrypt 加密存储
- JWT token 自动管理
- 行级安全策略保护数据

### 2. AI 规划模块

**文件**: `src/services/aiService.ts`

**功能**:
- 生成旅行计划
- 解析语音输入
- 优化行程建议

**实现**:
```typescript
export class AIService {
  async generateTravelPlan(request: PlanningRequest) {
    const prompt = this.buildPlanningPrompt(request)
    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '...' },
          { role: 'user', content: prompt }
        ]
      }
    )
    return this.parsePlanResponse(response)
  }
}
```

**提示词工程**:
- 结构化输出要求
- 明确的约束条件
- 示例格式引导

### 3. 语音识别模块

**文件**: `src/services/voiceService.ts`

**功能**:
- 实时语音转文字
- WebSocket 通信
- 音频流处理

**实现**:
```typescript
export class VoiceService {
  async startRecording(onResult, onError) {
    // 1. 获取麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 2. 建立 WebSocket 连接
    const ws = new WebSocket(this.generateAuthUrl())

    // 3. 处理音频流
    const audioContext = new AudioContext({ sampleRate: 16000 })
    const processor = audioContext.createScriptProcessor(4096, 1, 1)

    // 4. 接收识别结果
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.data.status === 2) {
        onResult({ text: resultText, confidence: 1 })
      }
    }
  }
}
```

**技术要点**:
- WebSocket 实时通信
- Web Audio API 音频处理
- HMAC-SHA256 签名认证

### 4. 地图模块

**文件**: `src/services/mapService.ts`

**功能**:
- 地图初始化
- 标记管理
- 路线绘制
- 地理编码

**实现**:
```typescript
export class MapService {
  initMap(containerId: string, center?: [number, number]) {
    this.map = new AMap.Map(containerId, {
      zoom: 12,
      center: center || [116.397428, 39.90923],
      mapStyle: 'amap://styles/normal',
    })
  }

  addMarker(location: Location, options?: any) {
    const marker = new AMap.Marker({
      position: [location.longitude, location.latitude],
      title: location.name,
    })
    marker.setMap(this.map)
  }
}
```

### 5. 数据库模块

**文件**: `src/services/databaseService.ts`

**功能**:
- CRUD 操作
- 行级安全
- 实时订阅

**实现**:
```typescript
export const databaseService = {
  async createPlan(plan: Omit<TravelPlan, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('travel_plans')
      .insert([plan])
      .select()
      .single()

    if (error) throw error
    return data
  }
}
```

---

## API 集成

### OpenAI API

**端点**: `https://api.openai.com/v1/chat/completions`

**请求格式**:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "你是旅行规划师" },
    { "role": "user", "content": "请生成旅行计划..." }
  ],
  "temperature": 0.7,
  "max_tokens": 3000
}
```

**响应处理**:
- 提取 JSON 格式的行程数据
- 验证数据完整性
- 转换为应用内部类型

### 科大讯飞 API

**协议**: WebSocket

**认证方式**: HMAC-SHA256 签名

**流程**:
1. 生成认证 URL
2. 建立 WebSocket 连接
3. 发送音频数据
4. 接收识别结果

### 高德地图 API

**加载方式**: Script 标签

**功能使用**:
- AMap.Map: 地图显示
- AMap.Marker: 标记点
- AMap.Polyline: 路线
- AMap.Geocoder: 地理编码

---

## 状态管理

### Context 架构

**AuthContext**
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

**ConfigContext**
```typescript
interface ConfigContextType {
  config: ApiConfig
  updateConfig: (newConfig: Partial<ApiConfig>) => void
  isConfigured: boolean
}
```

### 状态持久化

- **认证状态**: Supabase 自动管理 token
- **配置信息**: localStorage 存储
- **旅行计划**: Supabase 数据库

---

## 安全设计

### 前端安全

1. **XSS 防护**
   - React 默认转义
   - 避免 dangerouslySetInnerHTML

2. **CSRF 防护**
   - Supabase 处理

3. **敏感信息**
   - API Keys 存储在环境变量
   - 不提交到 Git

### 后端安全

1. **行级安全 (RLS)**
```sql
CREATE POLICY "Users can view their own travel plans"
ON travel_plans
FOR SELECT
USING (auth.uid() = user_id);
```

2. **认证验证**
   - JWT token 验证
   - 自动过期刷新

3. **数据验证**
   - 前端表单验证
   - 数据库约束

### API 安全

1. **密钥管理**
   - 环境变量存储
   - 定期轮换

2. **请求限制**
   - API 配额监控
   - 错误重试策略

3. **HTTPS**
   - 生产环境强制 HTTPS
   - 安全的 WebSocket (WSS)

---

## 性能优化

### 代码分割

```typescript
// 路由级别代码分割
const PlannerPage = lazy(() => import('./pages/PlannerPage'))
```

### 懒加载

```typescript
// 组件懒加载
<Suspense fallback={<Spin />}>
  <PlannerPage />
</Suspense>
```

### 缓存策略

1. **浏览器缓存**
   - 静态资源长期缓存
   - 动态内容协商缓存

2. **应用缓存**
   - React Query 数据缓存
   - localStorage 配置缓存

### 网络优化

1. **请求优化**
   - 并发请求
   - 请求取消
   - 防抖节流

2. **资源优化**
   - 图片压缩
   - 代码压缩
   - Tree shaking

---

## 测试策略

### 单元测试

```typescript
// 服务测试示例
describe('AIService', () => {
  it('should generate travel plan', async () => {
    const plan = await aiService.generateTravelPlan({
      destination: 'Tokyo',
      // ...
    })
    expect(plan).toBeDefined()
  })
})
```

### 集成测试

```typescript
// 页面测试示例
describe('PlannerPage', () => {
  it('should create plan on submit', async () => {
    render(<PlannerPage />)
    // 填写表单
    // 点击提交
    // 验证结果
  })
})
```

### E2E 测试

使用 Playwright 或 Cypress 进行端到端测试。

---

## 扩展性设计

### 插件化架构

可以轻松添加新的服务：

```typescript
// 新增翻译服务
export class TranslationService {
  async translate(text: string, target: string) {
    // 实现翻译逻辑
  }
}
```

### 主题定制

```typescript
// 自定义主题
<ConfigProvider theme={{
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
  },
}}>
  <App />
</ConfigProvider>
```

### 国际化

```typescript
// 添加多语言支持
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

<ConfigProvider locale={currentLocale}>
  <App />
</ConfigProvider>
```

---

## 最佳实践

### 代码规范

1. **命名约定**
   - 组件：PascalCase
   - 函数：camelCase
   - 常量：UPPER_SNAKE_CASE

2. **文件组织**
   - 一个文件一个组件
   - 相关文件放在同一目录

3. **注释规范**
   - 复杂逻辑添加注释
   - 公共 API 添加 JSDoc

### Git 工作流

```bash
# 功能分支
git checkout -b feature/new-feature

# 提交规范
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update readme"
```

### 错误处理

```typescript
try {
  const result = await apiCall()
} catch (error) {
  if (error instanceof ApiError) {
    // 处理 API 错误
  } else {
    // 处理其他错误
  }
  logger.error('Error occurred', error)
}
```

---

## 未来规划

### 功能扩展

1. **社交功能**
   - 分享行程
   - 协作规划

2. **智能推荐**
   - 基于历史的个性化推荐
   - 实时优惠信息

3. **离线支持**
   - PWA 支持
   - 离线地图

### 技术升级

1. **性能提升**
   - React Server Components
   - Suspense for Data Fetching

2. **开发体验**
   - Storybook 组件文档
   - 自动化测试

---

## 参考资源

- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Supabase 文档](https://supabase.com/docs)
- [Ant Design 文档](https://ant.design/)

---

**维护者**: AI Travel Planner Team
**最后更新**: 2024-01-10
