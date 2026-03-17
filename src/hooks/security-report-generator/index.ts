/**
 * security-report-generator hook
 * 会话结束时生成安全摘要
 */

export interface SecuritySummary {
  totalFindings: number
  critical: number
  high: number
  medium: number
  low: number
  info: number
  categories: string[]
  timestamp: string
}

export function createSecurityReportGenerator() {
  const findings: Array<{ severity: string; category: string; description: string }> = []

  return {
    name: "security-report-generator" as const,

    addFinding(severity: string, category: string, description: string) {
      findings.push({ severity, category, description })
    },

    generateSummary(): SecuritySummary {
      const categories = [...new Set(findings.map(f => f.category))]
      return {
        totalFindings: findings.length,
        critical: findings.filter(f => f.severity === "critical").length,
        high: findings.filter(f => f.severity === "high").length,
        medium: findings.filter(f => f.severity === "medium").length,
        low: findings.filter(f => f.severity === "low").length,
        info: findings.filter(f => f.severity === "info").length,
        categories,
        timestamp: new Date().toISOString(),
      }
    },

    generateMarkdownReport(): string {
      const summary = this.generateSummary()
      return `# 安全会话摘要

## 概览
- **总发现数**: ${summary.totalFindings}
- **Critical**: ${summary.critical}
- **High**: ${summary.high}
- **Medium**: ${summary.medium}
- **Low**: ${summary.low}
- **Info**: ${summary.info}
- **涉及分类**: ${summary.categories.join(", ") || "无"}
- **时间**: ${summary.timestamp}

## 详细发现

${findings.length === 0 ? "本次会话未检测到安全问题。" : findings.map((f, i) => `### ${i + 1}. [${f.severity.toUpperCase()}] ${f.category}\n${f.description}`).join("\n\n")}
`
    },
  }
}
