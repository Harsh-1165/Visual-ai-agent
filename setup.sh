#!/bin/bash

# Visual AI Agent - Setup Script
# This script sets up the development environment

set -e

echo "🎯 Visual AI Agent - Setup Script"
echo "=================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install it from https://nodejs.org"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✓ Node.js: $(node --version)"
echo "✓ pnpm: $(pnpm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✓ Dependencies installed"
echo ""

# Check environment
echo "🔐 Checking environment variables..."

if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << 'EOF'
# Database Configuration (from Neon)
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: AI Gateway (for Claude vision API)
# ANTHROPIC_API_KEY=your-key-here
EOF
    echo "⚠️  .env.local created. Please update with your database credentials."
else
    echo "✓ .env.local found"
fi
echo ""

# Generate BETTER_AUTH_SECRET if missing
if grep -q "your-secret-key-here" .env.local; then
    echo "🔑 Generating BETTER_AUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/your-secret-key-here/$SECRET/" .env.local && rm .env.local.bak
    echo "✓ Secret generated and saved to .env.local"
fi
echo ""

# Show next steps
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Update .env.local with your Neon database URL:"
echo "   DATABASE_URL=postgresql://..."
echo ""
echo "2. Start the development server:"
echo "   pnpm dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "4. Load the Chrome extension:"
echo "   - Open chrome://extensions"
echo "   - Enable 'Developer mode'"
echo "   - Click 'Load unpacked'"
echo "   - Select ./public/extension"
echo ""
echo "5. Create an account and start tracking!"
echo ""
echo "📚 Useful commands:"
echo "  pnpm dev          - Start dev server"
echo "  pnpm build        - Build for production"
echo "  pnpm type-check   - Run TypeScript check"
echo "  pnpm lint         - Run ESLint"
echo ""
echo "📖 Documentation:"
echo "  README.md         - Project overview"
echo "  DEPLOYMENT.md     - How to deploy"
echo "  GITHUB_SETUP.md   - GitHub repository setup"
echo ""
echo "🆘 Need help?"
echo "  Check README.md for detailed documentation"
echo "  Visit: https://github.com/yourusername/visual-ai-agent"
echo ""
