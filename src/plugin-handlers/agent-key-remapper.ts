import { AGENT_DISPLAY_NAMES } from "../shared/agent-display-names"

/**
 * Remap agent config keys to their display names for UI rendering
 */
export function remapAgentKeysToDisplayNames(
  agents: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(agents)) {
    const displayName = AGENT_DISPLAY_NAMES[key]
    if (displayName && key !== displayName) {
      result[displayName] = value
    } else {
      result[key] = value
    }
  }

  return result
}
