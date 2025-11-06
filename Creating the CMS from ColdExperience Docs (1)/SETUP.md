# Cold Experience CMS - Detailed Setup Guide

This guide walks you through deploying and configuring the headless CMS for Cold Experience.

## Prerequisites

- GitHub account with admin access to Onepiecedad/ColdExperience repository
- Netlify account (free tier is sufficient)
- Access to your domain registrar for DNS configuration

## Step 1: Create a New Repository for the CMS

The CMS should be in a separate repository from your main React app.

```bash
# Option A: Create a new GitHub repository
# Go to GitHub and create: Onepiecedad/ColdExperience-CMS

# Option B: Create a subdirectory in your existing repo
# (Not recommended - separate repos are cleaner)
```

## Step 2: Deploy to Netlify

### 2.1 Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"**
3. Choose **"Connect to Git"**
4. Select GitHub and authorize
5. Choose the ColdExperience-CMS repository
6. Configure build settings:
   - **Build command**: `echo "CMS ready to deploy"`
   - **Publish directory**: `.` (root directory)
7. Click **"Deploy site"**

Netlify will deploy the site and assign a temporary URL like `cold-experience-cms.netlify.app`.

### 2.2 Configure Site Settings

1. In Netlify dashboard, go to **Site settings**
2. Change the site name to something memorable (e.g., `cold-experience-cms`)
3. Note the site URL for later

## Step 3: Enable Netlify Identity

Netlify Identity is required for GitHub authentication in Decap CMS.

1. In Netlify dashboard, click **"Identity"** in the left sidebar
2. Click **"Enable Identity"**
3. Click **"Invite users"** and add Gustav's email address
4. Gustav will receive an invitation email
5. Go to **"Services"** and click **"Enable Git Gateway"**

This allows Decap CMS to commit directly to your GitHub repository.

## Step 4: Configure GitHub Integration

### 4.1 GitHub OAuth Application

Decap CMS needs a GitHub OAuth app for authentication.

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: Cold Experience CMS
   - **Homepage URL**: `https://cold-experience-cms.netlify.app` (your Netlify URL)
   - **Authorization callback URL**: `https://cold-experience-cms.netlify.app/` (same as homepage)
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret**

### 4.2 Add OAuth Credentials to Netlify

1. In Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**
2. Click **"Edit variables"**
3. Add these environment variables:
   - **GITHUB_CLIENT_ID**: (paste from GitHub OAuth app)
   - **GITHUB_CLIENT_SECRET**: (paste from GitHub OAuth app)

**Note**: Netlify's Git Gateway handles OAuth automatically, so you may not need to set these manually. If Decap CMS authentication fails, add them.

## Step 5: Configure Custom Domain

To expose the CMS on `admin.coldexperience.se`:

### 5.1 Add DNS Record

In your domain registrar (GoDaddy, Namecheap, etc.):

1. Go to DNS settings for `coldexperience.se`
2. Add a new CNAME record:
   - **Name**: `admin`
   - **Value**: `cold-experience-cms.netlify.app` (your Netlify site URL)
   - **TTL**: 3600 (or default)
3. Save the DNS record

DNS propagation takes 15 minutes to 24 hours.

### 5.2 Configure Custom Domain in Netlify

1. In Netlify dashboard, go to **Domain management**
2. Click **"Add domain"**
3. Enter `admin.coldexperience.se`
4. Verify the DNS configuration
5. Netlify will automatically provision an SSL certificate

Now the CMS is accessible at `https://admin.coldexperience.se`

## Step 6: Configure Decap CMS

The `config.yml` file is already configured to:

- Connect to your GitHub repository
- Edit JSON files in `frontend/public/locales/`
- Support 4 languages (SV, EN, DE, PL)
- Upload media to `frontend/public/media/`

### 6.1 Verify Configuration

1. Open `config.yml` in your text editor
2. Verify the GitHub repository path:
   ```yaml
   backend:
     name: github
     repo: Onepiecedad/ColdExperience  # Should match your repo
     branch: main
   ```
3. Verify the media folder path:
   ```yaml
   media_folder: "frontend/public/media"
   public_folder: "/media"
   ```

### 6.2 Test the CMS

1. Go to `https://admin.coldexperience.se`
2. You should see the Decap CMS login screen
3. Click **"Login with GitHub"**
4. Authorize the application
5. You should see the CMS dashboard with collections:
   - Hero Section
   - Experiences

If you see an error, check:
- Netlify Identity is enabled
- Git Gateway is enabled
- GitHub OAuth app is configured
- DNS is propagated (may take up to 24 hours)

## Step 7: Invite Gustav to the CMS

### 7.1 Add to Netlify

1. In Netlify dashboard, go to **Team** (or **Members**)
2. Click **"Invite"**
3. Enter Gustav's email address
4. Set role to **"Editor"**
5. Gustav will receive an invitation email

### 7.2 Add to GitHub (Optional)

If Gustav needs to review commits:

1. Go to GitHub repository settings
2. Click **"Collaborators"**
3. Add Gustav's GitHub username
4. Set permissions to **"Maintain"** (can't delete repo)

## Step 8: Test the Integration

### 8.1 Edit Content

1. Log in to `https://admin.coldexperience.se` as Gustav
2. Click **"Hero Section"** in the left sidebar
3. Click **"Hero (Swedish)"**
4. Edit a field (e.g., change the title)
5. Click **"Publish"**

### 8.2 Verify GitHub Commit

1. Go to your GitHub repository
2. Check the commit history
3. You should see a new commit from the CMS
4. Open the JSON file to verify the change

### 8.3 Verify React App Update

1. Go to your React app repository
2. Pull the latest changes
3. The JSON file should be updated
4. Rebuild your React app
5. The new content should appear on the website

## Step 9: Add More Collections (Optional)

To make more sections editable via CMS:

1. Edit `config.yml`
2. Add a new collection for each section
3. Example: Adding "About" section

```yaml
- name: "about"
  label: "About Section"
  files:
    - file: "frontend/public/locales/sv/about.json"
      label: "About (Swedish)"
      name: "about_sv"
      fields:
        - {label: "Title", name: "title", widget: "string"}
        - {label: "Description", name: "description", widget: "text"}
        # Add more fields as needed
```

4. Commit and push to GitHub
5. Netlify redeploys automatically
6. New collection appears in CMS

## Troubleshooting

### CMS Won't Load

**Problem**: Getting 404 or blank page at `admin.coldexperience.se`

**Solutions**:
- Wait for DNS propagation (up to 24 hours)
- Verify CNAME record is correct in your domain registrar
- Check Netlify deployment logs
- Clear browser cache and cookies

### Login Fails

**Problem**: "Login with GitHub" button doesn't work

**Solutions**:
- Verify Netlify Identity is enabled
- Check Git Gateway is enabled
- Verify GitHub OAuth app credentials
- Try logging in incognito mode
- Check browser console for error messages

### Publish Fails

**Problem**: "Publish" button doesn't work or shows error

**Solutions**:
- Verify GitHub repository is public or Netlify has access
- Check that Git Gateway is enabled
- Verify the repository path in `config.yml`
- Check Netlify logs for Git Gateway errors
- Try refreshing the page

### Changes Not Appearing

**Problem**: Published changes don't appear in GitHub

**Solutions**:
- Wait 30 seconds for the commit to process
- Check GitHub repository for new commits
- Verify the correct branch is selected (should be `main`)
- Check Netlify logs for errors
- Try publishing again

### JSON File Corrupted

**Problem**: JSON file has syntax errors after editing

**Solutions**:
- Restore from GitHub history
- Check the file in the repository
- Report to Joakim if it happens repeatedly

## File Locations

All files edited by the CMS are in your main repository:

```
ColdExperience/
├── frontend/
│   ├── public/
│   │   ├── locales/
│   │   │   ├── sv/
│   │   │   │   ├── hero.json          ← CMS edits
│   │   │   │   ├── experiences.json   ← CMS edits
│   │   │   │   └── ... (other files)
│   │   │   ├── en/
│   │   │   ├── de/
│   │   │   └── pl/
│   │   └── media/                      ← CMS uploads
│   └── src/
│       └── data/
│           └── packagesConfig.js       ← Manual edit
```

## Monitoring

### GitHub Commits

Monitor CMS edits by watching GitHub commits:

1. Go to your GitHub repository
2. Click **"Commits"**
3. Filter by author "decap-cms" or "netlify"
4. Review changes regularly

### Netlify Logs

Monitor deployment and Git Gateway:

1. In Netlify dashboard, click **"Deploys"**
2. Check deployment logs
3. Go to **"Functions"** to see Git Gateway logs

## Maintenance

### Regular Tasks

- Review CMS commits weekly
- Update translations if needed
- Monitor for errors in logs
- Test publishing occasionally

### Backup Strategy

- GitHub is your version control
- Keep backups of important JSON files
- Document any manual changes
- Use GitHub branches for testing

## Next Steps

1. Complete all setup steps above
2. Test the CMS with Gustav
3. Add more collections if needed
4. Monitor initial edits
5. Document any customizations
6. Plan for scaling

## Support

- **Decap CMS**: https://decapcms.org/docs/intro/
- **Netlify**: https://docs.netlify.com/
- **GitHub**: https://docs.github.com/

---

**Your CMS is ready to integrate with Cold Experience!**
