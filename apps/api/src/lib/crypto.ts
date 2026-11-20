import crypto from 'crypto';
import { config } from '../config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
const TAG_LENGTH = 16; // 128 bits auth tag
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;

export interface EncryptedPayload {
  format: 'aes-256-gcm';
  version: 1;
  salt: string;
  iv: string;
  tag: string;
  ciphertext: string;
  encoded: string;
}

/**
 * Derives a 256-bit AES key from a passphrase/secret using PBKDF2 with SHA-256
 */
export function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, PBKDF2_ITERATIONS, 32, 'sha256');
}

/**
 * Encrypts sensitive credentials or data at rest using authenticated AES-256-GCM.
 * Protects against tampering and unauthorized exposure.
 */
export function encryptCredential(plainText: string, secretKey?: string): EncryptedPayload {
  const masterKey = secretKey || config.JWT_SECRET;
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(masterKey, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let ciphertext = cipher.update(plainText, 'utf8', 'hex');
  ciphertext += cipher.final('hex');

  const tag = cipher.getAuthTag();

  const saltHex = salt.toString('hex');
  const ivHex = iv.toString('hex');
  const tagHex = tag.toString('hex');

  const encoded = `enc:v1:${saltHex}:${ivHex}:${tagHex}:${ciphertext}`;

  return {
    format: 'aes-256-gcm',
    version: 1,
    salt: saltHex,
    iv: ivHex,
    tag: tagHex,
    ciphertext,
    encoded,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload, verifying authentication tag.
 * Throws an error if payload has been modified or corrupted.
 */
export function decryptCredential(encodedOrPayload: string | { salt: string; iv: string; tag: string; ciphertext: string }, secretKey?: string): string {
  const masterKey = secretKey || config.JWT_SECRET;

  let saltHex: string;
  let ivHex: string;
  let tagHex: string;
  let ciphertext: string;

  if (typeof encodedOrPayload === 'string') {
    const parts = encodedOrPayload.split(':');
    if (parts.length !== 6 || parts[0] !== 'enc' || parts[1] !== 'v1') {
      throw new Error('Format kredensial terenkripsi tidak valid');
    }
    [, , saltHex, ivHex, tagHex, ciphertext] = parts;
  } else {
    ({ salt: saltHex, iv: ivHex, tag: tagHex, ciphertext } = encodedOrPayload);
  }

  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const key = deriveKey(masterKey, salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

