# 容器安全加固

## 触发词
Docker, Dockerfile, K8s, Kubernetes, 容器安全, container security, 镜像安全

## 描述
Docker 和 Kubernetes 环境的安全加固检查和最佳实践。

## 工作流程

### 步骤 1: Dockerfile 安全审查

| 检查项 | 安全要求 |
|--------|---------|
| 基础镜像 | 使用官方镜像，指定版本标签（非 latest） |
| 运行用户 | 使用非 root 用户 (USER directive) |
| 多阶段构建 | 分离构建和运行环境 |
| 敏感数据 | 不在镜像中包含密钥/凭据 |
| 端口暴露 | 仅暴露必要端口 |
| 健康检查 | 配置 HEALTHCHECK |
| 文件权限 | 最小必要文件权限 |

#### Dockerfile 最佳实践示例
```dockerfile
# ✅ 安全的 Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -q --spider http://localhost:3000/health
CMD ["node", "server.js"]
```

### 步骤 2: 镜像安全扫描

```bash
# 使用 Trivy 扫描镜像漏洞
trivy image <image-name>

# 使用 Grype 扫描
grype <image-name>
```

### 步骤 3: Kubernetes 安全检查

| 检查项 | 安全要求 |
|--------|---------|
| Pod Security | 设置 SecurityContext (runAsNonRoot, readOnlyRootFilesystem) |
| 网络策略 | 实施 NetworkPolicy 限制 Pod 间通信 |
| RBAC | 最小权限原则的角色绑定 |
| Secrets | 使用 K8s Secrets 或外部密钥管理 |
| 资源限制 | 设置 CPU/Memory limits |
| 镜像策略 | imagePullPolicy: Always，使用私有仓库 |

### 步骤 4: 生成加固报告

输出包含：
- 当前安全状态评估
- 不符合项列表（按严重性）
- 修复代码/配置示例
- 合规标准对照（CIS Benchmark）
