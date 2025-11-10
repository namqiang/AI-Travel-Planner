# AI 大模型配置指南

本应用已支持多种大语言模型，你可以根据需求选择最合适的服务。

## 支持的模型

### 1. OpenAI (GPT)

**推荐指数**: ⭐⭐⭐⭐⭐

**优势**:
- 质量最高，响应准确
- 支持 GPT-3.5 和 GPT-4
- 生态完善，文档齐全

**劣势**:
- 需要国际网络
- 需要国际信用卡
- 成本相对较高

**配置步骤**:
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 注册并登录
3. 充值（至少 $5）
4. 创建 API Key
5. 在应用设置中选择 "OpenAI (GPT)"
6. 填入 API Key

**费用**:
- GPT-3.5-turbo: $0.0015/1K tokens (输入), $0.002/1K tokens (输出)
- GPT-4: $0.03/1K tokens (输入), $0.06/1K tokens (输出)
- 生成一次旅行计划约 $0.005-0.01

---

### 2. DeepSeek ⭐ 推荐国内用户

**推荐指数**: ⭐⭐⭐⭐⭐

**优势**:
- **国内可直接访问**，无需翻墙
- **性价比极高**，价格是 GPT-3.5 的 1/10
- 质量接近 GPT-3.5
- 新用户有免费额度
- 支持支付宝付款

**劣势**:
- 知名度相对较低
- 某些复杂场景不如 GPT-4

**配置步骤**:
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 使用手机号注册
3. 充值（支持支付宝，最低 10 元）
4. 创建 API Key
5. 在应用设置中选择 "DeepSeek"
6. 填入 API Key

**费用**:
- deepseek-chat: ¥1/百万 tokens（输入），¥2/百万 tokens（输出）
- 生成一次旅行计划约 ¥0.003-0.005（不到 1 分钱）
- **新用户赠送 500 万 tokens 免费额度**

**示例配置**:
```
AI 服务商: DeepSeek
API Key: sk-xxxxxxxxxxxxxxxxxxxxx
```

---

### 3. 通义千问 (Qwen)

**推荐指数**: ⭐⭐⭐⭐

**优势**:
- 阿里云官方服务，稳定可靠
- 国内访问速度快
- 支持多种模型规格
- 有免费额度

**劣势**:
- 需要实名认证
- 某些场景响应质量不如 GPT

**配置步骤**:
1. 访问 [阿里云 DashScope](https://dashscope.console.aliyun.com/)
2. 使用阿里云账号登录
3. 开通 DashScope 服务
4. 创建 API Key
5. 在应用设置中选择 "通义千问 (Qwen)"
6. 填入 API Key

**费用**:
- qwen-plus: ¥0.8/千次调用
- qwen-max: ¥20/百万 tokens
- 每个账号有免费额度

**可用模型**:
- `qwen-plus`: 推荐，性价比高
- `qwen-max`: 质量最高
- `qwen-turbo`: 速度最快

**示例配置**:
```
AI 服务商: 通义千问 (Qwen)
API Key: sk-xxxxxxxxxxxxxxxxxxxxx
模型名称: qwen-plus （可选，留空使用默认）
```

---

### 4. Kimi (Moonshot)

**推荐指数**: ⭐⭐⭐⭐

**优势**:
- 支持超长上下文（最高 128K tokens）
- 月之暗面官方服务
- 国内访问友好
- 响应质量不错

**劣势**:
- 价格相对较高
- API 调用限制较多

**配置步骤**:
1. 访问 [Moonshot Platform](https://platform.moonshot.cn/)
2. 注册并登录
3. 创建 API Key
4. 在应用设置中选择 "Kimi (Moonshot)"
5. 填入 API Key

**费用**:
- moonshot-v1-8k: ¥12/百万 tokens（输入），¥12/百万 tokens（输出）
- moonshot-v1-32k: ¥24/百万 tokens
- moonshot-v1-128k: ¥60/百万 tokens

**示例配置**:
```
AI 服务商: Kimi (Moonshot)
API Key: sk-xxxxxxxxxxxxxxxxxxxxx
```

---

### 5. 其他兼容 OpenAI 的服务

**推荐指数**: ⭐⭐⭐

**适用场景**:
- 使用 OpenAI 代理服务
- 自建大模型服务
- 使用第三方兼容服务

**常见服务**:
- **OpenRouter**: 聚合多个模型的服务
- **SiliconFlow**: 国内服务，支持多种开源模型
- **零一万物**: 国产大模型
- **智谱 AI (GLM)**: 清华系大模型
- **文心一言**: 百度大模型

**配置方法**:

#### 使用 OpenRouter
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册获取 API Key
3. 配置：
   ```
   AI 服务商: 其他兼容 OpenAI 的服务
   API Key: sk-or-xxxxxxxxxxxxxxxxxxxxx
   API 地址: https://openrouter.ai/api/v1
   模型名称: anthropic/claude-3-opus (或其他支持的模型)
   ```

#### 使用 SiliconFlow
1. 访问 [SiliconFlow](https://cloud.siliconflow.cn/)
2. 注册获取 API Key
3. 配置：
   ```
   AI 服务商: 其他兼容 OpenAI 的服务
   API Key: sk-xxxxxxxxxxxxxxxxxxxxx
   API 地址: https://api.siliconflow.cn/v1
   模型名称: Qwen/Qwen2-72B-Instruct
   ```

---

## 选择建议

### 个人用户 / 学习使用
**推荐**: DeepSeek
- 理由：性价比最高，新用户有大量免费额度
- 配置难度：⭐⭐ (简单)
- 月成本：< ¥5

### 企业用户 / 商业使用
**推荐**: OpenAI GPT-4
- 理由：质量最稳定，响应最准确
- 配置难度：⭐⭐⭐ (中等，需要翻墙)
- 月成本：¥200-1000

### 预算有限 / 国内用户
**推荐**: 通义千问 (Qwen)
- 理由：阿里云服务稳定，有免费额度
- 配置难度：⭐⭐ (简单，需实名)
- 月成本：< ¥20

### 需要长文本处理
**推荐**: Kimi (Moonshot)
- 理由：支持超长上下文
- 配置难度：⭐⭐ (简单)
- 月成本：¥50-200

---

## 性能对比

| 服务商 | 速度 | 质量 | 价格 | 国内访问 | 推荐度 |
|--------|------|------|------|----------|--------|
| OpenAI GPT-4 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ❌ 需翻墙 | ⭐⭐⭐⭐⭐ |
| OpenAI GPT-3.5 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ❌ 需翻墙 | ⭐⭐⭐⭐ |
| DeepSeek | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ 直连 | ⭐⭐⭐⭐⭐ |
| 通义千问 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ 直连 | ⭐⭐⭐⭐ |
| Kimi | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ 直连 | ⭐⭐⭐⭐ |

---

## 切换模型

在应用的设置页面，你可以随时切换 AI 模型：

1. 点击右上角 "设置"
2. 在 "AI 模型配置" 部分选择新的服务商
3. 填入对应的 API Key
4. 点击 "保存配置"

配置会立即生效，无需重启应用。

---

## 常见问题

### Q1: 如何测试配置是否成功？

保存配置后，创建一个新的旅行计划。如果 AI 能成功生成行程，说明配置正确。

### Q2: 为什么提示 "API Key 无效"？

可能原因：
- API Key 复制错误（注意前后空格）
- 选错了服务商
- API Key 已过期或被删除
- 账户余额不足

### Q3: DeepSeek 的免费额度如何使用？

新注册用户自动获得 500 万 tokens 免费额度，无需充值即可使用。

### Q4: 可以同时配置多个模型吗？

目前暂不支持。如需切换模型，请在设置页面修改配置。

### Q5: 哪个模型最便宜？

DeepSeek 最便宜，价格约为 OpenAI GPT-3.5 的 1/10。

### Q6: 使用代理访问 OpenAI 怎么配置？

选择 "其他兼容 OpenAI 的服务"，然后在 "API 地址" 中填入你的代理地址，如：
```
https://your-proxy.com/v1
```

---

## 技术细节

### API 格式

所有支持的模型都使用 OpenAI 兼容的 API 格式：

```http
POST /v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "model": "model-name",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "temperature": 0.7,
  "max_tokens": 3000
}
```

### 默认模型

| 服务商 | 默认模型 | 说明 |
|--------|----------|------|
| OpenAI | gpt-3.5-turbo | 推荐 gpt-4 获得更好质量 |
| DeepSeek | deepseek-chat | 唯一模型 |
| 通义千问 | qwen-plus | 可选 qwen-max |
| Kimi | moonshot-v1-8k | 可选 32k/128k |

### 自定义模型

在高级选项中，你可以指定自定义模型名称，例如：
- OpenAI: `gpt-4-turbo-preview`
- 通义千问: `qwen-max`
- Kimi: `moonshot-v1-128k`

---

## 获取帮助

如果在配置过程中遇到问题：

1. 查看各服务商的官方文档
2. 检查浏览器控制台的错误信息
3. 在项目 GitHub 提交 Issue
4. 加入社区讨论

---

**最后更新**: 2024-01-10

**相关文档**:
- [API 配置指南](API_SETUP.md)
- [快速开始](../QUICKSTART.md)
- [项目架构](ARCHITECTURE.md)
