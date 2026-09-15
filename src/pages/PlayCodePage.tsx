import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, TIMINGS } from '../config';
import { getRandomCode } from '../services/rewardsApi';
import { useRewardFlow } from '../hooks/useRewardFlow';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RewardCard } from '../components/RewardCard';
import { SearchAnimation } from '../components/SearchAnimation';
import { RewardCodeCard } from '../components/RewardCodeCard';
import { ErrorState } from '../components/ErrorState';
import { HowItWorksModal } from '../components/Modals/HowItWorksModal';
import { TermsModal } from '../components/Modals/TermsModal';
import { Ad, AD_KEYS } from '../components/Ad';
import {
  Sparkles,
  Shield,
  Gift,
  ArrowRight,
  RotateCcw,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ErrorStateInfo } from '../types';

// ==================== Constants ====================
const REWARD_FOUND_DELAY_SECONDS = 30;
const REDIRECT_AFTER_REVEAL_SECONDS = 60;

export const PlayCodePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    searchStepText,
    session,
    errorInfo: flowErrorInfo,
    isCopied: flowIsCopied,
    startSearch,
    unlockReward,
    copyCode,
    resetFlow,
  } = useRewardFlow();

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // ===== حالة عرض الكود بعد فتحه (UNLOCKED) =====
  const [countdown, setCountdown] = useState(REWARD_FOUND_DELAY_SECONDS);
  const [showCode, setShowCode] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(
    REDIRECT_AFTER_REVEAL_SECONDS
  );

  const isSearching = state === 'SEARCHING' || state === 'VERIFYING';
  const isUnlocked = state === 'UNLOCKED' && Boolean(session?.claimedCode);
  const isError =
    state === 'ERROR' || state === 'NO_REWARDS' || state === 'EXPIRED';

  // ==================== عدّاد قبل ظهور الكود ====================
  useEffect(() => {
    if (!isUnlocked) {
      setShowCode(false);
      setCountdown(REWARD_FOUND_DELAY_SECONDS);
      return;
    }

    if (showCode) return;

    setCountdown(REWARD_FOUND_DELAY_SECONDS);
    setShowCode(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowCode(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isUnlocked, showCode]);

  // ==================== عدّاد إعادة التوجيه ====================
  useEffect(() => {
    if (!showCode) return;

    setRedirectCountdown(REDIRECT_AFTER_REVEAL_SECONDS);

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // نظّف البيانات ثم أعد تعيين الحالة (بدون تغيير URL)
          sessionStorage.removeItem(STORAGE_KEYS.CLAIMED_CODE);
          sessionStorage.removeItem(STORAGE_KEYS.REWARD_VALUE);
          resetFlow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCode, resetFlow]);

  // ==================== نسخ الكود ====================
  const handleCopy = useCallback(() => {
    if (session?.claimedCode) {
      copyCode(session.claimedCode);
    }
  }, [session, copyCode]);

  return (
    <div className="min-h-screen flex flex-col bg-play-surface text-slate-800">
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* إعلان علوي */}
      <div className="w-full flex justify-center py-3 bg-slate-50 border-b border-slate-100">
        <Ad
          adKey={AD_KEYS.banner728x90.key}
          width={AD_KEYS.banner728x90.width}
          height={AD_KEYS.banner728x90.height}
          className="hidden md:flex"
        />
        <Ad
          adKey={AD_KEYS.banner320x50.key}
          width={AD_KEYS.banner320x50.width}
          height={AD_KEYS.banner320x50.height}
          className="flex md:hidden"
        />
      </div>

      {/* Body */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex gap-5 justify-center items-start">

          {/* Sidebar أيسر */}
          <aside className="hidden lg:block shrink-0 w-[160px]">
            <div className="sticky top-24 flex flex-col gap-6">
              <Ad
                adKey={AD_KEYS.skyscraper160x600.key}
                width={AD_KEYS.skyscraper160x600.width}
                height={AD_KEYS.skyscraper160x600.height}
              />
              <Ad
                adKey={AD_KEYS.halfPage160x300.key}
                width={AD_KEYS.halfPage160x300.width}
                height={AD_KEYS.halfPage160x300.height}
              />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 max-w-4xl min-w-0 flex flex-col justify-center">

            {/* ============ الحالة 1: الكود مفتوح ============ */}
            {isUnlocked && session?.claimedCode ? (
              showCode ? (
                /* ----- بعد 30 ثانية: عرض الكود ----- */
                <div className="space-y-6">
                  <RewardCodeCard
                    code={session.claimedCode}
                    value={session.value || 5}
                    isCopied={flowIsCopied}
                    onCopy={handleCopy}
                  />

                  {/* رسالة تحذيرية */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
                      If the card does not work, it is likely that someone else
                      has already used it. Please try again; new cards will be
                      added soon.
                    </p>
                  </div>

                  {/* إعلان مربع */}
                  <div className="flex justify-center pt-2">
                    <Ad
                      adKey={AD_KEYS.square300x250.key}
                      width={AD_KEYS.square300x250.width}
                      height={AD_KEYS.square300x250.height}
                    />
                  </div>

                  {/* عدّاد إعادة التعيين */}
                  <div className="text-center space-y-3 pt-2">
                    <p className="text-xs sm:text-sm text-slate-500">
                      Returning to rewards in{' '}
                      <span className="font-bold text-play-blue-600 tabular-nums">
                        {redirectCountdown}s
                      </span>
                    </p>

                    <div className="max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-play-blue-500 to-play-blue-700 rounded-full transition-all duration-1000 ease-linear"
                        style={{
                          width: `${
                            ((REDIRECT_AFTER_REVEAL_SECONDS -
                              redirectCountdown) /
                              REDIRECT_AFTER_REVEAL_SECONDS) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.removeItem(STORAGE_KEYS.CLAIMED_CODE);
                        sessionStorage.removeItem(STORAGE_KEYS.REWARD_VALUE);
                        resetFlow();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return now</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ----- عدّاد 30 ثانية قبل الكود ----- */
                <div className="max-w-md mx-auto w-full">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-play-blue-100/80 space-y-5 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-play-blue-50 border border-play-blue-100 flex items-center justify-center mx-auto text-play-blue-600 shadow-sm">
                      <Clock className="w-8 h-8 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        Preparing your code...
                      </h2>
                      <p className="text-slate-600 text-sm">
                        Please wait while we finalize your reward.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="text-5xl sm:text-6xl font-extrabold text-play-blue-600 tabular-nums">
                        {countdown}
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-play-blue-500 to-play-blue-700 rounded-full transition-all duration-1000 ease-linear"
                          style={{
                            width: `${
                              ((REWARD_FOUND_DELAY_SECONDS - countdown) /
                                REWARD_FOUND_DELAY_SECONDS) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        Do not close this page
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center pt-6">
                    <Ad
                      adKey={AD_KEYS.square300x250.key}
                      width={AD_KEYS.square300x250.width}
                      height={AD_KEYS.square300x250.height}
                    />
                  </div>
                </div>
              )
            ) : isError ? (
              /* ============ الحالة 2: خطأ ============ */
              flowErrorInfo && (
                <ErrorState
                  error={flowErrorInfo}
                  onRetry={
                    flowErrorInfo.type === 'UNAUTHORIZED'
                      ? () => navigate('/playcode/locker')
                      : resetFlow
                  }
                />
              )
            ) : (
              /* ============ الحالة 3: عادي / بحث ============ */
              <div className="space-y-8 sm:space-y-10 text-center">

                {/* Hero */}
                <div className="space-y-3 sm:space-y-4 max-w-xl mx-auto">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-white shadow-md border border-slate-100 text-2xl sm:text-3xl mx-auto transform transition-transform duration-300 hover:scale-105">
                    🎁
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                      Google Play Reward
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                      Check if a reward is available for you.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-play-blue-50/80 border border-play-blue-100 text-play-blue-700 text-xs sm:text-sm font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-play-blue-600" />
                    <span>Limited rewards available</span>
                  </div>
                </div>

                {/* بطاقة الهدية */}
                <div className="py-2">
                  <RewardCard
                    value={session?.value || 5}
                    isSearching={isSearching}
                  />
                </div>

                {/* منطقة تفاعلية */}
                <div className="max-w-md mx-auto w-full">
                  {isSearching ? (
                    <SearchAnimation statusText={searchStepText} />
                  ) : state === 'REWARD_FOUND' ? (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-play-blue-100/80 space-y-4 text-center animate-modal-scale">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-2xl shadow-sm">
                        🎉
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                          Reward Found
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                          A reward may be available for you.
                        </p>
                      </div>
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={unlockReward}
                          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-play-blue-600 to-play-blue-700 hover:from-play-blue-700 hover:to-play-blue-800 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-play-blue-600/25 transition duration-150 flex items-center justify-center gap-2"
                        >
                          <span>Unlock Reward</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="text-xs text-amber-700 font-medium">
                          Complete verification to securely claim your code
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startSearch}
                      disabled={isSearching}
                      className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-play-blue-600 via-play-blue-600 to-play-blue-700 hover:from-play-blue-700 hover:to-play-blue-800 active:scale-[0.98] text-white font-bold text-base sm:text-lg shadow-xl shadow-play-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-4 focus-visible:ring-play-blue-500/40"
                    >
                      <span>Find My Reward</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  )}
                </div>

                {/* إعلان مربع */}
                {!isSearching && state !== 'REWARD_FOUND' && (
                  <div className="flex justify-center pt-4">
                    <Ad
                      adKey={AD_KEYS.square300x250.key}
                      width={AD_KEYS.square300x250.width}
                      height={AD_KEYS.square300x250.height}
                    />
                  </div>
                )}

                {/* Trust badges */}
                <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Direct DB Claim</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-play-blue-600" />
                    <span>Genuine Codes</span>
                  </div>
                </div>
              </div>
            )}

            <HowItWorksModal
              isOpen={isHowItWorksOpen}
              onClose={() => setIsHowItWorksOpen(false)}
            />
            <TermsModal
              isOpen={isTermsOpen}
              onClose={() => setIsTermsOpen(false)}
            />
          </main>

          {/* Sidebar أيمن */}
          <aside className="hidden lg:block shrink-0 w-[160px]">
            <div className="sticky top-24 flex flex-col gap-6">
              <Ad
                adKey={AD_KEYS.skyscraper160x600.key}
                width={AD_KEYS.skyscraper160x600.width}
                height={AD_KEYS.skyscraper160x600.height}
              />
              <Ad
                adKey={AD_KEYS.halfPage160x300.key}
                width={AD_KEYS.halfPage160x300.width}
                height={AD_KEYS.halfPage160x300.height}
              />
            </div>
          </aside>

        </div>
      </div>

      {/* إعلان سفلي */}
      <div className="w-full flex flex-col items-center gap-4 py-5 bg-slate-50 border-t border-slate-100">
        <Ad
          adKey={AD_KEYS.banner468x60.key}
          width={AD_KEYS.banner468x60.width}
          height={AD_KEYS.banner468x60.height}
          className="hidden sm:flex"
        />
        <Ad
          adKey={AD_KEYS.banner320x50.key}
          width={AD_KEYS.banner320x50.width}
          height={AD_KEYS.banner320x50.height}
          className="flex sm:hidden"
        />
      </div>

      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsTermsOpen(true)}
        onOpenContact={() => setIsHowItWorksOpen(true)}
      />
    </div>
  );
};