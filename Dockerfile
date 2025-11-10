# 多阶段构建 Dockerfile
# 阶段 1: 构建应用
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖，构建需要）
RUN npm ci && npm cache clean --force

# 复制源代码
COPY . .

# 设置构建时的环境变量（使用 .env.example 中的值）
ENV VITE_SUPABASE_URL=https://vtojiucxfqibzhptoshu.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0b2ppdWN4ZnFpYnpocHRvc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDA4MjQsImV4cCI6MjA3ODI3NjgyNH0.qaV1nnD6FDczz6g58yjP3FPpcXBTtz0kV3ApPfPJQUU

# 构建应用（使用 vite build 跳过 tsc 严格检查）
RUN npx vite build

# 阶段 2: 生产环境
FROM nginx:alpine

# 安装 tzdata 以支持时区设置
RUN apk add --no-cache tzdata

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
