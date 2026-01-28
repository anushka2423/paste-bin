import { kv } from '@vercel/kv';

const TEST_MODE = process.env.TEST_MODE === '1';

// Helper function to get current time (respects TEST_MODE)
export function getCurrentTime() {
  return Date.now();
}

// Helper function to get current time from request (for TEST_MODE)
export function getCurrentTimeFromRequest(req) {
  if (TEST_MODE && req.headers['x-test-now-ms']) {
    const testTime = parseInt(req.headers['x-test-now-ms'], 10);
    if (!isNaN(testTime)) {
      return testTime;
    }
  }
  return getCurrentTime();
}

// Generate unique ID
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Escape HTML to prevent XSS
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Get paste from KV
export async function getPaste(id) {
  const kvKey = `paste:${id}`;
  const pasteJson = await kv.get(kvKey);
  return pasteJson ? JSON.parse(pasteJson) : null;
}

// Save paste to KV
export async function savePaste(id, pasteData, ttlSeconds = null) {
  const kvKey = `paste:${id}`;
  if (ttlSeconds) {
    await kv.setex(kvKey, ttlSeconds, JSON.stringify(pasteData));
  } else {
    await kv.set(kvKey, JSON.stringify(pasteData));
  }
}

// Delete paste from KV
export async function deletePaste(id) {
  const kvKey = `paste:${id}`;
  await kv.del(kvKey);
}

// Check if paste is expired
export function isPasteExpired(paste, now) {
  if (!paste.expiresAt) return false;
  const expiryTime = new Date(paste.expiresAt).getTime();
  return now >= expiryTime;
}

// Check if paste view limit exceeded
export function isViewLimitExceeded(paste) {
  if (paste.maxViews === null) return false;
  return paste.currentViews >= paste.maxViews;
}

// Increment paste views
export async function incrementPasteViews(id, paste, now) {
  paste.currentViews = (paste.currentViews || 0) + 1;
  
  const remainingTTL = paste.expiresAt 
    ? Math.max(0, Math.floor((new Date(paste.expiresAt).getTime() - now) / 1000))
    : null;
  
  if (remainingTTL && remainingTTL > 0) {
    await kv.setex(`paste:${id}`, remainingTTL, JSON.stringify(paste));
  } else {
    await kv.set(`paste:${id}`, JSON.stringify(paste));
  }
  
  return paste;
}
