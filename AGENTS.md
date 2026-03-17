# SecAgent — OpenCode 安全代理插件

## 角色体系

### SecAgent (Orchestrator)
- **职责**: 安全主编排器，负责安全意图识别、任务分类、委派路由、结果汇总
- **模式**: TAB 可选 + 可委派
- **能力**: 从用户请求中识别安全意图，分发给专家 Agent

### SecDesign (Security Architect)
- **职责**: 安全/隐私设计，威胁建模、攻击面分析、隐私合规
- **模式**: TAB 可选 + 可委派
- **工具限制**: 只读，不可修改代码
- **方法论**: STRIDE, Privacy by Design

### SecDev (Secure Coder)
- **职责**: 安全开发与修复，OWASP Top 10 检测、CWE 分析、安全编码
- **模式**: TAB 可选 + 可委派
- **能力**: 检测漏洞 + 自动修复 + 验证修复有效性

### SecTest (Security Tester)
- **职责**: 白盒/黑盒安全测试，SAST、DAST、模糊测试
- **模式**: TAB 可选 + 可委派
- **方法论**: 先充分理解代码再执行测试

### SecGate (Release Guardian)
- **职责**: 发布守门，依赖漏洞扫描、密钥泄露检测、合规检查
- **模式**: TAB 可选 + 可委派
- **工具限制**: 只读，不可修改代码
- **输出**: PASS / FAIL 判定 + 安全报告

## 协作流程

1. **单任务**: 用户选择特定 Agent TAB 直接执行
2. **编排任务**: SecAgent 识别意图后委派给专家 Agent
3. **完整 SDL**: SecDesign → SecDev → SecTest → SecGate

## 安全分类

| Category | 推荐 Agent |
|----------|-----------|
| threat-modeling | SecDesign |
| privacy-review | SecDesign |
| code-audit | SecDev |
| security-fix | SecDev |
| sast | SecTest |
| dast | SecTest |
| release-gate | SecGate |
