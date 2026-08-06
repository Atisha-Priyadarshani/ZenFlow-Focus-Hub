import Image from 'next/image';
import { Image as ImageIcon, CheckCircle2, XCircle, Sparkles, Sliders } from 'lucide-react';

export const metadata = {
  title: 'Image Curation Report | Atisha Priyadarshani',
  description: 'Visual Discernment & Asset Curation Report for ZenFlow Capstone Workspace',
};

export default function CurationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[var(--border-app)] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-card)] text-xs font-extrabold text-[#ec4899]">
          <Sparkles className="w-3.5 h-3.5" /> GENERAL AI FLUENCY — WEEK 3 ASSIGNMENT
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)]">
          Kill Your Darlings: Image Curation Report
        </h1>
        <p className="text-sm font-semibold text-[var(--text-muted)]">
          Visual Discernment, Asset Curation &amp; Real Code Proof for Atisha Priyadarshani
        </p>
      </div>

      {/* Need Map */}
      <div className="zenflow-card space-y-4">
        <h2 className="text-lg font-extrabold text-[var(--text-main)] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#ec4899]" /> Portfolio Image Need Map
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-card)] bg-[var(--bg-input)]">
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Need Category</th>
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Asset Type</th>
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Selection / Source</th>
                <th className="p-3 font-extrabold text-[var(--text-muted)] uppercase text-[11px]">Curation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-card)]">
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">Product UI Proof</td>
                <td className="p-3 text-[var(--text-dim)] font-semibold">Real Code Capture</td>
                <td className="p-3 text-[var(--text-main)]">ZenFlow React App UI</td>
                <td className="p-3 text-[var(--text-muted)]">Proves functional React state, actual timer intervals, and real CSS layout math rather than fake AI mockups.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">System Health</td>
                <td className="p-3 text-[var(--text-dim)] font-semibold">Real Code Capture</td>
                <td className="p-3 text-[var(--text-main)]">Live /health Server Component</td>
                <td className="p-3 text-[var(--text-muted)]">Proves live API data-fetching &amp; Next.js 15 App Router architecture.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">Connective Tissue</td>
                <td className="p-3 text-[var(--text-dim)] font-semibold">AI Generated Asset</td>
                <td className="p-3 text-[var(--text-main)]">Obsidian Blossom Banner</td>
                <td className="p-3 text-[var(--text-muted)]">Provides a calm background texture matching our Identity Kit palette (#120A14, #EC4899).</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[var(--text-main)]">Personal Author</td>
                <td className="p-3 text-[var(--text-dim)] font-semibold">Real Photography</td>
                <td className="p-3 text-[var(--text-main)]">Developer Portrait</td>
                <td className="p-3 text-[var(--text-muted)]">Establishes authentic personal identity and genuine project authorship.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Matrix Grid */}
      <div className="zenflow-card space-y-4">
        <h2 className="text-lg font-extrabold text-[var(--text-main)] flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#ec4899]" /> Visual Discernment &amp; Rejection Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rejected Asset */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-red-500 text-white font-extrabold text-xs flex items-center gap-1 w-fit">
              <XCircle className="w-4 h-4" /> REJECTED AI GENERATION
            </span>
            <div className="relative w-full h-44 rounded-lg overflow-hidden border border-red-500/20">
              <Image src="/rejected_ai_image.png" alt="Rejected AI Asset" fill className="object-cover" />
            </div>
            <div className="text-sm font-bold text-red-400">Hyper-Neon 3D Ribbon Texture</div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              <strong>Why Rejected:</strong> The harsh cyan lens flares and dense glossy 3D ribbons created extreme visual clutter. It violated our Identity Kit rule: <em>&quot;calm enough that your work is the loudest thing on the page&quot;</em>.
            </p>
          </div>

          {/* Kept Asset */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1 w-fit">
              <CheckCircle2 className="w-4 h-4" /> CURATED KEEPER (AI HERO)
            </span>
            <div className="relative w-full h-44 rounded-lg overflow-hidden border border-emerald-500/20">
              <Image src="/curated_hero_bg.png" alt="Curated Hero Asset" fill className="object-cover" />
            </div>
            <div className="text-sm font-bold text-emerald-400">Obsidian Blossom Header</div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              <strong>Why Kept:</strong> Subtle ambient pink wave lighting on deep obsidian plum background. Restrained, elegant, and frames the UI content without competing with it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
