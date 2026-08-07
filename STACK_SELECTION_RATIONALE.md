# Three Roads: Tech Stack Choice & Rationale

> **General AI Fluency — Week 4 Assignment**  
> **Student**: Friend / ZenFlow Team  
> **Project**: ZenFlow — Mindfulness & Task Flow Workspace  

---

## 1. Project Constraints & Needs Map

Before choosing a technology stack, four hard constraints were evaluated:
1. **Cost Constraint**: $0 (100% free hosting and open-source tooling required).
2. **Skill Level & Maintainability**: Experienced with React 18, TypeScript, and Next.js App Router.
3. **Display Requirements**: Needs live interactive component demos, embedded mindfulness focus cards, responsive task lists, code repository links, and fast rendering.
4. **Backend Necessity**: Dynamic API server routes required for Server-Sent Events (SSE) token streaming and server-side secret API key security.

---

## 2. Evaluation of 3 Stack Options (Simplest to Most Powerful)

### Option 1: Static HTML / Vanilla CSS + GitHub Pages (Simplest)
- **Architecture**: Plain HTML5, Tailwind CDN, vanilla JS scripts.
- **Hosting**: GitHub Pages (Free).
- **Backend Required**: No.
- **Trade-off Analysis**: Cannot securely call LLM APIs or handle streaming server responses without leaking API keys directly in client-side JavaScript.

### Option 2: React + Vite + Netlify (Moderate)
- **Architecture**: Single Page Application (SPA) using React 18, TypeScript, Vite, and Netlify serverless functions.
- **Hosting**: Netlify Free Tier.
- **Backend Required**: Netlify Functions for API calls.
- **Trade-off Analysis**: Excellent developer experience, but serverless streaming requires extra configuration boilerplate compared to unified framework routing.

### Option 3: Next.js 15 App Router + TypeScript + Vercel (Chosen & Most Powerful)
- **Architecture**: Next.js 15 App Router, React 19, Server Components by default, Tailwind CSS, and Web Streams API.
- **Hosting**: Vercel Free Tier.
- **Backend Required**: Yes (Next.js Route Handlers in `/app/api/`).
- **Trade-off Analysis**: Requires disciplined Server vs Client Component separation, but natively provides secure server-side API execution, token-by-token streaming, and automatic Vercel preview builds.

---

## 3. Pressure-Test & Final Rationale

### Why Option 3 (Next.js 15 + Vercel) Was Selected:
> *"I chose Next.js 15 App Router hosted on Vercel because it fulfills both my frontend display needs and my backend security needs without incurring any costs. By utilizing Next.js API Route Handlers, my LLM API keys remain 100% server-side while delivering real-time streaming chat responses directly to the client."*

### What I Maintained vs. Alternatives Considered:
- **Discarded Option 1**: Rejected static HTML because mindfulness apps require interactive state management and secure server-side API calls.
- **Discarded Option 2**: Rejected React + Vite because Next.js App Router integrates route handlers natively in the same codebase.
- **Maintainability Verdict**: **High**. Zero infrastructure overhead, zero hosting costs, and production-grade architecture.
