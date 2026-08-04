# 🎯 Visual AI Agent - Browser Activity Monitor

A comprehensive Chrome extension paired with a Next.js web application that monitors and analyzes your browser activity using AI-powered insights. Built with privacy controls and user consent at the core.

## 🌟 Features

- **Real-Time Activity Tracking**: Captures clicks, keystrokes, scrolling, tab changes, and URL visits
- **Automatic Screenshots**: Periodic screenshots with configurable intervals (default: every 60 seconds)
- **AI-Powered Analysis**: Claude vision API integration for analyzing screenshots
- **Privacy First**: URL filtering, toggle tracking on/off, whitelisting/blacklisting support
- **Beautiful Dashboard**: View all activities and screenshots with filtering and sorting
- **Chrome Extension**: Lightweight Manifest V3 extension with minimal performance impact
- **Secure Authentication**: Better Auth integration with Neon PostgreSQL

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Next.js 16 (App Router)
- Neon PostgreSQL
- Drizzle ORM
- Better Auth
- Claude AI API

**Extension:**
- Chrome Manifest V3
- Content Scripts for activity tracking
- Service Workers for background tasks
- Storage API for settings

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS

### Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts      # Better Auth handler
│   │   ├── activities/route.ts         # Activity logging
│   │   ├── screenshots/route.ts        # Screenshot storage
│   │   └── settings/route.ts           # User settings
│   ├── dashboard/                      # Activity & screenshot viewer
│   ├── sign-in/                        # Authentication pages
│   ├── sign-up/
│   └── page.tsx                        # Landing page
├── lib/
│   ├── auth.ts                         # Better Auth config
│   ├── auth-client.ts                  # Client-side auth
│   └── db/
│       ├── index.ts                    # Drizzle setup
│       └── schema.ts                   # Database schema
└── public/extension/
    ├── manifest.json                   # Extension manifest
    ├── background.js                   # Service worker
    ├── content.js                      # Content script
    ├── popup.html/js                   # Extension popup
    └── options.html/js                 # Extension settings
```

## 📋 Database Schema

### User Tables (Better Auth)
- `user` - User profiles
- `session` - Active sessions
- `account` - OAuth/provider accounts
- `verification` - Email verification tokens

### App Tables
- `activities` - Tracked user activities (clicks, typing, scrolling, etc.)
- `screenshots` - Captured screenshots with optional AI analysis
- `user_settings` - Privacy settings and tracking preferences

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Neon PostgreSQL account
- Claude API key (for AI analysis, optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/visual-ai-agent.git
cd visual-ai-agent
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
# .env.local
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start the development server**
```bash
pnpm dev
```

5. **Load Chrome extension**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `/public/extension/` directory

### Usage

1. **Web App**: Visit `http://localhost:3000`
2. **Sign Up**: Create an account
3. **Install Extension**: Add the Chrome extension to your browser
4. **Configure**: Open extension settings to customize tracking behavior
5. **Monitor**: View all activities and screenshots in the dashboard

## 🔒 Privacy & Security

### Privacy Controls

- **Toggle Tracking**: Pause/resume tracking anytime from the extension popup
- **URL Filtering**: Exclude specific URLs or whitelist only certain domains
- **Selective Analysis**: Enable/disable AI analysis independently
- **Data Ownership**: All data is stored in your own database

### Security Features

- Session-based authentication with Better Auth
- Row-level scoping of all queries by userId
- Encrypted sensitive data in transit
- No personal keyboard data logging (only event types)
- Server-side validation and sanitization

## 📊 API Endpoints

### Authentication
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-up/email` - Create account
- `POST /api/auth/sign-out` - Sign out

### Activities
- `GET /api/activities` - Fetch user activities
- `POST /api/activities` - Log activity

### Screenshots
- `GET /api/screenshots` - Fetch screenshots
- `POST /api/screenshots` - Upload screenshot

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

## 🧠 AI Analysis

Screenshots can be analyzed using Claude's vision API for:
- Text extraction (OCR)
- Content understanding
- Activity summarization
- Anomaly detection

Configure in settings to enable AI analysis.

## 📦 Extension Structure

### Manifest V3
- Permissions: activeTab, scripting, storage, tabs
- Content scripts for activity tracking
- Service worker for background tasks
- Popup UI for user controls

### Activity Types Tracked
- `CLICK` - Mouse clicks with element info
- `TYPING` - Keyboard input detected
- `SCROLL` - Page scrolling
- `INPUT` - Form input events
- `TAB_CHANGED` - User switched tabs
- `URL_CHANGED` - Page navigation
- `WINDOW_FOCUSED` - Browser window focused
- `WINDOW_BLURRED` - Browser window lost focus

## 🛠️ Development

### Run in Development Mode

```bash
# Start dev server with hot reload
pnpm dev

# Run type checking
pnpm type-check

# Build for production
pnpm build
```

### Database Migrations

All schema changes are managed through Neon. Connect with:
```bash
psql $DATABASE_URL
```

### Extension Development

1. Make changes to files in `/public/extension/`
2. Reload extension in `chrome://extensions/` 
3. Test in popup and options pages

## 📈 Monitoring

The dashboard provides real-time insights into:
- Activity timeline with filtering
- Screenshot gallery with AI summaries
- Usage statistics
- Privacy compliance overview

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This extension is designed for personal productivity monitoring and legal use cases only. Users are responsible for complying with privacy laws and workplace policies in their jurisdiction. The developer assumes no liability for misuse.

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the FAQ section

## 🗺️ Roadmap

- [ ] Firefox extension support
- [ ] Advanced analytics and reports
- [ ] Team collaboration features
- [ ] Cloud backup and sync
- [ ] Mobile app integration
- [ ] Export functionality
- [ ] Custom AI prompts for analysis

---

**Built with ❤️ for digital productivity & awareness**
