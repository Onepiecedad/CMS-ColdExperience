# SOP – Image Management

## Goal
Allow editors to upload and change images directly via Decap CMS with zero developer input.

## Storage
All images are stored under `/public/media` and referenced in JSON as relative paths.

## User Flow
1. Editor opens “Home” or “Experience” in admin.
2. Clicks “Hero Image” or “Gallery”.
3. Uploads new file → Decap saves it to `/public/media`.
4. CMS updates JSON with file path.
5. GitHub commit triggers Vercel rebuild → new image live.
