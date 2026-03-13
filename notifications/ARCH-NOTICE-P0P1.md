# 技术架构调整通知 - P0+P1 全功能交付

**发送时间**: 2026-03-13 13:19  
**优先级**: 🔴 紧急  
**接收人**: @Arch (胡小架)

---

## 📋 老大指令

老大刚下达新指令：**按原计划交付 P0+P1 全部功能**（共 14 项功能）

### P0 核心功能（8 项）
- P0-1: 日历视图 (月视图)
- P0-2: 双击创建任务
- P0-3: 任务拖拽修改日期
- P0-4: 任务 CRUD
- P0-5: 优先级管理 (P0/P1/P2)
- P0-6: 完成状态切换
- P0-7: 数据持久化 (SQLite)
- P0-8: 开箱即用 (PyInstaller 打包)

### P1 增强功能（6 项）
- P1-1: 周视图/日视图
- P1-2: 任务搜索
- P1-3: 任务过滤
- P1-4: 重复任务
- P1-5: 到期提醒
- P1-6: 数据统计

---

## 🏗️ 技术架构调整

### 核心技术栈变更

| 组件 | 原方案 | **新方案** | 变更原因 |
|------|--------|-----------|----------|
| **GUI 框架** | Tkinter | **PyQt6** | 支持复杂 UI 交互（多视图切换、拖拽、搜索过滤） |
| **数据存储** | SQLite | SQLite | 保持不变 |
| **打包工具** | PyInstaller | PyInstaller | 保持不变，需包含 PyQt6 依赖 |
| **Python 版本** | 3.8+ | 3.8+ | 保持不变 |

### 技术决策说明

**为什么从 Tkinter 升级到 PyQt6？**

1. **P1 功能需求**: 周视图/日视图切换需要更灵活的布局管理
2. **拖拽体验**: PyQt6 的拖拽 API 更成熟，支持流畅的拖拽操作
3. **搜索过滤**: PyQt6 的模型 - 视图架构更适合实现搜索和过滤功能
4. **UI 美观度**: PyQt6 提供更现代化的界面组件
5. **可扩展性**: 便于后续 P2 功能（主题切换、年视图等）的实现

---

## 📐 架构设计要求

请 Arch 在 **60 分钟内**（13:29-14:29）完成以下设计文档：

### 1. TDD.md 技术设计文档
- [ ] PyQt6 项目结构设计
- [ ] 数据库 schema 设计（支持重复任务、提醒等 P1 功能）
- [ ] 核心类设计：
  - `MainWindow` (主窗口，支持多视图切换)
  - `CalendarView` (月视图)
  - `WeekView` (周视图)
  - `DayView` (日视图)
  - `TaskModel` (任务数据模型)
  - `TaskDatabase` (数据库操作)
  - `TaskDialog` (任务创建/编辑对话框)
  - `SearchFilter` (搜索和过滤逻辑)
  - `ReminderService` (到期提醒服务)

### 2. UI 原型图
- [ ] 月视图界面布局（含工具栏、视图切换按钮）
- [ ] 周视图/日视图界面布局
- [ ] 任务创建/编辑对话框设计
- [ ] 搜索框和过滤器位置
- [ ] 统计面板设计

### 3. 数据库设计
```sql
-- 任务表（需支持 P1 功能）
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1,  -- 0=P0, 1=P1, 2=P2
    due_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- P1 功能字段
    repeat_rule TEXT,  -- 重复规则：'weekly', 'monthly', NULL
    reminder_enabled BOOLEAN DEFAULT 0,
    reminder_time TIME
);
```

---

## ⏰ 时间线

| 时间 | 事项 | 交付物 |
|------|------|--------|
| **13:19** | 收到指令 | 本通知 |
| **13:29** | 开始设计 | - |
| **14:29** | 设计完成 | TDD.md + UI 原型图 |
| **14:29-14:39** | 技术评审 | Arch+FE+BE 确认 |
| **14:39** | 进入开发 | - |

---

## 📞 确认要求

请 Arch 收到通知后**立即确认**，并开始技术架构设计。

**回复格式**:
```
✅ Arch 已收到指令
- 技术栈变更：Tkinter → PyQt6 ✓
- 设计完成时间：14:29 ✓
- 开始设计 ✓
```

---

**PM**: 胡小产  
**时间**: 2026-03-13 13:19
