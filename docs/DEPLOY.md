# Tetris Web 部署手册

**项目名称**: Tetris Web (网页版俄罗斯方块)  
**部署平台**: Render (静态站点)  
**部署时间**: ~10 分钟  
**最后更新**: 2026-03-11

---

## 📋 目录

1. [部署前准备](#部署前准备)
2. [Render 部署步骤](#render-部署步骤)
3. [自定义域名配置](#自定义域名配置)
4. [环境变量配置](#环境变量配置)
5. [CI/CD 自动部署](#cicd-自动部署)
6. [故障排查](#故障排查)

---

## 🚀 部署前准备

### 必要条件

| 要求 | 说明 | 状态 |
|------|------|------|
| **GitHub 账号** | 用于连接仓库 | ✅ 已创建 |
| **Render 账号** | 用于部署服务 | ⏳ 待登录 |
| **Node.js** | 版本 >= 20.x | ✅ 已安装 |
| **npm** | 版本 >= 9.0.0 | ✅ 已安装 |

### 本地验证

```bash
# 1. 进入项目目录
cd /home/admin/.openclaw/workspace/tetris-web

# 2. 安装依赖
npm install

# 3. 本地开发测试
npm run dev

# 4. 生产构建测试
npm run build

# 5. 验证构建产物
ls -la dist/
```

**预期输出**:
```
dist/
├── index.html
├── assets/
│   ├── index-xxx.css
│   └── index-xxx.js
└── favicon.ico
```

---

## 🌐 Render 部署步骤

### 步骤 1: 登录 Render Dashboard

1. 访问 https://dashboard.render.com
2. 使用 GitHub 账号登录
3. 授权 Render 访问 GitHub 仓库

[截图：Render 登录页面]

---

### 步骤 2: 创建静态站点

1. 点击 **New** 按钮
2. 选择 **Static Site**
3. 连接 GitHub 仓库 `HYCGITCODE/tetris-web`

[截图：创建 Static Site 页面]

---

### 步骤 3: 配置构建参数

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Name** | `tetris-web` | 服务名称 |
| **Branch** | `master` | 部署分支 |
| **Root Directory** | 留空 | 不填 |
| **Build Command** | `npm install && npm run build` | 构建命令 |
| **Publish Directory** | `dist` | 输出目录 |
| **Node Version** | `20` | Node 版本 |

[截图：构建配置页面]

---

### 步骤 4: 配置环境变量（可选）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境 |
| `VITE_GAME_VERSION` | `1.0.0` | 游戏版本号 |

**配置步骤**:
1. 点击 **Advanced** 标签页
2. 点击 **Add Environment Variable**
3. 输入 Key 和 Value
4. 点击 **Save**

[截图：环境变量配置页面]

---

### 步骤 5: 配置安全头（推荐）

在 `render.yaml` 中已配置：

```yaml
headers:
  - path: /*
    name: X-Frame-Options
    value: DENY
  - path: /*
    name: X-Content-Type-Options
    value: nosniff
```

**作用**:
- `X-Frame-Options`: 防止点击劫持
- `X-Content-Type-Options`: 防止 MIME 类型嗅探

---

### 步骤 6: 启动部署

1. 点击 **Create Static Site**
2. 等待部署完成（约 5-10 分钟）
3. 部署成功后获取公网域名

**部署日志**:
```
> Build started
> Installing dependencies...
> Running build command...
> Build succeeded!
> Deploying to CDN...
> Deployment complete!
```

[截图：部署进度页面]

---

### 步骤 7: 验证部署

**访问地址**: `https://tetris-web.onrender.com`

**验证步骤**:
1. 打开浏览器访问域名
2. 检查游戏是否正常加载
3. 测试核心功能（移动/旋转/消行）
4. 检查浏览器控制台无错误

**预期结果**:
- ✅ 页面加载时间 < 2s
- ✅ 游戏帧率 ≥ 60fps
- ✅ 按键响应 < 50ms
- ✅ 无控制台错误

---

## 🔗 自定义域名配置（可选）

### 步骤 1: 添加自定义域名

1. 进入 Render Dashboard → 服务设置
2. 点击 **Custom Domains**
3. 输入域名 `game.yourdomain.com`
4. 点击 **Add Custom Domain**

[截图：自定义域名配置页面]

---

### 步骤 2: 配置 DNS 记录

**CNAME 记录**:
```
类型：CNAME
主机：game
值：tetris-web.onrender.com
TTL: 自动
```

**验证 DNS 传播**:
```bash
nslookup game.yourdomain.com
```

---

### 步骤 3: HTTPS 自动配置

Render 会自动为自定义域名配置 HTTPS 证书：
- 证书类型：Let's Encrypt
- 自动续期：是
- 生效时间：约 10-30 分钟

---

## 🔄 CI/CD 自动部署

### 配置 GitHub Actions（可选）

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Render
        uses: render-oss/render-deploy@v1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

---

## 🐛 故障排查

### 问题 1: 构建失败

**错误信息**:
```
Error: Build failed with exit code 1
```

**排查步骤**:
1. 检查 `package.json` 脚本是否正确
2. 检查 Node.js 版本是否 >= 20
3. 查看完整构建日志
4. 本地运行 `npm run build` 验证

**解决方案**:
```bash
# 清理 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 重新构建
npm run build
```

---

### 问题 2: 页面空白

**可能原因**:
- 静态资源路径错误
- JavaScript 加载失败
- CSS 未加载

**排查步骤**:
1. 打开浏览器开发者工具
2. 查看 Console 错误
3. 查看 Network 请求状态
4. 检查 `vite.config.ts` 的 `base` 配置

**解决方案**:
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // 确保路径正确
  build: {
    outDir: 'dist'
  }
})
```

---

### 问题 3: 游戏卡顿

**可能原因**:
- 渲染性能问题
- 内存泄漏
- 浏览器兼容性

**排查步骤**:
1. 打开 Chrome DevTools → Performance
2. 录制游戏运行性能
3. 检查 FPS 和内存使用
4. 查看是否有长时间任务

**解决方案**:
- 优化 Canvas 渲染逻辑
- 减少不必要的 DOM 操作
- 使用 `requestAnimationFrame` 替代 `setInterval`

---

### 问题 4: 移动端适配问题

**症状**:
- 按钮太小无法点击
- 画布显示不完整
- 键盘无法操作

**解决方案**:
```css
/* 移动端适配 */
@media (max-width: 768px) {
  #game-canvas {
    width: 100%;
    height: auto;
  }
  
  .controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}
```

---

## 📊 部署检查清单

### 部署前检查

- [ ] 本地构建测试通过
- [ ] 所有核心功能验证完成
- [ ] 代码已推送到 GitHub
- [ ] Render 账号已登录
- [ ] 环境变量已配置

### 部署后检查

- [ ] 公网域名可访问
- [ ] 游戏加载正常
- [ ] 核心功能测试通过
- [ ] 性能指标达标
- [ ] 无控制台错误

### 安全配置检查

- [ ] HTTPS 已启用
- [ ] 安全头已配置
- [ ] 敏感信息未泄露
- [ ] CORS 配置正确

---

## 📞 支持联系方式

| 问题类型 | 联系方式 | 响应时间 |
|----------|----------|----------|
| **部署问题** | Render 工单 | 24 小时 |
| **代码问题** | GitHub Issues | 48 小时 |
| **紧急故障** | OCA 胡小豆 | 即时 |

---

## 📝 版本历史

| 版本 | 日期 | 变更 | 负责人 |
|------|------|------|--------|
| v1.0.0 | 2026-03-11 | 初始版本 | OCA 胡小豆 |
| v1.0.1 | TBD | 性能优化 | FE 胡小前 |
| v1.1.0 | TBD | 在线排行榜 | BE 胡小后 |

---

**文档维护**: OCA 胡小豆  
**最后更新**: 2026-03-11 20:25
