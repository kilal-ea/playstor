/**
 * Application Configuration
 * Single source of truth for API and Locker endpoints.
 */

// Google Apps Script API endpoint
export const API_URL =
  "https://script.google.com/macros/s/AKfycbwU1q4vuXefsHi_pgVWfR8uHqKLfBWW8fi92wibT6TmEMaDByypmm9E3nHni3Vhg0eo/exec";

// External Content Locker URL
export const LOCKER_URL = "https://appcomplete.org/cl/i/ved83x";

// Locker Redirect Destination URL
export const REDIRECT_URL = "https://freetool.us/playcode";

// Application storage keys
export const STORAGE_KEYS = {
  SESSION_TOKEN: "reward_session_token",
  SESSION_EXPIRES_AT: "reward_session_expires_at",
  REWARD_VALUE: "reward_session_value",
  LOCKER_PENDING: "reward_locker_pending",
  CLAIMED_CODE: "reward_claimed_code",
} as const;

// Optional developer flag to simulate postback approval during offline UX testing
// KEEP FALSE IN PRODUCTION: Server-to-server verification must confirm the conversion!
export const DEV_ALLOW_MOCK_VERIFY = false;

// UX simulation minimum timing in milliseconds (to ensure smooth transitions)
export const TIMINGS = {
  SEARCH_STEP_1_MS: 900,
  SEARCH_STEP_2_MS: 900,
  VERIFY_MIN_MS: 1200,
  COPY_TOAST_MS: 2000,
} as const;
