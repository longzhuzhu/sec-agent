import type { SecAgentConfig } from "./config/schema/sec-agent-config"
import { createConfigHandler } from "./plugin-handlers/config-handler"

export type Managers = {
  configHandler: ReturnType<typeof createConfigHandler>
}

export function createManagers(args: {
  pluginConfig: SecAgentConfig
  directory: string
}): Managers {
  const { pluginConfig, directory } = args

  const configHandler = createConfigHandler({
    pluginConfig,
    directory,
  })

  return {
    configHandler,
  }
}
