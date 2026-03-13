## [LRN-20260313-001] OCA 角色边界 - 不应该自己写代码

**Logged**: 2026-03-13T17:35:00+08:00
**Priority**: critical
**Status**: pending
**Area**: config

### Summary
OCA 的职责是监督和交付管理，不应该自己编写代码。代码改动应该由开发团队完成。

### Details
在 Todo Calendar 项目开发过程中，我 (OCA) 直接编写了：
- UI 组件代码 (search_results.py, task_list.py, calendar_view.py)
- 样式表 (default.qss)
- 功能修复 (数据库连接、删除功能等)
- 中文翻译

**这是错误的行为**。正确的流程应该是：

1. **用户下达需求** → 老大提出需求
2. **OCA 分析翻译** → 我分析需求，转化为可执行指令
3. **PM 接收指令** → 胡小产接收开发任务
4. **团队执行** → Arch/FE/BE/QA 各自完成工作
5. **进度汇报** → PM 向 OCA 汇报进度
6. **OCA 审计** → 我审查交付物质量
7. **用户确认** → 老大最终验收

### Suggested Action

1. **立即停止写代码** - OCA 不再直接修改源代码
2. **建立交付流程** - 需求 → OCA → PM → 团队 → 交付 → OCA 审计 → 用户
3. **更新 IDENTITY.md** - 明确 OCA 不写代码的职责边界
4. **更新 AGENTS.md** - 记录正确的交付流程
5. **后续需求走流程** - UI 改动、功能开发都通过 PM 下达

### Metadata
- Source: user_correction (老大批评)
- Related Files: IDENTITY.md, AGENTS.md, SOUL.md
- Tags: OCA, 角色边界，交付流程，团队管理
- Pattern-Key: oca.no_coding | oca.audit_only

---

## [LRN-20260313-002] OCA 的正确职责 - 审计而非执行

**Logged**: 2026-03-13T17:35:00+08:00
**Priority**: high
**Status**: pending
**Area**: config

### Summary
OCA 应该做审计者和交付管理者，不是执行者。

### Details

**OCA 应该做**:
- ✅ 分析用户需求
- ✅ 翻译为 PM 可执行的战略指令
- ✅ 监督 PM 和团队进度
- ✅ 审计交付物质量
- ✅ 风险预警和上报
- ✅ 流程门禁管理

**OCA 不应该做**:
- ❌ 直接编写代码
- ❌ 直接修改 UI 组件
- ❌ 直接修复 Bug
- ❌ 越级指挥开发团队
- ❌ 替代 PM 的职责

### Suggested Action

1. **更新 SOUL.md** - 明确 OCA 的审计职责
2. **更新 AGENTS.md** - 记录 OCA 不做的事情
3. **建立审计清单** - 交付物审查标准
4. **强化流程门禁** - 每个阶段必须 PM 汇报

### Metadata
- Source: user_correction
- Related Files: SOUL.md, AGENTS.md
- Tags: OCA, 审计，职责边界
- Pattern-Key: oca.auditor_not_coder

---
