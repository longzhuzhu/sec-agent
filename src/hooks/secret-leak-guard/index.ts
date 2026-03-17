/**
 * secret-leak-guard hook
 * Write/Edit 操作前检测硬编码密钥
 */
import { SECRET_PATTERNS } from "../../shared/security-patterns"

export interface SecretDetection {
  pattern: string
  match: string
  line?: number
}

export function detectSecrets(content: string): SecretDetection[] {
  const detections: SecretDetection[] = []
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    for (const { name, pattern } of SECRET_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags)
      let match: RegExpExecArray | null
      while ((match = regex.exec(line)) !== null) {
        detections.push({
          pattern: name,
          match: match[0].substring(0, 20) + "...",
          line: i + 1,
        })
      }
    }
  }

  return detections
}

export function createSecretLeakGuard() {
  return {
    name: "secret-leak-guard" as const,
    beforeToolExecute(toolName: string, args: Record<string, unknown>): { blocked: boolean; reason?: string } {
      if (toolName !== "write" && toolName !== "edit") {
        return { blocked: false }
      }

      const content = (args.content as string) ?? (args.new_string as string) ?? ""
      const detections = detectSecrets(content)

      if (detections.length > 0) {
        const details = detections
          .map(d => `  - [${d.pattern}] 行 ${d.line}: ${d.match}`)
          .join("\n")
        return {
          blocked: true,
          reason: `⚠️ 检测到潜在的硬编码密钥:\n${details}\n请移除敏感信息后重试。`,
        }
      }

      return { blocked: false }
    },
  }
}
