# ColdExperience CMS - Owner Setup Guide for Joakim

This guide walks you through setting up the ColdExperience CMS for production deployment.

## Prerequisites

- GitHub account with admin access to Onepiecedad/ColdExperience repository
- Netlify account (free tier is fine)
- Vercel account (free tier is fine)
- n8n account (free tier or self-hosted)
- DeepL or OpenAI API key for translations

## Step 1: GitHub Repository Setup

### Create GitHub Repository

```bash
# Initialize git in the project
cd /path/to/coldexperience-cms
git init
git add .
git commit -m "Initial commit: ColdExperience CMS"

# Add remote and push
git remote add origin https://github.com/Onepiecedad/ColdExperience.git
git branch -M main
git push -u origin main
```

### Configure Branch Protection

1. Go to GitHub repository settings
2. Click **"Branches"** in the left sidebar
3. Click **"Add rule"** under "Branch protection rules"
4. Set branch name pattern to `main`
5. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass
   - Require branches to be up to date before merging
6. Click **"Create"**

## Step 2: Netlify Setup (for Decap CMS)

### Create Netlify Site

1. Go to https://app.netlify.com
2. Click **"Add new site"**
3. Choose **"Connect to Git"**
4. Select GitHub and authorize
5. Choose the ColdExperience repository
6. Set build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
7. Click **"Deploy site"**

### Configure Netlify Identity

1. In Netlify dashboard, go to **"Site settings"**
2. Click **"Identity"** in the left sidebar
3. Click **"Enable Identity"**
4. Click **"Invite users"**
5. Add Gustav's email address
6. Gustav will receive an invitation email

### Configure Git Gateway

1. In Netlify dashboard, go to **"Site settings"**
2. Click **"Identity"** → **"Services"**
3. Click **"Enable Git Gateway"**
4. This allows Decap CMS to commit directly to GitHub

## Step 3: Vercel Deployment Setup

### Create Vercel Project

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import the GitHub repository
4. Set up build settings:
   - Framework: Next.js
   - Build command: `pnpm build`
   - Output directory: `.next`
5. Click **"Deploy"**

### Configure Environment Variables (if needed)

1. In Vercel project settings, go to **"Environment Variables"**
2. Add any required variables (usually none for static site)
3. Redeploy after adding variables

### Enable Automatic Deployments

1. Vercel automatically deploys on push to main
2. Verify by checking deployment logs
3. Test by making a small change and pushing

## Step 4: n8n Automation Setup

### Install n8n (Self-hosted or Cloud)

**Option A: n8n Cloud** (Recommended for beginners)
1. Go to https://n8n.cloud
2. Sign up for free account
3. Create new workflow

**Option B: Self-hosted**
```bash
# Using Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Or install locally
npm install -g n8n
n8n start
```

### Create Translation Workflow

1. In n8n, create a new workflow
2. Add trigger: **"Webhook"** (for GitHub)
3. Add node: **"GitHub"** - Get file content (sv.json)
4. Add node: **"Code"** - Detect changes/diff
5. Add node: **"DeepL"** or **"OpenAI"** - Translate
6. Add node: **"GitHub"** - Update language files
7. Add node: **"GitHub"** - Create commit

### Workflow Steps

```
GitHub Webhook (push event)
    ↓
Get sv.json from GitHub
    ↓
Compare with previous version
    ↓
Extract changed keys
    ↓
Translate to EN, DE, PL (using DeepL/OpenAI)
    ↓
Apply glossary terms
    ↓
Update en.json, de.json, pl.json
    ↓
Commit changes to GitHub
    ↓
Vercel auto-deploys
```

### Configure GitHub Webhook

1. In GitHub repository, go to **Settings** → **Webhooks**
2. Click **"Add webhook"**
3. Payload URL: Your n8n webhook URL
4. Content type: `application/json`
5. Events: Select **"Push events"**
6. Click **"Add webhook"**

### Set Up Translation API

**Using DeepL:**
1. Sign up at https://www.deepl.com/pro
2. Get API key
3. In n8n, add DeepL credentials with API key

**Using OpenAI:**
1. Sign up at https://platform.openai.com
2. Create API key
3. In n8n, add OpenAI credentials with API key

## Step 5: Decap CMS Configuration

### Update config.yml

Edit `client/public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: Onepiecedad/ColdExperience
  branch: main
  auth_endpoint: api/auth
  
# Rest of config stays the same
```

### Test CMS Access

1. Go to https://coldexperience.com/admin
2. Click **"Login with GitHub"**
3. Authorize the application
4. You should see the CMS dashboard

## Step 6: Content Initialization

### Create Initial Content

1. Create sample experiences in `/content/experiences/`
2. Create sample FAQ items in `/content/faq/`
3. Create home page content in `/content/pages/home.json`
4. Commit and push to GitHub

### Upload Initial Images

1. Create `/public/media/` directory
2. Add placeholder images
3. Update content JSON files with image paths
4. Commit and push

## Step 7: Testing

### Test Content Editing Workflow

1. Log in to CMS as Gustav
2. Edit a piece of content
3. Publish changes
4. Verify changes appear in GitHub
5. Wait for n8n to translate
6. Verify translations in GitHub
7. Check Vercel deployment logs
8. Verify changes on live site

### Test Translation Accuracy

1. Edit a Swedish text
2. Check translated versions
3. Review glossary application
4. Adjust glossary if needed
5. Re-run translation

### Test Image Upload

1. Upload image via CMS
2. Verify file appears in `/public/media/`
3. Verify image displays on site
4. Test on mobile and desktop

## Step 8: User Access Setup

### Add Gustav to GitHub

1. Go to GitHub repository settings
2. Click **"Collaborators"**
3. Add Gustav's GitHub username
4. Set permissions to **"Maintain"** (can't delete repo)

### Invite Gustav to Netlify

1. In Netlify site settings, go to **"Team"**
2. Click **"Invite"**
3. Add Gustav's email
4. Set role to **"Editor"**

### Add Gustav to CMS

1. Gustav will receive Netlify invitation
2. He accepts and sets up account
3. He can now log in to CMS at `/admin`

## Monitoring & Maintenance

### Monitor Deployments

1. Check Vercel deployment logs regularly
2. Monitor n8n workflow execution
3. Review GitHub Actions logs
4. Check for failed translations

### Backup Strategy

1. GitHub is your version control
2. Regular backups of content JSON files
3. Keep glossary.csv backed up
4. Document any manual changes

### Update Glossary

When brand terminology changes:

1. Update `i18n/glossary.csv`
2. Commit and push to GitHub
3. Update n8n workflow if needed
4. Re-run translations for affected content

### Monitor Performance

1. Check Vercel analytics
2. Monitor site speed
3. Check image optimization
4. Review error logs

## Troubleshooting

### Decap CMS Not Connecting to GitHub

- Verify Netlify Identity is enabled
- Check Git Gateway is enabled
- Verify GitHub OAuth app is configured
- Check browser console for errors

### Translations Not Updating

- Verify n8n workflow is active
- Check GitHub webhook is configured
- Review n8n execution logs
- Verify API keys are valid
- Check glossary is properly formatted

### Vercel Not Deploying

- Check GitHub push was successful
- Verify branch protection rules
- Review Vercel build logs
- Check environment variables

### Images Not Displaying

- Verify `/public/media/` directory exists
- Check file paths in JSON
- Verify image files are accessible
- Check image permissions

## Security Considerations

1. **GitHub Access**: Use strong passwords and 2FA
2. **API Keys**: Store securely, never commit to repo
3. **Netlify Identity**: Enable 2FA for all users
4. **n8n**: Use environment variables for credentials
5. **Backups**: Regular backups of content
6. **Monitoring**: Monitor for unauthorized changes

## Maintenance Schedule

| Task | Frequency |
|------|-----------|
| Review deployments | Daily |
| Check error logs | Daily |
| Backup content | Weekly |
| Update glossary | As needed |
| Review translations | Weekly |
| Update dependencies | Monthly |
| Security audit | Quarterly |

## Support Resources

- Decap CMS docs: https://decapcms.org/docs/intro/
- n8n docs: https://docs.n8n.io/
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com/
- GitHub docs: https://docs.github.com/

## Next Steps

1. Complete all setup steps above
2. Test the full workflow
3. Train Gustav on CMS usage
4. Monitor initial deployments
5. Document any customizations
6. Plan for scaling

---

**Setup Complete!** Your ColdExperience CMS is ready for production.
