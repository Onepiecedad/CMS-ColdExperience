# Project Overview – ColdExperience CMS

## Purpose
To build a multilingual content management system (CMS) for **ColdExperience**, allowing the client (Gustav) to update website text and images on four languages (SV, EN, DE, PL) without touching code.

All text content is stored as **i18n keys** (e.g., `home.hero.title`) in JSON files.  
Swedish is the **master language**; all other languages are automatically translated and updated via **n8n** using DeepL or OpenAI GPT-4o.

Images and video files are managed directly in the CMS via Decap CMS and stored under `/public/media`.

## Goals
- Enable Gustav to edit Swedish text and images easily.  
- Automate translation and synchronization for EN, DE, PL.  
- Automatically deploy updated content to the live site.  
- Keep full version control via GitHub.  
- Make the setup reusable as a template for future clients.

## Key Metrics
| Metric | Target |
|---------|--------|
| Edit-to-publish time | < 2 minutes |
| Translation accuracy | > 95 % |
| CMS onboarding time | < 10 minutes |
| Manual developer involvement | 0 for routine edits |

## Tech Stack
- **Frontend:** Next.js 14 (App Router + i18next)
- **CMS:** Decap CMS (Netlify CMS 3.x)
- **Automation:** n8n workflow for translation
- **Deployment:** Vercel (auto build on push)
- **Repository:** GitHub (Onepiecedad/ColdExperience)
