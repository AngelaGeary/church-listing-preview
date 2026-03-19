# 🚀 Quick Start Guide

Follow these steps to get your church listing preview system up and running:

## 1. Upload Files to GitHub

1. Download all the files from this folder
2. Go to your GitHub repository: https://github.com/[your-username]/church-listing-preview
3. Click "Add file" → "Upload files"
4. Drag and drop ALL files (or click to select them)
5. Commit with message: "Initial setup for church listing preview"

**Files to upload:**
- ✅ index.html
- ✅ listings.css
- ✅ netlify.toml
- ✅ package.json
- ✅ .gitignore
- ✅ README.md
- ✅ netlify/functions/get-church.js (create the folder structure)

## 2. Enable GitHub Pages (Optional - we'll use Netlify instead)

Actually, skip this! We're using Netlify for the serverless functions.

## 3. Deploy to Netlify

### A. Sign up/Login to Netlify
1. Go to https://app.netlify.com
2. Sign in with GitHub

### B. Import Your Repository
1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub"
3. Authorize Netlify to access your repositories
4. Select `church-listing-preview`
5. Click "Deploy site" (accept all defaults)

### C. Get Your Site URL
After deployment (takes ~1 minute), you'll get a URL like:
```
https://gleaming-pudding-abc123.netlify.app
```

You can customize this later in Site settings → Domain management.

## 4. Add Your Airtable API Key

**CRITICAL SECURITY STEP:**

1. In Netlify, go to **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add:
   - **Key:** `AIRTABLE_API_KEY`
   - **Value:** [Paste your NEW Airtable API key here]
4. Click "Create variable"
5. Go to **Deploys** tab → Click "Trigger deploy" → "Deploy site"

## 5. Test Your Preview

Once redeployed, test with a real church record:

```
https://your-site.netlify.app/?id=rec1PVwlMRc6H8YqK&type=standard
```

You should see Chelmsford Presbyterian Church's listing!

## 6. Update Your Airtable Formula

In Airtable, update the formula field that generates preview URLs:

```javascript
CONCATENATE(
  "https://your-actual-site.netlify.app/?id=",
  {Airtable ID (from Churches)},
  "&type=",
  LOWER({Listing type})
)
```

## 7. Update Stacker Embed

In Stacker:
1. Edit the church detail page
2. Find the embed field showing "Entry 2025 url"
3. Verify it's pulling from the updated formula field
4. Save and test!

## ✅ You're Done!

Church administrators can now:
- Edit their church details in Stacker
- Click "Refresh Preview" to see updates
- Preview updates in near-real-time

## 🆘 Need Help?

Common issues:
- **"Unable to load preview"** → Check environment variables in Netlify
- **Shows old data** → Wait 60 seconds or click Refresh
- **403/404 errors** → Verify record ID is correct

Check the full README.md for detailed troubleshooting.
