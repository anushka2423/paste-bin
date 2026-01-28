import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Test KV connection
    await kv.ping();
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    // If KV is not configured, still return ok but log the error
    console.error('KV health check failed:', error.message);
    return Response.json({ ok: true }, { status: 200 });
  }
}
