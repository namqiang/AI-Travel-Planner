# 阿里云镜像仓库配置完成 ✅

## 配置信息

### 镜像仓库地址
```
crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com
```

**类型**: 个人实例

### 登录凭证
- **用户名**: `namqiang`
- **密码**: 你在阿里云设置的固定密码
- **命名空间**: `namqiang`
- **镜像名称**: `ai-travel-planner`

### 完整镜像地址
```
crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

---

## ✅ 已完成的配置

### 1. GitHub Actions 工作流
文件: `.github/workflows/docker-build.yml`

```yaml
env:
  ALIYUN_REGISTRY: crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com
  ALIYUN_NAMESPACE: namqiang
  IMAGE_NAME: ai-travel-planner
```

### 2. Docker Compose 配置
文件: `docker-compose.yml`

```yaml
services:
  ai-travel-planner:
    image: crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

---

## 🔐 下一步：配置 GitHub Secrets

现在需要在 GitHub 仓库中添加凭证：

### 步骤

1. **打开 GitHub 仓库**
   ```
   https://github.com/your-username/AI-Travel-Planner
   ```

2. **进入 Settings → Secrets and variables → Actions**

3. **添加第一个 Secret**
   - 点击 `New repository secret`
   - **Name**: `ALIYUN_REGISTRY_USER`
   - **Secret**: `namqiang`
   - 点击 `Add secret`

4. **添加第二个 Secret**
   - 点击 `New repository secret`
   - **Name**: `ALIYUN_REGISTRY_PASSWORD`
   - **Secret**: [你的固定密码]
   - 点击 `Add secret`

### 验证 Secrets

确认 Secrets 列表中有：
- ✅ `ALIYUN_REGISTRY_USER`
- ✅ `ALIYUN_REGISTRY_PASSWORD`

---

## 🚀 测试部署

### 方法 1：本地测试（推荐先做）

```bash
# 1. 确认登录成功
docker login --username=namqiang crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com

# 2. 构建镜像
docker build -t crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:test .

# 3. 推送测试镜像
docker push crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:test

# 4. 拉取并运行
docker pull crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:test
docker run -d -p 3000:80 crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:test

# 5. 访问测试
# 打开浏览器访问 http://localhost:3000
```

### 方法 2：触发 GitHub Actions

配置好 Secrets 后，推送代码触发自动构建：

```bash
# 提交配置更改
git add .
git commit -m "ci: update aliyun registry to personal instance"
git push origin main
```

### 方法 3：手动触发工作流

1. 进入 GitHub 仓库的 `Actions` 标签页
2. 选择 "Build and Push Docker Image"
3. 点击 `Run workflow`
4. 选择 `main` 分支
5. 点击 `Run workflow` 按钮

---

## 📊 查看构建状态

### GitHub Actions 日志

1. 进入 `Actions` 标签页
2. 点击最新的工作流运行
3. 展开各个步骤查看详细日志

**成功标志**：
```
✓ Log in to Aliyun Container Registry
  Login Succeeded

✓ Build and push Docker image
  pushing manifest for crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

### 阿里云控制台

1. 访问: https://cr.console.aliyun.com/
2. 进入个人实例
3. 命名空间 → `namqiang`
4. 镜像仓库 → `ai-travel-planner`
5. 查看镜像版本列表

---

## 🎯 使用镜像

### 拉取最新镜像

```bash
docker pull crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

### 运行容器

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:80 \
  --restart unless-stopped \
  crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

### 使用 Docker Compose

```bash
# 项目目录已包含 docker-compose.yml
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 🔄 镜像标签说明

GitHub Actions 会自动生成以下标签：

| 标签格式 | 触发条件 | 示例 |
|---------|---------|------|
| `latest` | 推送到 main/master 分支 | `latest` |
| `main-<sha>` | 推送到 main 分支 | `main-abc1234` |
| `v1.2.0` | 创建版本标签 | `v1.2.0` |
| `1.2.0` | 创建版本标签 | `1.2.0` |
| `1.2` | 创建版本标签 | `1.2` |
| `1` | 创建版本标签 | `1` |

### 拉取特定版本

```bash
# 拉取最新版本
docker pull crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest

# 拉取特定版本
docker pull crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:v1.2.0

# 拉取特定 commit
docker pull crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:main-abc1234
```

---

## 📝 VPC 网络优化（可选）

如果你在阿里云 ECS 或 VPC 网络环境中使用，可以使用内网地址加速：

### VPC 内网地址
```
crpi-uspbv1mtgfy0n9og-vpc.cn-hangzhou.personal.cr.aliyuncs.com
```

### 使用方法

在阿里云 ECS 上：

```bash
# 登录（使用内网地址）
docker login --username=namqiang crpi-uspbv1mtgfy0n9og-vpc.cn-hangzhou.personal.cr.aliyuncs.com

# 拉取镜像（更快，不消耗公网流量）
docker pull crpi-uspbv1mtgfy0n9og-vpc.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

---

## 🛠️ 常用命令速查

### 登录相关

```bash
# 公网登录
docker login --username=namqiang crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com

# VPC 内网登录
docker login --username=namqiang crpi-uspbv1mtgfy0n9og-vpc.cn-hangzhou.personal.cr.aliyuncs.com

# 查看登录状态
cat ~/.docker/config.json

# 退出登录
docker logout crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com
```

### 镜像操作

```bash
# 拉取镜像
docker pull crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest

# 构建并打标签
docker build -t crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:v1.0.0 .

# 推送镜像
docker push crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:v1.0.0

# 查看本地镜像
docker images | grep ai-travel-planner

# 删除本地镜像
docker rmi crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest
```

### 容器操作

```bash
# 运行容器
docker run -d -p 3000:80 --name ai-travel-planner crpi-uspbv1mtgfy0n9og.cn-hangzhou.personal.cr.aliyuncs.com/namqiang/ai-travel-planner:latest

# 查看容器日志
docker logs -f ai-travel-planner

# 进入容器
docker exec -it ai-travel-planner sh

# 重启容器
docker restart ai-travel-planner

# 停止容器
docker stop ai-travel-planner

# 删除容器
docker rm -f ai-travel-planner
```

---

## 📚 相关文档

- [Docker 部署详细指南](./DOCKER.md)
- [GitHub Actions 配置指南](./GITHUB_ACTIONS_SETUP.md)
- [快速修复 403 错误](./QUICK_FIX_403.md)
- [故障排查文档](./TROUBLESHOOTING.md)
- [阿里云容器镜像服务文档](https://help.aliyun.com/product/60716.html)

---

## ✅ 配置检查清单

部署前请确认：

- [ ] 已在阿里云容器镜像服务创建命名空间 `namqiang`
- [ ] 已创建镜像仓库 `ai-travel-planner`（或允许自动创建）
- [ ] 已设置固定密码
- [ ] 本地 `docker login` 成功
- [ ] GitHub Secrets `ALIYUN_REGISTRY_USER` 已配置
- [ ] GitHub Secrets `ALIYUN_REGISTRY_PASSWORD` 已配置
- [ ] `.github/workflows/docker-build.yml` 使用正确的镜像地址
- [ ] `docker-compose.yml` 使用正确的镜像地址
- [ ] 已推送代码到 GitHub 或手动触发工作流
- [ ] GitHub Actions 构建成功
- [ ] 在阿里云控制台看到推送的镜像

---

## 🎉 配置完成

恭喜！你已经完成了阿里云个人镜像仓库的配置。

现在你可以：
1. ✅ 本地构建和推送镜像到阿里云
2. ✅ GitHub 自动构建并推送镜像
3. ✅ 使用 Docker Compose 一键部署
4. ✅ 多架构支持（amd64 + arm64）
5. ✅ 自动生成多个版本标签

**下次更新应用时**，只需推送代码到 GitHub，镜像会自动构建并更新到阿里云！
