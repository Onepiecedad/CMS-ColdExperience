# ColdExperience CMS - Project TODO

## Phase 1: Project Setup & Architecture
- [x] Initialize Next.js 14 project with App Router
- [x] Set up Git repository structure
- [x] Configure TypeScript and ESLint

## Phase 2: Content Structure & i18n
- [x] Create `/content/pages/` directory structure
- [x] Create `/content/experiences/` directory structure
- [x] Create `/content/faq/` directory structure
- [x] Create `/i18n/` directory with language files (sv.json, en.json, de.json, pl.json)
- [x] Create `/i18n/glossary.csv` for brand terminology
- [x] Set up i18next configuration in Next.js
- [ ] Create i18n middleware for language routing

## Phase 3: Decap CMS Configuration
- [x] Create `/public/admin/config.yml` with Decap CMS configuration
- [ ] Configure GitHub backend authentication
- [x] Set up media folder at `/public/media`
- [x] Create Home page collection (hero, CTA fields)
- [x] Create Experiences collection (title, slug, summary, price, duration, season, gallery)
- [x] Create FAQ collection (question, answer)
- [ ] Test Decap CMS admin interface at `/admin`

## Phase 4: Frontend Components & Pages
- [x] Create layout components (Header, Footer, Navigation)
- [x] Create Home page component with hero section
- [x] Create Experiences listing page
- [x] Create Experience detail page with dynamic routing
- [x] Create FAQ page with accordion component
- [x] Implement responsive design with Tailwind CSS
- [ ] Add image optimization with Next.js Image component
- [x] Implement language switcher component

## Phase 5: i18n Integration
- [x] Integrate i18next with Next.js App Router
- [ ] Create language-based routing (/sv/, /en/, /de/, /pl/)
- [x] Implement useTranslation hook usage across components
- [x] Create translation utility functions
- [ ] Test language switching functionality

## Phase 6: Media Management
- [x] Set up `/public/media` directory
- [ ] Configure image upload handling in Decap CMS
- [ ] Implement image optimization pipeline
- [ ] Create media reference system in JSON content

## Phase 7: GitHub Integration
- [ ] Initialize GitHub repository
- [ ] Configure GitHub Actions for CI/CD
- [ ] Set up branch protection rules (main = production, dev = staging)
- [ ] Create GitHub webhook for n8n automation
- [ ] Configure GitHub API access for automation bot

## Phase 8: n8n Automation Setup
- [ ] Create n8n workflow for translation automation
- [ ] Implement diff detection for sv.json changes
- [ ] Integrate DeepL or OpenAI GPT-4o translation API
- [ ] Implement glossary lookup and application
- [ ] Set up automated commit and push to GitHub
- [ ] Configure GitHub webhook trigger for n8n

## Phase 9: Vercel Deployment
- [ ] Connect project to Vercel
- [ ] Configure environment variables
- [ ] Set up automatic deployments on GitHub push
- [ ] Configure preview deployments for branches
- [ ] Test production build and deployment

## Phase 10: Testing & Validation
- [ ] Test CMS content editing workflow
- [ ] Verify translation automation accuracy
- [ ] Test image upload and media management
- [ ] Validate language switching functionality
- [ ] Test full deployment pipeline (edit → translate → deploy)
- [ ] Performance testing and optimization

## Phase 11: Documentation & Handoff
- [x] Create user guide for Gustav (editor)
- [x] Document CMS editing workflow
- [x] Create troubleshooting guide
- [x] Document glossary management process
- [x] Create maintenance runbook for Joakim (owner)

## Phase 12: Launch & Monitoring
- [ ] Final QA and testing
- [ ] Go-live preparation
- [ ] Monitor initial deployments
- [ ] Gather feedback from Gustav and Joakim
- [ ] Document lessons learned
