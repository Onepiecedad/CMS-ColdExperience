# Cold Experience CMS - Test Checklist

Complete this checklist to verify the CMS integration works end-to-end.

## Pre-Testing Setup

- [ ] All JSON files created in `/content` directory
- [ ] All i18n files created in `/i18n` directory
- [ ] Glossary.csv populated with brand terms
- [ ] React app updated to read from JSON files
- [ ] CMS deployed to Netlify/Vercel
- [ ] GitHub webhook configured
- [ ] n8n workflow imported and configured
- [ ] DeepL API key added to n8n
- [ ] GitHub token added to n8n

## 1. CMS Access & Authentication

### Test: Login to CMS

- [ ] Navigate to `https://admin.coldexperience.se` (or your CMS URL)
- [ ] Click **"Login with GitHub"**
- [ ] Authorize the application
- [ ] Successfully logged in to CMS dashboard
- [ ] See all collections in left sidebar:
  - [ ] Site Settings
  - [ ] Home Page
  - [ ] About Page
  - [ ] Packages Page
  - [ ] Gallery Page
  - [ ] Contact Page
  - [ ] Experiences
  - [ ] FAQ
  - [ ] Blog / News

### Test: Logout

- [ ] Click user menu (top right)
- [ ] Click **"Logout"**
- [ ] Redirected to login page

## 2. Content Editing

### Test: Edit Home Page (Swedish)

- [ ] Click **"Home Page"** in sidebar
- [ ] Click **"Home (Swedish)"**
- [ ] Edit hero title: Change to "Test Title"
- [ ] Click **"Publish"**
- [ ] See success message
- [ ] Verify change in GitHub commit

### Test: Edit Experience

- [ ] Click **"Experiences"** in sidebar
- [ ] Click **"Snowmobile Tours"**
- [ ] Edit title: Change to "Test Snowmobile"
- [ ] Edit price: Change to 9999
- [ ] Click **"Publish"**
- [ ] See success message
- [ ] Verify change in GitHub

### Test: Create New Experience

- [ ] Click **"Experiences"** in sidebar
- [ ] Click **"Create New"**
- [ ] Fill in fields:
  - [ ] Title: "Test Experience"
  - [ ] Summary: "Test summary"
  - [ ] Description: "Test description"
  - [ ] Price: 1000
  - [ ] Duration: "Half day"
  - [ ] Season: "Winter"
  - [ ] Difficulty: "Beginner"
- [ ] Upload featured image
- [ ] Click **"Publish"**
- [ ] New file created in GitHub

### Test: Edit FAQ

- [ ] Click **"FAQ"** in sidebar
- [ ] Click **"Is it safe?"**
- [ ] Edit answer text
- [ ] Click **"Publish"**
- [ ] Verify change in GitHub

## 3. Media Management

### Test: Upload Image

- [ ] Click **"Home Page"** → **"Home (Swedish)"**
- [ ] Find **"Hero Image"** field
- [ ] Click to upload image
- [ ] Select image from computer
- [ ] Image uploads successfully
- [ ] Image appears in media folder in GitHub
- [ ] Image path shows as `/media/filename.jpg`

### Test: Image in Gallery

- [ ] Click **"Gallery Page"** → **"Gallery (Swedish)"**
- [ ] Add gallery image
- [ ] Upload image
- [ ] Add caption
- [ ] Click **"Publish"**
- [ ] Image appears in `/frontend/public/media/`

## 4. Multi-Language Support

### Test: Edit English Home Page

- [ ] Click **"Home Page"** → **"Home (English)"**
- [ ] Verify content is in English
- [ ] Edit a field
- [ ] Click **"Publish"**
- [ ] Verify change in `en.json`

### Test: Edit German Home Page

- [ ] Click **"Home Page"** → **"Home (German)"**
- [ ] Verify content is in German
- [ ] Edit a field
- [ ] Click **"Publish"**
- [ ] Verify change in `de.json`

### Test: Edit Polish Home Page

- [ ] Click **"Home Page"** → **"Home (Polish)"**
- [ ] Verify content is in Polish
- [ ] Edit a field
- [ ] Click **"Publish"**
- [ ] Verify change in `pl.json`

## 5. Auto-Translation Workflow

### Test: Trigger Auto-Translation

- [ ] Edit `i18n/sv.json` in GitHub directly
- [ ] Add new key: `"test": { "message": "Hej världen" }`
- [ ] Commit and push
- [ ] Watch n8n workflow execute:
  - [ ] Webhook triggers
  - [ ] Workflow starts
  - [ ] Detects changes
  - [ ] Translates to EN/DE/PL
  - [ ] Commits back to GitHub

### Test: Verify Translations

- [ ] Check `i18n/en.json`:
  - [ ] New key exists
  - [ ] Translation is in English
  - [ ] Not Swedish text
- [ ] Check `i18n/de.json`:
  - [ ] New key exists
  - [ ] Translation is in German
- [ ] Check `i18n/pl.json`:
  - [ ] New key exists
  - [ ] Translation is in Polish

### Test: Glossary Applied

- [ ] Add key with glossary term: `"lapland": "Lapland"`
- [ ] Trigger auto-translation
- [ ] Verify "Lapland" is NOT translated in other languages
- [ ] Verify glossary terms are preserved

### Test: Placeholders Preserved

- [ ] Add key with placeholder: `"greeting": "Hej {name}!"`
- [ ] Trigger auto-translation
- [ ] Verify `{name}` is preserved in all translations
- [ ] Not replaced with actual values

## 6. React App Integration

### Test: Home Page Loads

- [ ] Go to `https://coldexperience.se` (or your live site)
- [ ] Home page loads without errors
- [ ] Hero section displays
- [ ] Content matches JSON file
- [ ] Images load correctly

### Test: Language Switcher

- [ ] Click language switcher (top right)
- [ ] Select **"English"**
- [ ] Page content changes to English
- [ ] Select **"Swedish"**
- [ ] Page content changes back to Swedish
- [ ] Select **"German"** and **"Polish"**
- [ ] Content updates for each language

### Test: Experience Page

- [ ] Click on an experience (e.g., "Snowmobile Tours")
- [ ] Experience detail page loads
- [ ] All fields display:
  - [ ] Title
  - [ ] Summary
  - [ ] Description
  - [ ] Price
  - [ ] Duration
  - [ ] Gallery images
  - [ ] Itinerary
  - [ ] Includes/Not Included
- [ ] Images load correctly

### Test: About Page

- [ ] Navigate to About page
- [ ] Team section displays
- [ ] Team member info shows:
  - [ ] Name
  - [ ] Role
  - [ ] Bio
  - [ ] Image
- [ ] Mission statement displays

### Test: FAQ Page

- [ ] Navigate to FAQ page
- [ ] FAQ items display
- [ ] Click on FAQ item
- [ ] Answer expands
- [ ] Click again
- [ ] Answer collapses

### Test: Contact Page

- [ ] Navigate to Contact page
- [ ] Contact information displays:
  - [ ] Email
  - [ ] Phone
  - [ ] Address
- [ ] Contact form displays
- [ ] Form submits successfully

## 7. SEO & Meta Tags

### Test: Meta Tags Render

- [ ] View page source (Ctrl+U)
- [ ] Check `<title>` tag matches SEO title from JSON
- [ ] Check `<meta name="description">` matches SEO description
- [ ] Check Open Graph tags if implemented

### Test: SEO Fields in CMS

- [ ] Click **"Home Page"** → **"Home (Swedish)"**
- [ ] Scroll to SEO section
- [ ] Edit SEO title
- [ ] Edit SEO description
- [ ] Click **"Publish"**
- [ ] Verify in page source

## 8. Fallback & Error Handling

### Test: Missing Translation Fallback

- [ ] Delete a key from `en.json`
- [ ] Navigate to that page in English
- [ ] Content should fall back to Swedish
- [ ] No errors in console
- [ ] Page still displays

### Test: Missing JSON File

- [ ] Temporarily delete a JSON file
- [ ] Navigate to that page
- [ ] Error handling works:
  - [ ] Error message displays (or graceful fallback)
  - [ ] No blank page
  - [ ] No console errors

### Test: Invalid JSON

- [ ] Corrupt a JSON file (remove closing brace)
- [ ] Trigger a page load
- [ ] Error is caught and handled
- [ ] Fallback content displays

## 9. Performance & Caching

### Test: Content Caching

- [ ] Edit a page in CMS
- [ ] Publish changes
- [ ] Reload page in browser
- [ ] Changes appear within 2 seconds
- [ ] No stale content

### Test: Image Caching

- [ ] Upload new image
- [ ] Image appears on page
- [ ] Refresh page
- [ ] Image loads from cache
- [ ] No 404 errors

### Test: Translation Caching

- [ ] Switch languages
- [ ] Content loads quickly
- [ ] Switch back
- [ ] Content loads from cache

## 10. Build & Deployment

### Test: Build Succeeds

- [ ] Push changes to GitHub
- [ ] Netlify/Vercel build triggers
- [ ] Build completes successfully
- [ ] No build errors
- [ ] Deploy preview available

### Test: Live Deployment

- [ ] Build completes
- [ ] Changes deployed to production
- [ ] Live site reflects changes
- [ ] No downtime
- [ ] All pages accessible

### Test: Rollback

- [ ] If needed, rollback to previous commit
- [ ] Site reverts to previous state
- [ ] No data loss

## 11. Workflow Automation

### Test: CMS → GitHub → Build → Live

1. [ ] Edit content in CMS
2. [ ] Click **"Publish"**
3. [ ] Verify GitHub commit created
4. [ ] Verify Netlify build triggered
5. [ ] Verify build completes
6. [ ] Verify changes live on site
7. [ ] Total time: < 5 minutes

### Test: Auto-Translation Workflow

1. [ ] Edit Swedish i18n key
2. [ ] Commit to GitHub
3. [ ] n8n workflow triggers
4. [ ] Translations created
5. [ ] Commits pushed back
6. [ ] Build triggered
7. [ ] All languages updated
8. [ ] Total time: < 2 minutes

## 12. User Experience

### Test: Editor Workflow (Gustav)

- [ ] Login to CMS
- [ ] Edit home page title
- [ ] Click Publish
- [ ] See success message
- [ ] Check live site
- [ ] Change appears
- [ ] Process takes < 1 minute

### Test: Mobile Responsiveness

- [ ] View site on mobile device
- [ ] All pages responsive
- [ ] Images scale correctly
- [ ] Text readable
- [ ] Navigation works
- [ ] Forms functional

### Test: Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] All pages work correctly

## 13. Security

### Test: Authentication

- [ ] Only logged-in users can access CMS
- [ ] Logout works
- [ ] Session expires after timeout
- [ ] Cannot access CMS with invalid token

### Test: Authorization

- [ ] Only authorized users can edit
- [ ] Cannot edit without proper permissions
- [ ] Cannot delete content without confirmation

### Test: HTTPS

- [ ] Site accessible via HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid

## 14. Monitoring & Logging

### Test: Error Logging

- [ ] Trigger an error (e.g., invalid JSON)
- [ ] Error is logged
- [ ] Can view logs in n8n/Netlify
- [ ] Error details helpful for debugging

### Test: Slack Notifications

- [ ] Auto-translation completes
- [ ] Slack notification sent
- [ ] Notification contains relevant info
- [ ] Links to commits/builds work

## Final Sign-Off

- [ ] All tests passed
- [ ] No critical issues
- [ ] Performance acceptable
- [ ] Ready for production
- [ ] Document any known limitations

---

## Test Results Summary

| Test Category | Status | Notes |
|---|---|---|
| CMS Access | ✅ / ❌ | |
| Content Editing | ✅ / ❌ | |
| Media Management | ✅ / ❌ | |
| Multi-Language | ✅ / ❌ | |
| Auto-Translation | ✅ / ❌ | |
| React Integration | ✅ / ❌ | |
| SEO | ✅ / ❌ | |
| Error Handling | ✅ / ❌ | |
| Performance | ✅ / ❌ | |
| Build & Deploy | ✅ / ❌ | |
| Automation | ✅ / ❌ | |
| UX | ✅ / ❌ | |
| Security | ✅ / ❌ | |
| Monitoring | ✅ / ❌ | |

**Overall Status**: ✅ Ready / ❌ Issues Found

**Tested By**: _________________

**Date**: _________________

**Sign-Off**: _________________

---

**Congratulations! Your CMS is production-ready.** 🎉
