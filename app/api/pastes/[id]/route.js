import { 
  getPaste, 
  getCurrentTimeFromRequest,
  isPasteExpired,
  isViewLimitExceeded,
  incrementPasteViews,
  deletePaste
} from '../../../../lib/pasteUtils';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const paste = await getPaste(id);
    
    if (!paste) {
      return Response.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    // Get headers for TEST_MODE
    const headers = Object.fromEntries(request.headers.entries());
    const mockReq = { headers };
    const now = getCurrentTimeFromRequest(mockReq);

    // Check expiry
    if (isPasteExpired(paste, now)) {
      await deletePaste(id);
      return Response.json(
        { error: 'Paste expired' },
        { status: 404 }
      );
    }

    // Check view limit
    if (isViewLimitExceeded(paste)) {
      return Response.json(
        { error: 'Paste view limit exceeded' },
        { status: 404 }
      );
    }

    // Increment view count
    const updatedPaste = await incrementPasteViews(id, paste, now);

    // Calculate remaining views
    const remainingViews = updatedPaste.maxViews !== null 
      ? Math.max(0, updatedPaste.maxViews - updatedPaste.currentViews)
      : null;

    return Response.json({
      content: updatedPaste.content,
      remaining_views: remainingViews,
      expires_at: updatedPaste.expiresAt
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
