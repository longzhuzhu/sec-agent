# SecAgent — OpenCode 安全代理插件

OpenCode 安全代理插件，实现完整的 SDL（安全开发生命周期）防护。5 个安全角色覆盖设计、开发、测试、发布全阶段，支持 OpenCode TAB 切换选择。

## 角色体系

| Agent | TAB 显示名 | 职责 |
|-------|-----------|------|
| **SecAgent** | SecAgent (Orchestrator) | 主编排器：安全意图识别、任务分类、委派路由、结果汇总 |
| **SecDesign** | SecDesign (Security Architect) | 安全架构师：威胁建模(STRIDE)、攻击面分析、隐私合规(GDPR/CCPA) |
| **SecDev** | SecDev (Secure Coder) | 安全开发：OWASP Top 10 检测、CWE 分析、安全编码审查与修复 |
| **SecTest** | SecTest (Security Tester) | 安全测试：SAST/DAST 双模式、白盒/黑盒测试、模糊测试 |
| **SecGate** | SecGate (Release Guardian) | 发布守门：依赖漏洞扫描、密钥泄露检测、合规检查、PASS/FAIL 判定 |

## 安装

```bash
# 在 OpenCode 配置中添加插件
# ~/.config/opencode/opencode.jsonc
{
  "plugin": [
    "file:///path/to/sec-agent"
  ]
}
```

或从本地路径安装：

```bash
cd sec-agent
npm install
npm run build
```

## 安全工具

| 工具 | 描述 |
|------|------|
| `sec_scan` | 安全代码扫描（OWASP Top 10、CWE） |
| `dep_audit` | 依赖漏洞扫描（npm/pip/cargo/go） |
| `secret_scan` | 密钥泄露检测（API Key、Token、私钥） |
| `sec_report` | 安全报告生成（Markdown/SARIF） |

## 安全 Hooks

| Hook | 触发时机 | 功能 |
|------|---------|------|
| security-keyword-detector | 消息转换 | 检测安全关键词，注入安全上下文 |
| secret-leak-guard | Write/Edit 前 | 检测硬编码密钥，阻止写入 |
| unsafe-pattern-detector | Write/Edit 后 | 检测不安全编码模式（eval、innerHTML等） |
| pre-commit-security-scan | git commit 前 | 安全扫描提醒 |
| dependency-audit-reminder | 消息检测 | 新增依赖时提醒安全审查 |
| security-report-generator | 会话结束 | 生成安全发现摘要 |
| security-todo-enforcer | 会话结束 | 确保安全修复任务完成 |

## 安全 Skills

- **owasp-top10** — OWASP Top 10 检测与修复指南
- **threat-modeling** — STRIDE 威胁建模方法论
- **privacy-compliance** — GDPR/CCPA 隐私合规检查
- **crypto-review** — 密码学最佳实践审查
- **api-security** — API 安全测试方法
- **dependency-security** — 依赖安全管理（SCA）
- **container-security** — Docker/K8s 容器安全加固

## 协作流程

```
用户请求 → SecAgent 意图门控
  ├─ 简单任务 → 直接委派对应 Agent
  └─ 完整 SDL → 按阶段编排
      ├─ Wave 1: SecDesign → 威胁建模 + 安全设计评审
      ├─ Wave 2: SecDev → 安全编码审查 + 修复
      ├─ Wave 3: SecTest → 白盒 + 黑盒测试
      └─ Wave 4: SecGate → 发布门控检查 (PASS/FAIL)
```

## 配置

在 `~/.config/opencode/sec-agent.json` 或项目 `.opencode/sec-agent.json` 中配置：

```jsonc
{
  // 禁用特定 Agent
  "disabled_agents": ["sec-test"],
  // 禁用特定 Hook
  "disabled_hooks": ["dependency-audit-reminder"],
  // 默认 Agent
  "default_agent": "sec-agent",
  // Agent 覆盖配置
  "agents": {
    "sec-dev": {
      "model": "anthropic/claude-sonnet-4-6"
    }
  }
}
```

## 技术栈

- TypeScript + Node.js
- OpenCode Plugin SDK (`@opencode-ai/plugin` + `@opencode-ai/sdk`)
- Zod (配置校验)

## License

MIT
