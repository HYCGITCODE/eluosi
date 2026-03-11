# GitHub 仓库创建指南

## 📋 创建步骤

### 步骤 1: 登录 GitHub
1. 访问 https://github.com
2. 使用账号 `HYCGITCODE` 登录

### 步骤 2: 创建新仓库
1. 点击右上角 **+** → **New repository**
2. 填写以下信息：

| 字段 | 值 |
|------|-----|
| **Repository name** | `tetris-web` |
| **Description** | 网页版俄罗斯方块 - TypeScript + Vue 3 + Canvas |
| **Visibility** | Public (公开) |
| **Initialize with README** | ❌ 不勾选 |
| **.gitignore** | ❌ 不添加 |
| **License** | ❌ 不添加 |

3. 点击 **Create repository**

### 步骤 3: 推送本地代码

```bash
cd /home/admin/.openclaw/workspace/tetris-web-git

# 添加远程仓库
git remote add origin git@github.com:HYCGITCODE/tetris-web.git

# 推送到 GitHub
git push -u origin master
```

### 步骤 4: 验证推送

访问 https://github.com/HYCGITCODE/tetris-web 确认文件已上传

---

## 🚀 快速推送命令

```bash
cd /home/admin/.openclaw/workspace/tetris-web-git
git remote add origin git@github.com:HYCGITCODE/tetris-web.git
git branch -M master
git push -u origin master
```

---

## 📊 当前提交记录

| 提交哈希 | 提交信息 | 时间 |
|----------|----------|------|
| fb80681 | docs: 添加部署手册 DEPLOY.md | 20:25 |
| 09a6387 | feat: Tetris Web 项目初始化 | 20:18 |

---

## 📁 待上传文件

```
tetris-web-git/
├── .gitignore
├── README.md
├── render.yaml
├── docs/
│   ├── architecture.md
│   ├── dev-guide.md
│   ├── test-cases.md
│   ├── qa-report.md
│   └── DEPLOY.md (新增)
└── docs-project/
    └── README.md (eluosi 文档)
```

---

## ⚠️ 注意事项

1. **仓库名称**: 必须是 `tetris-web`（与 render.yaml 配置一致）
2. **仓库可见性**: 建议公开（便于 Render 访问）
3. **分支名称**: `master`（与部署配置一致）
4. **SSH Key**: 确保本地 SSH key 已添加到 GitHub

---

## 🔑 SSH Key 配置（如果需要）

```bash
# 生成 SSH key
ssh-keygen -t ed25519 -C "oca@tetris-web.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub
# Settings → SSH and GPG keys → New SSH key
```

---

**创建完成后执行推送命令即可！**
