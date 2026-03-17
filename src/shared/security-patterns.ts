/**
 * Security patterns for detection via regex matching
 */

/** 硬编码密钥/Token 检测模式 */
export const SECRET_PATTERNS = [
  { name: "AWS Access Key", pattern: /AKIA[0-9A-Z]{16}/g },
  { name: "AWS Secret Key", pattern: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*["']?[A-Za-z0-9/+=]{40}/g },
  { name: "GitHub Token", pattern: /gh[pousr]_[A-Za-z0-9_]{36,255}/g },
  { name: "Generic API Key", pattern: /(?:api[_-]?key|apikey|api[_-]?secret)\s*[=:]\s*["'][A-Za-z0-9\-_.]{16,}/gi },
  { name: "JWT Token", pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
  { name: "Private Key", pattern: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/g },
  { name: "Password Assignment", pattern: /(?:password|passwd|pwd)\s*[=:]\s*["'][^"']{8,}/gi },
  { name: "Bearer Token", pattern: /Bearer\s+[A-Za-z0-9\-_.~+/]+=*/g },
  { name: "Slack Token", pattern: /xox[bpras]-[0-9]{10,}-[A-Za-z0-9-]+/g },
  { name: "Generic Secret", pattern: /(?:secret|token|credential)\s*[=:]\s*["'][A-Za-z0-9\-_.]{16,}/gi },
]

/** 不安全编码模式检测 */
export const UNSAFE_CODE_PATTERNS = [
  { name: "eval() usage", pattern: /\beval\s*\(/g, cwe: "CWE-94", severity: "high" as const },
  { name: "innerHTML assignment", pattern: /\.innerHTML\s*=/g, cwe: "CWE-79", severity: "medium" as const },
  { name: "document.write", pattern: /document\.write\s*\(/g, cwe: "CWE-79", severity: "medium" as const },
  { name: "SQL string concatenation", pattern: /(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE).*\+\s*(?:req\.|params\.|query\.|body\.)/gi, cwe: "CWE-89", severity: "critical" as const },
  { name: "exec/spawn without shell:false", pattern: /(?:exec|execSync|spawn)\s*\([^)]*(?:req\.|params\.|query\.|body\.)/g, cwe: "CWE-78", severity: "critical" as const },
  { name: "Weak crypto (MD5/SHA1)", pattern: /(?:createHash|hashlib\.)\s*\(\s*["'](?:md5|sha1)["']\s*\)/g, cwe: "CWE-328", severity: "medium" as const },
  { name: "Math.random for security", pattern: /Math\.random\s*\(\s*\)/g, cwe: "CWE-330", severity: "medium" as const },
  { name: "Disabled TLS verification", pattern: /rejectUnauthorized\s*:\s*false/g, cwe: "CWE-295", severity: "high" as const },
  { name: "CORS wildcard", pattern: /(?:Access-Control-Allow-Origin|cors)\s*[=:]\s*["']\*["']/g, cwe: "CWE-942", severity: "medium" as const },
  { name: "Prototype pollution", pattern: /\[(?:req\.|params\.|query\.|body\.)[^\]]*\]\s*=/g, cwe: "CWE-1321", severity: "high" as const },
]

/** 隐私数据模式（PII 检测） */
export const PII_PATTERNS = [
  { name: "Email", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: "Phone Number", pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { name: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: "Credit Card", pattern: /\b(?:4\d{3}|5[1-5]\d{2}|6011|3[47]\d{2})[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g },
  { name: "IP Address", pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
]
