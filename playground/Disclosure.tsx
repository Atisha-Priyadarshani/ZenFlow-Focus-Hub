import React, { useState, ReactNode } from 'react';

export interface DisclosureProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Disclosure: React.FC<DisclosureProps> = ({
  id,
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="w-full border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`disclosure-panel-${id}`}
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left text-xs font-extrabold text-indigo-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform duration-200 text-indigo-400 font-bold ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          id={`disclosure-panel-${id}`}
          className="px-5 py-4 border-t border-slate-800 text-xs text-slate-300 space-y-2 animate-fade-in"
        >
          {children}
        </div>
      )}
    </div>
  );
};
