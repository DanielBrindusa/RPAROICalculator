
# RPA ROI Calculator

A small, frontend-only RPA ROI calculator for GitHub Pages.

## What is included

- Realistic RPA ROI model
- Attended, unattended, and hybrid setup
- Manual baseline vs automated future state
- One-time implementation cost
- Recurring annual run cost
- Realization factor for true savings
- Conservative / expected / optimistic scenarios
- Warning checks and confidence indicator
- Local storage scenario saving
- Shareable URL with assumptions encoded in the link
- JSON and CSV export for assumptions
- PDF export for results
- Process templates
- Light / dark mode
- Charts for benefits, cost per transaction, cash flow, and sensitivity

## Files

- `index.html`
- `styles.css`
- `app.js`

## How to upload to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the root of the repository.
3. Commit the files.
4. In GitHub, open the repository.
5. Go to **Settings**.
6. Go to **Pages**.
7. Under **Build and deployment**, choose:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/root`
8. Save.
9. GitHub will publish the page and provide the public link.

## Notes

- This tool runs entirely in the browser.
- No backend is required.
- Saved scenarios are stored only in the local browser storage.
- Vendor pricing presets are sample editable values and should be reviewed before real business use.
