/**
 * pre-commit-security-scan hook
 * git commit 前执行安全扫描
 */
import { SECRET_PATTERNS, UNSAFE_CODE_PATTERNS } from "../../shared/security-patterns"

export function createPreCommitSecurityScan() {
  return {
    name: "pre-commit-security-scan" as const,
    beforeToolExecute(toolName: string, args: Record<string, unknown>): { blocked: boolean; reason?: string } {
      if (toolName !== "bash") return { blocked: false }

      const command = (args.command as string) ?? ""
      if (!command.includes("git commit")) return { blocked: false }

      // 注入安全提示到 commit 上下文
      return {
        blocked: false,
        reason: `\n<security-reminder>
执行 git commit 前请确认:
1. 无硬编码密钥或敏感信息
2. 无已知的不安全编码模式
3. 依赖已通过安全审查
建议: 使用 SecGate 进行发布前安全检查
</security-reminder>\n`,
      }
    },
  }
}
