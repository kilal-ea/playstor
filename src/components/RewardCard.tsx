import React from 'react';

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

      {/* Ambient Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-yellow-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-700" />

      {/* Main Card */}
      <div className="relative aspect-[1.6/1] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-2xl shadow-slate-900/15 border border-slate-200 transition-transform duration-300 group-hover:scale-[1.02]">

        {/* Top color strip (Google colors) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#FBBC04]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>

        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(66,133,244,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(52,168,83,0.08),transparent_60%)]" />

        {/* Card Content */}
        <div className="relative h-full p-5 sm:p-7 flex flex-col justify-between">

          {/* ===== Header: Google Play Logo ===== */}
          <div className="flex items-center justify-between">
            {/* Google Play Logo (SVG رسمي) */}
            <div className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 512 512"
                className="w-7 h-7 sm:w-8 sm:h-8"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Play Triangle Colors */}
                <path
                  fill="#00D2FF"
                  d="M47.6 33.7L270.5 256 47.6 478.3c-6.2-3.9-10.3-10.9-10.3-19V52.7c0-8.1 4.1-15.1 10.3-19z"
                />
                <path
                  fill="#00F076"
                  d="M353.2 173.1L79.1 33.7c-3.4-1.8-7.2-2.8-11.1-2.8L270.5 256 353.2 173.1z"
                />
                <path
                  fill="#FFCE00"
                  d="M353.2 338.9L270.5 256 68 481.1c3.9 0 7.7-1 11.1-2.8l274.1-139.4z"
                />
                <path
                  fill="#FF3A44"
                  d="M353.2 173.1L270.5 256l82.7 82.9 82.7-42.1c9.7-5.4 15.7-15.3 15.7-25.8 0-10.5-6-20.4-15.7-25.8l-82.7-42.1z"
                />
              </svg>

              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm sm:text-base text-slate-800 tracking-tight">
                  Google Play
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                  Gift Card
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                {isSearching ? 'Checking' : 'Active'}
              </span>
            </div>
          </div>

          {/* ===== Body: Value ===== */}
          <div className="text-center">
            <div className="inline-flex items-baseline gap-1 transition-transform duration-300 group-hover:scale-105">
              <span className="text-3xl sm:text-4xl font-bold text-slate-700">
                $
              </span>
              <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                {value}
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mt-1">
              Digital Code
            </div>
          </div>

          {/* ===== Footer ===== */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-[10px] sm:text-[11px] font-medium">
                Secure & Verified
              </span>
            </div>

            <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-400 uppercase">
              {isSearching ? '•••• ••••' : 'PLAY-••••-••••'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};