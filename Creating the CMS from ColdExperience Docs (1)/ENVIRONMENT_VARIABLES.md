# Environment Variables & Secrets

This document covers all environment variables and secrets needed for production deployment of the CMS and React app integration.

## Overview

Environment variables are organized by service:

1. **GitHub** - Repository access
2. **Netlify** - CMS hosting and deployment
3. **Decap CMS** - Content management
4. **n8n** - Auto-translation workflow
5. **DeepL** - Translation API
6. **React App** - Frontend configuration

## GitHub

### Required for CMS & n8n Workflow

**GITHUB_OWNER**
- Value: `Onepiecedad`
- Description: GitHub username/organization
- Used by: n8n workflow
- Required: Yes

**GITHUB_REPO**
- Value: `ColdExperience`
- Description: GitHub repository name
- Used by: n8n workflow
- Required: Yes

**GITHUB_TOKEN**
- Value: `ghp_xxxxxxxxxxxxx` (personal access token)
- Description: GitHub personal access token for API access
- Used by: n8n workflow, Netlify
- Required: Yes
- Scopes needed:
  - `repo` (full control of private repositories)
  - `workflow` (update GitHub Actions)
- How to create:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens
  2. Click "Generate new token"
  3. Name: `cms-auto-translate`
  4. Select required scopes
  5. Copy token (only shown once!)
  6. Save securely

## Netlify

### For CMS Deployment (admin.coldexperience.se)

**NETLIFY_SITE_ID**
- Value: (from Netlify dashboard)
- Description: Unique ID for your Netlify site
- Used by: Netlify CLI, CI/CD
- Required: Yes
- How to find:
  1. Log in to Netlify dashboard
  2. Go to Site settings → General
  3. Copy Site ID

**NETLIFY_AUTH_TOKEN**
- Value: (from Netlify dashboard)
- Description: Authentication token for Netlify API
- Used by: Netlify CLI, CI/CD
- Required: Yes
- How to create:
  1. Log in to Netlify dashboard
  2. Go to User settings → Applications → New access token
  3. Name: `cms-deployment`
  4. Copy token

### For Netlify Identity (CMS Authentication)

**NETLIFY_IDENTITY_ENABLED**
- Value: `true`
- Description: Enable Netlify Identity for CMS
- Used by: Decap CMS
- Required: Yes

**NETLIFY_IDENTITY_SITE_URL**
- Value: `https://admin.coldexperience.se`
- Description: URL of your CMS site
- Used by: Netlify Identity
- Required: Yes

**NETLIFY_IDENTITY_REDIRECT_URL**
- Value: `https://admin.coldexperience.se/admin/`
- Description: Redirect after login
- Used by: Netlify Identity
- Required: Yes

## Decap CMS

### Configuration (in config.yml)

These are set in `public/admin/config.yml`:

**backend**
```yaml
backend:
  name: github
  repo: Onepiecedad/ColdExperience
  branch: main
  auth_endpoint: api/auth
```

**media_folder**
```yaml
media_folder: /public/media
public_folder: /media
```

**i18n**
```yaml
i18n:
  structure: multiple_folders
  locales: [sv, en, de, pl]
  default_locale: sv
```

## n8n Workflow

### Required Credentials

**GITHUB_OWNER**
- Value: `Onepiecedad`
- Used by: n8n GitHub nodes
- Required: Yes

**GITHUB_REPO**
- Value: `ColdExperience`
- Used by: n8n GitHub nodes
- Required: Yes

**GITHUB_TOKEN**
- Value: (same as above)
- Used by: n8n GitHub nodes
- Required: Yes

**DEEPL_API_KEY**
- Value: `xxxxxxxxxxxxx:fx`
- Description: DeepL API key for translations
- Used by: n8n DeepL nodes
- Required: Yes
- How to get:
  1. Go to https://www.deepl.com/pro
  2. Sign up for free account (500,000 chars/month)
  3. Go to Account → API keys
  4. Copy API key

### Optional: Slack Notifications

**SLACK_CHANNEL**
- Value: `#translations` (or your channel)
- Description: Slack channel for notifications
- Used by: n8n Slack node
- Required: No

**SLACK_WEBHOOK_URL**
- Value: (from Slack workspace)
- Description: Slack webhook for posting messages
- Used by: n8n Slack node
- Required: No
- How to create:
  1. Go to Slack workspace → Settings
  2. Go to Apps & integrations → Incoming Webhooks
  3. Create new webhook
  4. Copy webhook URL

### Optional: OpenAI (Alternative to DeepL)

**OPENAI_API_KEY**
- Value: `sk-xxxxxxxxxxxxx`
- Description: OpenAI API key for GPT-4o translations
- Used by: n8n HTTP nodes
- Required: No (use if preferring GPT-4o over DeepL)
- How to get:
  1. Go to https://platform.openai.com/api-keys
  2. Create new secret key
  3. Copy key

## React App

### Frontend Configuration

These are typically set in `.env` or `.env.local`:

**REACT_APP_SITE_URL**
- Value: `https://coldexperience.se`
- Description: Public URL of your site
- Used by: React app (SEO, links)
- Required: No (defaults to window.location)

**REACT_APP_API_URL**
- Value: `https://api.coldexperience.se` (if you have a backend)
- Description: Backend API endpoint
- Used by: Contact form, booking API
- Required: No (if using FastAPI on Render)

**REACT_APP_ANALYTICS_ID**
- Value: (from Google Analytics or similar)
- Description: Analytics tracking ID
- Used by: Analytics library
- Required: No

**PUBLIC_URL**
- Value: `/`
- Description: Public URL path for assets
- Used by: Create React App build
- Required: No (defaults to /)

## Netlify Build Configuration

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "build/"

[build.environment]
  NODE_VERSION = "18.0.0"
  NPM_VERSION = "9.0.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/media/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Setting Up Environment Variables

### Step 1: Local Development

Create `.env.local` in your React app root:

```bash
# React App
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8000

# Optional: Analytics
REACT_APP_ANALYTICS_ID=G-XXXXXXXXXX
```

### Step 2: Netlify (CMS)

1. Go to Netlify dashboard
2. Site settings → Build & deploy → Environment
3. Add environment variables:

```
GITHUB_OWNER=Onepiecedad
GITHUB_REPO=ColdExperience
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
NETLIFY_IDENTITY_ENABLED=true
```

### Step 3: n8n Workflow

1. Open n8n dashboard
2. Go to Credentials
3. Create credentials for each service:
   - GitHub (with token)
   - DeepL (with API key)
   - Slack (optional, with webhook)

4. In workflow environment, set:

```
GITHUB_OWNER=Onepiecedad
GITHUB_REPO=ColdExperience
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
DEEPL_API_KEY=xxxxxxxxxxxxx:fx
SLACK_CHANNEL=#translations
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### Step 4: GitHub Secrets (for CI/CD)

If using GitHub Actions:

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add secrets:

```
NETLIFY_AUTH_TOKEN=xxxxxxxxxxxxx
NETLIFY_SITE_ID=xxxxxxxxxxxxx
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

## Security Best Practices

### ✅ Do's

- [ ] Store secrets in environment variables, never in code
- [ ] Use GitHub Secrets for CI/CD
- [ ] Use Netlify Environment Variables for build
- [ ] Rotate tokens regularly (every 90 days)
- [ ] Use minimal required scopes for tokens
- [ ] Keep `.env.local` in `.gitignore`
- [ ] Use different tokens for different services
- [ ] Document where each secret is used

### ❌ Don'ts

- [ ] Never commit `.env` files to Git
- [ ] Never share tokens in chat or email
- [ ] Never use personal tokens in shared accounts
- [ ] Never commit secrets to GitHub
- [ ] Never log secrets in console
- [ ] Never use same token for multiple services
- [ ] Never share Netlify auth tokens

## Checking Environment Variables

### Verify Variables Are Set

```bash
# Check if variable exists
echo $GITHUB_TOKEN

# List all env variables
env | grep GITHUB

# In Node.js
console.log(process.env.REACT_APP_SITE_URL)
```

### Debugging Missing Variables

1. **In Netlify build logs**
   - Go to Netlify dashboard → Deploys
   - Click on failed deploy
   - Check build logs for missing variables

2. **In n8n workflow**
   - Open workflow
   - Click on node
   - Check "Credentials" section
   - Verify credentials are selected

3. **In React app**
   - Check browser console
   - Look for undefined variables
   - Check `.env.local` file

## Rotating Secrets

### GitHub Token Rotation

1. Create new token (same scopes as old)
2. Update in Netlify environment
3. Update in n8n credentials
4. Update in GitHub Secrets
5. Delete old token from GitHub

### DeepL API Key Rotation

1. Create new API key in DeepL dashboard
2. Update in n8n credentials
3. Test translation workflow
4. Delete old key

### Slack Webhook Rotation

1. Create new webhook in Slack
2. Update in n8n environment
3. Test notification
4. Delete old webhook

## Troubleshooting

### "Authentication failed" Error

**Problem**: Workflow fails with authentication error

**Solutions**:
- Verify token is correct and not expired
- Check token has required scopes
- Verify token is set in correct place (n8n credentials)
- Try creating new token

### "API rate limit exceeded"

**Problem**: DeepL or GitHub API returns rate limit error

**Solutions**:
- Check API usage in dashboard
- Upgrade to paid plan if needed
- Implement request throttling
- Wait before retrying

### "Environment variable not found"

**Problem**: Workflow can't find environment variable

**Solutions**:
- Verify variable is set in correct location
- Check spelling (case-sensitive)
- Verify variable is available to service
- Check variable scope (build vs runtime)

### "Webhook not triggered"

**Problem**: GitHub webhook doesn't trigger n8n workflow

**Solutions**:
- Verify webhook URL is correct
- Check webhook delivery logs in GitHub
- Verify n8n workflow is active
- Test with manual trigger first

## Production Checklist

Before deploying to production:

- [ ] All GitHub tokens created and secured
- [ ] Netlify environment variables set
- [ ] n8n credentials configured
- [ ] DeepL API key verified
- [ ] Slack webhook tested (if using)
- [ ] Environment variables documented
- [ ] Secrets rotation schedule created
- [ ] Backup of secrets created (secure storage)
- [ ] Team members notified of secret locations
- [ ] Monitoring set up for failed workflows

## Support & Resources

- **GitHub Docs**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **Netlify Docs**: https://docs.netlify.com/configure-builds/environment-variables/
- **Decap CMS**: https://decapcms.org/docs/backends/github/
- **n8n Docs**: https://docs.n8n.io/
- **DeepL API**: https://www.deepl.com/docs-api

---

**All environment variables are now documented and ready for production!** 🔐
