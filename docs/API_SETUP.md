# API 配置详细指南

本文档详细说明如何获取和配置各个 API Keys。

## 目录

- [Supabase 配置](#supabase-配置)
- [OpenAI API 配置](#openai-api-配置)
- [科大讯飞 API 配置](#科大讯飞-api-配置)
- [高德地图 API 配置](#高德地图-api-配置)

---

## Supabase 配置

Supabase 提供后端即服务（BaaS），包括数据库、认证、存储等功能。

### 步骤 1：注册 Supabase

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（推荐）或使用邮箱注册

### 步骤 2：创建项目

1. 点击 "New Project"
2. 选择或创建组织
3. 填写项目信息：
   - **Name**: 项目名称（如：ai-travel-planner）
   - **Database Password**: 强密码（请务必记住）
   - **Region**: 选择离你最近的区域
     - 中国用户推荐：Northeast Asia (Tokyo)
     - 美国用户推荐：West US (Oregon)
4. 点击 "Create new project"
5. 等待 1-2 分钟完成初始化

### 步骤 3：获取 API 凭证

1. 项目创建完成后，点击左侧 "Settings"（齿轮图标）
2. 点击 "API"
3. 复制以下信息：
   - **URL**: 形如 `https://xxxxx.supabase.co`
   - **anon public**: 形如 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 步骤 4：创建数据库表

1. 点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 `database/schema.sql` 的内容
4. 粘贴到编辑器
5. 点击 "Run" 或按 Ctrl+Enter
6. 确认显示 "Success"

### 步骤 5：配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 费用说明

- **免费额度**：
  - 数据库存储：500MB
  - 带宽：5GB
  - 认证用户：50,000 月活跃用户
- **付费计划**：从 $25/月起
- 个人开发和小型项目免费额度完全够用

---

## OpenAI API 配置

OpenAI 提供 GPT 系列大语言模型，用于智能行程规划。

### 步骤 1：注册 OpenAI

1. 访问 [https://platform.openai.com](https://platform.openai.com)
2. 点击 "Sign up"
3. 使用邮箱注册或 Google 账号登录
4. 验证手机号（需要国际手机号）

### 步骤 2：充值

1. 点击右上角账户菜单
2. 选择 "Billing"
3. 点击 "Add payment method"
4. 添加信用卡
5. 充值（建议至少 $5）

### 步骤 3：创建 API Key

1. 访问 [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. 点击 "Create new secret key"
3. 输入 Key 名称（如：AI-Travel-Planner）
4. 点击 "Create secret key"
5. **立即复制并保存**（只显示一次）
6. Key 格式：`sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 4：在应用中配置

1. 启动应用并登录
2. 点击右上角 "设置"
3. 在 "OpenAI API Key" 字段粘贴你的 Key
4. 点击 "保存配置"

### 模型选择

默认使用 `gpt-3.5-turbo`，推荐配置：

- **gpt-3.5-turbo**: 速度快，成本低（推荐）
  - 价格：$0.0015/1K tokens（输入），$0.002/1K tokens（输出）
- **gpt-4**: 质量更高，速度较慢，成本较高
  - 价格：$0.03/1K tokens（输入），$0.06/1K tokens（输出）

### 费用估算

以 gpt-3.5-turbo 为例：
- 生成一次旅行计划约消耗 2000-3000 tokens
- 单次费用约 $0.005-0.01（约 0.03-0.07 元人民币）
- $5 可以生成约 500-1000 次行程

### 国内用户注意事项

1. 需要稳定的国际网络访问
2. 手机验证需要国际号码（可使用接码平台）
3. 支付需要国际信用卡
4. 建议使用 VPN 确保稳定性

### 替代方案

如果无法使用 OpenAI，可以考虑：

1. **Azure OpenAI**: 微软提供，需要企业认证
2. **国内大模型**：
   - 通义千问（阿里云）
   - 文心一言（百度）
   - 智谱 AI（ChatGLM）
   - 需要修改代码适配不同的 API 格式

---

## 科大讯飞 API 配置

科大讯飞提供语音识别服务，用于语音输入功能。

### 步骤 1：注册账号

1. 访问 [https://www.xfyun.cn](https://www.xfyun.cn)
2. 点击右上角 "注册"
3. 填写信息并完成注册
4. 实名认证（可选，但建议完成以获得更多免费额度）

### 步骤 2：创建应用

1. 登录后访问 [控制台](https://console.xfyun.cn)
2. 点击 "创建新应用"
3. 填写应用信息：
   - **应用名称**：AI Travel Planner
   - **应用平台**：WebAPI
   - **应用类型**：Web 应用
4. 点击 "提交"

### 步骤 3：开通语音听写服务

1. 在应用列表中找到刚创建的应用
2. 点击应用名称进入详情
3. 找到 "语音听写（流式版）WebAPI"
4. 点击 "开通" 或 "立即使用"
5. 确认服务协议

### 步骤 4：获取凭证

在应用详情页面可以看到：

- **APPID**: 8位数字，如 `12345678`
- **APISecret**: 32位字符串，如 `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
- **APIKey**: 32位字符串，如 `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### 步骤 5：在应用中配置

1. 启动应用并登录
2. 点击右上角 "设置"
3. 填写三个字段：
   - 科大讯飞 APPID
   - 科大讯飞 API Key
   - 科大讯飞 API Secret
4. 点击 "保存配置"

### 免费额度

- **每日免费调用**：500 次
- **免费时长**：每次最长 60 秒
- **并发数**：2 路
- 个人使用完全足够

### 费用说明

如果需要更多：
- 按量付费：0.125 元/千次
- 包年套餐：280 元/年（10万次）

### 常见问题

1. **WebSocket 连接失败**
   - 检查浏览器是否支持 WebSocket
   - 确认使用 HTTPS 或 localhost
   - 检查防火墙设置

2. **识别准确率低**
   - 确保环境安静
   - 麦克风质量要好
   - 说话清晰，语速适中

---

## 高德地图 API 配置

高德地图提供地图展示、地理编码、路径规划等功能。

### 步骤 1：注册成为开发者

1. 访问 [https://lbs.amap.com](https://lbs.amap.com)
2. 点击右上角 "注册"
3. 填写信息完成注册
4. 进行开发者认证（个人或企业）

### 步骤 2：创建应用

1. 登录后访问 [控制台](https://console.amap.com/dev/key/app)
2. 点击 "应用管理" -> "我的应用"
3. 点击 "创建新应用"
4. 填写：
   - **应用名称**：AI Travel Planner
   - **应用类型**：Web 应用

### 步骤 3：添加 Key

1. 在应用列表中找到刚创建的应用
2. 点击 "添加 Key"
3. 填写 Key 信息：
   - **Key 名称**：web-key
   - **服务平台**：Web端（JS API）
   - **白名单**：
     - 开发环境：`localhost`
     - 生产环境：你的域名，如 `yourdomain.com`

### 步骤 4：配置应用

需要在两个地方配置：

#### 1. 修改 index.html

编辑项目根目录的 `index.html`：

```html
<script type="text/javascript"
        src="https://webapi.amap.com/maps?v=2.0&key=你的Key">
</script>
```

#### 2. 在应用设置中配置

1. 启动应用并登录
2. 点击右上角 "设置"
3. 在 "高德地图 API Key" 字段粘贴 Key
4. 点击 "保存配置"

### 免费额度

- **个人开发者**：
  - 配额：30万次/日
  - 并发：300 QPS
- **企业开发者**：
  - 配额：100万次/日
  - 并发：1000 QPS

### 费用说明

超出免费额度后：
- 0.05 元/千次调用
- 个人项目基本不会超额

### 常见问题

1. **地图不显示**
   ```javascript
   // 检查控制台错误
   // 常见错误：INVALID_USER_KEY
   // 解决：检查 Key 是否正确，白名单是否配置
   ```

2. **跨域问题**
   - 确保在白名单中添加了正确的域名
   - 开发环境添加 `localhost`

3. **Key 配额不足**
   - 查看控制台的使用统计
   - 升级为企业开发者
   - 或优化调用频率

---

## 配置验证

### 验证 Supabase

```bash
# 在浏览器控制台执行
const { data, error } = await supabase.auth.getSession()
console.log(data, error)
```

### 验证 OpenAI

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 验证科大讯飞

在应用中点击语音输入按钮，说话后查看是否能正确识别。

### 验证高德地图

在应用中打开地图页面，查看地图是否正常显示。

---

## 安全建议

1. **不要提交 API Keys 到 Git**
   - 将 `.env` 添加到 `.gitignore`
   - 使用环境变量管理敏感信息

2. **定期轮换密钥**
   - 每 3-6 个月更换一次
   - 发现泄露立即更换

3. **限制 API 权限**
   - 只开通必要的服务
   - 设置合理的配额限制

4. **监控使用情况**
   - 定期检查各平台的使用统计
   - 设置异常告警

---

## 获取帮助

如果配置过程中遇到问题：

1. 查看各平台的官方文档
2. 检查浏览器控制台的错误信息
3. 在项目 GitHub 提交 Issue
4. 联系各平台的技术支持

## 相关链接

- [Supabase 文档](https://supabase.com/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [科大讯飞开发文档](https://www.xfyun.cn/doc/)
- [高德地图 Web API](https://lbs.amap.com/api/javascript-api/summary)
