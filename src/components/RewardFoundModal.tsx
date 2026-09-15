import React from 'react';
import { ArrowRight, Clock, X } from 'lucide-react';

interface RewardFoundModalProps {
  isOpen: boolean;
  onOpenReward: () => void;
  onClose?: () => void;
}

export const RewardFoundModal: React.FC<RewardFoundModalProps> = ({
  isOpen,
  onOpenReward,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-modal-scale text-center overflow-hidden">
        
        {/* Optional close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Celebration Emoji / Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl shadow-sm mb-4">
          🎉
        </div>

        {/* Modal Title & Value */}
        <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Reward Found
        </h2>

        {/* Informative Subtext */}
        <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
          A reward may be available for you.
        </p>

        {/* Action Button */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onOpenReward}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-play-blue-600 to-play-blue-700 hover:from-play-blue-700 hover:to-play-blue-800 active:scale-[0.98] text-white font-semibold text-base shadow-lg shadow-play-blue-600/25 transition duration-150 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-play-blue-500/30"
          >
            <span>Unlock Reward</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Availability note */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Limited availability – Claim before timeout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
