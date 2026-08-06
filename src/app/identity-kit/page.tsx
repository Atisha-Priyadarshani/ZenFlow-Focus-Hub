import { Flower2, Palette, Type, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Identity Kit | Atisha Priyadarshani',
  description: 'Design System & Identity Kit for ZenFlow Capstone Workspace',
};

export default function IdentityKitPage() {
  const colors = [
    { name: 'Near-White BG (Light)', hex: '#FFF5F7', border: 'border-pink-300', bgClass: 'bg-[#FFF5F7]', textClass: 'text-[#701A75]' },
    { name: 'Near-Black BG (Dark)', hex: '#120A14', border: 'border-pink-900', bgClass: 'bg-[#120A14]', textClass: 'text-[#FFF1F2]' },
    { name: 'Primary Text', hex: '#701A75', border: 'border-purple-300', bgClass: 'bg-[#701A75]', textClass: 'text-white' },
    { name: 'Vibrant Accent', hex: '#EC4899', border: 'border-pink-400', bgClass: 'bg-[#EC4899]', textClass: 'text-white' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[var(--border-app)] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--border-card)] text-xs font-extrabold text-[#ec4899]">
          <Sparkles className="w-3.5 h-3.5" /> GENERAL AI FLUENCY — WEEK 3 ASSIGNMENT
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)]">
          Decide Once: Personal Identity Kit
        </h1>
        <p className="text-sm font-semibold text-[var(--text-muted)]">
          Curated Design System &amp; Brand Tokens for Atisha Priyadarshani
        </p>
      </div>

      {/* Grid: Fonts & Logo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fonts Card */}
        <div className="zenflow-card space-y-4">
          <div className="flex items-center gap-2 text-lg font-extrabold text-[var(--text-main)]">
            <Type className="w-5 h-5 text-[#ec4899]" /> Typography Choice
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] space-y-2">
            <div className="text-xs text-[var(--text-dim)] font-bold uppercase tracking-wider">Free Font Choice</div>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">Plus Jakarta Sans</div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Selected for both Headings (700/800 ExtraBold) and Body text (400/500 Medium). High-contrast geometric sans-serif that maintains crisp readability from 375px mobile screens up to 4K displays.
            </p>
          </div>
        </div>

        {/* Logo & Monogram Card */}
        <div className="zenflow-card space-y-4">
          <div className="flex items-center gap-2 text-lg font-extrabold text-[var(--text-main)]">
            <Flower2 className="w-5 h-5 text-[#ec4899]" /> Logo &amp; Monogram (Favicon)
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f472b6] to-[#ec4899] flex items-center justify-center text-white shadow-lg">
              <Flower2 className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-extrabold bg-gradient-to-r from-[#fbcfe8] via-[#f472b6] to-[#ec4899] bg-clip-text text-transparent">
                ZenFlow 🌸
              </div>
              <p className="text-xs text-[var(--text-muted)] font-semibold">
                Clean Cherry Blossom Monogram SVG
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Palette Section */}
      <div className="zenflow-card space-y-4">
        <div className="flex items-center gap-2 text-lg font-extrabold text-[var(--text-main)]">
          <Palette className="w-5 h-5 text-[#ec4899]" /> Tight 4-Color Palette
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div key={c.hex} className={`p-4 rounded-xl border ${c.border} ${c.bgClass} ${c.textClass} flex flex-col justify-between h-32 shadow-sm`}>
              <span className="text-xs font-extrabold uppercase opacity-90">{c.name}</span>
              <span className="text-lg font-mono font-extrabold tracking-wider">{c.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Line Style Note */}
      <div className="zenflow-card space-y-3 bg-[var(--badge-bg)] border-[var(--border-card)]">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#ec4899]">
          <CheckCircle2 className="w-4 h-4" /> Two-Line Style Note (Claude Project / System Prompt)
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-xs md:text-sm font-mono text-[var(--text-main)] leading-relaxed space-y-2">
          <p>
            <strong>Specs:</strong> Fonts: Plus Jakarta Sans (Headings &amp; Body) | Palette: #120A14 (Dark BG), #FFF5F7 (Light BG), #EC4899 (Cherry Accent), #701A75 (Primary Text).
          </p>
          <p>
            <strong>Mood:</strong> A modern, serene Cherry Blossom focus space engineered with high-contrast glassmorphic minimalism to evoke calm, disciplined deep work.
          </p>
        </div>
      </div>
    </div>
  );
}
