# Pastebin-Lite

A lightweight Pastebin-like application for sharing text snippets with optional expiry and view limits.

## Features

- ✅ Create text pastes with shareable URLs
- ✅ Optional time-based expiry (TTL)
- ✅ Optional view count limits
- ✅ Automatic paste deletion when constraints trigger
- ✅ Clean, modern UI
- ✅ RESTful API
- ✅ TEST_MODE support for deterministic testing

## Tech Stack

- **Backend**: Node.js with Express (API routes via Next.js App Router)
- **Frontend**: Next.js App Router (latest)
- **Database**: Vercel KV (Redis-compatible)
- **Deployment**: Vercel (recommended)

## Prerequisites

Before running this project, you'll need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Vercel Account** (for deployment and KV database)

## External Services Required

### Vercel KV (Required)

This project uses **Vercel KV** (a Redis-compatible database) for persistence. You'll need to:

1. **Create a Vercel account** at [vercel.com](https://vercel.com)
2. **Create a new project** in your Vercel dashboard
3. **Add Vercel KV** to your project:
   - Go to your project settings
   - Navigate to "Storage" → "KV"
   - Create a new KV database
4. **Get your KV credentials**:
   - `KV_REST_API_URL` - Your KV REST API URL
   - `KV_REST_API_TOKEN` - Your KV REST API token
   - `KV_REST_API_READ_ONLY_TOKEN` - Your KV read-only token (optional)

These credentials will be automatically available as environment variables when deployed on Vercel. For local development, add them to your `.env` file.

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd pastebin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Vercel KV credentials:
   ```env
   KV_REST_API_URL=your_kv_url
   KV_REST_API_TOKEN=your_kv_token
   PORT=3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

## Running Locally

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns `{ "ok": true }` if the service is healthy.

### Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "Your text here",
  "ttl_seconds": 3600,  // Optional
  "max_views": 10       // Optional
}
```

Response:
```json
{
  "id": "abc123xyz",
  "url": "https://your-app.vercel.app/p/abc123xyz"
}
```

### Get Paste (API)
```
GET /api/pastes/:id
```

Response:
```json
{
  "content": "Your text here",
  "remaining_views": 9,
  "expires_at": "2026-01-29T12:00:00.000Z"
}
```

### View Paste (HTML)
```
GET /p/:id
```
Returns an HTML page displaying the paste content.

## Persistence Layer

This project uses **Vercel KV** (Redis-compatible) for persistence. Vercel KV is:
- Serverless-compatible
- Fast and reliable
- Automatically configured when deployed on Vercel
- Supports TTL natively for automatic expiry

### Why Vercel KV?

- ✅ Works seamlessly with Vercel serverless functions
- ✅ No database migrations needed
- ✅ Automatic scaling
- ✅ Built-in TTL support for expiry
- ✅ Free tier available for development

## Deployment to Vercel

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure Environment Variables**:
   - In your Vercel project settings, go to "Environment Variables"
   - Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` (these are usually auto-configured if you've added KV to your project)
   - Set `TEST_MODE=0` (or `1` for testing)

4. **Add Vercel KV**:
   - In your Vercel project dashboard
   - Go to "Storage" → "KV"
   - Create a new KV database if you haven't already

5. **Deploy**:
   - Vercel will automatically deploy on every push to your main branch
   - Your app will be available at `https://your-project.vercel.app`

## Testing

### Test Mode

Set `TEST_MODE=1` in your environment variables to enable deterministic time testing. When enabled, you can use the `x-test-now-ms` header to simulate different times:

```bash
curl -H "x-test-now-ms: 1738080000000" \
     https://your-app.vercel.app/api/pastes/abc123
```

### Manual Testing

1. Create a paste:
   ```bash
   curl -X POST https://your-app.vercel.app/api/pastes \
     -H "Content-Type: application/json" \
     -d '{"content": "Hello World", "max_views": 2}'
   ```

2. View the paste:
   ```bash
   curl https://your-app.vercel.app/api/pastes/<paste-id>
   ```

3. Visit the HTML page:
   Open `https://your-app.vercel.app/p/<paste-id>` in your browser

## Design Decisions

1. **Vercel KV for Persistence**: Chosen for seamless integration with Vercel serverless functions and native TTL support.

2. **Next.js App Router**: Using the latest Next.js with App Router for modern React Server Components and Route Handlers. API routes are handled via Route Handlers in the `app/api/` directory.

3. **View Counting**: Views are incremented atomically using KV operations to prevent race conditions.

4. **HTML Escaping**: All paste content is properly escaped when rendered in HTML to prevent XSS attacks.

5. **TEST_MODE**: Implemented to support automated testing with deterministic time, as required by the assignment.

6. **Error Handling**: Consistent 404 responses for all unavailable pastes (expired, view limit exceeded, or not found).

## Project Structure

```
pastebin/
├── app/                   # Next.js App Router directory
│   ├── layout.js         # Root layout
│   ├── page.js           # Home page
│   ├── api/              # API route handlers
│   │   ├── healthz/route.js
│   │   └── pastes/
│   │       ├── route.js          # POST /api/pastes
│   │       └── [id]/route.js     # GET /api/pastes/:id
│   └── p/
│       └── [id]/route.js  # GET /p/:id (HTML response)
├── components/            # React components
│   └── PasteForm.jsx     # Paste creation form
├── lib/                   # Shared utilities
│   └── pasteUtils.js     # Paste-related utility functions
├── styles/                # CSS modules
│   ├── globals.css       # Global styles
│   ├── Home.module.css   # Home page styles
│   ├── PasteForm.module.css
│   └── PasteViewer.module.css
├── package.json           # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## License

MIT
