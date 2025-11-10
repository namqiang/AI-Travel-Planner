# AI 旅行规划师 (AI Travel Planner)

一个基于 AI 的智能旅行规划 Web 应用，通过语音交互和大语言模型帮助用户自动生成个性化旅行路线，并提供实时预算管理和云端数据同步功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6.svg)

## 功能特性

### 核心功能

- **智能行程规划**
  - 支持文字和语音输入旅行需求
  - AI 自动生成详细的旅行路线
  - 包含交通、住宿、景点、餐厅等完整信息
  - 个性化推荐（美食、文化、历史、自然等）

- **语音交互**
  - 集成科大讯飞语音识别 API
  - 实时语音转文字
  - 语音输入旅行需求和费用记录
  - 便捷的语音交互体验

- **费用预算与管理**
  - AI 智能预算分析
  - 实时记录旅行开销
  - 预算追踪和统计
  - 多种支付方式记录
  - 分类费用管理

- **地图导航**
  - 高德地图集成
  - 可视化行程路线
  - 景点位置标注
  - 路线规划和导航

- **用户管理**
  - 注册登录系统
  - 多份旅行计划管理
  - 云端数据同步
  - 跨设备访问

## 技术栈

### 前端
- **框架**: React 18.2 + TypeScript
- **构建工具**: Vite 5.0
- **UI 库**: Ant Design 5.13
- **样式**: Tailwind CSS 3.4
- **路由**: React Router DOM 6.21
- **状态管理**: React Context + Hooks

### 后端服务
- **认证**: Supabase Authentication
- **数据库**: Supabase (PostgreSQL)
- **实时同步**: Supabase Realtime

### 第三方 API
- **AI 规划**: 支持多种大语言模型
  - OpenAI (GPT-3.5 / GPT-4)
  - DeepSeek
  - 通义千问 (Qwen)
  - Kimi (Moonshot)
  - 其他兼容 OpenAI 格式的 API
- **语音识别**: 科大讯飞语音识别 API
- **地图服务**: 高德地图 Web API v2.0

## 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm 或 yarn
- Supabase 账号
- 大语言模型 API Key (OpenAI / DeepSeek / Qwen / Kimi 等任选其一)
- 科大讯飞 API 账号
- 高德地图 API Key

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/AI-Travel-Planner.git
cd AI-Travel-Planner
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**

创建 `.env` 文件并配置 Supabase：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **配置 Supabase 数据库**

- 登录 [Supabase](https://supabase.com)
- 创建新项目
- 在 SQL 编辑器中执行 `database/schema.sql` 或 `database/schema_fixed.sql`
  - 如果遇到 "trigger already exists" 错误，请使用 `schema_fixed.sql`

5. **配置高德地图 API Key**

编辑 `index.html` 文件，替换高德地图 API Key：

```html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Scale,AMap.ToolBar"></script>
```

**注意**: 必须包含 `plugin=AMap.Scale,AMap.ToolBar` 参数以正确加载地图插件。

6. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

7. **访问应用**

打开浏览器访问 `http://localhost:3000`

### API Keys 配置

首次使用需要在应用的设置页面配置以下 API Keys：

1. **AI 大语言模型 API (任选其一)**

   **OpenAI**
   - 获取地址: https://platform.openai.com/api-keys
   - 模型: gpt-3.5-turbo / gpt-4
   - 用途: AI 智能规划功能

   **DeepSeek (推荐国内用户)**
   - 获取地址: https://platform.deepseek.com/
   - 模型: deepseek-chat
   - 特点: 性价比高，国内访问稳定

   **通义千问 (Qwen)**
   - 获取地址: https://dashscope.aliyun.com/
   - 模型: qwen-plus / qwen-turbo
   - 特点: 阿里云服务，国内访问快

   **Kimi (Moonshot)**
   - 获取地址: https://platform.moonshot.cn/
   - 模型: moonshot-v1-8k
   - 特点: 支持超长上下文

   **其他兼容 OpenAI 格式的 API**
   - 可配置自定义 API 地址和模型名称
   - 详见文档: [docs/AI_MODELS.md](docs/AI_MODELS.md)

2. **科大讯飞 API**
   - 获取地址: https://console.xfyun.cn/
   - 需要: APPID、API Key、API Secret
   - 用途: 语音识别功能

3. **高德地图 API Key**
   - 获取地址: https://console.amap.com/dev/key/app
   - 用途: 地图和导航功能

## 项目结构

```
AI-Travel-Planner/
├── .github/             # GitHub Actions 工作流
│   └── workflows/
│       └── docker-build.yml  # Docker 镜像构建和推送
├── public/              # 静态资源
├── src/
│   ├── components/      # 公共组件
│   │   ├── MapView.tsx         # 地图视图组件
│   │   ├── ProtectedRoute.tsx  # 路由保护组件
│   │   └── VoiceInput.tsx      # 语音输入组件
│   ├── contexts/        # React Context
│   │   ├── AuthContext.tsx     # 认证上下文
│   │   └── ConfigContext.tsx   # 配置上下文
│   ├── lib/             # 第三方库配置
│   │   └── supabase.ts         # Supabase 客户端
│   ├── pages/           # 页面组件
│   │   ├── HomePage.tsx        # 首页
│   │   ├── LoginPage.tsx       # 登录页
│   │   ├── PlannerPage.tsx     # 行程规划页
│   │   ├── RegisterPage.tsx    # 注册页
│   │   ├── SettingsPage.tsx    # 设置页
│   │   └── TripsPage.tsx       # 我的行程页
│   ├── services/        # 业务服务
│   │   ├── aiService.ts        # AI 服务
│   │   ├── authService.ts      # 认证服务
│   │   ├── databaseService.ts  # 数据库服务
│   │   ├── mapService.ts       # 地图服务
│   │   └── voiceService.ts     # 语音服务
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx          # 应用根组件
│   ├── App.css          # 应用样式
│   ├── index.css        # 全局样式
│   └── main.tsx         # 应用入口
├── database/            # 数据库脚本
│   ├── schema.sql       # 数据库表结构
│   └── schema_fixed.sql # 可重复执行的数据库脚本
├── docs/                # 项目文档
│   ├── AI_MODELS.md     # AI 模型配置指南
│   └── DOCKER.md        # Docker 部署详细指南
├── .dockerignore        # Docker 忽略文件
├── Dockerfile           # Docker 镜像构建文件
├── docker-compose.yml   # Docker Compose 配置
├── nginx.conf           # Nginx 服务器配置
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── README.md            # 项目文档
```

## 使用说明

### 1. 注册和登录

- 首次使用需要注册账号
- 使用邮箱和密码登录

### 2. 配置 API Keys

- 点击右上角"设置"按钮
- 输入所需的 API Keys
- 保存配置

### 3. 创建旅行计划

#### 方式一：表单输入
1. 点击"创建新计划"
2. 填写目的地、日期、预算、人数等信息
3. 选择旅行偏好
4. 点击"生成旅行计划"

#### 方式二：语音输入
1. 点击麦克风图标
2. 说出旅行需求，例如：
   > "我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"
3. AI 自动解析并生成行程

### 4. 查看和管理行程

- 在地图上查看行程路线
- 查看每日详细活动安排
- 添加、编辑、删除行程

### 5. 费用管理

- 记录实际花费
- 对比预算和实际支出
- 分类统计费用
- 支持语音记账

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

### 环境变量

创建 `.env.local` 文件用于本地开发：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 数据库迁移

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
-- 执行 database/schema.sql 中的 SQL 脚本
```

## 部署

### Docker 部署（推荐）

使用 Docker 可以快速部署应用，无需配置 Node.js 环境。

#### 方式一：使用预构建镜像

```bash
# 从阿里云镜像仓库拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

访问 `http://localhost:3000` 即可使用应用。

#### 方式二：使用 Docker Compose

```bash
# 下载 docker-compose.yml 文件
wget https://raw.githubusercontent.com/your-username/AI-Travel-Planner/main/docker-compose.yml

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 方式三：本地构建镜像

```bash
# 克隆项目
git clone https://github.com/your-username/AI-Travel-Planner.git
cd AI-Travel-Planner

# 构建镜像
docker build -t ai-travel-planner:latest .

# 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  --restart unless-stopped \
  ai-travel-planner:latest
```

**详细文档**: 查看 [Docker 部署指南](docs/DOCKER.md) 了解更多配置选项、生产环境部署、监控和故障排查等内容。

### Vercel 部署

1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 点击部署

### Netlify 部署

1. 连接 GitHub 仓库
2. 构建命令: `npm run build`
3. 发布目录: `dist`
4. 配置环境变量

## 常见问题

### 1. 语音识别不工作

**问题**: 点击录音按钮后无反应或识别文本不显示

**解决方案**:
- 检查科大讯飞 API 配置是否正确（APPID、API Key、API Secret）
- 确保浏览器已授予麦克风权限
- 确认使用 HTTPS 或 localhost（麦克风需要安全上下文）
- 录音完成后点击停止按钮，等待识别结果返回
- 查看浏览器控制台是否有错误信息

**已修复的问题**:
- ✅ 修复了 "request data must be valid json string" 错误
- ✅ 修复了语音识别结果不显示的问题
- ✅ 增加了手动触发回调机制，确保识别文本能正确显示

### 2. 地图不显示或报错

**问题**: 地图显示空白或控制台报错

**常见错误及解决方案**:

**错误 1**: `AMap.Scale is not a constructor`
- **原因**: 未正确加载地图插件
- **解决**: 确保 `index.html` 中的地图 SDK 链接包含插件参数：
  ```html
  <script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_KEY&plugin=AMap.Scale,AMap.ToolBar"></script>
  ```

**错误 2**: `Invalid Object: LngLat(NaN, NaN)`
- **原因**: AI 返回的坐标数据无效
- **解决**: 已在代码中添加坐标验证，自动过滤无效坐标
- **建议**: 使用更新的 AI 模型（如 GPT-4、DeepSeek）生成更准确的坐标

**其他检查项**:
- 检查高德地图 API Key 是否配置
- 确认 API Key 是否有效且未过期
- 检查是否有配额限制

### 3. AI 规划失败

**问题**: 生成旅行计划时报错

**常见错误及解决方案**:

- **API Key 未配置**: 在设置页面配置 AI API Key
- **API 额度不足**: 检查 API 账号余额和配额
- **网络连接问题**:
  - 使用 OpenAI 需要国际网络访问
  - 推荐国内用户使用 DeepSeek、Qwen 或 Kimi
- **模型参数错误**: 确保模型名称正确（如 `deepseek-chat`）

**切换 AI 模型**:
1. 进入设置页面
2. 选择不同的 AI 提供商
3. 输入对应的 API Key
4. 保存配置后重试

### 4. 保存行程失败

**问题**: `invalid input syntax for type uuid`

**解决方案**:
- ✅ 已修复：使用 `crypto.randomUUID()` 生成标准 UUID
- 确保浏览器支持 `crypto.randomUUID()` (现代浏览器均支持)
- 如果使用旧版浏览器，请升级到最新版本

### 5. 数据库触发器错误

**问题**: `trigger 'update_travel_plans_updated_at' already exists`

**解决方案**:
- 使用 `database/schema_fixed.sql` 代替 `database/schema.sql`
- 该脚本包含 `DROP IF EXISTS` 语句，可安全重复执行

### 6. 页面无法滚动

**解决方案**:
- ✅ 已修复：移除了 `overflow: hidden` 限制
- 如果仍有问题，请清除浏览器缓存后重试

### 7. 数据不同步

**检查项**:
- 检查 Supabase 配置是否正确（URL 和 Anon Key）
- 确认用户已登录
- 检查网络连接
- 查看浏览器控制台的 Supabase 错误信息

## 技术亮点

1. **多模型 AI 支持**: 支持 OpenAI、DeepSeek、Qwen、Kimi 等多种大语言模型，用户可根据需求灵活选择
2. **语音交互体验**: 集成科大讯飞语音识别，WebSocket 实时通信，提供流畅的语音输入体验
3. **AI 智能规划**: 基于大语言模型生成个性化旅行方案，智能理解用户需求
4. **实时数据同步**: 使用 Supabase 实现云端数据同步和 Row Level Security
5. **地图可视化**: 高德地图 2.0 集成，坐标验证机制，直观展示行程路线
6. **响应式设计**: 适配多种设备和屏幕尺寸
7. **类型安全**: 全面使用 TypeScript 保证代码质量和开发体验
8. **组件化开发**: React Hooks + Context 实现状态管理，代码结构清晰
9. **错误处理**: 完善的错误处理和用户反馈机制

## 版本更新记录

### v1.2.0 (最新)

**新增功能**:
- ✨ Docker 支持：提供完整的 Docker 部署方案
- ✨ GitHub Actions 自动构建：推送代码自动构建并发布到阿里云镜像仓库
- ✨ 多架构支持：支持 linux/amd64 和 linux/arm64
- ✨ Docker Compose 配置：一键启动完整应用
- ✨ Nginx 优化：Gzip 压缩、静态资源缓存、安全头部
- ✨ 健康检查：容器内置健康检查机制
- ✨ Docker 部署文档：详细的部署、配置和故障排查指南

**优化改进**:
- 🔧 多阶段构建优化镜像大小
- 🔧 使用 Alpine Linux 减小镜像体积
- 🔧 配置镜像缓存加速构建
- 🔧 自动生成多个版本标签

### v1.1.0

**新增功能**:
- ✨ 支持多种 AI 模型（OpenAI、DeepSeek、Qwen、Kimi）
- ✨ 可自定义 API 地址和模型名称
- ✨ 新增 AI 模型配置指南文档

**Bug 修复**:
- 🐛 修复语音识别 JSON 格式错误（"request data must be valid json string"）
- 🐛 修复语音识别结果不显示的问题
- 🐛 修复地图插件加载错误（AMap.Scale is not a constructor）
- 🐛 修复无效坐标导致地图报错（Invalid Object: LngLat(NaN, NaN)）
- 🐛 修复 UUID 格式错误（invalid input syntax for type uuid）
- 🐛 修复页面无法滚动的问题
- 🐛 修复数据库触发器重复创建错误

**优化改进**:
- 🔧 增加坐标验证机制，自动过滤无效坐标
- 🔧 优化语音识别回调机制，增加手动触发逻辑
- 🔧 改进 AI Prompt，生成更准确的地理坐标
- 🔧 使用 `crypto.randomUUID()` 生成标准 UUID
- 🔧 创建可重复执行的数据库脚本（schema_fixed.sql）
- 🔧 添加详细的控制台日志便于调试

### v1.0.0

- 🎉 初始版本发布
- ✨ 基础旅行规划功能
- ✨ 语音输入支持
- ✨ 地图导航集成
- ✨ 用户认证系统

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 Issue
- 发送邮件
- 提交 Pull Request

## 致谢

- [React](https://react.dev/)
- [Ant Design](https://ant.design/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [科大讯飞](https://www.xfyun.cn/)
- [高德地图](https://lbs.amap.com/)

---

⭐ 如果这个项目对你有帮助，欢迎 Star！#   T e s t  
 