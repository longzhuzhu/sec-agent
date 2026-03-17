# OWASP Top 10 安全检测与修复指南

## 触发词
OWASP, 注入, XSS, SQL注入, 命令注入, CSRF, SSRF, 反序列化

## 描述
基于 OWASP Top 10 (2021) 的安全漏洞检测与修复指南。涵盖 A01-A10 全部类别。

## 工作流程

### 步骤 1: 识别漏洞类型

根据代码特征判断属于 OWASP Top 10 的哪个类别：

| ID | 类别 | 关键特征 |
|----|------|---------|
| A01 | Broken Access Control | 缺少权限检查、IDOR、目录遍历 |
| A02 | Cryptographic Failures | 弱加密、明文传输、硬编码密钥 |
| A03 | Injection | SQL/XSS/CMD 字符串拼接 |
| A04 | Insecure Design | 缺少速率限制、业务逻辑缺陷 |
| A05 | Security Misconfiguration | 默认配置、错误信息泄露 |
| A06 | Vulnerable Components | 已知漏洞依赖 |
| A07 | Auth Failures | 弱密码策略、会话固定 |
| A08 | Data Integrity Failures | 不安全反序列化、CI/CD 缺陷 |
| A09 | Logging Failures | 缺少安全日志、日志注入 |
| A10 | SSRF | 未验证的服务端请求 |

### 步骤 2: 使用 AST Grep 搜索漏洞模式

针对每种注入类型使用 AST 模式搜索：

```
# SQL 注入: 字符串拼接查询
"SELECT " + $VAR
`SELECT * FROM ${$TABLE} WHERE ${$CONDITION}`

# XSS: innerHTML 赋值
$EL.innerHTML = $VALUE

# 命令注入: exec 带用户输入
exec($CMD)
execSync($CMD)
```

### 步骤 3: 评估风险等级

根据 CVSS 3.1 评分标准评估：
- **Attack Vector**: Network/Adjacent/Local/Physical
- **Attack Complexity**: Low/High
- **Privileges Required**: None/Low/High
- **User Interaction**: None/Required

### 步骤 4: 生成修复建议

每个发现提供：
1. CWE 编号和说明
2. 漏洞代码片段（标注问题行）
3. 修复后的代码
4. 验证方法
