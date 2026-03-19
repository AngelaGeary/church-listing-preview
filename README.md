# Church Listing Preview System

This system generates live previews of church directory listings for the Evangelical Times Holiday Church Guide.

## Features

- ✅ Real-time preview updates from Airtable
- ✅ Three listing types: Standard, Enhanced, and Photo
- ✅ Refresh button for manual updates
- ✅ Secure API key handling via serverless functions
- ✅ Embeds cleanly in Stacker portal

## How It Works

1. **Stacker Portal** embeds an iframe with a URL like:
   ```
   https://your-site.netlify.app/?id=rec1PVwlMRc6H8YqK&type=standard
   ```

2. **Preview Page** loads and fetches fresh data from Airtable via serverless function

3. **Serverless Function** securely queries Airtable API and returns church data

4. **Preview Renders** in the appropriate format (Standard/Enhanced/Photo)

## Setup Instructions

### Step 1: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select the `church-listing-preview` repository
5. Click "Deploy site"

### Step 2: Configure Environment Variables

In Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:
   - **Key:** `AIRTABLE_API_KEY`
   - **Value:** [Your new Airtable API key - keep this secret!]
   - **Scopes:** Check all scopes

3. Optional overrides (defaults are already set):
   - `AIRTABLE_BASE_ID` = `appSE6JqFAzvuFCoP`
   - `AIRTABLE_TABLE_NAME` = `Churches`

4. Click **Save**

5. Go to **Deploys** → Click **Trigger deploy** → **Deploy site**

### Step 3: Update Airtable Formula

In your **Holiday church purchases 2026** table, update the `Entry 2025 url` formula field to generate URLs like:

```
CONCATENATE(
  "https://your-site-name.netlify.app/?id=",
  {Airtable ID (from Churches)},
  "&type=",
  LOWER({Listing type})
)
```

Replace `your-site-name` with your actual Netlify site name.

### Step 4: Embed in Stacker

In Stacker:
1. Add an **Embed** field
2. Set **Source** to "From Field"
3. Select the **Entry 2025 url** field
4. Set height to `100VH` or `600px`
5. Save

## URL Parameters

- `id` (required) - The Airtable record ID from the Churches table (e.g., `rec1PVwlMRc6H8YqK`)
- `type` (optional) - Listing type: `standard`, `enhanced`, or `photo` (default: `standard`)

## Examples

**Standard Listing:**
```
https://your-site.netlify.app/?id=rec1PVwlMRc6H8YqK&type=standard
```

**Enhanced Listing:**
```
https://your-site.netlify.app/?id=recwh1KYznU2VRSj7&type=enhanced
```

**Photo Listing:**
```
https://your-site.netlify.app/?id=recKPYytha4MpkZeN&type=photo
```

## Testing

Once deployed, test with a direct URL:
```
https://your-site.netlify.app/?id=rec1PVwlMRc6H8YqK&type=standard
```

You should see the Chelmsford Presbyterian Church listing preview.

## Troubleshooting

### "Unable to load preview"
- Check that environment variables are set in Netlify
- Verify the Airtable API key is valid
- Check the record ID is correct

### Preview shows old data
- Click the "Refresh Preview" button
- Data is cached for 60 seconds to improve performance

### Photo not showing
- Verify the church has a photo uploaded in the "Church image" field
- Check the Airtable attachment URL is accessible
- Photo URLs from Airtable expire after ~2 hours (this is an Airtable limitation)

## Next Steps

- [ ] Add email generation workflow for sending listing previews
- [ ] Implement permanent photo storage for Photo listings
- [ ] Add print/screenshot functionality

## Support

For issues or questions, contact the Evangelical Times technical team.
