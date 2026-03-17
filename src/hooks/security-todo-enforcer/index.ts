/**
 * security-todo-enforcer hook
 * 确保安全修复任务全部完成
 */

export interface SecurityTodo {
  id: string
  description: string
  severity: string
  completed: boolean
}

export function createSecurityTodoEnforcer() {
  const todos: SecurityTodo[] = []

  return {
    name: "security-todo-enforcer" as const,

    addTodo(description: string, severity: string): string {
      const id = `SEC-${String(todos.length + 1).padStart(3, "0")}`
      todos.push({ id, description, severity, completed: false })
      return id
    },

    completeTodo(id: string): boolean {
      const todo = todos.find(t => t.id === id)
      if (todo) {
        todo.completed = true
        return true
      }
      return false
    },

    getPendingTodos(): SecurityTodo[] {
      return todos.filter(t => !t.completed)
    },

    enforceCompletion(): string | null {
      const pending = this.getPendingTodos()
      if (pending.length === 0) return null

      const criticalPending = pending.filter(t => t.severity === "critical" || t.severity === "high")
      const list = pending
        .map(t => `  - [${t.severity.toUpperCase()}] ${t.id}: ${t.description}`)
        .join("\n")

      const severity = criticalPending.length > 0 ? "⛔" : "⚠️"

      return `\n${severity} 安全修复任务未完成 (${pending.length} 项):
${list}
${criticalPending.length > 0 ? "存在 Critical/High 级别未完成项，建议优先处理。" : "建议在发布前完成所有安全修复。"}`
    },
  }
}
