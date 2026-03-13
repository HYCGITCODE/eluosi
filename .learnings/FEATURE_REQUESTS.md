# FEATURE_REQUESTS.md - 功能请求日志

---

## [FEAT-20260311-001] 游戏音效模块

**Logged**: 2026-03-12T12:59:00+08:00  
**Priority**: medium  
**Status**: pending  
**Area**: frontend

### Requested Capability
为俄罗斯方块游戏添加音效功能，包括：
- 方块下落音效
- 方块旋转音效
- 消行音效
- 游戏结束音效
- 背景音乐 (可选)

### User Context
俄罗斯方块项目中，音效作为 P1 功能因时间不足未实现。音效可以显著提升游戏沉浸感和玩家体验。

### Complexity Estimate
medium

### Suggested Implementation
1. 创建音效管理模块 (SoundManager)
2. 使用 HTML5 Audio API 或 Web Audio API
3. 音效文件预加载
4. 音效开关控制
5. 音量调节支持

代码结构建议：
```typescript
// src/core/SoundManager.ts
class SoundManager {
  playMove(): void
  playRotate(): void
  playClear(): void
  playGameOver(): void
  setVolume(level: number): void
  mute(): void
}
```

### Metadata
- Frequency: first_time
- Related Features: 暂停功能、等级系统

---
