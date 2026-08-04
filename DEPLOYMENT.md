# Deployment Guide - Visual AI Agent

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/visual-ai-agent.git
cd visual-ai-agent
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create `.env.local`:
```env
# Database (from Neon integration)
DATABASE_URL=postgresql://user:password@host/database

# Better Auth
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start development server**
```bash
pnpm dev
```

5. **Load Chrome extension**
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `./public/extension`

### Testing

- Web app: http://localhost:3000
- Create account: http://localhost:3000/sign-up
- Dashboard: http://localhost:3000/dashboard
- Extension: Check browser toolbar icon

---

## 🌐 Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository pushed with full history (no squash merges)
- Neon database already created

### Step 1: Push to GitHub

```bash
# Create GitHub repository (do NOT squash commits)
git remote add origin https://github.com/yourusername/visual-ai-agent.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

```bash
pnpm install -g vercel
vercel link
```

Or use Vercel dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings

### Step 3: Set Environment Variables in Vercel

In Vercel dashboard → Settings → Environment Variables, add:

```
DATABASE_URL = postgresql://...
BETTER_AUTH_SECRET = your-secret-key
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

### Step 4: Deploy

```bash
vercel deploy --prod
```

Or push to main branch for automatic deployment.

---

## 📦 Chrome Extension Distribution

### Option 1: Manual Installation (Development)

1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `/public/extension` directory

### Option 2: Chrome Web Store (Production)

1. Create developer account at [chrome.google.com/webstore](https://chrome.google.com/webstore)
2. Create new extension:
   - Upload manifest.json and all extension files
   - Add screenshots and description
   - Set privacy policy URL (use your deployed site URL)
3. Submit for review (typically 24-48 hours)
4. Once approved, distribute link to users

### Package Extension for Distribution

```bash
# Zip the extension folder
zip -r visual-ai-agent-extension.zip public/extension/

# Upload to Chrome Web Store Developer Dashboard
```

**Important**: Update `manifest.json` with your production API endpoint:
```json
{
  "background": {
    "service_worker": "background.js"
  }
}
```

Update in `background.js`:
```javascript
const API_BASE_URL = 'https://your-domain.vercel.app';
```

---

## 🔐 Security Checklist

- [ ] `BETTER_AUTH_SECRET` is set and strong (≥32 characters)
- [ ] Database URL uses SSL/TLS
- [ ] Environment variables not exposed in code
- [ ] CORS properly configured for extension origin
- [ ] Rate limiting enabled on API endpoints
- [ ] HTTPS enforced in production
- [ ] Content Security Policy headers set
- [ ] CSRF protection enabled
- [ ] User data encryption at rest

---

## 📊 Monitoring & Maintenance

### Logs

```bash
# View Vercel logs
vercel logs

# View database logs (Neon)
neon project logs
```

### Database Backups

Neon automatically backs up data daily. To manually backup:

```bash
# Using Neon CLI
neon db backup create

# Using psql
pg_dump $DATABASE_URL > backup.sql
```

### Performance Monitoring

- Use Vercel Analytics
- Monitor database query performance in Neon console
- Set up alerting for errors and slowdowns

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Extension not connecting

1. Check API URL in `background.js`
2. Ensure server is running
3. Check browser console for CORS errors
4. Verify auth token is stored correctly

### Authentication failing

1. Verify `BETTER_AUTH_SECRET` is set
2. Check database connection string
3. Ensure session tables exist
4. Clear cookies and try again

### Screenshots not uploading

1. Check screenshot API endpoint
2. Verify storage destination
3. Check browser console for errors
4. Ensure user is authenticated

### Database connection errors

1. Verify `DATABASE_URL` format
2. Check IP whitelist in Neon
3. Ensure SSL mode is correct
4. Test connection: `psql $DATABASE_URL`

---

## 📝 Notes

- Keep commit history intact (no squash merges)
- Test extension thoroughly before distribution
- Update privacy policy if distributing on Chrome Web Store
- Monitor usage and performance after deployment
- Regularly update dependencies for security

---

## 🆘 Support

- Check [README.md](./README.md) for overview
- Review API documentation in code comments
- Check Vercel deployment logs
- Contact Neon support for database issues

---

**Last updated**: January 2024
