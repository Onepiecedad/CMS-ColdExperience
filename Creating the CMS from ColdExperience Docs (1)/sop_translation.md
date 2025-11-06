# SOP – Automatic Translation (i18n)

## Objective
Ensure all languages (EN, DE, PL) stay synchronized with Swedish master content (`sv.json`) automatically.

## Flow
1. **Trigger:** Commit or save event modifies `i18n/sv.json`.
2. **Diff detection:** Compare old/new files → find changed keys.
3. **Translation:** Send new values to DeepL or OpenAI GPT-4o.
4. **Glossary:** Apply brand glossary (`/i18n/glossary.csv`) to preserve terms.
5. **Update:** Write translated text to `en.json`, `de.json`, `pl.json`.
6. **Validation:** Confirm JSON integrity.
7. **Commit:** Push to GitHub (main).
8. **Deploy:** Vercel auto-builds new site.

## Roles
| Role | Responsibility |
|------|----------------|
| **Editor (Gustav)** | Edits Swedish text only |
| **System (n8n)** | Performs translation and commit |
| **Owner (Joakim)** | Oversees automation, glossary updates |
