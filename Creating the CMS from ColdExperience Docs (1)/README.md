# ColdExperience CMS

A multilingual content management system for ColdExperience, enabling non-technical editors to manage website content, images, and translations across four languages (Swedish, English, German, Polish).

## Overview

ColdExperience CMS is built to allow Gustav (editor) to update Swedish content and images without touching code. The system automatically translates content to English, German, and Polish using n8n with DeepL or OpenAI GPT-4o, and automatically deploys updates to the live website via Vercel.

## Key Features

- **Multilingual Support**: Swedish (master), English, German, Polish
- **Decap CMS Integration**: User-friendly admin interface at `/admin`
- **Automatic Translation**: n8n workflow translates Swedish content to other languages
- **Content Collections**: Home page, Experiences, and FAQ management
- **Media Management**: Upload and manage images via CMS
- **Responsive Design**: Mobile-first, accessible interface
- **Automatic Deployment**: GitHub → n8n → Vercel pipeline

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Internationalization**: i18next with 4 language support
- **CMS**: Decap CMS (Netlify CMS 3.x)
- **Automation**: n8n for translation and GitHub commits
- **Deployment**: Vercel with automatic builds
- **Repository**: GitHub (Onepiecedad/ColdExperience)

## Project Structure

```
coldexperience-cms/
├── client/
│   ├── public/
│   │   ├── admin/              # Decap CMS admin interface
│   │   ├── content/            # Content JSON files
│   │   ├── i18n/               # Translation files
│   │   └── media/              # Uploaded images and videos
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Page components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Utility functions
│       └── App.tsx             # Main app component
├── content/                    # Source content files
│   ├── pages/
│   ├── experiences/
│   └── faq/
├── i18n/                       # Master translation files
│   ├── sv.json                 # Swedish (master)
│   ├── en.json                 # English
│   ├── de.json                 # German
│   ├── pl.json                 # Polish
│   └── glossary.csv            # Brand terminology
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- GitHub account with repository access
- Netlify account (for Decap CMS authentication)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

### Accessing the CMS

1. Navigate to `http://localhost:3000/admin`
2. Log in with your GitHub account (configured in Decap CMS)
3. Edit Swedish content and images
4. Changes automatically commit to GitHub
5. n8n translates and commits to other languages
6. Vercel deploys the updated site

## Content Management

### Home Page

Edit hero section, about section, and features via `/admin` under "Home Page" collection.

### Experiences

Create, edit, or delete cold water experiences. Each experience includes:
- Title and slug
- Summary and description
- Pricing (SEK)
- Duration
- Seasons
- Difficulty level
- Gallery images

### FAQ

Manage frequently asked questions organized by category:
- General
- Safety
- Booking
- Health

## Translation Workflow

1. **Editor** updates Swedish content in Decap CMS
2. **Decap** commits changes to GitHub main branch
3. **GitHub webhook** triggers n8n workflow
4. **n8n** detects changes in `i18n/sv.json`
5. **Translation API** (DeepL or OpenAI) translates new/changed keys
6. **Glossary** is applied to preserve brand terminology
7. **n8n** commits translated files to GitHub
8. **Vercel** auto-builds and deploys the updated site

## Language Management

### Adding New Translations

1. Edit `i18n/sv.json` (Swedish master)
2. Add new keys following the nested structure
3. Commit to GitHub
4. n8n automatically translates to EN, DE, PL

### Brand Glossary

Edit `i18n/glossary.csv` to maintain consistent terminology across translations:
- Swedish term
- English translation
- German translation
- Polish translation
- Description

## Deployment

### Vercel Setup

1. Connect GitHub repository to Vercel
2. Set environment variables (if needed)
3. Configure automatic deployments on push to main
4. Production site updates automatically on each commit

### GitHub Actions

CI/CD pipeline runs on each push:
- Lint and format checks
- TypeScript compilation
- Build verification

## User Roles

| Role | Access | Responsibilities |
|------|--------|------------------|
| **Gustav (Editor)** | CMS UI only | Edit Swedish texts and images |
| **Joakim (Owner)** | Full GitHub + CMS admin | System setup, config updates, code review |
| **n8n Bot** | GitHub API write access | Auto-translation and commits |

## Development

### Available Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format
```

### Adding New Pages

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Use `useTranslation()` hook for i18n
4. Add translation keys to all language files

### Adding New Content Collections

1. Update `client/public/admin/config.yml`
2. Create content directory structure
3. Add collection configuration
4. Create sample content files

## Troubleshooting

### CMS Not Loading

- Check GitHub authentication
- Verify Netlify Identity widget is loaded
- Check browser console for errors

### Translations Not Updating

- Verify n8n workflow is active
- Check GitHub webhook configuration
- Review n8n execution logs
- Ensure API keys are valid

### Images Not Displaying

- Verify images are uploaded to `/public/media`
- Check file paths in JSON content
- Ensure image files are accessible

## Support & Maintenance

For issues or questions:
- Check documentation in this README
- Review Decap CMS documentation
- Consult n8n workflow logs
- Check GitHub Actions logs for CI/CD issues

## License

© 2024 ColdExperience. All rights reserved.

## Next Steps

1. Configure GitHub repository access
2. Set up Netlify Identity for Decap CMS
3. Configure n8n workflow for translations
4. Connect Vercel for deployment
5. Test full content editing workflow
6. Train Gustav on CMS usage
