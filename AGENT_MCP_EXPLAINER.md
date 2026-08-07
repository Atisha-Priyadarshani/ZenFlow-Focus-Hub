# FL-05 Explainer: Workflows, AI Agents, and Model Context Protocol (MCP)

> **General AI Fluency — Week 4 Assignment (Code: FL-05)**  
> **Student**: Friend / ZenFlow Team  
> **Word Count**: ~750 words  

---

## 1. Defining Workflows vs. AI Agents

The distinction between an **AI Workflow** and an **AI Agent** lies in **control flow and autonomy**.

* **AI Workflows**: Workflows follow a predefined, deterministic sequence of steps (e.g., Step A $\rightarrow$ Step B $\rightarrow$ Step C). The LLM is used as an intelligent processing node within a human-designed pipeline. In our FL-04 build, data is gathered, synthesized, and formatted in fixed linear order. The prompt sequence is fixed, and the system cannot decide to skip a step or call an unscripted external API based on intermediate results.

* **AI Agents**: Agents operate within a dynamic control loop (Reason $\rightarrow$ Act $\rightarrow$ Observe $\rightarrow$ Repeat). An agent is given a high-level goal (e.g., *"Optimize user task schedule and block distraction websites during deep work"*), access to tools, and an environment. The agent autonomously decides which tools to invoke, evaluates the output of those tool calls, handles errors dynamically, and continues until the goal is achieved.

### Classification of FL-04 Build:
Our FL-04 pipeline is strictly a **Workflow**. It executes 4 defined steps sequentially. It lacks autonomous tool choice and dynamic loop branching.

---

## 2. Understanding Model Context Protocol (MCP)

The **Model Context Protocol (MCP)**, developed by Anthropic, acts as an open standard ("USB-C port") connecting AI models to external tools, data sources, and services securely.

MCP introduces three fundamental primitives:
1. **Tools**: Functions exposed by the server that the AI can execute (e.g., `read_file`, `create_calendar_event`, `toggle_do_not_disturb`).
2. **Resources**: Data sources that the AI can read into context (e.g., local files, user calendars, task database).
3. **Prompts**: Reusable prompt templates provided by the server to guide interaction.

By standardizing how models discover and execute capabilities, MCP decouples model logic from custom integration code.

---

## 3. Evidence of Working MCP / Connector Setup

During our development workspace setup, we connected local file inspection tools (`view_file`, `list_dir`) and terminal execution tools (`run_command`) to our AI environment.

### 3 Non-Chat Tasks Performed via External Tools:
1. **Local Codebase File Inspection**:
   - *Task*: Read and inspect local `package.json` and TypeScript source files (`/src/app/api/chat/route.ts`) directly from the filesystem to verify Next.js dependencies.
   - *Proof*: Verified file content programmatically without requiring manual user copy-paste.

2. **Automated Production Build Verification**:
   - *Task*: Executed build scripts directly via terminal tool integration (`run_command`).
   - *Proof*: Programmatically verified static page generation and component compilation.

3. **Subsystem Log Diagnostics**:
   - *Task*: Checked background task execution logs to verify build completion and dependency status.
   - *Proof*: Extracted exact compiler output and error traces directly from local log files.

---

## 4. Upgrading FL-04 Workflow into a Full AI Agent

To transform our FL-04 productivity workflow into an autonomous **ZenFlow AI Agent**, the following upgrades are required:

1. **Equip MCP Productivity Tools**: Connect MCP tools for `create_google_calendar_event`, `block_distracting_urls`, and `trigger_breathing_timer`.
2. **Dynamic Decision Loop**: Instead of running a fixed 4-step chain, allow the agent to monitor active user focus metrics, detect burnout signals, and autonomously decide whether to schedule an immediate mindfulness break.
3. **Memory & Reflection**: Store past task completion rates in a database resource so the agent can accurately predict user task completion velocities.
