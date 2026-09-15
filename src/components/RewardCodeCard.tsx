import React, { useEffect } from 'react';
import { Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardCodeCardProps {
  code: string;
  value?: number;
  isCopied: boolean;
  onCopy: () => void;
}

export const RewardCodeCard: React.FC<RewardCodeCardProps> = ({
  code,
  value = 5,
  isCopied,
  onCopy,
}) => {
  // Fire confetti celebration upon code unlock
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0b57d0', '#01875f', '#ea4335', '#fbbc04'],
      });
    } catch {
      // Confetti fallback safely ignored
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reward Unlocked</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reward Unlocked
        </h2>
        <p className="text-slate-600 text-sm">
          Your Google Play reward is ready.
        </p>
        <p className="text-base font-bold text-play-blue-600">
          ${value} Gift Card
        </p>
      </div>

      {/* Code Container Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="reward-code-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-center"
          >
            Your Google Play Code
          </label>

          {/* Monospaced Code Display */}
          <div className="relative group">
            <div className="w-full py-4 px-3 sm:px-4 rounded-2xl bg-slate-50 border-2 border-dashed border-play-blue-200 text-center font-mono text-base sm:text-xl font-bold tracking-wider text-slate-800 select-all transition-colors group-hover:border-play-blue-400">
              {code}
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={onCopy}
          aria-label={isCopied ? 'Code copied' : 'Copy code to clipboard'}
          className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
            isCopied
              ? 'bg-emerald-600 text-white shadow-emerald-600/20 scale-[0.99]'
              : 'bg-play-blue-600 hover:bg-play-blue-700 active:scale-[0.98] text-white shadow-play-blue-600/20'
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>✓ Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 stroke-[2]" />
              <span>Copy Code</span>
            </>
          )}
        </button>

        {/* How to redeem hint */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-xs text-slate-500">
          <span>Redeem directly on Google Play Store</span>
          <a
            href="https://play.google.com/redeem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-play-blue-600 hover:underline inline-flex items-center gap-0.5 ml-1"
          >
            <span>play.google.com/redeem</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
