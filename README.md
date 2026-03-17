# SecAgent — OpenCode 安全代理插件

> 基于 OpenCode Plugin SDK 的智能安全代理系统，实现完整的 SDL（安全开发生命周期）防护。

## 设计理念

### 为什么需要 SecAgent？

传统安全工具（SAST/DAST/SCA）各自独立运行，开发者需要手动整合多个工具的结果。SecAgent 将安全能力融入 AI 编码助手，实现：

- **安全左移 (Shift Left)** — 在设计和编码阶段就发现安全问题，而非等到发布前
- **AI 驱动的安全分析** — 不只是模式匹配，而是理解代码语义和业务逻辑的深度安全分析
- **统一编排** — 一个入口（SecAgent）自动协调设计评审、编码审查、安全测试、发布门控
- **并行执行** — 多个安全维度同时分析，不阻塞开发流程

### 核心设计原则

```
┌─────────────────────────────────────────────────────────────┐
│                    Design Principles                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 单一入口，多维分析                                        │
│     用户只与 SecAgent 交互，复杂度由编排器承担                   │
│                                                              │
│  2. 安全专家分工                                              │
│     5 个角色各司其职，覆盖 SDL 全生命周期                       │
│                                                              │
│  3. 并行优先                                                  │
│     设计/编码/测试 三个维度同时分析，最大化效率                   │
│                                                              │
│  4. 防御纵深 (Defense in Depth)                               │
│     Hooks 在编码过程中实时守护（密钥检测、不安全模式告警）        │
│                                                              │
│  5. 标准化输出                                                │
│     所有发现统一使用 CWE 编号 + CVSS 严重性评级                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 系统架构图

```
┌──────────────────────────────────────────────────────────────────────┐
│                         OpenCode IDE / CLI                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    SecAgent Plugin                              │  │
│  │                                                                │  │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │  │
│  │  │ config   │   │  tools   │   │  hooks   │   │  skills  │   │  │
│  │  │ handler  │   │ registry │   │  engine  │   │  loader  │   │  │
│  │  └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘   │  │
│  │       │              │              │              │           │  │
│  │  ┌────▼──────────────▼──────────────▼──────────────▼─────┐    │  │
│  │  │              Plugin Interface Layer                    │    │  │
│  │  │  config │ tool │ chat.message │ tool.execute.*        │    │  │
│  │  └────────────────────────┬───────────────────────────────┘    │  │
│  │                           │                                    │  │
│  │  ┌────────────────────────▼───────────────────────────────┐    │  │
│  │  │                   SecAgent (Orchestrator)               │    │  │
│  │  │              ┌─────────────────────────┐                │    │  │
│  │  │              │    Intent Gate (意图门控) │                │    │  │
│  │  │              └────────────┬────────────┘                │    │  │
│  │  │     ┌─────────┬──────────┼──────────┬─────────┐        │    │  │
│  │  │     ▼         ▼          ▼          ▼         ▼        │    │  │
│  │  │ SecDesign  SecDev    SecTest    SecGate    Direct       │    │  │
│  │  │ (hidden)  (hidden)  (hidden)  (hidden)   Execute       │    │  │
│  │  │              并行调度 (Agent tool)                       │    │  │
│  │  └────────────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## 编排原理图

### 意图门控 → 并行调度 → 结果汇总

```
                        ┌─────────────────┐
                        │   用户请求       │
                        │ "分析安全风险"   │
                        └────────┬────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Phase 0: 意图门控       │
                    │  识别安全意图 → 路由决策  │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                   │
    ┌─────────▼─────────┐ ┌─────▼───────┐ ┌────────▼────────┐
    │ 简单任务            │ │ 多维分析     │ │ 完整 SDL        │
    │ (单一维度)          │ │ (并行调度)   │ │ (四阶段编排)    │
    └─────────┬─────────┘ └─────┬───────┘ └────────┬────────┘
              │                  │                   │
              ▼                  ▼                   ▼
     SecAgent 直接执行     并行发射 Agent       Wave 编排模式
                          ┌─────┴─────┐
                     ┌────┤  同时调度  ├────┐
                     │    └───────────┘    │
              ┌──────▼──────┐       ┌──────▼──────┐
              │  SecDesign   │       │  SecDev     │
              │  威胁建模     │       │  编码审查    │
              └──────┬──────┘       └──────┬──────┘
                     │  ┌──────────────┐   │
                     │  │  SecTest     │   │
                     │  │  安全测试     │   │
                     │  └──────┬───────┘   │
                     │         │           │
              ┌──────▼─────────▼───────────▼──────┐
              │       SecAgent 结果汇总             │
              │  合并去重 → 统一评级 → 综合报告      │
              └──────────────────┬─────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  SecGate 发布门控        │
                    │  PASS / FAIL 判定        │
                    └─────────────────────────┘
```

### SDL 四阶段流水线

```
 ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
 │ Design  │───▶│  Dev    │───▶│  Test   │───▶│  Gate   │
 │ 安全设计 │    │ 安全编码 │    │ 安全测试 │    │ 发布门控 │
 └─────────┘    └─────────┘    └─────────┘    └─────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
 ┌─────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐
 │ STRIDE  │   │ OWASP    │  │ SAST     │  │ SCA 扫描  │
 │ 威胁建模 │   │ Top 10   │  │ 白盒分析  │  │ 依赖审计  │
 │ 攻击面   │   │ CWE 检测  │  │ DAST     │  │ 密钥检测  │
 │ 隐私合规 │   │ 安全修复  │  │ 模糊测试  │  │ 配置检查  │
 └─────────┘   └──────────┘  └──────────┘  └──────────┘
                                                 │
                                           ┌─────▼─────┐
                                           │ PASS/FAIL │
                                           └───────────┘
```

## 实时防护层（Hooks 架构）

```
  开发者编码过程
      │
      ├──── 输入消息 ──────▶ security-keyword-detector
      │                     检测安全关键词 → 注入上下文
      │
      ├──── Write/Edit ───▶ secret-leak-guard [BEFORE]
      │     (写入代码前)     检测硬编码密钥 → 阻止写入
      │
      ├──── Write/Edit ───▶ unsafe-pattern-detector [AFTER]
      │     (写入代码后)     检测 eval/innerHTML → 告警
      │
      ├──── git commit ───▶ pre-commit-security-scan [BEFORE]
      │                     安全扫描提醒
      │
      ├──── npm install ──▶ dependency-audit-reminder
      │                     依赖安全审查提醒
      │
      └──── 会话结束 ──────▶ security-report-generator
                            security-todo-enforcer
                            生成摘要 + 确认修复完成
```

## 角色体系

| Agent | 模式 | 职责 | 工具权限 |
|-------|------|------|---------|
| **SecAgent** | TAB 可见 | 主编排器：意图门控、并行调度、结果汇总 | 全部 |
| **SecDesign** | 隐藏(子代理) | 安全架构：STRIDE 威胁建模、攻击面分析、隐私合规 | 只读 |
| **SecDev** | 隐藏(子代理) | 安全开发：OWASP Top 10、CWE 检测、漏洞修复 | 读写 |
| **SecTest** | 隐藏(子代理) | 安全测试：SAST/DAST、模糊测试、API 安全 | 全部 |
| **SecGate** | 隐藏(子代理) | 发布守门：SCA 扫描、密钥检测、PASS/FAIL 判定 | 只读 |

## 安装

```bash
# 克隆并构建
git clone https://github.com/longzhuzhu/sec-agent.git
cd sec-agent
npm install
npm run build
```

在 OpenCode 配置中注册插件：

```jsonc
// ~/.config/opencode/opencode.jsonc
{
  "plugin": [
    "file:///path/to/sec-agent"
  ]
}
```

## 安全工具

| 工具 | 描述 |
|------|------|
| `sec_scan` | 安全代码扫描（OWASP Top 10、CWE） |
| `dep_audit` | 依赖漏洞扫描（npm/pip/cargo/go） |
| `secret_scan` | 密钥泄露检测（API Key、Token、私钥） |
| `sec_report` | 安全报告生成（Markdown/SARIF） |

## 安全 Skills

| Skill | 触发词 | 描述 |
|-------|--------|------|
| owasp-top10 | OWASP, 注入, XSS | OWASP Top 10 检测与修复指南 |
| threat-modeling | 威胁建模, STRIDE | STRIDE 威胁建模方法论 |
| privacy-compliance | GDPR, CCPA, 隐私 | 隐私合规检查清单 |
| crypto-review | 加密, 密码学, TLS | 密码学最佳实践审查 |
| api-security | API安全, 认证 | API 安全测试方法 |
| dependency-security | 依赖漏洞, SCA | 依赖安全管理 |
| container-security | Docker, K8s | 容器安全加固 |

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

## 项目结构

```
sec-agent/
├── src/
│   ├── index.ts                     # Plugin 入口
│   ├── plugin-config.ts             # 配置加载
│   ├── plugin-interface.ts          # Hook Handler 组装
│   ├── create-hooks.ts              # 7 个安全 Hook
│   ├── create-tools.ts              # 4 个安全 Tool
│   ├── create-managers.ts           # Manager 层
│   ├── agents/                      # 5 个安全 Agent
│   ├── hooks/                       # Hook 实现
│   ├── features/builtin-skills/     # 7 个 SKILL.md
│   ├── config/schema/               # Zod 配置 Schema
│   ├── plugin-handlers/             # 配置处理器
│   └── shared/                      # 共享模块
├── plans/                           # 设计方案文档
├── AGENTS.md
├── package.json
└── tsconfig.json
```

## 技术栈

- **语言**: TypeScript (strict mode)
- **运行时**: Node.js
- **插件 SDK**: @opencode-ai/plugin + @opencode-ai/sdk
- **配置校验**: Zod
- **参考架构**: [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)

## License

MIT
