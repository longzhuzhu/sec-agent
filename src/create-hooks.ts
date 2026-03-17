import type { SecAgentConfig, HookName } from "./config/schema/sec-agent-config"
import { createSecurityKeywordDetector } from "./hooks/security-keyword-detector"
import { createSecretLeakGuard } from "./hooks/secret-leak-guard"
import { createUnsafePatternDetector } from "./hooks/unsafe-pattern-detector"
import { createPreCommitSecurityScan } from "./hooks/pre-commit-security-scan"
import { createDependencyAuditReminder } from "./hooks/dependency-audit-reminder"
import { createSecurityReportGenerator } from "./hooks/security-report-generator"
import { createSecurityTodoEnforcer } from "./hooks/security-todo-enforcer"

export type CreatedHooks = ReturnType<typeof createHooks>

export function createHooks(args: {
  pluginConfig: SecAgentConfig
  isHookEnabled: (hookName: HookName) => boolean
}) {
  const { isHookEnabled } = args

  const securityKeywordDetector = isHookEnabled("security-keyword-detector")
    ? createSecurityKeywordDetector()
    : null

  const secretLeakGuard = isHookEnabled("secret-leak-guard")
    ? createSecretLeakGuard()
    : null

  const unsafePatternDetector = isHookEnabled("unsafe-pattern-detector")
    ? createUnsafePatternDetector()
    : null

  const preCommitSecurityScan = isHookEnabled("pre-commit-security-scan")
    ? createPreCommitSecurityScan()
    : null

  const dependencyAuditReminder = isHookEnabled("dependency-audit-reminder")
    ? createDependencyAuditReminder()
    : null

  const securityReportGenerator = isHookEnabled("security-report-generator")
    ? createSecurityReportGenerator()
    : null

  const securityTodoEnforcer = isHookEnabled("security-todo-enforcer")
    ? createSecurityTodoEnforcer()
    : null

  return {
    securityKeywordDetector,
    secretLeakGuard,
    unsafePatternDetector,
    preCommitSecurityScan,
    dependencyAuditReminder,
    securityReportGenerator,
    securityTodoEnforcer,
  }
}
