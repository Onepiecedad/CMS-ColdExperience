# Cold Experience - Full Site CMS Integration Guide

This guide covers integrating the complete Decap CMS solution with your existing Cold Experience React SPA, enabling management of all pages and content through the CMS.

## Overview

The CMS is configured to manage **all content** on coldexperience.se:

- **Global Settings** - Site configuration, navigation, footer, contact info
- **Home Page** - Hero, highlights, featured experiences
- **About Page** - Team information, mission statement
- **Packages Page** - Package offerings and pricing
- **Gallery Page** - Image gallery with captions
- **Contact Page** - Contact information and form
- **Experiences** - Individual experience listings (snowmobile, aurora, dog sled, lodging)
- **FAQ** - Frequently asked questions
- **Blog/News** - Optional blog functionality for future use

All content is available in **4 languages**: Swedish (master), English, German, Polish.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    coldexperience.se                         │
│                   (React SPA on Netlify)                     │
│                                                               │
│  Reads JSON from:                                             │
│  ├── frontend/public/locales/sv/*.json                       │
│  ├── frontend/public/locales/en/*.json                       │
│  ├── frontend/public/locales/de/*.json                       │
│  └── frontend/public/locales/pl/*.json                       │
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
│  ├── frontend/public/media/*                                 │
│  └── content/site.json                                       │
└─────────────────────────────────────────────────────────────┘
                              ↑
                      (CMS writes to)
                              │
┌─────────────────────────────────────────────────────────────┐
│         Decap CMS (admin.coldexperience.se)                 │
│                                                               │
│  Hosted on Netlify / Vercel                                  │
│  Edits JSON files via GitHub API                             │
│  Auto-translates via n8n (DeepL/OpenAI)                      │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

The CMS is configured to write to this structure:

```
frontend/
├── public/
│   ├── locales/
│   │   ├── sv/                          # Swedish (Master)
│   │   │   ├── home.json
│   │   │   ├── about.json
│   │   │   ├── packages.json
│   │   │   ├── gallery.json
│   │   │   ├── contact.json
│   │   │   ├── experiences/             # Individual experiences
│   │   │   │   ├── snowmobile.json
│   │   │   │   ├── aurora-hunt.json
│   │   │   │   └── ...
│   │   │   ├── faq/                     # Individual FAQ items
│   │   │   │   ├── is-it-safe.json
│   │   │   │   └── ...
│   │   │   └── blog/                    # Optional blog
│   │   ├── en/                          # English (Auto-translated)
│   │   ├── de/                          # German (Auto-translated)
│   │   └── pl/                          # Polish (Auto-translated)
│   └── media/                           # Uploaded images
│       ├── hero-image.jpg
│       ├── experience-1.jpg
│       └── ...
└── src/
    └── (React components read from locales/)
```

## Setup Steps

### 1. Deploy CMS to Netlify

1. Create a new Netlify site from the CMS repository
2. Build command: `echo "Static CMS - no build needed"`
3. Publish directory: `.` (root)
4. Deploy

### 2. Enable Netlify Identity

1. In Netlify site settings, click **"Identity"**
2. Click **"Enable Identity"**
3. Invite Gustav's email address
4. Go to **"Services"** and enable **"Git Gateway"**

### 3. Configure Custom Domain

Add DNS CNAME record:
- Name: `admin`
- Value: Your Netlify site URL (e.g., `cold-cms.netlify.app`)

Then configure custom domain in Netlify settings.

### 4. Test CMS Access

1. Go to `https://admin.coldexperience.se`
2. Log in with GitHub
3. You should see these sections:
   - Site Settings
   - Home Page
   - About Page
   - Packages Page
   - Gallery Page
   - Contact Page
   - Experiences
   - FAQ
   - Blog / News

### 5. Create Initial Content Files

Before Gustav can edit, you need to create the JSON files in your repository:

```bash
# Create directory structure
mkdir -p frontend/public/locales/sv/{experiences,faq,blog}
mkdir -p frontend/public/locales/en/{experiences,faq,blog}
mkdir -p frontend/public/locales/de/{experiences,faq,blog}
mkdir -p frontend/public/locales/pl/{experiences,faq,blog}

# Create initial JSON files (see examples below)
```

**Example: frontend/public/locales/sv/home.json**
```json
{
  "heroTitle": "Experience the Magic of Lapland",
  "heroSubtitle": "Embark on an unforgettable winter adventure...",
  "heroCTA": "Book Your Adventure",
  "highlightsTitle": "Why our guests choose us",
  "highlight1Title": "Small Private Groups",
  "highlight1Desc": "Exclusive experiences with your family and friends",
  "highlight2Title": "Authentic Local Food",
  "highlight2Desc": "Locally sourced elk, reindeer, and traditional flatbread",
  "highlight3Title": "Complete Experience",
  "highlight3Desc": "Sauna, hot tub, and Northern Lights under starry skies",
  "featuredTitle": "Our Experiences",
  "featuredDesc": "Choose from our range of cold water experiences"
}
```

**Example: frontend/public/locales/sv/experiences/snowmobile.json**
```json
{
  "title": "Snowmobile Tours",
  "summary": "Feel the thrill of driving your own snowmobile through untouched winter landscapes",
  "description": "Professional snowmobiles, safety gear included, expert local guides...",
  "priceFrom": 1250,
  "duration": "Full day",
  "season": "Winter",
  "difficulty": "Beginner",
  "featuredImage": "/media/snowmobile-hero.jpg",
  "gallery": [
    {"image": "/media/snowmobile-1.jpg", "caption": "Riding through winter landscape"},
    {"image": "/media/snowmobile-2.jpg", "caption": "Aurora borealis above"}
  ],
  "itinerary": [
    {"time": "08:00", "activity": "Pickup", "description": "We pick you up from your accommodation"},
    {"time": "09:00", "activity": "Safety briefing", "description": "Learn snowmobile basics"}
  ],
  "includes": ["Snowmobile rental", "Safety gear", "Guide", "Lunch"],
  "notIncluded": ["Transportation to/from accommodation"],
  "seoTitle": "Snowmobile Tours in Lapland",
  "seoDescription": "Experience thrilling snowmobile tours through Lapland's winter landscapes"
}
```

### 6. Update React App to Read from CMS

Your React app should read content from the JSON files. Example:

```jsx
// Hook to load content
const useContent = (page, lang = 'sv') => {
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    fetch(`/locales/${lang}/${page}.json`)
      .then(res => res.json())
      .then(data => setContent(data));
  }, [page, lang]);
  
  return content;
};

// Usage in component
function HomePage() {
  const home = useContent('home');
  
  return (
    <div>
      <h1>{home?.heroTitle}</h1>
      <p>{home?.heroSubtitle}</p>
    </div>
  );
}
```

### 7. Configure n8n Auto-Translation

Set up n8n to automatically translate Swedish content to other languages:

1. Create n8n workflow that:
   - Listens for GitHub push events
   - Detects changes in `frontend/public/locales/sv/`
   - Translates new/changed keys to EN, DE, PL
   - Applies glossary terms
   - Commits translated files

2. Workflow steps:
   ```
   GitHub Webhook (push event)
     ↓
   Get sv.json files from GitHub
     ↓
   Compare with previous version
     ↓
   Extract changed keys
     ↓
   Translate using DeepL/OpenAI
     ↓
   Apply glossary
     ↓
   Update en.json, de.json, pl.json
     ↓
   Commit to GitHub
   ```

## CMS Collections Reference

### Site Settings
Edit global site configuration, contact info, social links, SEO.

### Home Page
Edit hero section, highlights, featured experiences section.

### About Page
Edit team information, mission statement, team member bios.

### Packages Page
Edit package offerings, pricing, descriptions.

### Gallery Page
Edit gallery images and captions.

### Contact Page
Edit contact information, form copy, map location.

### Experiences (Collection)
Create/edit individual experience items:
- Title, summary, full description
- Pricing, duration, season, difficulty
- Featured image and gallery
- Itinerary items
- What's included/not included
- SEO metadata

### FAQ (Collection)
Create/edit individual FAQ items:
- Question and answer
- Category (General, Safety, Booking, Health)
- Display order

### Blog / News (Optional)
Create/edit blog posts for future use:
- Title, date, summary, body
- Featured image
- Author, tags

## Workflow for Gustav

1. Go to `https://admin.coldexperience.se`
2. Log in with GitHub
3. Select a section to edit
4. Make changes
5. Click **"Publish"**
6. Changes are committed to GitHub
7. n8n automatically translates to other languages
8. Netlify rebuilds your React app
9. Changes go live

## Workflow for Joakim (Developer)

1. Monitor GitHub commits from CMS
2. Review changes if needed
3. Update `config.yml` to add new sections
4. Redeploy CMS when configuration changes
5. Manage n8n translation workflow
6. Handle any technical issues

## Important Notes

### Language Hierarchy

- **Swedish (SV)** is the master language
- Edit Swedish first
- n8n automatically translates to EN, DE, PL
- Don't manually edit other languages (they'll be overwritten)

### Media Management

- Images uploaded via CMS go to `/frontend/public/media/`
- Reference them in JSON as `/media/filename.jpg`
- Optimize images before uploading (use TinyPNG or similar)

### Git Workflow

- All changes are version-controlled in GitHub
- Every edit creates a commit
- You can revert changes via GitHub if needed
- No database—everything is in Git

### Performance

- Content is static JSON files
- No runtime API calls
- Fast page loads
- Great for SEO

## Troubleshooting

### CMS Won't Load
- Verify Netlify Identity is enabled
- Check Git Gateway is enabled
- Clear browser cache
- Check browser console for errors

### Publish Fails
- Verify GitHub repository is accessible
- Check Netlify has write permissions
- Review browser console for errors

### Changes Not Appearing
- Wait 1-2 minutes for rebuild
- Force refresh browser (Ctrl+Shift+R)
- Check GitHub for commits
- Verify Netlify build logs

### Translation Issues
- Check n8n workflow is active
- Verify API keys are valid
- Check glossary is properly formatted
- Review n8n execution logs

## Next Steps

1. Deploy CMS to Netlify
2. Enable Netlify Identity
3. Configure custom domain
4. Create initial JSON files
5. Update React app to read from CMS
6. Set up n8n translation workflow
7. Invite Gustav to CMS
8. Test full workflow
9. Go live!

## Support

- **Decap CMS**: https://decapcms.org/docs/intro/
- **Netlify**: https://docs.netlify.com/
- **GitHub**: https://docs.github.com/
- **n8n**: https://docs.n8n.io/

---

**Your complete CMS is ready for integration!**
