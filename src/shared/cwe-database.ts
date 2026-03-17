/**
 * CWE (Common Weakness Enumeration) category mappings
 */
export const CWE_CATEGORIES: Record<string, { name: string; category: string }> = {
  "CWE-79": { name: "Cross-site Scripting (XSS)", category: "injection" },
  "CWE-89": { name: "SQL Injection", category: "injection" },
  "CWE-78": { name: "OS Command Injection", category: "injection" },
  "CWE-94": { name: "Code Injection", category: "injection" },
  "CWE-502": { name: "Deserialization of Untrusted Data", category: "injection" },
  "CWE-22": { name: "Path Traversal", category: "file-access" },
  "CWE-73": { name: "External Control of File Name or Path", category: "file-access" },
  "CWE-287": { name: "Improper Authentication", category: "auth" },
  "CWE-306": { name: "Missing Authentication for Critical Function", category: "auth" },
  "CWE-862": { name: "Missing Authorization", category: "auth" },
  "CWE-863": { name: "Incorrect Authorization", category: "auth" },
  "CWE-798": { name: "Use of Hard-coded Credentials", category: "secrets" },
  "CWE-321": { name: "Use of Hard-coded Cryptographic Key", category: "secrets" },
  "CWE-327": { name: "Use of a Broken or Risky Cryptographic Algorithm", category: "crypto" },
  "CWE-328": { name: "Use of Weak Hash", category: "crypto" },
  "CWE-330": { name: "Use of Insufficiently Random Values", category: "crypto" },
  "CWE-352": { name: "Cross-Site Request Forgery (CSRF)", category: "web" },
  "CWE-918": { name: "Server-Side Request Forgery (SSRF)", category: "web" },
  "CWE-601": { name: "URL Redirection to Untrusted Site", category: "web" },
  "CWE-200": { name: "Information Exposure", category: "info-leak" },
  "CWE-209": { name: "Information Exposure Through Error Message", category: "info-leak" },
  "CWE-532": { name: "Information Exposure Through Log Files", category: "info-leak" },
  "CWE-362": { name: "Race Condition", category: "concurrency" },
  "CWE-190": { name: "Integer Overflow", category: "numeric" },
  "CWE-400": { name: "Uncontrolled Resource Consumption", category: "dos" },
}

export function getCWEName(cweId: string): string {
  return CWE_CATEGORIES[cweId]?.name ?? cweId
}

export function getCWECategory(cweId: string): string {
  return CWE_CATEGORIES[cweId]?.category ?? "unknown"
}
