import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, TIMINGS } from '../config';
import { getRandomCode } from '../services/rewardsApi';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RewardCodeCard } from '../components/RewardCodeCard';
import { ErrorState } from '../components/ErrorState';
import { SearchAnimation } from '../components/SearchAnimation';
import { HowItWorksModal } from '../components/Modals/HowItWorksModal';
import { TermsModal } from '../components/Modals/TermsModal';
import { Ad, AD_KEYS } from '../components/Ad';
import { RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { ErrorStateInfo } from '../types';

// ==================== Constants ====================
const CODE_REVEAL_DELAY_SECONDS = 30;
const REDIRECT_AFTER_REVEAL_SECONDS = 60;

export const CodePage: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [code, setCode] = useState<string | null>(null);
  const [value, setValue] = useState<number>(5);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<ErrorStateInfo | null>(null);

  // ===== Countdown before showing code =====
  const [countdown, setCountdown] = useState<number>(CODE_REVEAL_DELAY_SECONDS);
  const [showCode, setShowCode] = useState<boolean>(false);

  // ===== Countdown before redirect =====
  const [redirectCountdown, setRedirectCountdown] = useState<number>(
    REDIRECT_AFTER_REVEAL_SECONDS
  );

  // Modals state
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  const fetchRandomCode = useCallback(async () => {
    setIsLoading(true);
    setErrorInfo(null);
    setShowCode(false);
    setCountdown(CODE_REVEAL_DELAY_SECONDS);
    setRedirectCountdown(REDIRECT_AFTER_REVEAL_SECONDS);

    try {
      // Reuse the code already shown during this browser session.
      const savedCode = sessionStorage.getItem(STORAGE_KEYS.CLAIMED_CODE);
      const savedValue = sessionStorage.getItem(STORAGE_KEYS.REWARD_VALUE);

      if (savedCode) {
        setCode(savedCode);

        if (savedValue) {
          setValue(Number(savedValue));
        }

        setIsLoading(false);
        return;
      }

      // Minimum loading time for smoother UX.
      const start = Date.now();

      // IMPORTANT:
      // This uses the new Apps Script "random" action.
      // It does NOT check status, reserve, claim, token, or SID.
      const result = await getRandomCode();

      const elapsed = Date.now() - start;

      if (elapsed < TIMINGS.VERIFY_MIN_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, TIMINGS.VERIFY_MIN_MS - elapsed)
        );
      }

      if (!result.success || !result.code) {
        setErrorInfo({
          type: 'API_ERROR',
          title: 'Something went wrong.',
          message:
            result.error ||
            'Failed to retrieve a reward code from the database. Please try again.',
          actionText: 'Retry',
        });

        setIsLoading(false);
        return;
      }

      // Save the selected code for this browser session.
      sessionStorage.setItem(STORAGE_KEYS.CLAIMED_CODE, result.code);

      if (result.value !== undefined) {
        sessionStorage.setItem(
          STORAGE_KEYS.REWARD_VALUE,
          String(result.value)
        );
        setValue(result.value);
      }

      setCode(result.code);
      setIsLoading(false);
    } catch {
      setErrorInfo({
        type: 'NETWORK_ERROR',
        title: 'Connection problem',
        message: 'Check your internet connection and try again.',
        actionText: 'Retry',
      });

      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomCode();
  }, [fetchRandomCode]);

  // ==================== Countdown before showing code ====================
  useEffect(() => {
    if (isLoading || !code || errorInfo) return;
    if (showCode) return;

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
  }, [isLoading, code, errorInfo, showCode]);

  // ==================== Countdown before redirect ====================
  useEffect(() => {
    if (!showCode) return;

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // حذف البيانات وإعادة التوجيه
          sessionStorage.removeItem(STORAGE_KEYS.CLAIMED_CODE);
          sessionStorage.removeItem(STORAGE_KEYS.REWARD_VALUE);
          navigate('/playcode');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCode, navigate]);

  // Copy handler
  const handleCopy = async () => {
    if (!code) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');

        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand('copy');

        textarea.remove();
      }

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, TIMINGS.COPY_TOAST_MS);
    } catch {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, TIMINGS.COPY_TOAST_MS);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-play-surface text-slate-800">
      {/* ==================== Header ==================== */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* ==================== إعلان علوي ==================== */}
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

      {/* ==================== Body مع Sidebars Sticky ==================== */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex gap-5 justify-center items-start">

          {/* ===== Sidebar أيسر ===== */}
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

          {/* ==================== المحتوى الرئيسي ==================== */}
          <main className="flex-1 max-w-4xl min-w-0 flex flex-col justify-center">
            {isLoading ? (
              /* ===== 1. التحميل ===== */
              <div className="py-12">
                <SearchAnimation statusText="preparing your reward..." />
              </div>
            ) : errorInfo ? (
              /* ===== 2. الخطأ ===== */
              <ErrorState error={errorInfo} onRetry={fetchRandomCode} />
            ) : code ? (
              showCode ? (
                /* ===== 3. عرض الكود ===== */
                <div className="space-y-6">
                  <RewardCodeCard
                    code={code}
                    value={value}
                    isCopied={isCopied}
                    onCopy={handleCopy}
                  />

                  {/* ===== رسالة تحذيرية أسفل الكود ===== */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
                      If the card does not work, it is likely that someone else
                      has already used it. Please try again; new cards will be
                      added soon.
                    </p>
                  </div>

                  {/* ===== عدّاد إعادة التوجيه ===== */}
                  <div className="text-center space-y-3 pt-2">
                    <p className="text-xs sm:text-sm text-slate-500">
                      Redirecting to rewards page in{' '}
                      <span className="font-bold text-play-blue-600 tabular-nums">
                        {redirectCountdown}s
                      </span>
                    </p>

                    {/* شريط تقدم صغير */}
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
                        navigate('/playcode');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return now</span>
                    </button>
                  </div>

                  {/* إعلان مربع */}
                  <div className="flex justify-center pt-2">
                    <Ad
                      adKey={AD_KEYS.square300x250.key}
                      width={AD_KEYS.square300x250.width}
                      height={AD_KEYS.square300x250.height}
                    />
                  </div>
                </div>
              ) : (
                /* ===== 4. العدّاد قبل ظهور الكود ===== */
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
                              ((CODE_REVEAL_DELAY_SECONDS - countdown) /
                                CODE_REVEAL_DELAY_SECONDS) *
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

                  {/* إعلان مربع أثناء الانتظار */}
                  <div className="flex justify-center pt-6">
                    <Ad
                      adKey={AD_KEYS.square300x250.key}
                      width={AD_KEYS.square300x250.width}
                      height={AD_KEYS.square300x250.height}
                    />
                  </div>
                </div>
              )
            ) : null}

            <HowItWorksModal
              isOpen={isHowItWorksOpen}
              onClose={() => setIsHowItWorksOpen(false)}
            />

            <TermsModal
              isOpen={isTermsOpen}
              onClose={() => setIsTermsOpen(false)}
            />
          </main>

          {/* ===== Sidebar أيمن ===== */}
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

      {/* ==================== إعلان سفلي ==================== */}
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

      {/* ==================== Footer ==================== */}
      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsTermsOpen(true)}
        onOpenContact={() => setIsHowItWorksOpen(true)}
      />
    </div>
  );
};