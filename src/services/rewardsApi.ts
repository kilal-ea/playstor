import { API_URL, DEV_ALLOW_MOCK_VERIFY } from '../config';
import {
  RewardStatusResponse,
  ReserveResponse,
  ClaimResponse,
  ReleaseResponse,
  VerificationResponse,
} from '../types';

export interface RandomCodeResponse {
  success: boolean;
  code?: string;
  value?: number;
  error?: string;
}

async function postToAppsScript<T>(
  payload: Record<string, unknown>
): Promise<T> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error ${response.status}: ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (
        err.name === 'TypeError' &&
        err.message.toLowerCase().includes('fetch')
      ) {
        throw new Error('NETWORK_ERROR');
      }

      throw err;
    }

    throw new Error('UNKNOWN_API_ERROR');
  }
}

/**
 * Existing status endpoint.
 * Kept for compatibility with the old reward flow.
 */
export async function getRewardStatus(): Promise<RewardStatusResponse> {
  try {
    const url = new URL(API_URL);
    url.searchParams.set('action', 'status');

    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return (await response.json()) as RewardStatusResponse;
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.name === 'TypeError' &&
      err.message.toLowerCase().includes('fetch')
    ) {
      throw new Error('NETWORK_ERROR');
    }

    throw err;
  }
}

/**
 * NEW reward flow.
 *
 * Calls:
 * POST { action: "random" }
 *
 * This does NOT:
 * - check availability
 * - reserve
 * - claim
 * - require a token
 * - require sid
 * - check status
 *
 * Google Apps Script chooses a random non-empty code.
 */
export async function getRandomCode(): Promise<RandomCodeResponse> {
  try {
    return await postToAppsScript<RandomCodeResponse>({
      action: 'random',
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NETWORK_ERROR') {
      throw err;
    }

    return {
      success: false,
      error: 'Failed to retrieve a reward code from the database.',
    };
  }
}

/**
 * Existing reservation endpoint.
 * Kept for compatibility.
 */
export async function reserveReward(
  userId: string
): Promise<ReserveResponse> {
  return postToAppsScript<ReserveResponse>({
    action: 'reserve',
    userId,
  });
}

/**
 * Existing verification endpoint.
 * Kept for compatibility with the previous architecture.
 */
export async function verifyRewardSession(
  token: string
): Promise<VerificationResponse> {
  try {
    const isDevMock =
      DEV_ALLOW_MOCK_VERIFY ||
      (typeof window !== 'undefined' &&
        window.location.search.includes('dev_mock=true'));

    const result = await postToAppsScript<{
      success: boolean;
      eligible?: boolean;
      error?: string;
    }>({
      action: 'verify',
      token,
    });

    if (result.success && result.eligible === true) {
      return {
        success: true,
        eligible: true,
      };
    }

    if (result.success && result.eligible === false) {
      return {
        success: false,
        eligible: false,
        error:
          'Conversion could not be verified by the server. Please ensure the sponsor offer was completed.',
      };
    }

    if (result.error === 'Unknown action') {
      if (isDevMock) {
        return {
          success: true,
          eligible: true,
        };
      }

      return {
        success: false,
        eligible: false,
        error:
          'Server-side conversion verification is not yet received for this session. A valid S2S Postback from AppComplete is required to unlock the code.',
      };
    }

    return {
      success: false,
      eligible: false,
      error: result.error || 'Session verification failed',
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NETWORK_ERROR') {
      throw err;
    }

    return {
      success: false,
      eligible: false,
      error: 'Unable to communicate with verification server.',
    };
  }
}

/**
 * Existing claim endpoint.
 * Kept for compatibility with the old reward flow.
 */
export async function claimReward(
  token: string
): Promise<ClaimResponse> {
  return postToAppsScript<ClaimResponse>({
    action: 'claim',
    token,
  });
}

/**
 * OLD reserve + claim flow.
 *
 * Kept so existing code does not break.
 *
 * CodePage.tsx should NOT use this function.
 * It should use getRandomCode().
 */
export async function claimRandomAvailableCode(
  existingToken?: string | null
): Promise<ClaimResponse> {
  try {
    let token = existingToken;

    if (!token) {
      const status = await getRewardStatus();

      if (!status.success || status.available <= 0) {
        return {
          success: false,
          error: 'NO_REWARDS',
        };
      }

      const anonymousUserId =
        'user_' +
        Math.random().toString(36).substring(2, 11) +
        '_' +
        Date.now().toString(36);

      const reserve = await reserveReward(anonymousUserId);

      if (!reserve.success || !reserve.reservation?.token) {
        return {
          success: false,
          error:
            reserve.error || 'Failed to reserve available code',
        };
      }

      token = reserve.reservation.token;
    }

    return await claimReward(token);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NETWORK_ERROR') {
      throw err;
    }

    return {
      success: false,
      error: 'Failed to claim reward code from database',
    };
  }
}

/**
 * Existing release endpoint.
 */
export async function releaseReward(
  token: string
): Promise<ReleaseResponse> {
  return postToAppsScript<ReleaseResponse>({
    action: 'release',
    token,
  });
}

