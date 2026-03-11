# AI News Pulse - 部署指南

**项目**: AI 行业新闻聚合应用  
**版本**: 1.0.0  
**最后更新**: 2026-03-11

---

## 📋 目录

1. [系统要求](#系统要求)
2. [快速部署](#快速部署)
   - [方案 A: Render 一键部署](#方案-a-render-一键部署强烈推荐)
   - [方案 B: 手动部署](#方案-b-手动部署)
3. [生产环境部署](#生产环境部署)
   - [方案 D: Railway 部署](#方案-d-railway-部署)
   - [方案 E: Docker 部署](#方案-e-docker-部署)
   - [方案 F: VPS 手动部署](#方案-f-vps-手动部署)
4. [环境变量配置](#环境变量配置)
5. [常见问题](#常见问题)

---

## 系统要求

### 最低配置

| 组件 | 版本 | 说明 |
|------|------|------|
| **Node.js** | >= 18.0.0 | 必需 |
| **npm** | >= 9.0.0 | 随 Node.js 安装 |
| **内存** | >= 512MB | 运行时需求 |
| **磁盘** | >= 200MB | 依赖 + 缓存 |

### 推荐配置

| 组件 | 版本 | 说明 |
|------|------|------|
| **Node.js** | >= 20.0.0 | LTS 版本 |
| **内存** | >= 1GB | 更流畅运行 |
| **系统** | Linux/macOS/Windows | 全平台支持 |

---

## 快速部署

### 方案 A: Render 一键部署（⭐ 强烈推荐）

**优势**: 免费额度、HTTPS、自动部署、新加坡节点、配置简单

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/HYCGITCODE/ai-news-pulse)

**部署步骤**:
1. 点击上述 "Deploy to Render" 按钮
2. 登录 Render（可使用 GitHub 账号）
3. 确认服务配置（已预配置 `render.yaml`）
4. 点击 **"Create Web Service"**
5. 等待 2-5 分钟部署完成

**详细教程**: 查看 [docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md)

**预计耗时**: 10 分钟

---

### 方案 B: 手动部署

#### 步骤 1: 克隆仓库

```bash
git clone https://github.com/HYCGITCODE/ai-news-pulse.git
cd ai-news-pulse
```

---

### 步骤 2: 安装后端依赖

```bash
cd backend
npm install
```

---

### 步骤 3: 安装前端依赖

```bash
cd ../frontend
npm install
```

---

### 步骤 4: 配置环境变量（可选）

```bash
# 复制示例配置
cd ../backend
cp .env.example .env

# 编辑 .env 文件（通常无需修改）
nano .env
```

**默认配置**:
```bash
PORT=3000
NODE_ENV=development
```

---

### 步骤 5: 启动后端服务

```bash
# 开发环境（支持热重载）
npm run dev

# 生产环境
npm start
```

**验证后端**: 访问 http://localhost:3000/health

---

### 步骤 6: 启动前端服务（新终端）

```bash
cd frontend
npm run dev
```

**验证前端**: 访问 http://localhost:5173

---

## 生产环境部署

### 方案 D: Railway 部署

**优势**: 自动部署、免费额度、HTTPS、自动扩缩容

1. 打开 https://railway.app
2. 点击 **"New Project"** → **"Deploy from GitHub repo"**
3. 选择 `ai-news-pulse` 仓库
4. Railway 自动识别 `railway.json` 配置
5. 点击 **"Deploy"**

**环境变量**（在 Railway 面板配置）:
```
NODE_ENV=production
```

---

### 方案 E: Docker 部署

**创建 Dockerfile**（项目根目录）:

```dockerfile
# 后端
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
EXPOSE 3000
CMD ["npm", "start"]

# 前端
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 生产环境
FROM nginx:alpine
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY --from=backend /app /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**构建并运行**:
```bash
docker build -t ai-news-pulse .
docker run -p 80:80 ai-news-pulse
```

---

### 方案 F: VPS 手动部署

**适用**: 自有服务器、云服务器

#### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

#### 2. 克隆并安装

```bash
git clone https://github.com/HYCGITCODE/ai-news-pulse.git
cd ai-news-pulse
cd backend && npm install
cd ../frontend && npm install
```

#### 3. 配置 systemd 服务

**后端服务** (`/etc/systemd/system/ai-news-backend.service`):
```ini
[Unit]
Description=AI News Pulse Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/ai-news-pulse/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

**前端服务** (`/etc/systemd/system/ai-news-frontend.service`):
```ini
[Unit]
Description=AI News Pulse Frontend
After=network.target ai-news-backend.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/ai-news-pulse/frontend
ExecStart=/usr/bin/npm run dev
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

#### 4. 启动服务

```bash
# 重载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start ai-news-backend
sudo systemctl start ai-news-frontend

# 设置开机自启
sudo systemctl enable ai-news-backend
sudo systemctl enable ai-news-frontend

# 查看状态
sudo systemctl status ai-news-backend
sudo systemctl status ai-news-frontend
```

#### 5. 配置 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 环境变量配置

### 后端环境变量

| 变量名 | 默认值 | 说明 | 必需 |
|--------|--------|------|------|
| `PORT` | 3000 | 后端服务端口 | 否 |
| `NODE_ENV` | development | 运行环境 | 否 |

### 前端环境变量

| 变量名 | 默认值 | 说明 | 必需 |
|--------|--------|------|------|
| `VITE_API_URL` | /api | API 基础 URL | 否 |

---

## 常见问题

### Q1: 端口被占用

**错误**: `EADDRINUSE: address already in use :::3000`

**解决**:
```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
kill -9 <PID>

# 或修改端口
PORT=3001 npm start
```

---

### Q2: 依赖安装失败

**错误**: `npm ERR! code EACCES`

**解决**:
```bash
# 清理 npm 缓存
npm cache clean --force

# 使用 sudo（不推荐）
sudo npm install

# 或修复权限（推荐）
sudo chown -R $(whoami) ~/.npm
```

---

### Q3: 前端无法连接后端

**错误**: `Network Error` 或 `CORS Error`

**解决**:
1. 确认后端已启动：`curl http://localhost:3000/health`
2. 检查 CORS 配置（`backend/src/server.js`）
3. 确认前端 API URL 配置正确

---

### Q4: RSS 抓取失败

**错误**: 新闻列表为空

**解决**:
1. 检查网络连接
2. 验证 RSS 源是否可访问
3. 查看后端日志：`tail -f backend/logs/*.log`
4. 手动触发刷新：`curl -X POST http://localhost:3000/api/news/refresh`

---

### Q5: 构建失败

**错误**: `npm run build` 失败

**解决**:
```bash
# 清理 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 重新构建
npm run build
```

---

## 性能优化建议

### 1. 启用缓存

后端已实现 1 小时缓存，无需额外配置。

### 2. CDN 加速（生产环境）

将前端静态资源部署到 CDN:
- Cloudflare Pages
- Vercel
- Netlify

### 3. 数据库优化（如需扩展）

当前使用内存缓存，如需持久化:
```bash
# 安装 Redis
sudo apt-get install redis-server

# 修改 backend/src/services/cache.js
# 使用 Redis 替代 node-cache
```

---

## 监控与日志

### 查看日志

```bash
# 后端日志
tail -f backend/logs/*.log

# systemd 日志
journalctl -u ai-news-backend -f
journalctl -u ai-news-frontend -f
```

### 健康检查

```bash
# 后端健康状态
curl http://localhost:3000/health

# 前端页面
curl http://localhost:5173
```

---

## 安全建议

### 1. 防火墙配置

```bash
# 仅允许必要端口
sudo ufw allow 3000
sudo ufw allow 5173
sudo ufw enable
```

### 2. HTTPS 配置（生产环境）

使用 Let's Encrypt 免费证书:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. 定期更新依赖

```bash
# 检查可更新的依赖
npm outdated

# 更新依赖
npm update
```

---

## 技术支持

- **GitHub Issues**: https://github.com/HYCGITCODE/ai-news-pulse/issues
- **文档**: `/docs` 目录
- **邮件**: 联系项目维护者

---

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.1.0 | 2026-03-11 | 新增 Render 一键部署方案、render.yaml 配置文件 |
| 1.0.0 | 2026-03-09 | 初始发布 |

---

**祝部署顺利！** 🚀
