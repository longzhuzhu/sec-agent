import * as fs from "node:fs"
import * as path from "node:path"
import { SecAgentConfigSchema, type SecAgentConfig } from "./config/schema/sec-agent-config"

function parseJsonc<T>(content: string): T {
  // 移除 JSONC 注释
  const stripped = content
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
  return JSON.parse(stripped) as T
}

function getOpenCodeConfigDir(): string {
  return path.join(process.env.HOME ?? "~", ".config", "opencode")
}

export function loadPluginConfig(directory: string): SecAgentConfig {
  const configDir = getOpenCodeConfigDir()
  const userConfigPath = path.join(configDir, "sec-agent.json")
  const projectConfigPath = path.join(directory, ".opencode", "sec-agent.json")

  let config: SecAgentConfig = {}

  config = loadConfigFromPath(userConfigPath) ?? config

  const projectConfig = loadConfigFromPath(projectConfigPath)
  if (projectConfig) {
    config = {
      ...config,
      ...projectConfig,
      disabled_agents: [
        ...new Set([
          ...(config.disabled_agents ?? []),
          ...(projectConfig.disabled_agents ?? []),
        ]),
      ],
      disabled_hooks: [
        ...new Set([
          ...(config.disabled_hooks ?? []),
          ...(projectConfig.disabled_hooks ?? []),
        ]),
      ],
    }
  }

  return config
}

function loadConfigFromPath(configPath: string): SecAgentConfig | null {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, "utf-8")
      const rawConfig = parseJsonc<Record<string, unknown>>(content)
      const result = SecAgentConfigSchema.safeParse(rawConfig)
      if (result.success) {
        return result.data
      }
    }
  } catch {
    // 配置文件不存在或解析失败，使用默认配置
  }
  return null
}
