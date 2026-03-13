# ERRORS.md - 错误日志

---

## [ERR-20260311-001] vue-tsc 版本兼容性问题

**Logged**: 2026-03-12T12:59:00+08:00  
**Priority**: high  
**Status**: pending  
**Area**: config

### Summary
项目初始化时 vue-tsc 版本不兼容导致 TypeScript 编译警告

### Error
```
vue-tsc 版本问题 - 代码质量检查不完整
```

### Context
- 项目：俄罗斯方块 (Tetris Web)
- 技术栈：TypeScript + Vue 3 + Canvas + Vite
- 问题：vue-tsc 版本与 Vue 3 版本不匹配
- 影响：TypeScript 类型检查可能不准确

### Suggested Fix
1. 检查 package.json 中 vue-tsc 版本
2. 参考 Vue 3 官方文档确认兼容版本
3. 更新命令：`npm install -D vue-tsc@latest`
4. 验证：`npx vue-tsc --noEmit`

### Metadata
- Reproducible: unknown
- Related Files: /home/admin/.openclaw/workspace/eluosi/package.json
- See Also: LRN-20260311-005

---
