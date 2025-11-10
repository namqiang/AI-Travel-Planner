# 部署指南

本文档介绍如何将 AI 旅行规划师部署到生产环境。

## 目录

- [Vercel 部署（推荐）](#vercel-部署推荐)
- [Netlify 部署](#netlify-部署)
- [自托管部署](#自托管部署)
- [环境变量配置](#环境变量配置)
- [域名配置](#域名配置)
- [生产环境优化](#生产环境优化)

---

## Vercel 部署（推荐）

Vercel 是最简单快速的部署方式，特别适合 React + Vite 项目。

### 优势

- 全球 CDN 加速
- 自动 HTTPS
- 持续部署（Git push 自动部署）
- 免费额度慷慨
- 零配置

### 步骤

#### 1. 准备 GitHub 仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/AI-Travel-Planner.git

# 提交代码
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### 2. 导入到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New" -> "Project"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

#### 3. 配置项目

Vercel 会自动检测到 Vite 项目，默认配置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

这些通常不需要修改。

#### 4. 配置环境变量

在 Vercel 项目设置中添加环境变量：

1. 点击 "Settings"
2. 点击 "Environment Variables"
3. 添加以下变量：

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

#### 5. 部署

点击 "Deploy" 按钮，等待部署完成（通常 2-3 分钟）。

#### 6. 配置高德地图

部署完成后：

1. 获取 Vercel 分配的域名（如 `your-app.vercel.app`）
2. 在高德地图控制台添加这个域名到白名单
3. 重新部署（Vercel Dashboard -> Deployments -> Redeploy）

### 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

### 持续部署

配置完成后，每次 push 到 GitHub 都会自动触发部署：

```bash
git add .
git commit -m "Update feature"
git push
```

---

## Netlify 部署

Netlify 是另一个优秀的静态网站托管平台。

### 步骤

#### 1. 准备代码

确保代码已推送到 GitHub。

#### 2. 连接 Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 使用 GitHub 登录
3. 点击 "Add new site" -> "Import an existing project"
4. 选择 GitHub
5. 授权并选择仓库

#### 3. 配置构建设置

```
Build command: npm run build
Publish directory: dist
```

#### 4. 配置环境变量

在 Site settings -> Environment variables 中添加：

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

#### 5. 部署

点击 "Deploy site" 开始部署。

### 配置重定向

创建 `public/_redirects` 文件：

```
/*    /index.html   200
```

这确保 React Router 正常工作。

---

## 自托管部署

如果你想部署到自己的服务器。

### 方式一：使用 Docker

#### 创建 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api-server;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 构建和运行

```bash
# 构建镜像
docker build -t ai-travel-planner .

# 运行容器
docker run -d -p 80:80 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  ai-travel-planner
```

### 方式二：直接部署

#### 1. 构建项目

```bash
npm run build
```

这会在 `dist` 目录生成生产文件。

#### 2. 配置 Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/ai-travel-planner;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;
}
```

#### 3. 上传文件

```bash
# 上传到服务器
scp -r dist/* user@server:/var/www/ai-travel-planner/

# 重启 Nginx
ssh user@server 'sudo systemctl restart nginx'
```

#### 4. 配置 HTTPS

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 环境变量配置

### 开发环境 (.env.local)

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=local_dev_key
```

### 生产环境 (.env.production)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_key
```

### 环境变量管理最佳实践

1. **不同环境使用不同的配置**
   - 开发：本地 Supabase 或开发项目
   - 预生产：测试用 Supabase 项目
   - 生产：正式 Supabase 项目

2. **使用环境变量管理工具**
   - Vercel/Netlify 的环境变量管理
   - Docker secrets
   - AWS Systems Manager Parameter Store

3. **敏感信息加密**
   - 使用密钥管理服务
   - 定期轮换密钥

---

## 域名配置

### DNS 记录配置

#### Vercel

添加 CNAME 记录：

```
Type: CNAME
Name: www (或 @)
Value: cname.vercel-dns.com
```

#### Netlify

添加 A 记录：

```
Type: A
Name: @
Value: 75.2.60.5
```

### SSL 证书

Vercel 和 Netlify 会自动配置 SSL 证书。

自托管需要手动配置：

```bash
# 使用 Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 生产环境优化

### 1. 构建优化

#### 启用代码分割

Vite 默认启用，确保 `vite.config.ts` 中：

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd'],
        },
      },
    },
  },
})
```

#### 压缩资源

```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
```

### 2. 性能优化

#### 启用 CDN

```html
<!-- 使用 CDN 加载大型库 -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
```

#### 图片优化

- 使用 WebP 格式
- 实现懒加载
- 使用响应式图片

#### 启用缓存

```nginx
# Nginx 配置
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 安全配置

#### 配置安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;" always;
```

#### 配置 CORS

在 Supabase Dashboard 中配置允许的域名。

### 4. 监控和日志

#### Vercel Analytics

```typescript
// 添加 @vercel/analytics
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  )
}
```

#### Sentry 错误追踪

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
})
```

---

## 部署检查清单

部署前确认：

- [ ] 所有环境变量已配置
- [ ] API Keys 有效且有足够配额
- [ ] 高德地图白名单包含生产域名
- [ ] 数据库表结构已创建
- [ ] 构建成功无错误
- [ ] 所有测试通过
- [ ] 敏感信息未提交到代码仓库
- [ ] HTTPS 已配置
- [ ] DNS 记录已配置
- [ ] 错误监控已启用

部署后测试：

- [ ] 注册登录功能正常
- [ ] 语音输入功能正常
- [ ] AI 生成行程功能正常
- [ ] 地图显示正常
- [ ] 数据能正常保存和读取
- [ ] 在不同浏览器测试
- [ ] 在移动设备测试

---

## 回滚策略

### Vercel

1. 在 Deployments 页面找到之前的部署
2. 点击 "Promote to Production"

### Git 回滚

```bash
# 回滚到上一个 commit
git revert HEAD
git push

# 回滚到指定 commit
git revert <commit-hash>
git push
```

---

## 常见部署问题

### 1. 构建失败

**错误**: `npm ERR! code ELIFECYCLE`

**解决**:
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. 环境变量未生效

**原因**: Vite 环境变量必须以 `VITE_` 开头

**解决**: 检查所有环境变量是否正确命名

### 3. 路由 404

**原因**: SPA 路由配置问题

**解决**:
- Vercel: 创建 `vercel.json`
- Netlify: 创建 `_redirects` 文件
- Nginx: 配置 `try_files`

### 4. API 跨域错误

**解决**: 在 Supabase 项目设置中添加生产域名到 CORS 白名单

---

## 性能监控

### 推荐工具

1. **Google Analytics**: 用户行为分析
2. **Vercel Analytics**: 性能监控
3. **Sentry**: 错误追踪
4. **LogRocket**: 会话重放

### 关键指标

- 首次内容绘制 (FCP)
- 最大内容绘制 (LCP)
- 首次输入延迟 (FID)
- 累积布局偏移 (CLS)

---

## 成本估算

### 免费方案

- **Vercel**: Hobby 计划（免费）
  - 100GB 带宽/月
  - 无限项目
  - 自动 HTTPS

- **Supabase**: Free 计划
  - 500MB 数据库
  - 1GB 文件存储
  - 50,000 月活用户

- **总成本**: $0/月（适合个人项目）

### 付费方案（成长型项目）

- **Vercel Pro**: $20/月
- **Supabase Pro**: $25/月
- **OpenAI API**: ~$10/月（根据使用量）
- **其他 API**: ~$5/月

- **总成本**: ~$60/月

---

## 获取帮助

部署遇到问题？

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Netlify 文档](https://docs.netlify.com)
3. 在项目 GitHub 提 Issue
4. 加入 Supabase Discord 社区

祝部署顺利！
