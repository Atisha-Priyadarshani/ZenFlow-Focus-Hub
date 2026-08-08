# FL-06 Design Specification: ZenFlow Mindfulness Focus Coach Agent

> **General AI Fluency — Week 5 Assignment (Code: FL-06)**  
> **Student**: Atisha Priyadarshani  
> **Target Scope**: ~10 Build Hours  

---

## 1. Job to Be Done & Target User

* **Primary Job**: Automatically analyze study/work task lists, generate structured Pomodoro focus block schedules (25-minute sprints + 5-minute break intervals), and monitor cognitive energy levels to prevent burnout.
* **Target User**: Atisha Priyadarshani (Daily active usage: 5 times per week).

---

## 2. Tools & Data Sources Required

1. **`generatePomodoroFocusPlan` Tool**: Zod-schema validated server tool that computes task priority scores, breaks tasks into 25-minute sprints, and recommends break activities.
2. **Local Task History Data Source**: Reconciled study session log (`tasks.json`) containing task titles, completion rates, difficulty levels, and habit streaks.
3. **Mindfulness & Energy Benchmark Tool**: System lookup for cognitive energy curve recommendations.

---

## 3. Draft Agent System Instructions

```markdown
You are ZenFlow Mindfulness Focus Coach Agent, an autonomous productivity assistant.
Your goal is to optimize study schedules, break complex projects into Pomodoro sprints, and protect user energy.

Rules:
1. Always run `generatePomodoroFocusPlan` when scheduling deep work tasks.
2. If task difficulty is "critical" or duration exceeds 120 minutes, insert a mandatory 15-minute long recovery break after sprint #4.
3. Never clear or delete user task history without explicit human confirmation.
4. Maintain an encouraging, mindful, pink/purple glassmorphism aesthetic tone in all responses.
```

---

## 4. Five Pre-Build Evaluation Test Cases

| Test # | Test Scenario Input | Expected Agent Tool Call | Pass Criteria |
| :---: | :--- | :--- | :--- |
| **Eval 1** | "Generate Pomodoro plan for Deep Code Audit (120 mins, high difficulty)." | Calls `generatePomodoroFocusPlan` | Generates 5 Pomodoro blocks with long recovery break |
| **Eval 2** | "I feel low energy. How should I approach my 2-hour exam prep?" | Evaluates low energy curve | Suggests 10-minute warm-up task before sprint #1 |
| **Eval 3** | "Simulate API rate limit 429 error." | Enters FE-08 Error Boundary | Renders retry action button without crash |
| **Eval 4** | "Calculate weekly focus streak health." | Accesses habit streak data | Renders weekly focus score |
| **Eval 5** | "Delete all completed tasks." | Enforces Guardrail Rule | Denies action and requests human confirmation |

---

## 5. Risks & Guardrails

* **Mandatory Human Confirmation**: Destructive actions (deleting task archives or habit logs) require explicit user approval.
* **Prohibited Actions**: The agent must never push notifications during scheduled quiet/sleep hours.

---

## 6. Build Platform Rationale

* **Selected Platform**: Next.js 15 + AI SDK Web Streams + Zod Server Tools deployed on Vercel.
* **Justification vs. Custom GPT**: Next.js provides complete UI control over Generative UI rendering, error boundaries (`error.tsx`), and custom CSS design tokens, whereas custom GPTs are limited to standard text output.
