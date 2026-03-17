# 依赖安全管理

## 触发词
依赖漏洞, SCA, npm audit, 供应链安全, dependency, supply chain

## 描述
依赖安全管理和软件组成分析（SCA），检测第三方库漏洞和许可证合规。

## 工作流程

### 步骤 1: 依赖清单

分析项目依赖文件：
- `package.json` / `package-lock.json` (Node.js)
- `requirements.txt` / `Pipfile` / `pyproject.toml` (Python)
- `Cargo.toml` / `Cargo.lock` (Rust)
- `go.mod` / `go.sum` (Go)
- `pom.xml` / `build.gradle` (Java)

### 步骤 2: 漏洞扫描

使用对应的包管理器审计命令：

```bash
# Node.js
npm audit --json

# Python
pip-audit --format json

# Rust
cargo audit --json

# Go
govulncheck ./...
```

### 步骤 3: 风险评估

| 指标 | 高风险 | 中风险 | 低风险 |
|------|--------|--------|--------|
| CVSS | ≥7.0 | 4.0-6.9 | <4.0 |
| 可利用性 | POC 公开 | 理论可行 | 难以利用 |
| 影响范围 | 直接依赖 | 间接依赖 | 开发依赖 |
| 修复方案 | 有补丁版本 | 需要升级大版本 | 无修复 |

### 步骤 4: 许可证合规

| 许可证类型 | 风险 | 注意事项 |
|-----------|------|---------|
| MIT, BSD, Apache 2.0 | 低 | 宽松许可 |
| LGPL | 中 | 动态链接通常安全 |
| GPL | 高 | 传染性，可能影响项目许可 |
| AGPL | 极高 | 网络使用也要开源 |
| 无许可证 | 高 | 法律风险 |

### 步骤 5: 修复建议

1. 优先升级有安全补丁的直接依赖
2. 评估大版本升级的兼容性风险
3. 无补丁时考虑替代库
4. 设置依赖自动更新（Dependabot/Renovate）
