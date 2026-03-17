import type { AgentConfig } from "@opencode-ai/sdk"
import type { SecAgentName, AgentOverrides } from "./types"
import type { AgentSource } from "./agent-builder"
import { buildAgent } from "./agent-builder"
import { createSecAgentAgent } from "./sec-agent"
import { createSecDesignAgent } from "./sec-design"
import { createSecDevAgent } from "./sec-dev"
import { createSecTestAgent } from "./sec-test"
import { createSecGateAgent } from "./sec-gate"

const agentSources: Record<SecAgentName, AgentSource> = {
  "sec-agent": createSecAgentAgent,
  "sec-design": createSecDesignAgent,
  "sec-dev": createSecDevAgent,
  "sec-test": createSecTestAgent,
  "sec-gate": createSecGateAgent,
}

export function createBuiltinAgents(
  disabledAgents: string[] = [],
  agentOverrides: AgentOverrides = {},
  systemDefaultModel?: string,
): Record<string, AgentConfig> {
  const result: Record<string, AgentConfig> = {}
  const disabledSet = new Set(disabledAgents.map(a => a.toLowerCase()))
  const model = systemDefaultModel ?? ""

  for (const [name, source] of Object.entries(agentSources)) {
    if (disabledSet.has(name.toLowerCase())) continue

    const config = buildAgent(source, model)
    const override = agentOverrides[name as SecAgentName]

    if (override) {
      if (override.model) config.model = override.model
      if (override.prompt_append) {
        config.prompt = (config.prompt ?? "") + "\n\n" + override.prompt_append
      }
      if (override.temperature !== undefined) config.temperature = override.temperature
      if (override.variant !== undefined) config.variant = override.variant
    }

    result[name] = config
  }

  return result
}
