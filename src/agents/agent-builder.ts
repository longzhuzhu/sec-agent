import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentFactory } from "./types"

export type AgentSource = AgentFactory | AgentConfig

export function isFactory(source: AgentSource): source is AgentFactory {
  return typeof source === "function"
}

export function buildAgent(source: AgentSource, model: string): AgentConfig {
  return isFactory(source) ? source(model) : { ...source }
}
