# External Requirements for Pastebin-Lite

This document outlines what you need to provide externally to run and deploy this application.

## Required External Services

### 1. Vercel KV Database (REQUIRED)

**What it is**: A Redis-compatible key-value database provided by Vercel.

**Why it's needed**: 
- The application needs persistent storage for pastes
- Serverless functions require external persistence (in-memory storage doesn't work)
- Vercel KV provides automatic TTL support for paste expiry

**How to get it**:

1. **Sign up for Vercel** (if you don't have an account):
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended) or email

2. **Create a Vercel Project**:
   - Click "New Project" in your dashboard
   - Connect your GitHub repository (or create one first)
   - Vercel will detect the project automatically

3. **Add Vercel KV to your project**:
   - In your Vercel project dashboard
   - Go to the "Storage" tab
   - Click "Create Database" → Select "KV"
   - Give it a name (e.g., "pastebin-kv")
   - Click "Create"

4. **Get your KV credentials** (for local development):
   - In your KV database settings
   - You'll see:
     - `KV_REST_API_URL` - Your KV REST API URL
     - `KV_REST_API_TOKEN` - Your KV REST API token
   - Copy these values

5. **Set up environment variables**:
   
   **For Local Development**:
   - Create a `.env` file in the project root
   - Add:
     ```env
     KV_REST_API_URL=your_kv_url_here
     KV_REST_API_TOKEN=your_kv_token_here
     PORT=3000
     ```
   
   **For Vercel Deployment**:
   - In your Vercel project settings
   - Go to "Environment Variables"
   - Add the KV credentials (they might be auto-added if you created KV through Vercel)
   - Vercel automatically provides these when KV is linked to your project

**Cost**: 
- Vercel KV has a free tier (512 MB storage, 30K reads/day, 30K writes/day)
- More than enough for this assignment

---

## Optional External Services

### 2. GitHub Account (Recommended)

**What it is**: Code hosting and version control.

**Why it's needed**:
- Required for submitting the assignment (public git repository)
- Makes deployment to Vercel easier (automatic deployments)

**How to get it**:
- Sign up at [github.com](https://github.com)
- Create a new repository
- Push your code

---

## Environment Variables Summary

### Required for Local Development:
```env
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
PORT=3000
```

### Optional:
```env
BASE_URL=https://your-app.vercel.app  # Auto-detected if not set
TEST_MODE=0  # Set to 1 for deterministic testing
NODE_ENV=development
```

### For Vercel Deployment:
- `KV_REST_API_URL` and `KV_REST_API_TOKEN` are usually auto-configured
- `TEST_MODE` can be set in Vercel dashboard if needed
- `NODE_ENV` is automatically set to "production" by Vercel

---

## Quick Start Checklist

- [ ] Create Vercel account
- [ ] Create Vercel KV database
- [ ] Copy KV credentials to `.env` file
- [ ] Install dependencies: `npm install`
- [ ] Build frontend: `npm run build:frontend`
- [ ] Run locally: `npm run dev`
- [ ] Deploy to Vercel: Push to GitHub and connect to Vercel

---

## Troubleshooting

### "KV connection failed" error:
- Make sure your `.env` file has the correct KV credentials
- Verify the KV database exists in your Vercel dashboard
- Check that the tokens haven't expired

### "Cannot find module '@vercel/kv'":
- Run `npm install` to install dependencies

### Frontend not loading:
- Make sure you've run `npm run build:frontend` before starting the server
- Check that the `dist/` folder exists

---

## Support Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Express.js Documentation](https://expressjs.com/)
