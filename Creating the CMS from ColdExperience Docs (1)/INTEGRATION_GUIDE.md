# Cold Experience - Headless CMS Integration Guide

## Overview

This is a **headless CMS** solution for Cold Experience that integrates with your existing React SPA. The CMS writes JSON files directly to your repository, which your React app reads from. No runtime API calls needed—everything is Git-first.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    coldexperience.se                         │
│                   (React SPA on Netlify)                     │
│                                                               │
│  Reads JSON from: frontend/public/locales/sv|en|de|pl/      │
└─────────────────────────────────────────────────────────────┘
                              ↑
                         (Git pulls)
                              │
┌─────────────────────────────────────────────────────────────┐
│              GitHub Repository (Main Source)                 │
│                                                               │
│  ├── frontend/public/locales/sv/*.json                       │
│  ├── frontend/public/locales/en/*.json                       │
│  ├── frontend/public/locales/de/*.json                       │
│  ├── frontend/public/locales/pl/*.json                       │
│  └── frontend/src/data/packagesConfig.js                     │
└─────────────────────────────────────────────────────────────┘
                              ↑
                      (CMS writes to)
                              │
┌─────────────────────────────────────────────────────────────┐
│            admin.coldexperience.se (Decap CMS)              │
│                                                               │
│  Hosted on Netlify / Vercel                                  │
│  Edits JSON files via GitHub API                             │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Deploy CMS to Netlify

The CMS is a static site that needs to be deployed separately from your main React app.

**Option A: Deploy to Netlify (Recommended)**

1. Create a new Netlify site from this repository
2. Build command: `echo "Static CMS - no build needed"`
3. Publish directory: `.` (root)
4. Environment variables: None needed

**Option B: Deploy to Vercel**

1. Create a new Vercel project from this repository
2. Framework: Other
3. Build command: (leave empty)
4. Output directory: (leave empty)

### 2. Configure Netlify Identity

Netlify Identity is needed for GitHub authentication in Decap CMS.

1. Go to your Netlify site settings
2. Click **"Identity"** in the left sidebar
3. Click **"Enable Identity"**
4. Click **"Invite users"** and add Gustav's email
5. Go to **"Services"** and enable **"Git Gateway"**

This allows Decap CMS to commit directly to your GitHub repository.

### 3. Configure Custom Domain

To expose the CMS on `admin.coldexperience.se`:

1. In your domain registrar (wherever you manage coldexperience.se), add a DNS record:
   - Type: `CNAME`
   - Name: `admin`
   - Value: Your Netlify site URL (e.g., `cold-experience-cms.netlify.app`)

2. In Netlify site settings, go to **"Domain management"**
3. Click **"Add domain"** and enter `admin.coldexperience.se`
4. Verify the DNS configuration

Now the CMS will be accessible at `https://admin.coldexperience.se`

### 4. GitHub Repository Configuration

The CMS needs write access to your GitHub repository.

1. Go to your GitHub repository settings
2. Click **"Collaborators"** (or "Access" if using organization)
3. Add the Netlify app as a collaborator (it will be auto-added when you enable Git Gateway)
4. Ensure the repository is public or Netlify has access

### 5. Test the Integration

1. Go to `https://admin.coldexperience.se`
2. Click **"Login with GitHub"**
3. Authorize the application
4. You should see the CMS dashboard
5. Try editing a field in the Hero section
6. Click **"Publish"**
7. Go to your GitHub repository and verify the JSON file was updated
8. Your React app will automatically pick up the changes on next build

## CMS Collections

The CMS is configured to edit the following sections:

### Hero Section
- File: `frontend/public/locales/{lang}/hero.json`
- Editable fields:
  - Choose Language
  - Premium text
  - Title and Magic text
  - Subtitle
  - CTA buttons
  - Feature descriptions (4 features)

### Experiences Section
- File: `frontend/public/locales/{lang}/experiences.json`
- Editable fields:
  - Title and highlight
  - Intro text
  - Snowmobile tour details (title, description, 4 features)
  - Northern Lights details (title, description, 4 features)
  - Dog sledding details (title, description, 4 features)
  - Lodging details (title, description, 4 features)
  - CTA section

## Adding More Collections

To add more sections to the CMS:

1. Edit `config.yml`
2. Add a new collection for each section
3. Reference the correct JSON file path
4. Define all fields that should be editable
5. Redeploy the CMS

Example: Adding a "Why" section

```yaml
- name: "why"
  label: "Why Choose Us"
  files:
    - file: "frontend/public/locales/sv/why.json"
      label: "Why (Swedish)"
      name: "why_sv"
      fields:
        - {label: "Title", name: "title", widget: "string"}
        - {label: "Description", name: "description", widget: "text"}
        # ... add more fields
```

## Workflow

### For Gustav (Editor)

1. Go to `https://admin.coldexperience.se`
2. Log in with GitHub
3. Select a section to edit (Hero, Experiences, etc.)
4. Make changes
5. Click **"Publish"**
6. Changes are committed to GitHub
7. Netlify rebuilds your React app
8. Changes go live automatically

### For Joakim (Developer)

1. Monitor GitHub for CMS commits
2. Review changes if needed
3. Manually edit `config.yml` to add new sections
4. Redeploy CMS when configuration changes
5. Manage packages configuration in `frontend/src/data/packagesConfig.js`

## Important Notes

### JSON File Format

The CMS writes JSON files in the same format as your existing files:

```json
{
  "key1": "value1",
  "key2": "value2",
  "nested": {
    "key3": "value3"
  }
}
```

The CMS preserves the structure and formatting.

### Language Sync

The CMS edits each language independently. You'll need to:

1. Edit Swedish version first
2. Manually translate to other languages, OR
3. Set up an automated translation workflow (optional)

### Media Management

Currently, the CMS is configured to upload media to `frontend/public/media/`. You can:

1. Upload images via the CMS
2. Reference them in JSON files
3. Use them in your React components

### Packages Configuration

The `packagesConfig.js` file is NOT currently editable via CMS. To update packages:

1. Edit `frontend/src/data/packagesConfig.js` directly
2. Commit and push
3. Netlify rebuilds automatically

To make packages editable via CMS, we can create a separate collection.

## Troubleshooting

### "Login Failed"

- Ensure Netlify Identity is enabled
- Check that Git Gateway is enabled
- Verify your GitHub account has access to the repository
- Try clearing browser cookies and logging in again

### "Publish Failed"

- Check that the GitHub repository is accessible
- Verify Netlify has write permissions
- Check the browser console for error messages
- Review Netlify logs for Git Gateway errors

### "Changes Not Appearing"

- Wait for Netlify to rebuild (usually 30-60 seconds)
- Check the GitHub repository to verify the commit was made
- Force refresh your React app (Ctrl+Shift+R or Cmd+Shift+R)
- Check Netlify deployment logs for build errors

### "JSON File Corrupted"

- The CMS should preserve JSON formatting
- If a file becomes corrupted, restore from GitHub history
- Check the file in the GitHub repository to verify format

## File Locations

All files edited by the CMS are located in your main repository:

```
frontend/
├── public/
│   ├── locales/
│   │   ├── sv/
│   │   │   ├── hero.json          ← CMS edits
│   │   │   ├── experiences.json   ← CMS edits
│   │   │   └── ... (other files)
│   │   ├── en/
│   │   ├── de/
│   │   └── pl/
│   └── media/                      ← CMS uploads
└── src/
    └── data/
        └── packagesConfig.js       ← Manual edit
```

## Next Steps

1. Deploy this CMS to Netlify
2. Configure Netlify Identity and Git Gateway
3. Set up the `admin.coldexperience.se` domain
4. Invite Gustav to the CMS
5. Test editing and publishing content
6. Add more collections as needed
7. Set up automated translation (optional)

## Support

For issues or questions:

1. Check this guide first
2. Review Netlify and GitHub documentation
3. Check Decap CMS documentation: https://decapcms.org/
4. Contact Netlify support if needed

---

**Your CMS is ready to integrate with your existing React app!**
