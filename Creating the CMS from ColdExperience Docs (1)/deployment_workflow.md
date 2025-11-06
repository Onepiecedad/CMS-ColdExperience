# Deployment & Automation Workflow

## Overview
Every content change in the CMS automatically rebuilds and deploys the live website.

## Steps
1. Gustav saves text/image → Decap commits to GitHub.
2. GitHub triggers n8n Webhook.
3. n8n:
   - Detects diff in `sv.json`
   - Translates to EN/DE/PL
   - Commits updates
4. Vercel rebuilds and deploys.
