import { generateId, getCurrentTime } from '../../../lib/pasteUtils';
import { savePaste } from '../../../lib/pasteUtils';

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return Response.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return Response.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return Response.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    // Generate ID and URL
    const id = generateId();
    const headers = Object.fromEntries(request.headers.entries());
    const baseUrl = process.env.BASE_URL || 
                   (headers['x-forwarded-proto'] || 'http') + '://' + headers.host ||
                   'http://localhost:3000';
    const url = `${baseUrl}/p/${id}`;

    // Calculate expiry time
    const now = getCurrentTime();
    const expiresAt = ttl_seconds 
      ? new Date(now + ttl_seconds * 1000).toISOString()
      : null;

    // Store paste data
    const pasteData = {
      content: content.trim(),
      createdAt: now,
      expiresAt,
      maxViews: max_views || null,
      currentViews: 0
    };

    // Store in KV
    await savePaste(id, pasteData, ttl_seconds);

    return Response.json({ id, url }, { status: 201 });
  } catch (error) {
    console.error('Error creating paste:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
