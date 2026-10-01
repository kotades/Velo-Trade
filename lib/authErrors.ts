/**
 * User-friendly error message mapping for authentication and application errors.
 * Replaces raw Firebase error codes and generic messages with clear, actionable copy.
 */

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Incorrect email or password. Please verify your credentials and try again.',
  'auth/user-not-found': 'No account exists with this email address. Please check your spelling or create a new account.',
  'auth/wrong-password': 'Incorrect password. Please double-check your password and try again.',
  'auth/email-already-in-use': 'An account with this email address already exists. Please sign in instead.',
  'auth/weak-password': 'Password is too weak. Please use at least 6 characters, including a combination of letters and numbers.',
  'auth/invalid-email': 'Please enter a valid email address (e.g., name@example.com).',
  'auth/missing-password': 'Please enter your password.',
  'auth/missing-email': 'Please enter your email address.',
  'auth/too-many-requests': 'Too many unsuccessful attempts. For your security, access has been temporarily paused. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'Unable to connect to the server. Please check your internet connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in cancelled: the Google window was closed before completion. Please try again.',
  'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for Velo-Trade and try again.',
  'auth/user-disabled': 'This account has been deactivated. Please contact support@velo-trade.com for assistance.',
  'auth/operation-not-allowed': 'This sign-in method is temporarily unavailable. Please contact support.',
  'auth/requires-recent-login': 'For security, please log out and log back in to perform this action.',
  'auth/invalid-verification-code': 'The verification code entered is incorrect or has expired.',
  'auth/internal-error': 'An unexpected authentication error occurred. Please try again in a few moments.',
};

/**
 * Returns a human-friendly, professional error message from an error object.
 */
export function getFriendlyErrorMessage(err: unknown, fallback: string = 'An unexpected error occurred. Please try again.'): string {
  if (!err) return fallback;

  // If it's a string
  if (typeof err === 'string') {
    return cleanFirebaseMessage(err) || fallback;
  }

  const errorObj = err as { code?: string; message?: string };

  // 1. Check known Firebase error code
  if (errorObj.code && AUTH_ERROR_MESSAGES[errorObj.code]) {
    return AUTH_ERROR_MESSAGES[errorObj.code];
  }

  // 2. Check if message itself contains an auth code
  if (errorObj.message) {
    for (const [code, friendlyMsg] of Object.entries(AUTH_ERROR_MESSAGES)) {
      if (errorObj.message.includes(code)) {
        return friendlyMsg;
      }
    }
    // Clean raw "Firebase: Error (auth/...)" strings
    const cleaned = cleanFirebaseMessage(errorObj.message);
    if (cleaned) return cleaned;
  }

  return fallback;
}

function cleanFirebaseMessage(msg: string): string {
  // Strip "Firebase: Error (auth/...)." or "Firebase: "
  let cleaned = msg.replace(/^Firebase:\s*/i, '').replace(/Error\s*\([^)]+\):?\s*/i, '').trim();
  // Strip trailing bracketed code e.g. "(auth/weak-password)"
  cleaned = cleaned.replace(/\s*\(auth\/[^)]+\)\.?$/i, '').trim();
  if (cleaned.length > 0) {
    // Ensure starts with uppercase and ends with a period
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) + (cleaned.endsWith('.') ? '' : '.');
  }
  return '';
}
