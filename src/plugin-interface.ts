import type { CreatedHooks } from "./create-hooks"
import type { Managers } from "./create-managers"
import type { ToolsRecord } from "./create-tools"

export function createPluginInterface(args: {
  managers: Managers
  hooks: CreatedHooks
  tools: ToolsRecord
}) {
  const { managers, hooks, tools } = args

  return {
    tool: tools,

    config: managers.configHandler,

    "tool.execute.after": async (
      input: { tool: string; sessionID: string; callID: string; args: any },
      output: { title: string; output: string; metadata: any },
    ): Promise<void> => {
      // 不安全模式检测 (write/edit 后)
      if (hooks.unsafePatternDetector) {
        const content = input.args?.content ?? input.args?.new_string ?? ""
        if (typeof content === "string" && content.length > 0) {
          const warning = hooks.unsafePatternDetector.afterToolExecute(input.tool, input.args)
          if (warning) {
            output.output = (output.output ?? "") + warning
          }
        }
      }
    },

    "experimental.chat.messages.transform": async (
      _input: {},
      output: { messages: Array<{ info: any; parts: any[] }> },
    ): Promise<void> => {
      // 安全关键词检测
      if (!hooks.securityKeywordDetector) return
      if (!output.messages || output.messages.length === 0) return

      const lastMsg = output.messages[output.messages.length - 1]
      if (!lastMsg) return

      // 从 parts 中提取文本内容进行关键词检测
      const textParts = lastMsg.parts?.filter((p: any) => p.type === "text") ?? []
      for (const part of textParts) {
        if (typeof part.text === "string") {
          const { detectSecurityKeywords, buildSecurityContext } = await import("./hooks/security-keyword-detector")
          const keywords = detectSecurityKeywords(part.text)
          if (keywords.length > 0) {
            part.text = part.text + buildSecurityContext(keywords)
          }
        }
      }
    },
  }
}
