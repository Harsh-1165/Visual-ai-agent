# GitHub Repository Setup Guide

## 🎯 Initial Repository Creation

### 1. Create New Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `visual-ai-agent`
3. Description: "Chrome extension + Next.js web app for browser activity monitoring with AI analysis"
4. Choose: **Public** (to share with community)
5. Initialize with nothing (we'll push existing repo)
6. Click "Create repository"

### 2. Connect Local Repository

```bash
cd /vercel/share/v0-project

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/visual-ai-agent.git

# Set main branch
git branch -M main

# Push with full history (NO SQUASHING)
git push -u origin main
```

### 3. Verify Commit History

```bash
# Check all commits are present
git log --oneline

# Expected output should show:
# 9e0112a docs: add comprehensive README and landing page
# a259f1e feat(extension): implement Chrome Manifest V3 extension
# c317f4d feat(pages): create authentication and dashboard pages
# 9220e31 feat(api): implement core API endpoints
# 6c79bc9 feat(database): setup Neon PostgreSQL with Drizzle ORM
# 796fec8 feat: add cors, dotenv, zod dependencies
# 300bd63 Initial commit
```

---

## 📋 Repository Structure

```
visual-ai-agent/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── auth/               # Better Auth endpoints
│   │   ├── activities/         # Activity logging
│   │   ├── screenshots/        # Screenshot storage
│   │   └── settings/           # User settings
│   ├── dashboard/              # Activity viewer page
│   ├── sign-in/               # Sign in page
│   ├── sign-up/               # Sign up page
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── lib/
│   ├── auth.ts                # Better Auth config
│   ├── auth-client.ts         # Client auth hook
│   └── db/
│       ├── index.ts           # Drizzle setup
│       └── schema.ts          # Database schema
├── public/extension/          # Chrome extension files
│   ├── manifest.json          # Extension manifest
│   ├── background.js          # Service worker
│   ├── content.js             # Content script
│   ├── popup.html/js          # Popup UI
│   └── options.html/js        # Settings page
├── components/                # React components
├── .env.local                 # Local environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
├── README.md                  # Project overview
├── DEPLOYMENT.md              # Deployment guide
└── GITHUB_SETUP.md            # This file
```

---

## 🔧 GitHub Settings

### Branches

1. Go to Settings → Branches
2. Set default branch to `main`
3. Add branch protection:
   - Require pull request reviews (1 reviewer)
   - Dismiss stale PR approvals
   - Require status checks to pass

### Collaborators

1. Settings → Collaborators
2. Add team members as needed
3. Set appropriate permissions

### Secrets (if using GitHub Actions)

Settings → Secrets and variables → Actions

Required for CI/CD:
- `VERCEL_TOKEN` - From Vercel account settings
- `VERCEL_ORG_ID` - From Vercel project
- `VERCEL_PROJECT_ID` - From Vercel project

### Actions

Enable GitHub Actions for:
- Automated testing
- Linting checks
- Type checking
- Deployment previews

---

## 📦 Release Process

### Creating Releases

1. Go to Releases → Draft a new release
2. Choose tag version (e.g., `v1.0.0`) following [Semantic Versioning](https://semver.org/)
3. Add changelog for features/fixes
4. Mark as release (or pre-release for beta)
5. Publish release

### Version Format

- `v1.0.0` - Major.Minor.Patch
- `v1.0.0-beta.1` - Beta releases
- `v1.0.0-alpha.1` - Alpha releases

Example changelog:

```markdown
## v1.0.0 - 2024-01-15

### Features
- Chrome extension with real-time activity tracking
- Dashboard for viewing activities and screenshots
- AI-powered screenshot analysis
- Privacy controls and URL filtering

### Bug Fixes
- Fixed screenshot upload timeout
- Improved error handling in auth flow

### Breaking Changes
- Removed deprecated activity types

### Contributors
- @yourusername
```

---

## 🐛 Issues & Pull Requests

### Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Report a bug
labels: bug
---

## Describe the bug
Clear description of what happened

## Steps to reproduce
1. Go to...
2. Click on...
3. See error

## Expected behavior
What should happen

## Actual behavior
What actually happens

## Environment
- OS: 
- Browser: 
- Version:
```

### PR Template

Create `.github/pull_request_template.md`:

```markdown
## Description
Clear description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## How to test
Steps to test the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] No new warnings generated
- [ ] Tests added/updated
```

---

## 📊 Community Features

### Discussions

Enable in Settings → Features → Discussions

Use categories:
- **General** - General questions and chat
- **Ideas** - Feature suggestions
- **Show & Tell** - Showcase usage/extensions
- **Help** - Get help from community

### Wiki

Create wiki pages for:
- Installation guide
- Configuration options
- Troubleshooting
- Development guide
- API documentation

### Projects

Create project board:
1. Go to Projects → New project
2. Set up columns: Todo, In Progress, Review, Done
3. Link issues and PRs
4. Track progress

---

## 🔄 Contribution Guidelines

Create `CONTRIBUTING.md`:

```markdown
# Contributing to Visual AI Agent

## Code of Conduct
- Be respectful and inclusive
- No harassment or discrimination
- Be open to feedback

## How to Contribute

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes
4. Commit with clear messages: `git commit -m 'feat: add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

## Development Setup
See README.md for setup instructions

## Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

Example: `feat(extension): add activity tracking for scroll events`

## Code Style
- Use TypeScript
- Follow existing patterns
- Format with Prettier
- Lint with ESLint
```

---

## 🚀 GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm build
```

---

## 📝 Documentation URLs

Add to repository description:
- **Website**: https://visual-ai-agent.vercel.app
- **Docs**: https://github.com/yourusername/visual-ai-agent/wiki
- **Issues**: https://github.com/yourusername/visual-ai-agent/issues

---

## 🔗 Useful Links

- [GitHub Docs](https://docs.github.com)
- [Semantic Versioning](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Keep a Changelog](https://keepachangelog.com)

---

## ✅ Pre-Push Checklist

Before pushing to GitHub:

- [ ] All commits have clear, descriptive messages
- [ ] No sensitive data in commits
- [ ] Code follows project style guide
- [ ] Documentation is updated
- [ ] README reflects current state
- [ ] Tests pass locally
- [ ] No merge conflicts
- [ ] History is preserved (no force push)

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code with full history
3. ⬜ Set up GitHub Pages/Wiki
4. ⬜ Create release notes
5. ⬜ Share with community
6. ⬜ Accept contributions
7. ⬜ Build community

---

**Good luck with your Visual AI Agent project! 🚀**
