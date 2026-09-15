/**
 * Type definitions for the Google Play Rewards Platform
 */

// API Responses
export interface RewardStatusResponse {
  success: boolean;
  available: number;
  error?: string;
}

export interface ReservationData {
  token: string;
  value: number;
  expiresAt?: string;
}

export interface ReserveResponse {
  success: boolean;
  reservation?: ReservationData;
  error?: string;
}

export interface ClaimResponse {
  success: boolean;
  code?: string;
  value?: number;
  error?: string;
}

export interface ReleaseResponse {
  success: boolean;
  error?: string;
}

export interface VerificationResponse {
  success: boolean;
  eligible: boolean;
  error?: string;
}

// State Machine States
export type FlowState =
  | 'IDLE'          // Initial default state
  | 'SEARCHING'     // Searching animation and checking status
  | 'REWARD_FOUND'  // Reward available and reserved modal shown
  | 'LOCKER'        // Handed off to content locker
  | 'VERIFYING'     // Returning from locker, validating session
  | 'UNLOCKED'      // Verified, gift card code revealed
  | 'CLAIMED'       // Code copied / claimed
  | 'ERROR'         // General or network error
  | 'EXPIRED'       // Reservation token expired
  | 'NO_REWARDS';   // 0 rewards available

export type ErrorType =
  | 'NO_REWARDS'
  | 'SESSION_EXPIRED'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED';

export interface ErrorStateInfo {
  type: ErrorType;
  title: string;
  message: string;
  actionText?: string;
}

export interface ActiveSession {
  token: string;
  value: number;
  expiresAt?: string;
  claimedCode?: string;
}
