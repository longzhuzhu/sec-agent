import type { Config } from "@opencode-ai/sdk"
import type { SecAgentConfig } from "../config/schema/sec-agent-config"
import { createBuiltinAgents } from "../agents/builtin-agents"
import { createBuiltinCommands } from "../commands"
import { getAgentDisplayName } from "../shared/agent-display-names"
import { remapAgentKeysToDisplayNames } from "./agent-key-remapper"
import { reorderAgentsByPriority } from "./agent-priority-order"

export function createConfigHandler(deps: {
  pluginConfig: SecAgentConfig
  directory: string
}) {
  const { pluginConfig } = deps

  return async (config: Config) => {
    const currentModel = (config as any).model as string | undefined

    const builtinAgents = createBuiltinAgents(
      pluginConfig.disabled_agents,
      pluginConfig.agents,
      currentModel,
    )

    const existingAgents = config.agent ?? {}

    // 仅在用户显式配置了 default_agent 时才覆盖
    if (pluginConfig.default_agent) {
      ;(config as any).default_agent = getAgentDisplayName(pluginConfig.default_agent)
    }

    // Merge: existing config agents 优先，保留用户原有配置
    let mergedAgents: Record<string, unknown> = {
      ...builtinAgents,
      ...existingAgents,
    }

    // Remap keys to display names and reorder
    mergedAgents = remapAgentKeysToDisplayNames(mergedAgents)
    mergedAgents = reorderAgentsByPriority(mergedAgents)

    ;(config as any).agent = mergedAgents

    // 注册 commands（/secagent, /secdesign）
    const existingCommands = ((config as any).command ?? {}) as Record<string, unknown>
    const builtinCommands = createBuiltinCommands()
    ;(config as any).command = {
      ...existingCommands,
      ...builtinCommands,
    }
  }
}
