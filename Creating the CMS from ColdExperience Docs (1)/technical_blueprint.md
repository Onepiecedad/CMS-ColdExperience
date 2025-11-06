# Technical Blueprint

## Architecture
/content/
  pages/home.json
  experiences/*.json
/i18n/
  sv.json  ← master
  en.json
  de.json
  pl.json
/public/
  media/
  admin/config.yml

## Core Components
- **Next.js frontend** renders content dynamically via i18n keys.
- **Decap CMS** manages all JSON content and media uploads.
- **n8n workflow** handles translation automation and GitHub commits.
- **Vercel** rebuilds and deploys site automatically when repository updates.

## Workflow Summary
1. Gustav edits Swedish content or images via `/admin`.
2. Decap commits changes to GitHub (`main` branch).
3. GitHub webhook triggers n8n.
4. n8n:
   - Detects diff in `i18n/sv.json`.
   - Translates new/changed keys to EN, DE, PL.
   - Commits translated files back to repo.
5. Vercel auto-builds → site updated live.

## CI/CD
- **GitHub Actions** run lint + build checks.
- **Vercel** handles production deployment.
- **Branching:** `main` = production, `dev` = staging.
