import type { Severity } from "../agents/types"

/**
 * CVSS severity thresholds
 */
export const SEVERITY_LEVELS: Record<Severity, { label: string; cvssMin: number; cvssMax: number; emoji: string }> = {
  critical: { label: "Critical", cvssMin: 9.0, cvssMax: 10.0, emoji: "🔴" },
  high: { label: "High", cvssMin: 7.0, cvssMax: 8.9, emoji: "🟠" },
  medium: { label: "Medium", cvssMin: 4.0, cvssMax: 6.9, emoji: "🟡" },
  low: { label: "Low", cvssMin: 0.1, cvssMax: 3.9, emoji: "🔵" },
  info: { label: "Info", cvssMin: 0.0, cvssMax: 0.0, emoji: "⚪" },
}

/**
 * Release gate decision based on severity
 */
export function shouldBlockRelease(findings: { severity: Severity }[]): boolean {
  return findings.some(f => f.severity === "critical" || f.severity === "high")
}

/**
 * Sort findings by severity (critical first)
 */
const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
}

export function sortBySeverity<T extends { severity: Severity }>(findings: T[]): T[] {
  return [...findings].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}
