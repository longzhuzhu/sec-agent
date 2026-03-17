import { getAgentDisplayName } from "../shared/agent-display-names"

/**
 * Core agent TAB ordering — agents appear in this order in the UI
 */
const CORE_AGENT_ORDER = [
  getAgentDisplayName("sec-agent"),
  getAgentDisplayName("sec-design"),
  getAgentDisplayName("sec-dev"),
  getAgentDisplayName("sec-test"),
  getAgentDisplayName("sec-gate"),
] as const

export function reorderAgentsByPriority(
  agents: Record<string, unknown>,
): Record<string, unknown> {
  const ordered: Record<string, unknown> = {}
  const seen = new Set<string>()

  for (const key of CORE_AGENT_ORDER) {
    if (Object.prototype.hasOwnProperty.call(agents, key)) {
      ordered[key] = agents[key]
      seen.add(key)
    }
  }

  for (const [key, value] of Object.entries(agents)) {
    if (!seen.has(key)) {
      ordered[key] = value
    }
  }

  return ordered
}
