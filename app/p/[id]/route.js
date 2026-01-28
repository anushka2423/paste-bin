import { 
  getPaste, 
  getCurrentTimeFromRequest,
  isPasteExpired,
  isViewLimitExceeded,
  incrementPasteViews,
  deletePaste,
  escapeHtml
} from '../../../lib/pasteUtils';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const paste = await getPaste(id);
    
    if (!paste) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Paste Not Found</title>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1 class="error">404 - Paste Not Found</h1>
          <p>The paste you're looking for doesn't exist or has expired.</p>
        </body>
        </html>
      `, {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Get headers from request for TEST_MODE
    const headers = Object.fromEntries(request.headers.entries());
    const mockReq = { headers };
    const now = getCurrentTimeFromRequest(mockReq);

    // Check expiry
    if (isPasteExpired(paste, now)) {
      await deletePaste(id);
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Paste Expired</title>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1 class="error">404 - Paste Expired</h1>
          <p>This paste has expired and is no longer available.</p>
        </body>
        </html>
      `, {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Check view limit
    if (isViewLimitExceeded(paste)) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Paste Unavailable</title>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1 class="error">404 - Paste Unavailable</h1>
          <p>This paste has reached its view limit and is no longer available.</p>
        </body>
        </html>
      `, {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Increment view count
    const updatedPaste = await incrementPasteViews(id, paste, now);

    // Escape HTML to prevent XSS
    const escapedContent = escapeHtml(updatedPaste.content)
      .replace(/\n/g, '<br>')
      .replace(/ /g, '&nbsp;');

    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paste - ${id.substring(0, 8)}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 30px;
          }
          .content {
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 20px;
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.6;
            font-size: 14px;
          }
          .meta {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">${escapedContent}</div>
          <div class="meta">
            Paste ID: ${id}
          </div>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error viewing paste:', error);
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .error { color: #d32f2f; }
        </style>
      </head>
      <body>
        <h1 class="error">500 - Internal Server Error</h1>
        <p>An error occurred while retrieving the paste.</p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
