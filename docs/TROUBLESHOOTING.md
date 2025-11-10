# GitHub Actions 常见问题排查

## 403 Forbidden 错误

### 错误信息
```
Error response from daemon: login attempt to https://registry.cn-hangzhou.aliyuncs.com/v2/ failed with status: 403 Forbidden
```

### 原因分析

403 Forbidden 错误通常由以下原因导致：

1. **Secrets 配置错误**：用户名或密码不正确
2. **密码格式问题**：使用了临时密码而非固定密码
3. **用户名格式错误**：阿里云镜像仓库的用户名有特定格式
4. **权限不足**：账号没有推送镜像的权限
5. **仓库未创建或不存在**：命名空间或镜像仓库不存在

### 解决步骤

#### 步骤 1：检查阿里云镜像仓库凭证

1. **登录阿里云容器镜像服务控制台**
   - 访问：https://cr.console.aliyun.com/

2. **获取正确的访问凭证**
   - 点击右上角头像 → **访问凭证**
   - 查看 **用户名** 和设置 **固定密码**

3. **用户名格式**

   阿里云镜像仓库的用户名格式通常是以下几种之一：

   - 格式1：`命名空间ID` (例如：`namqiang`)
   - 格式2：`阿里云账号@aliyun.com` (例如：`your-account@aliyun.com`)
   - 格式3：企业版可能是自定义用户名

   **重要**：在访问凭证页面会明确显示你的用户名，复制这个准确的用户名。

4. **设置或重置固定密码**

   - 如果没有设置固定密码，点击 **设置固定密码**
   - 如果忘记密码，点击 **重置Docker登录密码**
   - 密码要求：8-32位，包含大小写字母和数字
   - **记住这个密码**，稍后需要在 GitHub Secrets 中使用

#### 步骤 2：验证本地登录

在更新 GitHub Secrets 之前，先在本地验证凭证是否正确：

```bash
# 使用你获取的用户名和密码进行本地测试
docker login --username=<你的用户名> registry.cn-hangzhou.aliyuncs.com

# 输入密码后，如果看到 "Login Succeeded" 说明凭证正确
```

**示例**：
```bash
# 如果你的用户名是 namqiang
docker login --username=namqiang registry.cn-hangzhou.aliyuncs.com
Password: [输入你的固定密码]
```

如果本地登录失败，说明凭证有问题，需要返回阿里云控制台重新检查。

#### 步骤 3：更新 GitHub Secrets

1. **进入 GitHub 仓库设置**
   - 打开你的 GitHub 仓库
   - 点击 `Settings` → `Secrets and variables` → `Actions`

2. **更新或创建 ALIYUN_REGISTRY_USER**
   - 如果已存在，点击铅笔图标编辑
   - 如果不存在，点击 `New repository secret`
   - **Name**: `ALIYUN_REGISTRY_USER`
   - **Secret**: 粘贴你在阿里云访问凭证页面看到的**准确用户名**
   - 点击 `Add secret` 或 `Update secret`

3. **更新或创建 ALIYUN_REGISTRY_PASSWORD**
   - **Name**: `ALIYUN_REGISTRY_PASSWORD`
   - **Secret**: 粘贴你刚才设置的**固定密码**
   - 点击 `Add secret` 或 `Update secret`

**重要提示**：
- ⚠️ 用户名和密码前后不要有空格
- ⚠️ 确保使用的是固定密码，不是临时密码
- ⚠️ 密码中如果包含特殊字符，确保完整复制

#### 步骤 4：检查命名空间配置

1. **验证命名空间是否存在**
   - 在阿里云容器镜像服务控制台
   - 点击左侧 **命名空间**
   - 确认 `namqiang` 命名空间已创建

2. **检查工作流配置**

   打开 `.github/workflows/docker-build.yml`，确认配置正确：

   ```yaml
   env:
     ALIYUN_REGISTRY: registry.cn-hangzhou.aliyuncs.com
     ALIYUN_NAMESPACE: namqiang  # 确保这个命名空间已在阿里云创建
     IMAGE_NAME: ai-travel-planner
   ```

3. **创建镜像仓库（可选，会自动创建）**

   虽然 GitHub Actions 会自动创建镜像仓库，但你也可以手动创建：
   - 在命名空间中点击 **创建镜像仓库**
   - 仓库名称：`ai-travel-planner`
   - 仓库类型：**公开**（推荐）或 私有
   - 代码源：选择 **本地仓库**

#### 步骤 5：测试工作流

更新 Secrets 后，重新触发工作流：

**方法 1：推送测试提交**
```bash
# 创建一个小的测试提交
echo "test" >> README.md
git add README.md
git commit -m "test: trigger github actions"
git push origin main
```

**方法 2：手动触发工作流**
1. 进入 GitHub 仓库的 `Actions` 标签页
2. 选择 "Build and Push Docker Image" 工作流
3. 点击 `Run workflow`
4. 选择分支（通常是 `main`）
5. 点击 `Run workflow` 按钮

**方法 3：使用 GitHub CLI**
```bash
gh workflow run docker-build.yml
```

#### 步骤 6：查看构建日志

1. 进入 `Actions` 标签页
2. 点击最新的工作流运行
3. 展开 "Log in to Aliyun Container Registry" 步骤
4. 检查是否有错误信息

如果仍然出现 403 错误，查看日志中的详细错误信息。

### 其他可能的解决方案

#### 方案 A：区域不匹配

确保使用的区域与你的命名空间所在区域一致：

```yaml
# 常见区域列表
ALIYUN_REGISTRY: registry.cn-hangzhou.aliyuncs.com  # 华东1（杭州）
# ALIYUN_REGISTRY: registry.cn-shanghai.aliyuncs.com  # 华东2（上海）
# ALIYUN_REGISTRY: registry.cn-beijing.aliyuncs.com   # 华北2（北京）
# ALIYUN_REGISTRY: registry.cn-shenzhen.aliyuncs.com  # 华南1（深圳）
```

检查你的命名空间在哪个区域：
1. 进入阿里云容器镜像服务控制台
2. 查看左上角的区域选择器
3. 确认当前区域与工作流配置一致

#### 方案 B：账号类型问题

不同的阿里云账号类型，用户名格式可能不同：

**个人账号**：
- 用户名通常是命名空间名称或账号邮箱
- 示例：`namqiang` 或 `your-email@aliyun.com`

**企业账号（RAM子账号）**：
- 用户名格式：`子账号名@企业别名`
- 示例：`subuser@company`
- 或完整格式：`企业别名$子账号名`

**确认方法**：
在阿里云容器镜像服务控制台的访问凭证页面，会显示准确的用户名格式。

#### 方案 C：使用个人实例 vs 企业实例

确认你使用的是个人实例还是企业实例：

1. 在阿里云容器镜像服务控制台
2. 查看左上角是否有 "个人实例" / "企业实例" 的切换选项
3. 个人实例和企业实例的凭证不同

**个人实例（推荐新用户）**：
- 免费
- 用户名通常简单
- 适合个人项目

**企业实例**：
- 收费
- 更多高级功能
- 用户名可能更复杂

#### 方案 D：清除并重新创建 Secrets

有时 GitHub Secrets 可能存在缓存问题：

1. 删除现有的两个 Secrets：
   - `ALIYUN_REGISTRY_USER`
   - `ALIYUN_REGISTRY_PASSWORD`

2. 等待几分钟

3. 重新创建这两个 Secrets，确保：
   - 复制粘贴时没有额外的空格或换行符
   - 使用正确的名称（区分大小写）

### 完整的验证清单

使用这个清单逐项检查：

- [ ] 已在阿里云控制台查看访问凭证页面
- [ ] 已记录准确的用户名（包括格式）
- [ ] 已设置固定密码（不是临时密码）
- [ ] 在本地使用 `docker login` 成功登录
- [ ] GitHub Secret `ALIYUN_REGISTRY_USER` 已正确设置
- [ ] GitHub Secret `ALIYUN_REGISTRY_PASSWORD` 已正确设置
- [ ] 命名空间 `namqiang` 已在阿里云创建
- [ ] 工作流文件中的 `ALIYUN_NAMESPACE` 与阿里云一致
- [ ] 工作流文件中的 `ALIYUN_REGISTRY` 区域正确
- [ ] 已重新触发工作流进行测试

### 调试技巧

#### 1. 在工作流中添加调试输出

编辑 `.github/workflows/docker-build.yml`，在登录步骤前添加：

```yaml
- name: Debug - Show registry info
  run: |
    echo "Registry: ${{ env.ALIYUN_REGISTRY }}"
    echo "Namespace: ${{ env.ALIYUN_NAMESPACE }}"
    echo "Image: ${{ env.IMAGE_NAME }}"
    echo "Username length: ${#ALIYUN_USER}"
  env:
    ALIYUN_USER: ${{ secrets.ALIYUN_REGISTRY_USER }}
```

这会显示配置信息（但不会显示密码），帮助你发现问题。

#### 2. 测试不同的登录方式

如果标准方式失败，可以尝试使用 Bash 直接登录：

```yaml
- name: Manual login to Aliyun
  run: |
    echo "${{ secrets.ALIYUN_REGISTRY_PASSWORD }}" | docker login \
      --username "${{ secrets.ALIYUN_REGISTRY_USER }}" \
      --password-stdin \
      ${{ env.ALIYUN_REGISTRY }}
```

### 最终测试

完成所有修改后，执行以下测试：

```bash
# 1. 本地测试
docker login --username=<你的用户名> registry.cn-hangzhou.aliyuncs.com

# 2. 推送测试提交
git add .
git commit -m "fix: update aliyun credentials"
git push origin main

# 3. 查看 Actions 日志
# 访问 https://github.com/<your-username>/AI-Travel-Planner/actions
```

### 仍然无法解决？

如果按照以上步骤仍然无法解决，请提供以下信息：

1. 阿里云账号类型（个人/企业）
2. 使用的实例类型（个人实例/企业实例）
3. 用户名格式（脱敏，例如：`xxx@aliyun.com` 或 `namespace-name`）
4. GitHub Actions 日志的完整错误信息
5. 本地 `docker login` 是否成功

### 参考资源

- [阿里云容器镜像服务文档](https://help.aliyun.com/document_detail/60743.html)
- [Docker Login 文档](https://docs.docker.com/engine/reference/commandline/login/)
- [GitHub Actions Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
