# SecAgent — OpenCode 安全代理插件实现方案

## 一、项目概述

SecAgent 是一个 OpenCode 插件（参考 oh-my-openagent 架构），实现安全代理系统。插件支持开发者在设计、开发、测试、发布阶段对代码进行安全防护。5 个角色均支持 OpenCode TAB 切换选择。

## 二、角色体系（5 个 Agent）

### Agent TAB 切换原理

oh-my-openagent 中 Agent 通过 `config` handler 注册到 `params.config.agent` 对象，OpenCode 会将该对象中的每个 key 渲染为 UI TAB。关键机制：

- `AGENT_DISPLAY_NAMES` 映射 config key → TAB 显示名
- `CORE_AGENT_ORDER` 控制 TAB 排列顺序
- `mode: "all"` 使 Agent 同时支持 TAB 选择和被其他 Agent 委派调用

### 5 个角色定义

| Agent | Config Key | TAB 显示名 | 职责 |
|-------|-----------|-----------|------|
| **SecAgent** | `sec-agent` | `SecAgent (Orchestrator)` | 主编排器：安全意图识别、任务分类、委派路由、结果汇总 |
| **SecDesign** | `sec-design` | `SecDesign (Security Architect)` | 安全/隐私设计：威胁建模、攻击面分析、隐私合规(GDPR/CCPA)、PII检测 |
| **SecDev** | `sec-dev` | `SecDev (Secure Coder)` | 安全开发与修复：OWASP Top 10、CWE检测、安全编码规范、漏洞修复 |
| **SecTest** | `sec-test` | `SecTest (Security Tester)` | 白盒/黑盒测试：SAST、密码学审查、DAST、模糊测试、API安全 |
| **SecGate** | `sec-gate` | `SecGate (Release Guardian)` | 发布守门：依赖漏洞扫描、密钥泄露检测、合规检查、安全报告生成 |

### 与 oh-my-openagent 的对应关系

| SecAgent | oh-my-openagent 对应 | 继承的设计模式 |
|----------|---------------------|--------------|
| SecAgent | Sisyphus (主编排器) | 意图门控(Intent Gate)、强制委派、动态 Prompt 构建 |
| SecDesign | Oracle (只读咨询) + Metis (预规划分析) | 只读分析模式、结构化输出、风险矩阵 |
| SecDev | Sisyphus-Junior (任务执行) + Momus (审查) | 代码修改权限、审查反馈循环 |
| SecTest | Hephaestus (深度自主工作) | 自主探索模式、端到端执行 |
| SecGate | Atlas (计划执行编排) + Momus (审查) | 门控检查、通过/拒绝决策 |

## 三、各角色详细设计

### 3.1 SecAgent — 主编排器

**系统提示词核心**：资深安全工程师 + 安全团队负责人，核心能力是从普通开发请求中识别隐含安全风险。

**Phase 0 — 安全意图门控（每条消息必须执行）**：

| 用户表面请求 | 安全意图分类 | 路由目标 |
|------------|------------|---------|
| "审查这段代码" | 安全编码审查 | SecDev |
| "这个设计安全吗" | 安全架构评审 | SecDesign |
| "GDPR合规检查" | 隐私设计 | SecDesign |
| "测试安全性" | 安全测试 | SecTest |
| "准备发布" | 发布安全门控 | SecGate |
| "全面安全评估" | 完整SDL | SecDesign → SecDev → SecTest → SecGate |

**委派规则**：
- 安全关键任务 **必须** 委派给专家 Agent，不自行处理
- 搜索类子任务可并行发射（`run_in_background=true`）
- 每个安全发现必须有严重性评级（Critical/High/Medium/Low/Info）

### 3.2 SecDesign — 安全/隐私设计

**方法论**：STRIDE 威胁建模、Privacy by Design

**能力矩阵**：

| 能力域 | 具体能力 | 输出格式 |
|--------|---------|---------|
| 威胁建模 | STRIDE 分析、攻击树、数据流图 | 威胁模型文档 + 风险矩阵 |
| 攻击面分析 | 入口点枚举、信任边界识别 | 攻击面清单 + CVSS 评分范围 |
| 隐私设计 | PII 检测、数据流追踪 | 数据映射 + 合规差距分析 |
| 合规检查 | GDPR/CCPA/PIPL 要求对照 | 合规检查清单 + 修复建议 |

**工具权限**：禁止 `write`、`edit`（只读分析，产出报告）

### 3.3 SecDev — 安全开发与修复

**规则集**：OWASP Top 10、CWE Top 25、语言特定安全规范

**能力矩阵**：

| 能力域 | 具体能力 |
|--------|---------|
| 安全编码审查 | 注入检测(SQL/XSS/CMD)、反序列化、路径遍历 |
| 安全修复 | 自动修复已知漏洞模式 |
| 依赖审查 | 第三方库漏洞检查 |
| 代码加固 | 输入验证、输出编码、权限控制 |

**特殊行为**：每次修复后自动运行安全扫描验证修复有效性

### 3.4 SecTest — 白盒/黑盒测试

**方法论**：白盒(SAST) + 黑盒(DAST) 双视角

**能力矩阵**：

| 测试类型 | 具体能力 |
|---------|---------|
| 白盒-SAST | 静态代码分析、污点分析、密码学审查 |
| 白盒-逻辑 | 竞态条件、整数溢出、TOCTOU |
| 黑盒-DAST | SQL注入/XSS/SSRF 测试 |
| 黑盒-API | 认证绕过、授权逻辑、速率限制 |
| 模糊测试 | 边界值、格式字符串、大payload |

**特殊行为**：自主深度探索模式 — 先花足够时间理解代码再执行测试

### 3.5 SecGate — 发布守门

**决策原则**：发现 Critical/High 漏洞 → 阻止发布；Medium 以下 → 警告但允许

**能力矩阵**：

| 检查项 | 具体能力 |
|--------|---------|
| 依赖漏洞 | SCA 扫描、许可证合规 |
| 密钥泄露 | 硬编码密钥、Token、证书检测 |
| 安全配置 | CORS/CSP/HSTS/TLS 配置检查 |
| 合规验证 | 安全需求覆盖度检查 |
| 安全报告 | Markdown/SARIF 格式报告生成 |

**工具权限**：禁止 `write`、`edit`（守门员不修改代码，只做判定）
**特殊输出**：`PASS` / `FAIL` + 详细理由 + 安全报告

## 四、协作流程

### 4.1 单任务流程（用户选择特定 TAB）

```
用户在 TAB 选择 SecDev → SecDev 直接执行安全编码审查
用户在 TAB 选择 SecTest → SecTest 直接执行安全测试
```

### 4.2 编排流程（用户使用 SecAgent TAB）

```
用户请求 → SecAgent 意图门控
  │
  ├─ 简单任务 → 直接委派对应 Agent
  │
  └─ 完整SDL → 按阶段编排
      ├─ Wave 1: SecDesign → 威胁建模 + 安全设计评审
      ├─ Wave 2: SecDev → 安全编码审查 + 修复
      ├─ Wave 3: SecTest → 白盒 + 黑盒测试
      └─ Wave 4: SecGate → 发布门控检查
```

## 五、Category 系统（安全任务分类）

| Category | 描述 | 推荐 Agent |
|----------|------|-----------|
| `threat-modeling` | 威胁建模与攻击面分析 | SecDesign |
| `privacy-review` | 隐私设计与合规检查 | SecDesign |
| `code-audit` | 安全编码审查 | SecDev |
| `security-fix` | 安全漏洞修复 | SecDev |
| `sast` | 白盒静态分析 | SecTest |
| `dast` | 黑盒动态测试 | SecTest |
| `release-gate` | 发布安全门控 | SecGate |

## 六、Hooks 设计

| Hook 名称 | 触发时机 | 描述 |
|-----------|---------|------|
| `security-keyword-detector` | messages.transform | 检测安全关键词，注入安全上下文 |
| `secret-leak-guard` | tool.execute.before | Write/Edit 前检测硬编码密钥 |
| `unsafe-pattern-detector` | tool.execute.after | Write/Edit 后检测不安全编码模式 |
| `pre-commit-security-scan` | tool.execute.before | git commit 前安全扫描提醒 |
| `dependency-audit-reminder` | chat.message | 新增依赖时提醒安全审查 |
| `security-report-generator` | session.idle | 会话结束时生成安全摘要 |
| `security-todo-enforcer` | session.idle | 确保安全修复任务全部完成 |

## 七、Skills 设计

| Skill 名称 | 触发词 | 描述 |
|-----------|--------|------|
| `owasp-top10` | "OWASP", "注入", "XSS" | OWASP Top 10 检测与修复指南 |
| `threat-modeling` | "威胁建模", "STRIDE" | STRIDE 威胁建模方法论 |
| `privacy-compliance` | "GDPR", "CCPA", "隐私" | 隐私合规检查清单 |
| `crypto-review` | "加密", "密码学", "TLS" | 密码学最佳实践 |
| `api-security` | "API安全", "认证" | API 安全测试方法 |
| `dependency-security` | "依赖漏洞", "SCA" | 依赖安全管理 |
| `container-security` | "Docker", "K8s" | 容器安全加固 |

## 八、Tools 设计

| Tool | 描述 | 参数 |
|------|------|------|
| `sec_scan` | 安全代码扫描 | target(路径), rules(规则集) |
| `dep_audit` | 依赖漏洞扫描 | package_manager(包管理器), path |
| `secret_scan` | 密钥泄露检测 | target(路径), include_entropy(熵分析) |
| `sec_report` | 安全报告生成 | format(格式), output_path, title |

## 九、项目目录结构

```
sec-agent/
├── src/
│   ├── index.ts                     # Plugin 入口
│   ├── plugin-config.ts             # JSONC 配置加载
│   ├── plugin-interface.ts          # Hook Handler 组装
│   ├── create-hooks.ts              # Hook 创建编排
│   ├── create-tools.ts              # Tool 创建编排
│   ├── create-managers.ts           # Manager 创建
│   │
│   ├── agents/                      # 5 个安全 Agent
│   │   ├── types.ts                 # AgentMode, AgentFactory 类型
│   │   ├── agent-builder.ts         # 通用 Agent 构建器
│   │   ├── builtin-agents.ts        # createBuiltinAgents() 注册中心
│   │   ├── sec-agent.ts             # 主编排器
│   │   ├── sec-design.ts            # 安全/隐私设计
│   │   ├── sec-dev.ts               # 安全开发与修复
│   │   ├── sec-test.ts              # 白盒/黑盒测试
│   │   └── sec-gate.ts              # 发布守门
│   │
│   ├── hooks/                       # 7 个安全 Hook
│   │   ├── security-keyword-detector/
│   │   ├── secret-leak-guard/
│   │   ├── unsafe-pattern-detector/
│   │   ├── pre-commit-security-scan/
│   │   ├── dependency-audit-reminder/
│   │   ├── security-report-generator/
│   │   └── security-todo-enforcer/
│   │
│   ├── features/
│   │   └── builtin-skills/          # 7 个安全 Skill
│   │       ├── owasp-top10/SKILL.md
│   │       ├── threat-modeling/SKILL.md
│   │       ├── privacy-compliance/SKILL.md
│   │       ├── crypto-review/SKILL.md
│   │       ├── api-security/SKILL.md
│   │       ├── dependency-security/SKILL.md
│   │       └── container-security/SKILL.md
│   │
│   ├── config/schema/               # Zod 配置 Schema
│   │   └── sec-agent-config.ts
│   │
│   ├── plugin-handlers/             # 插件处理器
│   │   ├── config-handler.ts
│   │   ├── agent-priority-order.ts
│   │   └── agent-key-remapper.ts
│   │
│   └── shared/                      # 共享模块
│       ├── agent-display-names.ts
│       ├── severity.ts
│       ├── cwe-database.ts
│       └── security-patterns.ts
│
├── plans/                           # 方案文档
├── AGENTS.md
├── README.md
├── package.json
└── tsconfig.json
```

## 十、技术栈

- **运行时**: Node.js / Bun
- **语言**: TypeScript (strict mode)
- **插件SDK**: @opencode-ai/plugin + @opencode-ai/sdk
- **配置校验**: Zod
- **构建**: tsc

## 十一、参考架构

本项目参考 [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) 的架构设计：
- Plugin 入口五阶段初始化流程
- Agent 通过 config handler 注册到 UI TAB
- AGENT_DISPLAY_NAMES + CORE_AGENT_ORDER 控制 TAB 渲染
- Hook 系统 (before/after/transform)
- Tool 使用 `tool()` 函数 + `tool.schema` (zod) 定义

## 十二、验证方式

1. **插件加载测试**：`opencode` 启动后 5 个 Agent TAB 正确显示且可切换
2. **单 Agent 测试**：
   - SecAgent：发送"全面安全评估"验证编排流程
   - SecDesign：发送"分析这个API的安全设计"验证威胁建模
   - SecDev：发送"检查这段代码的SQL注入"验证漏洞检测
   - SecTest：发送"对这个模块做安全测试"验证测试执行
   - SecGate：发送"检查是否可以发布"验证门控判定
3. **Hook 测试**：Write 代码时验证 secret-leak-guard 和 unsafe-pattern-detector 触发
