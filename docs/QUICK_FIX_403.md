# 快速修复：GitHub Actions 认证错误

## 错误信息
```
Error: Error response from daemon: Get "https://registry.cn-hangzhou.aliyuncs.com/v2/": unauthorized: authentication required
```

这个错误表示 **GitHub Secrets 未正确配置** 或 **阿里云凭证不正确**。

---

## 🔥 快速解决步骤（5分钟）

### 第 1 步：获取正确的阿里云凭证

1. **打开阿里云容器镜像服务**
   - 访问：https://cr.console.aliyun.com/
   - 登录你的阿里云账号

2. **查看访问凭证**
   - 点击右上角头像
   - 选择 **"访问凭证"**
   - 进入访问凭证页面

3. **记录用户名**

   在访问凭证页面，你会看到类似这样的信息：

   ```
   用户名: namqiang
   ```

   或者可能是：
   ```
   用户名: your-email@aliyun.com
   ```

   **重要**：复制这个用户名，一字不差地复制，包括所有字符。

4. **设置固定密码**

   - 如果还没有设置固定密码，点击 **"设置固定密码"** 按钮
   - 如果已经设置但忘记了，点击 **"重置Docker登录密码"**
   - 设置一个密码（8-32位，包含大小写字母和数字）
   - **立即记录这个密码**，稍后会用到

### 第 2 步：本地验证（重要！）

在配置 GitHub Secrets 之前，先在本地测试凭证是否正确：

```bash
# 使用你刚才获取的用户名和密码
docker login registry.cn-hangzhou.aliyuncs.com

# 输入用户名
Username: namqiang

# 输入密码
Password: [你刚才设置的固定密码]
```

**预期结果**：
```
Login Succeeded
```

**如果失败**：
- 返回第 1 步，重新检查用户名和密码
- 确保没有多余的空格或换行符
- 确认使用的是固定密码，不是临时密码

### 第 3 步：配置 GitHub Secrets

只有在第 2 步本地登录成功后，才进行这一步！

1. **打开 GitHub 仓库**
   - 访问：https://github.com/你的用户名/AI-Travel-Planner

2. **进入 Secrets 设置**
   - 点击 `Settings` 标签页
   - 左侧菜单点击 `Secrets and variables` → `Actions`

3. **配置第一个 Secret: ALIYUN_REGISTRY_USER**

   如果已存在这个 Secret：
   - 找到 `ALIYUN_REGISTRY_USER`
   - 点击右侧的铅笔图标（Edit）
   - 删除旧值
   - 粘贴你在第 1 步记录的**准确用户名**
   - 点击 `Update secret`

   如果不存在：
   - 点击 `New repository secret`
   - **Name**: `ALIYUN_REGISTRY_USER`
   - **Secret**: 粘贴你的用户名（例如：`namqiang`）
   - 点击 `Add secret`

4. **配置第二个 Secret: ALIYUN_REGISTRY_PASSWORD**

   如果已存在这个 Secret：
   - 找到 `ALIYUN_REGISTRY_PASSWORD`
   - 点击右侧的铅笔图标（Edit）
   - 删除旧值
   - 粘贴你在第 1 步设置的**固定密码**
   - 点击 `Update secret`

   如果不存在：
   - 点击 `New repository secret`
   - **Name**: `ALIYUN_REGISTRY_PASSWORD`
   - **Secret**: 粘贴你的固定密码
   - 点击 `Add secret`

**注意事项**：
- ⚠️ Secret 名称必须完全匹配（区分大小写）
- ⚠️ 用户名和密码前后不要有空格
- ⚠️ 粘贴时确保没有复制到换行符

### 第 4 步：验证配置

配置完成后，检查 Secrets 列表：

你应该看到两个 Secrets：
- ✅ `ALIYUN_REGISTRY_USER`
- ✅ `ALIYUN_REGISTRY_PASSWORD`

### 第 5 步：重新触发工作流

**方法 1：手动触发（推荐）**

1. 在 GitHub 仓库，点击 `Actions` 标签页
2. 左侧选择 "Build and Push Docker Image"
3. 点击右侧 `Run workflow` 按钮
4. 选择 `main` 分支
5. 点击绿色的 `Run workflow` 按钮

**方法 2：推送新提交**

```bash
# 创建一个测试提交
git commit --allow-empty -m "test: trigger github actions"
git push origin main
```

### 第 6 步：查看构建日志

1. 在 `Actions` 标签页，点击最新的工作流运行
2. 等待工作流开始执行
3. 展开 "Log in to Aliyun Container Registry" 步骤
4. 检查是否成功登录

**成功的日志**：
```
Login Succeeded
```

**失败的日志**：
```
Error: unauthorized: authentication required
```

如果还是失败，继续看下面的高级排查步骤。

---

## 🔍 高级排查步骤

### 检查点 1：确认命名空间已创建

1. 在阿里云容器镜像服务控制台
2. 点击左侧 **"命名空间"**
3. 确认 `namqiang` 命名空间存在

如果不存在：
- 点击 **"创建命名空间"**
- 命名空间名称：`namqiang`
- 选择 "公开" 或 "私有"
- 点击确定

### 检查点 2：确认区域正确

确保你的命名空间和工作流配置使用相同的区域：

1. 在阿里云控制台查看左上角的区域
2. 打开 `.github/workflows/docker-build.yml`
3. 确认 `ALIYUN_REGISTRY` 与你的区域匹配：

```yaml
env:
  ALIYUN_REGISTRY: registry.cn-hangzhou.aliyuncs.com  # 华东1（杭州）
  # 如果你的命名空间在其他区域，需要修改这个地址
```

**区域对照表**：
- 华东1（杭州）: `registry.cn-hangzhou.aliyuncs.com`
- 华东2（上海）: `registry.cn-shanghai.aliyuncs.com`
- 华北2（北京）: `registry.cn-beijing.aliyuncs.com`
- 华南1（深圳）: `registry.cn-shenzhen.aliyuncs.com`

### 检查点 3：确认使用个人实例

1. 在阿里云容器镜像服务控制台
2. 查看左上角是否有 "个人实例" / "企业实例" 切换按钮
3. 确保切换到 **"个人实例"**
4. 个人实例是免费的，适合个人项目

### 检查点 4：用户名格式问题

不同的阿里云账号，用户名格式可能不同：

**常见格式**：
- `namqiang` （命名空间名称）
- `your-email@aliyun.com` （阿里云账号）
- `ram-user@company` （RAM 子账号）

**确认方法**：
在访问凭证页面，会明确显示正确的用户名格式。**务必使用页面上显示的格式**。

---

## 📝 完整验证清单

在提交 issue 之前，请确认以下所有项目：

- [ ] 已在阿里云访问凭证页面查看并记录了准确的用户名
- [ ] 已设置了固定密码（不是临时密码）
- [ ] 在本地使用 `docker login` 成功登录
- [ ] GitHub Secret `ALIYUN_REGISTRY_USER` 已正确设置（无空格）
- [ ] GitHub Secret `ALIYUN_REGISTRY_PASSWORD` 已正确设置（无空格）
- [ ] 命名空间 `namqiang` 已在阿里云创建
- [ ] 工作流文件中的区域与阿里云控制台区域一致
- [ ] 使用的是个人实例（不是企业实例）
- [ ] 已重新触发工作流测试

---

## 🆘 仍然无法解决？

### 临时解决方案：使用 Docker Hub

如果阿里云一直无法登录，可以临时切换到 Docker Hub：

1. **注册 Docker Hub 账号**
   - 访问：https://hub.docker.com/
   - 注册并登录

2. **修改工作流文件**

编辑 `.github/workflows/docker-build.yml`：

```yaml
env:
  # 使用 Docker Hub
  REGISTRY: docker.io
  NAMESPACE: your-dockerhub-username  # 改为你的 Docker Hub 用户名
  IMAGE_NAME: ai-travel-planner
```

修改登录步骤：

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

3. **添加 Docker Hub Secrets**
   - `DOCKERHUB_USERNAME`: 你的 Docker Hub 用户名
   - `DOCKERHUB_TOKEN`: 在 Docker Hub 生成的 Access Token

### 获取详细帮助

如果以上步骤都无法解决，请提供以下信息：

1. **阿里云账号类型**
   - [ ] 个人账号
   - [ ] 企业账号
   - [ ] RAM 子账号

2. **使用的实例类型**
   - [ ] 个人实例
   - [ ] 企业实例

3. **用户名格式**（脱敏）
   - 例如：`xxx` 或 `xxx@aliyun.com` 或 `xxx@company`

4. **本地 docker login 结果**
   - [ ] 成功
   - [ ] 失败，错误信息：___________

5. **GitHub Actions 日志**
   - 复制 "Log in to Aliyun Container Registry" 步骤的完整日志

6. **截图**
   - 阿里云访问凭证页面（脱敏处理）
   - GitHub Secrets 列表页面

---

## 📚 相关文档

- [完整 GitHub Actions 配置指南](./GITHUB_ACTIONS_SETUP.md)
- [详细故障排查文档](./TROUBLESHOOTING.md)
- [Docker 部署指南](./DOCKER.md)
- [阿里云容器镜像服务文档](https://help.aliyun.com/document_detail/60743.html)

---

## ✅ 成功标志

当配置成功后，你会在 GitHub Actions 日志中看到：

```
Run docker/login-action@v3
Logging in to registry.cn-hangzhou.aliyuncs.com
Login Succeeded
```

然后镜像会成功构建并推送到阿里云镜像仓库。

在阿里云控制台可以看到新推送的镜像版本。
