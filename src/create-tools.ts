import { tool } from "@opencode-ai/plugin"

// 使用 tool.schema (SDK 内置兼容的 zod) 而非直接导入 zod
const z = tool.schema

export type ToolsRecord = Record<string, ReturnType<typeof tool>>

/**
 * sec-scan tool — 执行安全代码扫描
 */
function createSecScanTool() {
  return tool({
    description: "执行安全代码扫描，检测 OWASP Top 10 和 CWE 漏洞。支持多种语言的静态分析。",
    args: {
      target: z.string().describe("扫描目标路径（文件或目录）"),
      rules: z.string().optional().describe("扫描规则集: owasp-top10 | cwe-top25 | secrets | all"),
    },
    async execute(args) {
      const rules = args.rules ?? "all"
      return `安全扫描已启动\n目标: ${args.target}\n规则集: ${rules}\n请使用 Bash 工具执行具体的扫描命令（如 semgrep, bandit 等）。`
    },
  })
}

/**
 * dep-audit tool — 依赖漏洞扫描
 */
function createDepAuditTool() {
  return tool({
    description: "扫描项目依赖的已知安全漏洞（SCA）。支持 npm, pip, cargo 等包管理器。",
    args: {
      package_manager: z.string().describe("包管理器类型: npm | pip | cargo | go | yarn | pnpm | bun"),
      path: z.string().optional().describe("项目路径"),
    },
    async execute(args) {
      const pm = args.package_manager as string
      const cmds: Record<string, string> = {
        npm: "npm audit --json",
        yarn: "yarn audit --json",
        pnpm: "pnpm audit --json",
        bun: "bun pm audit",
        pip: "pip-audit --format json",
        cargo: "cargo audit --json",
        go: "govulncheck ./...",
      }
      const cmd = cmds[pm] ?? `${pm} audit`
      return `依赖审计命令:\n\`\`\`bash\n${cmd}\n\`\`\`\n请使用 Bash 工具执行上述命令进行依赖漏洞扫描。`
    },
  })
}

/**
 * secret-scan tool — 密钥泄露检测
 */
function createSecretScanTool() {
  return tool({
    description: "扫描代码中的硬编码密钥、Token、证书等敏感信息。",
    args: {
      target: z.string().describe("扫描目标路径"),
      include_entropy: z.boolean().optional().describe("是否包含高熵字符串检测"),
    },
    async execute(args) {
      const entropy = args.include_entropy ?? false
      return `密钥扫描已配置\n目标: ${args.target}\n熵分析: ${entropy ? "启用" : "禁用"}\n请使用 Grep 工具配合安全模式正则表达式进行扫描。`
    },
  })
}

/**
 * sec-report tool — 安全报告生成
 */
function createSecReportTool() {
  return tool({
    description: "生成安全评估报告（Markdown/SARIF 格式），汇总所有安全发现。",
    args: {
      format: z.string().describe("报告格式: markdown | sarif"),
      output_path: z.string().optional().describe("报告输出路径"),
      title: z.string().optional().describe("报告标题"),
    },
    async execute(args) {
      const outputPath = args.output_path ?? ".sec-agent/reports/"
      const title = args.title ?? "Security Assessment Report"
      return `安全报告生成\n格式: ${args.format}\n输出: ${outputPath}\n标题: ${title}\n请使用 Write 工具将报告内容写入指定路径。`
    },
  })
}

export function createTools(): ToolsRecord {
  return {
    sec_scan: createSecScanTool(),
    dep_audit: createDepAuditTool(),
    secret_scan: createSecretScanTool(),
    sec_report: createSecReportTool(),
  }
}
