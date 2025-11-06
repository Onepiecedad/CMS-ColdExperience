# n8n Auto-Translation Workflow Setup

This guide covers setting up the n8n workflow for automatic translation of Swedish i18n keys to English, German, and Polish.

## Overview

The workflow automatically:

1. **Detects changes** to `i18n/sv.json` when pushed to GitHub
2. **Extracts changed keys** and compares with previous version
3. **Loads glossary** for brand terminology preservation
4. **Translates** using DeepL API (or OpenAI GPT-4o as alternative)
5. **Updates** en.json, de.json, pl.json files
6. **Commits** back to GitHub with auto-translation message
7. **Notifies** via Slack (optional)

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- GitHub account with repository access
- DeepL API key (free tier available: 500,000 characters/month)
- Optional: Slack workspace for notifications

## Step 1: Set Up Environment Variables

Add these to your n8n environment or workflow:

```bash
# GitHub
GITHUB_OWNER=Onepiecedad
GITHUB_REPO=ColdExperience
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx

# DeepL
DEEPL_API_KEY=xxxxxxxxxxxxxxxx:fx

# Optional: Slack
SLACK_CHANNEL=#translations
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Optional: OpenAI (alternative to DeepL)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

## Step 2: Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click **"Generate new token"**
3. Name: `n8n-auto-translate`
4. Select scopes:
   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Actions and workflows)
5. Copy the token and save as `GITHUB_TOKEN`

## Step 3: Create DeepL API Account

1. Go to https://www.deepl.com/pro
2. Sign up for free account (500,000 characters/month)
3. Go to Account → API keys
4. Copy your API key and save as `DEEPL_API_KEY`

## Step 4: Import Workflow to n8n

### Option A: Import JSON File

1. Open n8n dashboard
2. Click **"Create workflow"**
3. Click **"Import from file"**
4. Select `n8n-auto-translate-workflow.json`
5. Click **"Import"**

### Option B: Manual Setup

If importing doesn't work, set up manually:

1. Create new workflow
2. Add **GitHub Trigger** node:
   - Event: `push`
   - Filter by branch: `main`
   - Filter by path: `i18n/sv.json`
3. Add **GitHub** node to get file content
4. Add **Code** node to detect changes
5. Add **GitHub** nodes to get en.json, de.json, pl.json
6. Add **DeepL** nodes to translate to each language
7. Add **Code** node to merge translations
8. Add **GitHub** nodes to commit updated files
9. Add **Slack** node for notifications (optional)

## Step 5: Configure Credentials

### GitHub Credentials

1. In n8n, go to **Credentials**
2. Click **"Create new"** → **"GitHub"**
3. Fill in:
   - **GitHub Server**: `github.com`
   - **GitHub Access Token**: (paste your token)
4. Click **"Save"**

### DeepL Credentials

1. Go to **Credentials** → **"Create new"** → **"DeepL API"**
2. Fill in:
   - **API Key**: (paste your DeepL key)
3. Click **"Save"**

### Slack Credentials (Optional)

1. Go to **Credentials** → **"Create new"** → **"Slack"**
2. Follow OAuth flow to authorize
3. Click **"Save"**

## Step 6: Configure Workflow Nodes

### GitHub Webhook Node

- **Events**: `push`
- **Filters**:
  - Branch: `main`
  - Path: `i18n/sv.json`

### Get Swedish File Node

- **Resource**: `File`
- **Operation**: `Get`
- **Owner**: `{{ $env.GITHUB_OWNER }}`
- **Repository**: `{{ $env.GITHUB_REPO }}`
- **File Path**: `i18n/sv.json`
- **Branch**: `main`

### Detect Changed Keys Node (Code)

This node extracts only the keys that changed:

```javascript
// Parse Swedish translations
const svContent = Buffer.from(
  JSON.parse(JSON.stringify($input.all()[0].json.content)), 
  'base64'
).toString('utf-8');
const svData = JSON.parse(svContent);

// Find changed keys by comparing with previous version
const changedKeys = {};
// ... (implementation in workflow)

return { svData, changedKeys };
```

### DeepL Translation Nodes

For each language (EN, DE, PL):

- **Method**: `POST`
- **URL**: `https://api.deepl.com/v2/translate`
- **Authentication**: DeepL API
- **Body**:
  - `text`: Changed keys (JSON string)
  - `target_lang`: `EN`, `DE`, or `PL`
  - `preserve_formatting`: `true`

### Commit Nodes

For each language file:

- **Resource**: `File`
- **Operation**: `Update`
- **Owner**: `{{ $env.GITHUB_OWNER }}`
- **Repository**: `{{ $env.GITHUB_REPO }}`
- **File Path**: `i18n/en.json` (or de.json, pl.json)
- **Commit Message**: `CMS: Auto-translate i18n keys to English`
- **Branch**: `main`

### Slack Notification (Optional)

- **Channel**: `{{ $env.SLACK_CHANNEL }}`
- **Message**: Customize notification text

## Step 7: Test the Workflow

1. Make a test change to `i18n/sv.json`:
   ```json
   {
     "test": {
       "message": "Hej världen"
     }
   }
   ```

2. Commit and push to GitHub

3. Watch n8n workflow execute:
   - Webhook triggers
   - Detects changes
   - Translates keys
   - Commits to en.json, de.json, pl.json
   - Sends Slack notification

4. Verify translations in GitHub:
   - Check en.json, de.json, pl.json
   - Verify translations are correct
   - Check commit messages

## Step 8: Set Up Workflow Trigger

### Option A: GitHub Webhook (Recommended)

1. In n8n workflow, click **"Trigger"** button
2. Copy the webhook URL
3. Go to GitHub repository → Settings → Webhooks
4. Click **"Add webhook"**
5. **Payload URL**: (paste n8n webhook URL)
6. **Content type**: `application/json`
7. **Events**: `Push events`
8. Click **"Add webhook"**

### Option B: n8n Cloud Trigger

If using n8n Cloud:

1. Workflow automatically has a trigger URL
2. Add GitHub webhook pointing to that URL
3. No additional setup needed

## Troubleshooting

### Workflow Doesn't Trigger

**Problem**: Webhook doesn't fire when pushing to GitHub

**Solutions**:
- Verify webhook URL is correct in GitHub
- Check n8n workflow is active (toggle on)
- Verify branch filter is set to `main`
- Check GitHub webhook delivery logs

### Translation Fails

**Problem**: DeepL API returns error

**Solutions**:
- Verify API key is correct
- Check DeepL account has available characters
- Verify request format is correct
- Check n8n logs for error details

### Commit Fails

**Problem**: GitHub commit doesn't work

**Solutions**:
- Verify GitHub token has `repo` scope
- Check token hasn't expired
- Verify file paths are correct
- Check branch exists

### Glossary Not Applied

**Problem**: Brand terms aren't translated correctly

**Solutions**:
- Verify glossary.csv format is correct
- Check glossary file path is correct
- Manually apply glossary terms if needed
- Consider using OpenAI GPT-4o instead (better context)

## Alternative: Using OpenAI GPT-4o

If you prefer OpenAI over DeepL:

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Replace DeepL nodes with HTTP Request nodes:

```javascript
// OpenAI Translation Request
{
  "method": "POST",
  "url": "https://api.openai.com/v1/chat/completions",
  "headers": {
    "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}"
  },
  "body": {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are a professional translator. Translate the following Swedish text to English, preserving all placeholders and formatting. Use this glossary: {{ glossary }}"
      },
      {
        "role": "user",
        "content": "{{ changedKeys }}"
      }
    ]
  }
}
```

Benefits of GPT-4o:
- Better context understanding
- Preserves placeholders automatically
- Applies glossary more intelligently
- More expensive (but higher quality)

## Monitoring

### Check Workflow Executions

1. Open workflow in n8n
2. Click **"Executions"** tab
3. View execution history:
   - Successful executions (green)
   - Failed executions (red)
   - Execution time and details

### Enable Slack Notifications

1. Configure Slack credentials
2. Add Slack node to workflow
3. Send notifications on:
   - Successful translation
   - Translation errors
   - Missing keys

### Monitor GitHub Commits

1. Go to GitHub repository
2. Click **"Commits"**
3. Filter by "auto-translate" message
4. Review translations regularly

## Best Practices

1. **Test before production**: Test with small changes first
2. **Review translations**: Manually review auto-translations occasionally
3. **Keep glossary updated**: Update glossary.csv when adding new brand terms
4. **Monitor API usage**: Track DeepL character usage to avoid overage
5. **Set up alerts**: Configure n8n alerts for failed executions
6. **Document changes**: Keep notes on translation rules and exceptions

## Maintenance

### Monthly Tasks

- Review translation quality
- Update glossary with new terms
- Check API usage and costs
- Monitor workflow execution logs

### Quarterly Tasks

- Review and optimize workflow
- Update translation rules if needed
- Audit glossary for accuracy
- Plan for scaling

## Support

- **n8n Docs**: https://docs.n8n.io/
- **DeepL API**: https://www.deepl.com/docs-api
- **OpenAI API**: https://platform.openai.com/docs
- **GitHub API**: https://docs.github.com/en/rest

---

**Your auto-translation workflow is ready!**
