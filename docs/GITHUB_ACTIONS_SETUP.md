# GitHub Actions 配置指南

本文档详细介绍如何配置 GitHub Actions 自动构建 Docker 镜像并推送到阿里云镜像仓库。

## 前置准备

### 1. 阿里云镜像仓库账号

1. 访问 [阿里云容器镜像服务](https://cr.console.aliyun.com/)
2. 开通容器镜像服务（个人实例免费）
3. 创建命名空间
4. 创建镜像仓库

### 2. 获取阿里云镜像仓库凭证

#### 获取用户名和密码

1. 登录阿里云容器镜像服务控制台
2. 点击右上角头像 → 访问凭证
3. 设置固定密码（如果未设置）
4. 记录以下信息：
   - **用户名**: 通常格式为 `your-aliyun-id@aliyun.com`
   - **密码**: 刚才设置的固定密码
   - **仓库地址**: 例如 `registry.cn-hangzhou.aliyuncs.com`

#### 创建命名空间

1. 在容器镜像服务控制台，选择 "个人实例"
2. 点击 "命名空间" → "创建命名空间"
3. 输入命名空间名称，例如：`ai-travel-planner`
4. 选择 "公开" 或 "私有"
5. 创建完成

#### 创建镜像仓库（可选）

GitHub Actions 会自动创建仓库，但也可以手动创建：

1. 在命名空间中点击 "创建镜像仓库"
2. 仓库名称：`ai-travel-planner`
3. 仓库类型：公开或私有
4. 摘要和详情：填写项目说明
5. 代码源：选择 "本地仓库"
6. 创建完成

## GitHub 配置

### 1. 添加 GitHub Secrets

在你的 GitHub 仓库中添加以下 Secrets：

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret` 添加以下两个密钥：

#### ALIYUN_REGISTRY_USER

- **Name**: `ALIYUN_REGISTRY_USER`
- **Secret**: 你的阿里云镜像仓库用户名（例如：`your-id@aliyun.com`）

#### ALIYUN_REGISTRY_PASSWORD

- **Name**: `ALIYUN_REGISTRY_PASSWORD`
- **Secret**: 你的阿里云镜像仓库密码（固定密码）

### 2. 修改工作流配置

编辑 `.github/workflows/docker-build.yml`，修改以下配置：

```yaml
env:
  # 阿里云镜像仓库配置
  ALIYUN_REGISTRY: registry.cn-hangzhou.aliyuncs.com  # 根据你的区域修改
  ALIYUN_NAMESPACE: your-namespace  # 修改为你创建的命名空间名称
  IMAGE_NAME: ai-travel-planner     # 镜像名称，可自定义
```

**常见区域的镜像仓库地址**：

- 华东1（杭州）: `registry.cn-hangzhou.aliyuncs.com`
- 华东2（上海）: `registry.cn-shanghai.aliyuncs.com`
- 华北1（青岛）: `registry.cn-qingdao.aliyuncs.com`
- 华北2（北京）: `registry.cn-beijing.aliyuncs.com`
- 华南1（深圳）: `registry.cn-shenzhen.aliyuncs.com`
- 中国香港: `registry.cn-hongkong.aliyuncs.com`

### 3. 修改 docker-compose.yml

编辑项目根目录的 `docker-compose.yml`：

```yaml
services:
  ai-travel-planner:
    image: registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
    # 将 your-namespace 替换为你的命名空间
```

## 工作流触发方式

GitHub Actions 工作流支持以下触发方式：

### 1. 自动触发

#### 推送到主分支

```bash
git add .
git commit -m "feat: add new feature"
git push origin main  # 或 master
```

触发后会构建并推送以下标签：
- `latest`
- `main-<git-sha>`

#### 创建发布标签

```bash
# 创建版本标签
git tag v1.2.0
git push origin v1.2.0
```

触发后会构建并推送以下标签：
- `v1.2.0`
- `1.2.0`
- `1.2`
- `1`
- `latest`

#### Pull Request

创建或更新 Pull Request 时会触发构建（仅构建，不推送到仓库）。

### 2. 手动触发

1. 进入 GitHub 仓库
2. 点击 `Actions` 标签页
3. 选择 "Build and Push Docker Image" 工作流
4. 点击 `Run workflow` → 选择分支 → `Run workflow`

## 验证配置

### 1. 检查 Secrets

确保已正确添加两个 Secrets：
- `ALIYUN_REGISTRY_USER`
- `ALIYUN_REGISTRY_PASSWORD`

### 2. 推送测试

```bash
# 提交一个小改动
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger github actions"
git push origin main
```

### 3. 查看构建状态

1. 在 GitHub 仓库点击 `Actions` 标签页
2. 查看最新的工作流运行状态
3. 点击进入查看详细日志

### 4. 验证镜像

构建成功后，在阿里云镜像仓库控制台查看：

1. 进入你的命名空间
2. 找到 `ai-travel-planner` 仓库
3. 查看镜像版本列表
4. 确认新镜像已推送

本地拉取测试：

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 运行容器
docker run -d -p 3000:80 registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 访问测试
curl http://localhost:3000
```

## 常见问题

### 1. 认证失败

**错误信息**: `Error: Cannot perform an interactive login from a non TTY device`

**解决方案**:
- 检查 Secrets 是否正确配置
- 确认用户名和密码无误
- 确认使用的是固定密码，而非临时密码

### 2. 推送失败

**错误信息**: `denied: requested access to the resource is denied`

**解决方案**:
- 检查命名空间名称是否正确
- 确认镜像仓库访问权限
- 如果是私有仓库，确认账号有推送权限

### 3. 构建超时

**错误信息**: `The job running on runner ... has exceeded the maximum execution time`

**解决方案**:
- 免费账户构建时间限制为 6 小时
- 检查 Dockerfile 是否有优化空间
- 使用构建缓存（已配置）

### 4. 依赖安装失败

**错误信息**: `npm ERR! code ENOTFOUND`

**解决方案**:
- 检查网络连接
- 考虑使用国内 npm 镜像源
- 在 Dockerfile 中添加：
  ```dockerfile
  RUN npm config set registry https://registry.npmmirror.com
  ```

### 5. 多架构构建失败

**错误信息**: `error: multiple platforms feature is currently not supported`

**解决方案**:
- 确保使用了 `docker/setup-buildx-action`
- 如果仍有问题，可以暂时移除 `platforms` 配置：
  ```yaml
  # 注释掉这一行
  # platforms: linux/amd64,linux/arm64
  ```

## 工作流配置详解

### 镜像标签策略

工作流使用 `docker/metadata-action` 自动生成标签：

```yaml
tags: |
  type=ref,event=branch              # 分支名，如: main, develop
  type=ref,event=pr                   # PR 编号，如: pr-123
  type=semver,pattern={{version}}     # 完整版本，如: 1.2.0
  type=semver,pattern={{major}}.{{minor}}  # 主次版本，如: 1.2
  type=semver,pattern={{major}}       # 主版本，如: 1
  type=raw,value=latest,enable={{is_default_branch}}  # latest 标签
  type=sha,prefix={{branch}}-         # Git SHA，如: main-abc1234
```

### 构建缓存

工作流配置了 GitHub Actions 缓存以加速构建：

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

### 多架构支持

支持构建 amd64 和 arm64 两种架构：

```yaml
platforms: linux/amd64,linux/arm64
```

## 优化建议

### 1. 使用国内镜像源

在 Dockerfile 中添加：

```dockerfile
# 使用国内 npm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 或使用淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org
```

### 2. 优化构建时间

- 使用 `.dockerignore` 减少构建上下文
- 合理组织 Dockerfile 层以利用缓存
- 使用 `npm ci` 代替 `npm install`

### 3. 定期清理旧镜像

在阿里云镜像仓库控制台设置自动清理规则：
1. 进入镜像仓库
2. 点击 "版本管理"
3. 设置 "自动清理"
4. 配置保留策略（例如：保留最近 10 个版本）

### 4. 监控构建状态

在 README.md 中添加构建状态徽章：

```markdown
![Docker Build](https://github.com/your-username/AI-Travel-Planner/workflows/Build%20and%20Push%20Docker%20Image/badge.svg)
```

## 安全最佳实践

1. **不要在代码中硬编码密钥**: 始终使用 GitHub Secrets
2. **定期更新密码**: 定期轮换阿里云镜像仓库密码
3. **使用最小权限**: 为 CI/CD 创建专用账号，仅授予必要权限
4. **启用二次验证**: 为 GitHub 和阿里云账号启用 2FA
5. **审查工作流日志**: 定期检查构建日志，发现异常行为

## 高级配置

### 1. 添加构建通知

可以集成 Slack、企业微信等通知：

```yaml
- name: Send notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: Docker build ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2. 添加安全扫描

使用 Trivy 扫描镜像漏洞：

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.ALIYUN_REGISTRY }}/${{ env.ALIYUN_NAMESPACE }}/${{ env.IMAGE_NAME }}:latest
    format: 'sarif'
    output: 'trivy-results.sarif'

- name: Upload Trivy results to GitHub Security
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: 'trivy-results.sarif'
```

### 3. 多环境部署

为不同环境使用不同标签：

```yaml
- name: Build dev image
  if: github.ref == 'refs/heads/develop'
  run: docker build -t ${{ env.IMAGE }}:dev .

- name: Build prod image
  if: github.ref == 'refs/heads/main'
  run: docker build -t ${{ env.IMAGE }}:latest .
```

## 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [阿里云容器镜像服务文档](https://help.aliyun.com/product/60716.html)
- [Docker Buildx 文档](https://docs.docker.com/buildx/working-with-buildx/)
