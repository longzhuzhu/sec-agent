import type { Plugin } from "@opencode-ai/plugin"
import type { HookName } from "./config/schema/sec-agent-config"

import { loadPluginConfig } from "./plugin-config"
import { createHooks } from "./create-hooks"
import { createTools } from "./create-tools"
import { createManagers } from "./create-managers"
import { createPluginInterface } from "./plugin-interface"

const SecAgentPlugin: Plugin = async (ctx) => {
  const pluginConfig = loadPluginConfig(ctx.directory)
  const disabledHooks = new Set(pluginConfig.disabled_hooks ?? [])

  const isHookEnabled = (hookName: HookName): boolean => !disabledHooks.has(hookName)

  const managers = createManagers({
    pluginConfig,
    directory: ctx.directory,
  })

  const tools = createTools()

  const hooks = createHooks({
    pluginConfig,
    isHookEnabled,
  })

  return createPluginInterface({
    managers,
    hooks,
    tools,
  })
}

export default SecAgentPlugin

export type { SecAgentConfig, HookName } from "./config/schema/sec-agent-config"
export type { SecAgentName, SecurityCategory, Severity, SecurityFinding } from "./agents/types"
