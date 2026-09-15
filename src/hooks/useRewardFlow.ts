import { useState, useEffect, useCallback } from 'react';
import { FlowState, ErrorStateInfo } from '../types';
import { STORAGE_KEYS, TIMINGS } from '../config';

export function useRewardFlow() {
  const [state, setState] = useState<FlowState>('IDLE');
  const [searchStepText, setSearchStepText] = useState<string>(
    'Searching for your reward...'
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorInfo, setErrorInfo] = useState<ErrorStateInfo | null>(null);

  /**
   * Initialize flow
   *
   * The new flow does NOT use:
   * - reward inventory checks
   * - reservations
   * - session tokens
   * - verification
   * - server-side claiming
   *
   * The code is handled separately by /playcode/code.
   */
  useEffect(() => {
    setState('IDLE');
    setErrorInfo(null);

    // Remove any old flow data that may exist
    // from the previous reserve/verify/claim system.
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
      sessionStorage.removeItem(STORAGE_KEYS.REWARD_VALUE);
      sessionStorage.removeItem(STORAGE_KEYS.CLAIMED_CODE);
      sessionStorage.removeItem(STORAGE_KEYS.LOCKER_PENDING);
    } catch {
      // Ignore storage errors
    }
  }, []);

  /**
   * Action 1:
   * Find My Reward
   *
   * IMPORTANT:
   * This does NOT check Google Sheets inventory.
   * The user should always reach "Reward Found".
   */
  const startSearch = useCallback(async () => {
    setErrorInfo(null);
    setState('SEARCHING');
    setSearchStepText('Searching for your reward...');

    try {
      // Small UX delay so the search animation is visible.
      await new Promise((resolve) =>
        setTimeout(resolve, TIMINGS.SEARCH_STEP_1_MS || 1200)
      );

      setSearchStepText('Reward found!');

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setState('REWARD_FOUND');
    } catch {
      setState('ERROR');

      setErrorInfo({
        type: 'API_ERROR',
        title: 'Something went wrong.',
        message: 'Unable to find your reward. Please try again.',
        actionText: 'Try Again',
      });
    }
  }, []);

  /**
   * Action 2:
   * Unlock Reward
   *
   * Opens the external locker directly.
   *
   * IMPORTANT:
   * - No sid
   * - No token
   * - No query parameters
   * - No React route
   * - No iframe
   */
  const unlockReward = useCallback(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.LOCKER_PENDING,
        'true'
      );
    } catch {
      // Storage is not required for the redirect.
    }

    window.location.assign(
      'https://trkoffer.net/cl/i/ved83x'
    );
  }, []);

  /**
   * Legacy compatibility function.
   *
   * The new flow does not verify or claim anything here.
   * Code selection happens on /playcode/code.
   */
  const verifyAndClaimToken = useCallback(
    async (_token: string) => {
      return;
    },
    []
  );

  /**
   * Copy Code
   *
   * Kept for compatibility with existing components.
   */
  const copyCode = useCallback(
    async (codeToCopy: string) => {
      try {
        if (
          navigator.clipboard &&
          window.isSecureContext
        ) {
          await navigator.clipboard.writeText(codeToCopy);
        } else {
          const textarea =
            document.createElement('textarea');

          textarea.value = codeToCopy;
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
    },
    []
  );

  /**
   * Reset flow
   */
  const resetFlow = useCallback(() => {
    try {
      sessionStorage.removeItem(
        STORAGE_KEYS.SESSION_TOKEN
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.SESSION_EXPIRES_AT
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.REWARD_VALUE
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.CLAIMED_CODE
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.LOCKER_PENDING
      );
    } catch {
      // Ignore storage errors
    }

    setState('IDLE');
    setErrorInfo(null);
    setSearchStepText('Searching for your reward...');
    setIsCopied(false);
  }, []);

  return {
    state,
    setState,
    searchStepText,

    // Kept for compatibility with existing UI.
    availableCount: null,
    session: null,

    errorInfo,
    isCopied,

    startSearch,
    unlockReward,
    verifyAndClaimToken,
    copyCode,
    resetFlow,
  };
}