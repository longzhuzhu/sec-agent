/**
 * security-keyword-detector hook
 * 检测用户消息中的安全关键词，注入安全上下文
 */

const SECURITY_KEYWORDS_ZH = [
  "安全", "漏洞", "注入", "XSS", "CSRF", "SSRF", "加密", "密钥",
  "认证", "授权", "越权", "渗透", "威胁", "攻击", "防护", "脆弱",
  "隐私", "合规", "GDPR", "审计", "扫描", "密码学",
]

const SECURITY_KEYWORDS_EN = [
  "security", "vulnerability", "injection", "exploit", "owasp", "cwe",
  "authentication", "authorization", "encryption", "penetration", "threat",
  "attack", "defense", "compliance", "privacy", "audit", "scan",
  "malware", "backdoor", "privilege", "escalation", "bypass",
  "sast", "dast", "sca", "devsecops", "sdl",
]

const ALL_KEYWORDS = [...SECURITY_KEYWORDS_ZH, ...SECURITY_KEYWORDS_EN]

export function detectSecurityKeywords(message: string): string[] {
  const lowerMessage = message.toLowerCase()
  return ALL_KEYWORDS.filter(kw => lowerMessage.includes(kw.toLowerCase()))
}

export function buildSecurityContext(keywords: string[]): string {
  if (keywords.length === 0) return ""

  return `\n<security-context>
检测到安全相关关键词: ${keywords.join(", ")}
请以安全视角审视此请求，注意潜在的安全风险。
优先考虑: 输入验证、输出编码、访问控制、加密安全、错误处理。
</security-context>\n`
}

export function createSecurityKeywordDetector() {
  return {
    name: "security-keyword-detector" as const,
    transform(messages: Array<{ role: string; content: string }>) {
      if (messages.length === 0) return messages

      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role !== "user") return messages

      const keywords = detectSecurityKeywords(lastMessage.content)
      if (keywords.length === 0) return messages

      const context = buildSecurityContext(keywords)
      return [
        ...messages.slice(0, -1),
        { ...lastMessage, content: lastMessage.content + context },
      ]
    },
  }
}
