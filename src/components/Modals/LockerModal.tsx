import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LOCKER_URL = 'https://trkoffer.net/cl/i/ved83x';
const ZOOM_FACTOR = 0.5;         // تصغير 50% (من الرد السابق)
const CONTENT_SCALE = 1.4;       // ← إزالة 20% إضافية

interface LockerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUnlock?: () => void;
}

export const LockerModal: React.FC<LockerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setIframeLoaded(false);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // ===== الحسابات =====
  // إجمالي التصغير = ZOOM_FACTOR × CONTENT_SCALE
  const totalScale = ZOOM_FACTOR * CONTENT_SCALE; // 0.5 × 0.8 = 0.4
  const widthPercent = `${100 / totalScale}%`;    // 250%
  const heightPercent = `${100 / totalScale}%`;   // 250%

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden w-[95vw] sm:w-[70vw]"
        style={{
          maxWidth: '1400px',
          height: '90dvh',
          maxHeight: '90dvh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 sm:px-8 pt-5 pb-3 text-center space-y-1 shrink-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Complete Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Please complete the offer below to unlock your reward.
            </p>
          </div>

          {/* iframe container */}
          <div className="flex-1 px-3 sm:px-4 pb-4 min-h-0">
            <div
              className="relative mx-auto bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
              style={{ width: '96%', height: '96%' }}
            >
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-10">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">Loading offer...</p>
                </div>
              )}

              <iframe
                src={LOCKER_URL}
                title="Offer Locker"
                className="border-0"
                onLoad={() => setIframeLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: widthPercent,
                  height: heightPercent,
                  transform: `scale(${totalScale})`,
                  transformOrigin: 'top left',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};