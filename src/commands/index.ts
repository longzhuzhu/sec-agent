import { SECAGENT_COMMAND } from "./secagent"
import { SECDESIGN_COMMAND } from "./secdesign"
import { SECDEV_COMMAND } from "./secdev"
import { SECTEST_COMMAND } from "./sectest"
import { SECGATE_COMMAND } from "./secgate"

export { SECAGENT_COMMAND, SECDESIGN_COMMAND, SECDEV_COMMAND, SECTEST_COMMAND, SECGATE_COMMAND }

/** 所有 command 定义，键名即为斜杠命令名 */
export function createBuiltinCommands(): Record<string, { description: string; template: string; agent?: string }> {
  return {
    secagent: SECAGENT_COMMAND,
    secdesign: SECDESIGN_COMMAND,
    secdev: SECDEV_COMMAND,
    sectest: SECTEST_COMMAND,
    secgate: SECGATE_COMMAND,
  }
}
