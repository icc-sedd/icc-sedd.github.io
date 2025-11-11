# Security Best Practices for Google API Keys

## Current Setup Analysis
Your application is hosted on GitHub Pages (static site) and uses Google Sheets API with a restricted API key. This is the recommended approach for frontend applications.

## Why API Keys MUST be in Frontend Code for GitHub Pages
- GitHub Pages is a static hosting service - no backend
- The browser must directly call Google APIs
- Therefore, API keys must be embedded in the frontend code
- **This is normal and expected for frontend-only applications**

## Security Measures to Protect Your API Key

### 1. Restrict API Key in Google Cloud Console ⭐ CRITICAL
**Steps:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Find your API key
3. Click on it to edit
4. Under "Application restrictions", select "HTTP referrers (web sites)"
5. Add your domain: `https://icc-sedd.github.io/*`
6. Click Save

**This ensures the key only works when called from your website.**

### 2. Limit API Permissions
Your API key should only have access to:
- Google Sheets API (Read-only)
- Google Drive API (Read-only, for querying sheet metadata)

**Do NOT enable:**
- Admin APIs
- Cloud Storage
- Any write operations

### 3. Rotate Keys Regularly
- Create new keys every 3-6 months
- Keep old keys for a short transition period
- Delete old keys after confirming new ones work

### 4. Monitor Usage
1. Go to Google Cloud Console
2. Navigate to **APIs & Services** → **Quotas**
3. Set up alerts for unusual usage patterns

### 5. Never Expose Other Secrets
- Never expose your **Google Apps Script endpoint** restrictions (if any)
- Keep the Apps Script URL URL-obscured when possible
- The endpoint uses `mode: 'no-cors'` for safety

## Environment Variable Best Practices

### Never Commit .env Files
✓ Add `.env` to `.gitignore` (already done)
✓ Use `.env.example` as documentation
✗ Never check in actual secrets

### GitHub Actions Secrets
- API keys SHOULD be stored as GitHub repository secrets
- They will be embedded at build time
- This is secure because GitHub masks secret values in logs

### Local Development
- Create `.env` locally with restricted keys
- Never push `.env` to repository
- Use separate keys for development (optional but recommended)

## What to Do After Key Exposure

1. **Immediate Actions:**
   - [ ] Revoke the exposed key in Google Cloud Console
   - [ ] Create a new API key
   - [ ] Restrict the new key to your domain
   - [ ] Update `.env` locally
   - [ ] Update GitHub repository secrets
   - [ ] Run `npm run deploy` to rebuild with new key

2. **Verification:**
   - [ ] Test that RSVP form works on live site
   - [ ] Check Google Cloud Console for key usage
   - [ ] Verify no errors in browser console

3. **Monitoring:**
   - [ ] Set up quotas and alerts
   - [ ] Check usage weekly for first month
   - [ ] Report any unusual activity

## References
- https://developers.google.com/sheets/api/guides/authorizing
- https://cloud.google.com/docs/authentication/api-keys
- https://cloud.google.com/docs/authentication/application-default-credentials
