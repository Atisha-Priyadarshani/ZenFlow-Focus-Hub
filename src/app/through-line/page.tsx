import { Target, MapPin, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'The Through-Line: Map Content & CTAs | Atisha Priyadarshani',
  description: 'Portfolio Architecture & Content Map for ZenFlow Capstone Workspace',
};

export default function ThroughLinePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[var(--border-app)] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-card)] text-xs font-extrabold text-[#ec4899]">
          <Sparkles className="w-3.5 h-3.5" /> GENERAL AI FLUENCY — WEEK 3 ASSIGNMENT
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)]">
          The Through-Line: Map Content &amp; CTAs
        </h1>
        <p className="text-sm font-semibold text-[var(--text-muted)]">
          Portfolio Architecture, Section Hierarchy &amp; Proof Inventory for Atisha Priyadarshani
        </p>
      </div>

      {/* One-Line Claim */}
      <div className="zenflow-card space-y-3 bg-[var(--badge-bg)] border-[var(--border-card)]">
        <h2 className="text-base font-extrabold text-[#ec4899] flex items-center gap-2">
          <Target className="w-5 h-5" /> The One-Line Claim
        </h2>
        <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-center text-lg md:text-xl font-extrabold text-[var(--text-main)] leading-relaxed">
          &ldquo;I engineer production-grade Next.js focus &amp; analytical workspaces powered by disciplined AI workflows and quantitative precision.&rdquo;
        </div>
      </div>

      {/* Content Map */}
      <div className="zenflow-card space-y-4">
        <h2 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#ec4899]" /> Content Map &amp; Call to Action (CTA) Hierarchy
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-card)] bg-[var(--bg-input)]">
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Page</th>
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Ordered Sections</th>
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Featured Case Study</th>
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Call to Action (CTA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-card)]">
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">Home (/)</td>
                <td className="p-3 text-[var(--text-dim)] font-medium">1. Hero Banner<br />2. Flagship Case<br />3. Live Diagnostics</td>
                <td className="p-3 text-[var(--text-main)]">ZenFlow Focus Hub (Next.js 15)</td>
                <td className="p-3 text-[#ec4899] font-bold">&ldquo;Schedule Technical Interview&rdquo;</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">ZenFlow Case</td>
                <td className="p-3 text-[var(--text-dim)] font-medium">1. Context &amp; Problem<br />2. AI Prompting Log<br />3. Vitest Proof</td>
                <td className="p-3 text-[var(--text-main)]">ZenFlow Focus Hub</td>
                <td className="p-3 text-[#ec4899] font-bold">&ldquo;Try Live ZenFlow App&rdquo;</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">Vitta Case</td>
                <td className="p-3 text-[var(--text-dim)] font-medium">1. Financial SLA Logic<br />2. Custom Hooks<br />3. Vitest Validation</td>
                <td className="p-3 text-[var(--text-main)]">Vitta Financial Analytics</td>
                <td className="p-3 text-[#ec4899] font-bold">&ldquo;Review Source Code&rdquo;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Still Need to Gather List */}
      <div className="zenflow-card space-y-4">
        <h2 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> &ldquo;Still Need to Gather&rdquo; List (Proof Inventory)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-main)]">Vercel Live Preview Deployment</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> COMPLETE
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-main)]">Vitest Unit Test Execution Proof</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> COMPLETE
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-main)]">Lighthouse Performance Audit Score</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white flex items-center gap-1">
              <Clock className="w-3 h-3" /> IN PROGRESS
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-main)]">Peer Feedback Testimonial Quote</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white flex items-center gap-1">
              <Clock className="w-3 h-3" /> PENDING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
