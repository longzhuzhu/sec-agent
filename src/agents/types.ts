import type { AgentConfig } from "@opencode-ai/sdk"

/**
 * Agent mode determines UI model selection behavior:
 * - "primary": Respects user's UI-selected model
 * - "subagent": Uses own fallback chain, ignores UI selection
 * - "all": Available in both contexts (TAB selection + delegation)
 */
export type AgentMode = "primary" | "subagent" | "all"

/**
 * Agent factory function with static mode property.
 */
export type AgentFactory = ((model: string) => AgentConfig) & {
  mode: AgentMode
}

/**
 * Security agent names
 */
export type SecAgentName =
  | "sec-agent"
  | "sec-design"
  | "sec-dev"
  | "sec-test"
  | "sec-gate"

/**
 * Security category for task classification
 */
export type SecurityCategory =
  | "threat-modeling"
  | "privacy-review"
  | "code-audit"
  | "security-fix"
  | "sast"
  | "dast"
  | "release-gate"

/**
 * Severity levels for security findings
 */
export type Severity = "critical" | "high" | "medium" | "low" | "info"

/**
 * Security finding structure
 */
export interface SecurityFinding {
  id: string
  severity: Severity
  category: SecurityCategory
  title: string
  description: string
  location?: string
  cwe?: string
  recommendation?: string
}

/**
 * Agent override configuration
 */
export type AgentOverrideConfig = Partial<AgentConfig> & {
  prompt_append?: string
  variant?: string
  fallback_models?: string | string[]
}

export type AgentOverrides = Partial<Record<SecAgentName, AgentOverrideConfig>>
