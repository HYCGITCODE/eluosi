#!/bin/bash
# PM 定期汇报脚本 - 每 30 分钟执行一次
# 用法：./pm-report.sh [阶段] [进展摘要]

TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
REPORT_TIME=$(date +"%H:%M")
NEXT_REPORT=$(date -d "+30 minutes" +"%H:%M")

# 获取当前阶段和进展（从状态文件读取）
STATE_FILE="/home/admin/.openclaw/workspace/state/pm-status.json"

if [ -f "$STATE_FILE" ]; then
    STAGE=$(jq -r '.stage' "$STATE_FILE" 2>/dev/null || echo "未知")
    PROGRESS=$(jq -r '.progress' "$STATE_FILE" 2>/dev/null || echo "无更新")
else
    STAGE="DEVING"
    PROGRESS="进行中"
fi

# 生成汇报内容
cat << EOF
## 📊 Todo Calendar 进度汇报

**时间**: ${TIMESTAMP}
**汇报人**: PM 胡小产

### 当前阶段
${STAGE}

### 本周期进展
${PROGRESS}

### 下一步计划
- 继续推进当前阶段任务
- 准备下一阶段工作

### 下次汇报
- ⏰ ${NEXT_REPORT}
EOF
