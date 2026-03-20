import { SECAGENT_COMMAND } from "./secagent"
import { SECDESIGN_COMMAND } from "./secdesign"

export { SECAGENT_COMMAND, SECDESIGN_COMMAND }

/** 所有 command 定义，键名即为斜杠命令名 */
export function createBuiltinCommands(): Record<string, { description: string; template: string; agent?: string }> {
  return {
    secagent: SECAGENT_COMMAND,
    secdesign: SECDESIGN_COMMAND,
  }
}
