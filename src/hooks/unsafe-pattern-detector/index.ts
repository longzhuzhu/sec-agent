/**
 * unsafe-pattern-detector hook
 * Write/Edit 操作后检测不安全编码模式
 */
import { UNSAFE_CODE_PATTERNS } from "../../shared/security-patterns"

export interface UnsafePatternDetection {
  name: string
  cwe: string
  severity: string
  match: string
  line?: number
}

export function detectUnsafePatterns(content: string): UnsafePatternDetection[] {
  const detections: UnsafePatternDetection[] = []
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    for (const { name, pattern, cwe, severity } of UNSAFE_CODE_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags)
      let match: RegExpExecArray | null
      while ((match = regex.exec(line)) !== null) {
        detections.push({
          name,
          cwe,
          severity,
          match: match[0].substring(0, 40),
          line: i + 1,
        })
      }
    }
  }

  return detections
}

export function createUnsafePatternDetector() {
  return {
    name: "unsafe-pattern-detector" as const,
    afterToolExecute(toolName: string, args: Record<string, unknown>): string | null {
      if (toolName !== "write" && toolName !== "edit") {
        return null
      }

      const content = (args.content as string) ?? (args.new_string as string) ?? ""
      const detections = detectUnsafePatterns(content)

      if (detections.length === 0) return null

      const warnings = detections
        .map(d => `  - [${d.severity.toUpperCase()}] ${d.name} (${d.cwe}) 行 ${d.line}: ${d.match}`)
        .join("\n")

      return `\n⚠️ 安全警告 — 检测到不安全编码模式:\n${warnings}\n建议修复上述安全问题。`
    },
  }
}
