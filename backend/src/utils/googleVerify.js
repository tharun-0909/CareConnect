import crypto from 'node:crypto';

let cachedCerts = null;
let cachedAt = 0;
const CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const CERTS_TTL = 60 * 60 * 1000;

async function getGoogleCerts() {
  if (cachedCerts && Date.now() - cachedAt < CERTS_TTL) return cachedCerts;
  const response = await fetch(CERTS_URL);
  if (!response.ok) throw new Error('Unable to fetch Google verification keys');
  const { keys } = await response.json();
  cachedCerts = keys;
  cachedAt = Date.now();
  return cachedCerts;
}

function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}

export async function verifyGoogleIdToken(idToken, expectedAudience) {
  const [headerB64, payloadB64, signatureB64] = String(idToken || '').split('.');
  if (!headerB64 || !payloadB64 || !signatureB64) throw new Error('Malformed Google ID token');

  const header = JSON.parse(base64UrlDecode(headerB64).toString('utf8'));
  if (header.alg !== 'RS256') throw new Error('Unsupported Google token algorithm');

  const certs = await getGoogleCerts();
  const key = certs.find(cert => cert.kid === header.kid);
  if (!key) throw new Error('Unknown Google signing key');

  const publicKey = crypto.createPublicKey({ key: { kty: 'RSA', n: key.n, e: key.e } });
  const data = Buffer.from(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);
  if (!crypto.verify('RSA-SHA256', data, publicKey, signature)) throw new Error('Invalid Google ID token signature');

  const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error('Google ID token expired');
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)) throw new Error('Invalid Google issuer');
  if (expectedAudience && payload.aud !== expectedAudience) throw new Error('Google token audience mismatch');
  if (payload.email_verified !== true) throw new Error('This Google account is not email-verified');
  return payload;
}