# 快速开始指南

本指南将帮助你在 5-10 分钟内启动 AI 旅行规划师应用。

## 第一步：准备工作

### 1. 安装 Node.js

确保你的电脑已安装 Node.js (版本 >= 16.0.0)

检查安装：
```bash
node --version
npm --version
```

如果未安装，请访问 [nodejs.org](https://nodejs.org/) 下载安装。

### 2. 克隆或下载项目

```bash
git clone https://github.com/your-username/AI-Travel-Planner.git
cd AI-Travel-Planner
```

或者直接下载 ZIP 文件并解压。

## 第二步：安装依赖

在项目根目录运行：

```bash
npm install
```

这将安装所有必要的依赖包（可能需要 2-5 分钟）。

## 第三步：配置 Supabase

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新组织（如果是第一次使用）
5. 创建新项目：
   - 输入项目名称（如：ai-travel-planner）
   - 设置数据库密码（请记住这个密码）
   - 选择区域（建议选择 Northeast Asia (Tokyo) 或其他近距离区域）
   - 点击 "Create new project"
6. 等待项目创建完成（约 1-2 分钟）

### 2. 获取 API 密钥

项目创建完成后：

1. 在左侧菜单点击 "Settings" (齿轮图标)
2. 点击 "API"
3. 你会看到：
   - **Project URL**: 这是你的 `VITE_SUPABASE_URL`
   - **anon/public key**: 这是你的 `VITE_SUPABASE_ANON_KEY`

### 3. 创建数据库表

1. 在左侧菜单点击 "SQL Editor"
2. 点击 "New query"
3. 打开项目中的 `database/schema.sql` 文件
4. 复制所有内容粘贴到 SQL Editor
5. 点击 "Run" 执行

### 4. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 信息：

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 第四步：启动应用

运行开发服务器：

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 第五步：注册账号并配置 API Keys

### 1. 注册账号

1. 打开浏览器访问 `http://localhost:3000`
2. 点击 "立即注册"
3. 输入邮箱和密码
4. 点击 "注册"

### 2. 配置 API Keys

首次登录后，你需要配置以下 API Keys：

#### OpenAI API Key（必需）

1. 访问 [OpenAI API Keys](https://platform.openai.com/api-keys)
2. 登录或注册 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制生成的密钥（格式：sk-...）
5. 在应用的设置页面粘贴

**注意**：OpenAI API 是付费服务，需要充值才能使用。新用户可能有免费额度。

#### 科大讯飞 API（必需）

1. 访问 [科大讯飞开放平台](https://console.xfyun.cn/)
2. 注册并登录
3. 创建应用：
   - 点击 "创建新应用"
   - 选择 "语音听写（流式版）WebAPI"
   - 填写应用信息
4. 获取凭证：
   - APPID
   - APIKey
   - APISecret
5. 在应用设置页面填入这三个值

**注意**：科大讯飞提供免费额度，足够个人使用。

#### 高德地图 API Key（必需）

1. 访问 [高德开放平台](https://console.amap.com/dev/key/app)
2. 注册并登录
3. 创建应用：
   - 点击 "创建新应用"
   - 填写应用名称
4. 添加 Key：
   - 点击 "添加"
   - 服务平台选择 "Web端(JS API)"
   - 填写域名白名单（开发环境填：localhost）
5. 复制生成的 Key
6. 在应用设置页面粘贴

**注意**：高德地图个人开发者有免费额度。

#### 同时更新 index.html

编辑项目根目录的 `index.html` 文件，替换高德地图 Key：

```html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=你的高德地图Key"></script>
```

## 第六步：开始使用

配置完成后，你可以：

1. **创建旅行计划**
   - 点击首页的 "创建新计划"
   - 填写旅行信息或使用语音输入
   - 等待 AI 生成行程

2. **查看地图**
   - 在行程页面查看可视化路线
   - 查看景点位置标注

3. **管理费用**
   - 在 "我的行程" 中查看已创建的计划
   - 点击 "费用管理" 添加开销记录

## 常见问题

### Q1: npm install 失败怎么办？

**A**: 尝试以下方法：
```bash
# 清除缓存
npm cache clean --force

# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### Q2: 启动后页面空白

**A**: 检查：
1. 浏览器控制台是否有错误
2. `.env` 文件是否正确配置
3. Supabase 项目是否正常运行

### Q3: 语音识别不工作

**A**: 确认：
1. 科大讯飞 API 配置正确
2. 浏览器已授予麦克风权限
3. 使用 HTTPS 或 localhost

### Q4: 地图不显示

**A**: 检查：
1. `index.html` 中的高德地图 Key 是否替换
2. 应用设置中是否配置了高德地图 Key
3. 浏览器控制台是否有 API 错误

### Q5: AI 生成失败

**A**: 确认：
1. OpenAI API Key 是否正确
2. OpenAI 账户是否有余额
3. 网络连接是否正常

## 进阶配置

### 使用其他 LLM

如果你想使用其他大语言模型（如 Claude、通义千问等），可以修改 `src/services/aiService.ts`：

```typescript
// 修改 baseURL
setBaseURL(url: string) {
  this.baseURL = url
}

// 在设置页面添加自定义 API URL 输入框
```

### 自定义主题

修改 `tailwind.config.js` 和 `src/main.tsx` 中的主题配置。

### 添加更多功能

项目采用模块化设计，你可以轻松添加新功能：
- 在 `src/services/` 添加新服务
- 在 `src/pages/` 添加新页面
- 在 `src/components/` 添加新组件

## 获取帮助

如果遇到问题：

1. 查看完整文档：[README.md](README.md)
2. 检查浏览器控制台错误信息
3. 查看 Supabase Dashboard 中的日志
4. 在 GitHub 提交 Issue

## 下一步

现在你已经成功启动了应用，可以：

1. 阅读完整的 [README.md](README.md) 了解更多功能
2. 尝试创建你的第一个旅行计划
3. 探索代码，进行自定义开发
4. 部署到生产环境（见 README 部署章节）

祝你使用愉快！
