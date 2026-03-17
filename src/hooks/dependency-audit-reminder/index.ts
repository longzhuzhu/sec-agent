/**
 * dependency-audit-reminder hook
 * 新增依赖时提醒安全审查
 */

const DEP_INSTALL_PATTERNS = [
  /npm\s+install\b/,
  /npm\s+i\b/,
  /yarn\s+add\b/,
  /pnpm\s+add\b/,
  /bun\s+add\b/,
  /pip\s+install\b/,
  /poetry\s+add\b/,
  /cargo\s+add\b/,
  /go\s+get\b/,
]

export function createDependencyAuditReminder() {
  return {
    name: "dependency-audit-reminder" as const,
    onMessage(message: string): string | null {
      const isDepInstall = DEP_INSTALL_PATTERNS.some(p => p.test(message))
      if (!isDepInstall) return null

      return `\n<dependency-security-reminder>
检测到依赖安装操作。安全建议:
1. 检查包的已知漏洞 (npm audit / pip-audit)
2. 验证包的维护状态和下载量
3. 审查包的许可证合规性
4. 考虑使用 SecGate 进行依赖安全扫描
</dependency-security-reminder>\n`
    },
  }
}
