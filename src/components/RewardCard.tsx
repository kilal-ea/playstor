import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface RewardCardProps {
  value?: number;
  isSearching?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  value = 5,
  isSearching = false,
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none group">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-play-blue-500/30 via-play-blue-600/30 to-emerald-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />

      {/* Main Gift Card Frame */}
      <div className="relative aspect-[1.6/1] w-full rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0e61f2] via-[#0b50cc] to-[#063594] text-white shadow-2xl shadow-blue-950/25 border border-white/20 card-shine">
        
        {/* Subtle geometric background accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 rounded-full bg-play-green-500/15 blur-2xl pointer-events-none" />

        {/* Card Header: Brand title & security badge */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-wide text-white/95 drop-shadow-sm">
              Google Play
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-medium text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available</span>
          </div>
        </div>

        {/* Card Body: Big Value and Gift Card Label */}
        <div className="my-auto text-center z-10 py-1">
          <div className="inline-block transition-transform duration-300 group-hover:scale-105">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              ${value}
            </div>
            <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-blue-100/90 mt-1">
              Gift Card
            </div>
          </div>
        </div>

        {/* Card Footer: Chip / Security details */}
        <div className="flex items-center justify-between text-xs text-blue-100/75 z-10 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span className="text-[11px] font-medium">Digital Delivery</span>
          </div>

          <span className="text-[11px] tracking-wider uppercase font-mono text-white/70">
            {isSearching ? 'CHECKING...' : 'VERIFIED'}
          </span>
        </div>
      </div>
    </div>
  );
};
