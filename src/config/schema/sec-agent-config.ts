import { z } from "zod"

export const SecAgentNameSchema = z.enum([
  "sec-agent",
  "sec-design",
  "sec-dev",
  "sec-test",
  "sec-gate",
])

export const SecurityCategorySchema = z.enum([
  "threat-modeling",
  "privacy-review",
  "code-audit",
  "security-fix",
  "sast",
  "dast",
  "release-gate",
])

export const HookNameSchema = z.enum([
  "security-keyword-detector",
  "secret-leak-guard",
  "unsafe-pattern-detector",
  "pre-commit-security-scan",
  "dependency-audit-reminder",
  "security-report-generator",
  "security-todo-enforcer",
])

export type HookName = z.infer<typeof HookNameSchema>

export const AgentOverrideSchema = z.object({
  model: z.string().optional(),
  prompt: z.string().optional(),
  prompt_append: z.string().optional(),
  temperature: z.number().optional(),
  variant: z.string().optional(),
}).passthrough()

export const SecAgentConfigSchema = z.object({
  $schema: z.string().optional(),
  disabled_agents: z.array(SecAgentNameSchema).optional(),
  disabled_hooks: z.array(HookNameSchema).optional(),
  agents: z.record(SecAgentNameSchema, AgentOverrideSchema).optional(),
  reports_dir: z.string().optional(),
  default_agent: SecAgentNameSchema.optional(),
})

export type SecAgentConfig = z.infer<typeof SecAgentConfigSchema>
