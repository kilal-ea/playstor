import React from 'react';
import { Gift } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks?: () => void;
  onOpenTerms?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHowItWorks, onOpenTerms }) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-play-blue-700 via-play-blue-600 to-play-blue-500 flex items-center justify-center shadow-sm shadow-play-blue-500/20 text-white">
            <Gift className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
              Play Reward
            </span>
          </div>
        </div>

        {/* Informative Links (No auth / No profiles) */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Quick links">
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-play-blue-600 hover:bg-play-blue-50/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-play-blue-500"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={onOpenTerms}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-play-blue-600 hover:bg-play-blue-50/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-play-blue-500"
          >
            Terms
          </button>
        </nav>
      </div>
    </header>
  );
};
