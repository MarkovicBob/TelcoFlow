# Deployment Guide

## Vercel Deployment

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Quick Deploy

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/telcoflow.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

### Configuration

Vercel automatically detects Vite projects. No additional configuration needed.

**Build Settings (auto-detected):**

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables (if needed)

1. Project Settings → Environment Variables
2. Add variables:
   ```
   VITE_API_URL=https://your-api.com
   ```
3. Redeploy to apply changes

---

## Netlify Deployment

### Quick Deploy

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - New site from Git
   - Connect to GitHub and select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

### Custom Domain

1. Domain settings → Add custom domain
2. Follow DNS instructions

---

## Manual Build & Deploy

For any static hosting provider:

```bash
# Build production bundle
npm run build

# Output will be in dist/ folder
# Upload dist/ contents to your hosting provider
```

---

## Docker Deployment

See [README.md](../README.md#docker) for Docker setup.

---

## Production Checklist

- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Verify all environment variables
- [ ] Test all features in production build
- [ ] Setup custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Setup error monitoring (optional, e.g., Sentry)
