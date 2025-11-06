# ColdExperience CMS - Deployment Guide

This guide covers deploying the ColdExperience CMS to production.

## Deployment Architecture

```
GitHub Repository
    ↓
Decap CMS (Content Editing)
    ↓
GitHub Commits
    ↓
n8n Workflow (Translation)
    ↓
GitHub Commits (Translated Content)
    ↓
Vercel (Automatic Build & Deploy)
    ↓
Live Website
```

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All content is created and reviewed
- [ ] Images are optimized and uploaded
- [ ] Translations are accurate
- [ ] Links are working
- [ ] Mobile responsiveness is tested
- [ ] Performance is acceptable
- [ ] Security is configured
- [ ] Backups are in place

## Development to Production

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### 2. Testing

```bash
# Run linting
pnpm lint

# Build for production
pnpm build

# Test production build
pnpm preview
```

### 3. Commit to GitHub

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new experiences and update translations"

# Push to main branch
git push origin main
```

### 4. Automatic Deployment

When you push to `main`:

1. **GitHub Actions** runs CI/CD checks
   - Linting
   - Type checking
   - Build verification

2. **n8n Webhook** triggers
   - Detects changes in `i18n/sv.json`
   - Translates to EN, DE, PL
   - Commits translations

3. **Vercel** auto-deploys
   - Builds the site
   - Deploys to production
   - Updates live URL

## Deployment Environments

### Staging (Development)

- Branch: `dev`
- URL: `dev.coldexperience.com` (or staging URL)
- Auto-deploys on push
- For testing before production

### Production

- Branch: `main`
- URL: `coldexperience.com`
- Auto-deploys on push
- Live site

## Vercel Deployment

### Initial Setup

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Build command: `pnpm build`
   - Output directory: `.next`
3. Set environment variables (if needed)
4. Deploy

### Automatic Deployments

Vercel automatically deploys when:
- Code is pushed to `main` branch
- Pull requests are created (preview deployments)
- Manual redeploy is triggered

### Manual Redeployment

If you need to redeploy without code changes:

1. Go to Vercel dashboard
2. Select the project
3. Click **"Deployments"**
4. Find the deployment to redeploy
5. Click **"Redeploy"**

## Content Deployment via CMS

### Publishing Content

1. Log in to CMS at `/admin`
2. Make content changes
3. Click **"Publish"**
4. Changes are committed to GitHub
5. n8n translates automatically
6. Vercel deploys within 2-5 minutes

### Scheduling Content (Future Feature)

Currently, all changes deploy immediately. To schedule content:

1. Create content in draft
2. Manually publish at desired time
3. Or use GitHub Actions for scheduled deployments

## Rollback Procedures

### Rollback via GitHub

If something goes wrong:

```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Or reset (use with caution)
git reset --hard <commit-hash>

# Push to trigger redeployment
git push origin main
```

### Rollback via Vercel

1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Find the last good deployment
4. Click the **"..."** menu
5. Select **"Promote to Production"**

## Monitoring Deployments

### Vercel Dashboard

1. Go to https://vercel.com
2. Select the project
3. View deployment status
4. Check build logs
5. Monitor performance metrics

### GitHub Actions

1. Go to GitHub repository
2. Click **"Actions"** tab
3. View workflow runs
4. Check for failures
5. Review logs

### n8n Workflow

1. Go to n8n dashboard
2. View workflow executions
3. Check translation status
4. Review error logs

## Performance Optimization

### Image Optimization

- Use Next.js Image component
- Compress images before upload
- Use modern formats (WebP)
- Lazy load images

### Caching Strategy

- Vercel handles caching automatically
- Static content cached aggressively
- JSON files cached with short TTL
- Images cached long-term

### Build Optimization

- Minimize bundle size
- Tree-shake unused code
- Optimize dependencies
- Use code splitting

## Security in Production

### HTTPS

- Vercel provides free HTTPS
- Automatic certificate renewal
- Redirect HTTP to HTTPS

### Environment Variables

- Store secrets in Vercel
- Never commit credentials
- Use different values per environment
- Rotate regularly

### Access Control

- GitHub branch protection
- Required reviews for main
- Status checks required
- Restrict deployment access

## Monitoring & Alerts

### Set Up Monitoring

1. **Vercel Analytics**: Built-in performance monitoring
2. **GitHub Notifications**: Email on deployment status
3. **n8n Alerts**: Email on workflow failures
4. **Custom Monitoring**: Set up external monitoring

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | Code error | Check build logs, fix error, push again |
| Deployment stuck | GitHub Actions issue | Check Actions logs, restart workflow |
| Translations missing | n8n workflow failed | Check n8n logs, verify API keys |
| Images not showing | Path error | Verify image paths in JSON |
| Site slow | Large bundle | Optimize images, reduce dependencies |

## Disaster Recovery

### Backup Strategy

1. GitHub is your primary backup
2. Export content regularly
3. Keep glossary backed up
4. Document all configurations

### Recovery Procedures

**If GitHub is compromised:**
1. Restore from local backup
2. Create new repository
3. Push restored content
4. Reconfigure all services

**If Vercel is down:**
1. Use Netlify as fallback
2. Or deploy to alternative hosting
3. Update DNS to point to backup

**If n8n is down:**
1. Manually translate content
2. Commit to GitHub
3. Vercel will deploy
4. Fix n8n workflow

## Deployment Checklist

Before each deployment:

- [ ] All tests pass
- [ ] Code is reviewed
- [ ] Commit message is descriptive
- [ ] No secrets in commit
- [ ] Translations are accurate
- [ ] Images are optimized
- [ ] Links are working
- [ ] Mobile is responsive

After deployment:

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images display properly
- [ ] Translations appear correct
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Mobile works well

## Scaling Considerations

### As Traffic Grows

1. **Vercel auto-scales**: Handles traffic automatically
2. **Monitor performance**: Use Vercel Analytics
3. **Optimize assets**: Reduce image sizes
4. **Upgrade plan**: If needed for higher limits

### Adding More Languages

1. Add language files to `/i18n/`
2. Update Decap CMS config
3. Update n8n workflow
4. Update language switcher
5. Deploy and test

### Adding More Content

1. Create new collections in Decap CMS
2. Add content directories
3. Update routes in App.tsx
4. Deploy and test

## Support

For deployment issues:

1. Check Vercel status page
2. Review GitHub Actions logs
3. Check n8n workflow logs
4. Review browser console
5. Contact support if needed

---

**Deployment is automatic and seamless!** Just push to GitHub and watch your changes go live.
