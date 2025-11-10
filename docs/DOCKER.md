# Docker 部署指南

本文档详细介绍如何使用 Docker 部署 AI 旅行规划师应用。

## 快速开始

### 1. 使用预构建镜像（推荐）

直接从阿里云镜像仓库拉取最新镜像：

```bash
# 拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

访问 `http://localhost:3000` 即可使用应用。

### 2. 使用 Docker Compose（推荐）

创建 `docker-compose.yml` 文件（项目中已包含），然后运行：

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 本地构建镜像

如果你想从源码构建镜像：

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

## 详细配置

### 环境变量

容器支持以下环境变量：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `TZ` | 时区设置 | `Asia/Shanghai` |

示例：

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  -e TZ=Asia/Shanghai \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

### 端口映射

默认情况下，容器内部使用 80 端口。你可以映射到主机的任意端口：

```bash
# 映射到主机的 8080 端口
docker run -d -p 8080:80 ai-travel-planner:latest

# 映射到主机的 3000 端口
docker run -d -p 3000:80 ai-travel-planner:latest
```

### 数据持久化

由于应用使用 Supabase 云数据库，不需要本地数据持久化。所有用户数据和配置都存储在云端。

### 健康检查

容器内置健康检查机制：

```bash
# 查看容器健康状态
docker ps

# 查看健康检查日志
docker inspect --format='{{json .State.Health}}' ai-travel-planner
```

## 镜像标签说明

项目使用以下镜像标签策略：

- `latest`: 最新的主分支构建
- `v1.0.0`, `v1.1.0`: 版本号标签
- `main-<sha>`: 主分支的 Git commit SHA 标签
- `1`, `1.1`: 主版本号和次版本号标签

示例：

```bash
# 拉取最新版本
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 拉取特定版本
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:v1.1.0

# 拉取主版本的最新次版本
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:1
```

## 常见操作

### 查看容器日志

```bash
# 查看实时日志
docker logs -f ai-travel-planner

# 查看最近 100 行日志
docker logs --tail 100 ai-travel-planner

# 查看带时间戳的日志
docker logs -t ai-travel-planner
```

### 进入容器

```bash
# 进入容器 shell
docker exec -it ai-travel-planner sh

# 查看 nginx 配置
docker exec ai-travel-planner cat /etc/nginx/conf.d/default.conf

# 查看应用文件
docker exec ai-travel-planner ls -la /usr/share/nginx/html
```

### 重启容器

```bash
# 重启容器
docker restart ai-travel-planner

# 停止容器
docker stop ai-travel-planner

# 启动容器
docker start ai-travel-planner

# 删除容器
docker rm -f ai-travel-planner
```

### 更新镜像

```bash
# 拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 停止并删除旧容器
docker stop ai-travel-planner
docker rm ai-travel-planner

# 使用新镜像启动容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

或使用 Docker Compose：

```bash
docker-compose pull
docker-compose up -d
```

## GitHub Actions 自动构建

项目配置了 GitHub Actions 自动构建流程，每次推送到主分支或创建新标签时会自动构建并推送镜像到阿里云。

### 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 进入 GitHub 仓库的 `Settings` > `Secrets and variables` > `Actions`
2. 点击 `New repository secret` 添加：

   - `ALIYUN_REGISTRY_USER`: 阿里云镜像仓库用户名
   - `ALIYUN_REGISTRY_PASSWORD`: 阿里云镜像仓库密码

### 修改配置

编辑 `.github/workflows/docker-build.yml`：

```yaml
env:
  ALIYUN_REGISTRY: registry.cn-hangzhou.aliyuncs.com
  ALIYUN_NAMESPACE: your-namespace  # 修改为你的命名空间
  IMAGE_NAME: ai-travel-planner
```

将 `your-namespace` 替换为你在阿里云创建的命名空间。

### 触发构建

- **自动触发**: 推送代码到 `main` 或 `master` 分支
- **版本发布**: 创建以 `v` 开头的 Git 标签
- **手动触发**: 在 GitHub Actions 页面手动运行工作流

创建版本标签示例：

```bash
# 创建并推送版本标签
git tag v1.1.0
git push origin v1.1.0

# 这会自动构建并推送以下标签的镜像：
# - v1.1.0
# - 1.1.0
# - 1.1
# - 1
# - latest
```

## 阿里云镜像仓库设置

### 1. 创建命名空间

1. 登录 [阿里云容器镜像服务控制台](https://cr.console.aliyun.com/)
2. 选择个人实例
3. 创建命名空间（例如：`ai-travel-planner`）

### 2. 创建镜像仓库

1. 在命名空间中创建镜像仓库
2. 仓库名称：`ai-travel-planner`
3. 仓库类型：公开或私有
4. 代码源：不使用代码源（我们使用 GitHub Actions）

### 3. 获取访问凭证

1. 在控制台右上角点击头像
2. 选择 `访问凭证`
3. 设置或重置密码
4. 用户名通常是你的阿里云账号

## 生产环境部署

### 使用反向代理

推荐使用 Nginx 或 Traefik 作为反向代理：

```nginx
server {
    listen 80;
    server_name travel.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 HTTPS

配合 Let's Encrypt 使用 HTTPS：

```bash
# 安装 certbot
apt-get install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d travel.example.com

# 自动续期
certbot renew --dry-run
```

### Docker Swarm / Kubernetes

对于集群部署，可以使用 Docker Swarm 或 Kubernetes。

Docker Swarm 示例：

```yaml
version: '3.8'

services:
  ai-travel-planner:
    image: registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    ports:
      - "3000:80"
    networks:
      - travel-network

networks:
  travel-network:
    driver: overlay
```

## 性能优化

### 1. 启用 HTTP/2

在 nginx 配置中启用 HTTP/2：

```nginx
server {
    listen 443 ssl http2;
    # ...
}
```

### 2. 资源限制

限制容器资源使用：

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  --memory="512m" \
  --cpus="1.0" \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

### 3. 使用 CDN

将静态资源部署到 CDN 以提升访问速度。

## 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker logs ai-travel-planner

# 查看容器详细信息
docker inspect ai-travel-planner
```

### 端口被占用

```bash
# 检查端口占用
netstat -tlnp | grep 3000

# 使用其他端口
docker run -d -p 8080:80 ai-travel-planner:latest
```

### 镜像拉取失败

```bash
# 检查网络连接
ping registry.cn-hangzhou.aliyuncs.com

# 使用阿里云镜像加速器
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": ["https://your-id.mirror.aliyuncs.com"]
}

# 重启 Docker
systemctl restart docker
```

### 应用无法访问

1. 检查容器是否运行：`docker ps`
2. 检查端口映射：`docker port ai-travel-planner`
3. 检查防火墙：`ufw status`
4. 检查健康检查：`docker inspect ai-travel-planner`

## 监控和日志

### 使用 Docker Stats

```bash
# 实时监控容器资源使用
docker stats ai-travel-planner
```

### 集成监控工具

- **Prometheus + Grafana**: 容器监控
- **ELK Stack**: 日志聚合和分析
- **Portainer**: Docker 可视化管理

## 安全建议

1. **定期更新镜像**: 及时拉取最新镜像以获取安全补丁
2. **使用私有镜像仓库**: 敏感应用使用私有仓库
3. **限制容器权限**: 不要使用 `--privileged` 标志
4. **扫描镜像漏洞**: 使用 Trivy 等工具扫描镜像
5. **配置防火墙**: 限制容器网络访问
6. **定期备份**: 虽然数据在云端，但应定期备份配置

## 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [阿里云容器镜像服务](https://help.aliyun.com/product/60716.html)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Nginx 官方文档](https://nginx.org/en/docs/)
