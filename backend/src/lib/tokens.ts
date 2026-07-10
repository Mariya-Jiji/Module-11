import crypto from 'crypto';

/**
 * Generates a secure random raw token.
 * This should be sent to the user via email.
 */
export function generateVerificationToken(): string {
  return crypto.randomUUID();
}

/**
 * Hashes a raw token for secure storage in the database.
 * We use SHA-256 for fast, secure token hashing.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
