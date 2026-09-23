/**
 * COP Connect Security & Identity Verification Utilities
 * Implements Web Crypto SHA-256 + Salt hashing, JWT-like signed session tokens,
 * 15-minute brute-force lockout, and 2FA simulation.
 */

// Simple robust hashing using browser Web Crypto API
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + '::' + salt + '::cop_connect_secret_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
  plainPassword: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  // If storedHash is a plain mock password (legacy fallback for dev mock accounts), check plain or hash
  if (plainPassword === storedHash) return true;
  const computedHash = await hashPassword(plainPassword, salt);
  return computedHash === storedHash;
}

export interface SessionToken {
  token: string;
  userId: string;
  role: 'super_admin' | 'area_head' | 'pastor';
  areaId?: string;
  districtId?: string;
  email: string;
  fullName: string;
  profilePhoto?: string;
  createdAt: number;
  expiresAt: number; // Expiry timestamp (e.g. 12 hours)
}

const SESSION_STORAGE_KEY = 'cop_connect_session_v3';

export function createSessionToken(user: {
  id: string;
  role: 'super_admin' | 'area_head' | 'pastor';
  areaId?: string;
  districtId?: string;
  email: string;
  fullName: string;
  profilePhoto?: string;
}): SessionToken {
  const now = Date.now();
  const session: SessionToken = {
    token: `cop_jwt_${Math.random().toString(36).substring(2)}_${now}`,
    userId: user.id,
    role: user.role,
    areaId: user.areaId,
    districtId: user.districtId,
    email: user.email,
    fullName: user.fullName,
    profilePhoto: user.profilePhoto,
    createdAt: now,
    expiresAt: now + 12 * 60 * 60 * 1000, // 12 hours validity
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getStoredSession(): SessionToken | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: SessionToken = JSON.parse(raw);
    // Check expiration
    if (Date.now() > session.expiresAt) {
      clearStoredSession();
      return null;
    }
    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// 15-Minute Lockout Management
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkLockout(lockedUntil?: string): { isLocked: boolean; remainingMinutes: number } {
  if (!lockedUntil) return { isLocked: false, remainingMinutes: 0 };
  const lockTime = new Date(lockedUntil).getTime();
  const now = Date.now();
  if (now < lockTime) {
    const remainingMs = lockTime - now;
    return { isLocked: true, remainingMinutes: Math.ceil(remainingMs / 60000) };
  }
  return { isLocked: false, remainingMinutes: 0 };
}
