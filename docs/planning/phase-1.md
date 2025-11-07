# Phase 1 Implementation Plan: Setup

## 📁 Project Structure

Create the following folder structure:

```
gmail-link-interceptor/
├── manifest.json
├── content.js
├── background.js
├── options.html
├── options.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon16-disabled.png
│   ├── icon48-disabled.png
│   └── icon128-disabled.png
└── README.md
```

## 🎨 Creating Icons

For Phase 1 testing, you can create simple placeholder icons:

### Option 1: Generate Icons Online
- Visit [Favicon Generator](https://favicon.io/favicon-generator/) or similar
- Create a simple shield icon with "GL" text
- Generate sizes: 16x16, 48x48, 128x128
- Create "disabled" versions with gray color

### Option 2: Use Placeholder Icons (Quick Testing)
Create simple colored squares in any image editor:
- **Enabled icons**: Green background (#4CAF50) with white border
- **Disabled icons**: Gray background (#999999) with white border

### Required Icon Files
- `icon16.png` (16x16px) - Browser toolbar
- `icon48.png` (48x48px) - Extension management page
- `icon128.png` (128x128px) - Chrome Web Store
- `icon16-disabled.png`, `icon48-disabled.png`, `icon128-disabled.png` (same sizes, grayed out)

## 🚀 Installation Steps

### 1. Create the Extension Files
1. Create a new folder named `gmail-link-interceptor`
2. Copy all the code files into this folder
3. Create the `icons` subfolder and add icon files

### 2. Load the Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `gmail-link-interceptor` folder
5. The extension should now appear in your extensions list

### 3. Verify Installation
- Check that the extension icon appears in the Chrome toolbar
- Click the icon to toggle enabled/disabled state
- Right-click the icon → Options to open settings page

## 🧪 Phase 1 Testing Checklist

### Basic Functionality
- [x] Extension loads without errors in `chrome://extensions/`
- [x] Extension icon appears in Chrome toolbar
- [x] Options page opens correctly
- [x] Toggle switch works in options page
- [x] Settings persist after closing options page

### Gmail Integration
1. **Open Gmail** (`https://mail.google.com`)
2. **Open Chrome DevTools** (F12)
3. **Check Console** for these messages:
   - ✅ "Gmail Link Interceptor: Content script loaded"
   - ✅ "Gmail Link Interceptor: Settings loaded"
   - ✅ "Gmail Link Interceptor: Gmail loaded, starting observation"
   - ✅ "Gmail Link Interceptor: Found X initial links"

4. **Click an external link** in an email:
   - ✅ Green notification appears in top-right corner
   - ✅ Console shows "Link clicked!" with URL details
   - ✅ Link does NOT open (intercepted successfully)

5. **Test dynamic loading**:
   - ✅ Open a different email thread
   - ✅ Console shows "Found X new links"
   - ✅ New links are also intercepted

### Settings Testing
1. **Whitelist a domain**:
   - Open Options page
   - Add "google.com" to whitelist
   - Save settings
   - Click a google.com link in Gmail
   - ✅ Link should open normally (not intercepted)

2. **Disable extension**:
   - Click extension icon to disable
   - ✅ Icon changes appearance
   - Click any link in Gmail
   - ✅ Links open normally

3. **Re-enable extension**:
   - Click icon again
   - ✅ Links are intercepted again

## 🐛 Troubleshooting

### Extension doesn't load
- Check `chrome://extensions/` for error messages
- Verify all files are in the correct folder structure
- Ensure `manifest.json` is valid JSON (no trailing commas)

### Content script not running
- Refresh Gmail page after loading extension
- Check DevTools console for errors
- Verify you're on `https://mail.google.com` (not `http://`)

### Links not being intercepted
- Open DevTools console and look for logs
- Check that extension is enabled (icon state)
- Verify the link is external (starts with `http://` or `https://`)
- Try clicking directly on the link text (not near it)

### Icons not showing
- Verify icon files exist in `icons/` folder
- Check file names match exactly (case-sensitive)
- For testing, extension will work without icons but show warnings

## 📊 Expected Phase 1 Behavior

At this stage, the extension should:

✅ **DO:**
- Detect and log all external links in Gmail emails
- Prevent links from opening
- Show a simple green notification when a link is clicked
- Display detailed URL information in console
- Respect whitelist settings
- Work with dynamically loaded emails
- Toggle on/off via extension icon

❌ **DON'T (yet):**
- Show a modal dialog (Phase 2)
- Have a "Confirm" button to open links (Phase 2)
- Have sophisticated styling (Phase 2)
- Handle all edge cases perfectly (refined in Phase 2+)

## 🎯 Phase 1 Success Criteria

You've successfully completed Phase 1 if:

1. ✅ Extension loads without errors
2. ✅ Console logs show link detection working
3. ✅ External links are blocked from opening
4. ✅ Green notification appears on click
5. ✅ Whitelist prevents interception for specified domains
6. ✅ Toggle on/off works via extension icon
7. ✅ MutationObserver detects dynamically loaded links
8. ✅ No significant performance issues in Gmail

## 📝 Phase 1 Debugging Tips

### View Console Logs
```javascript
// Filter logs in DevTools Console
Gmail Link Interceptor:
```

### Test Selectors Manually
Open DevTools Console in Gmail and run:
```javascript
// Count email links
document.querySelectorAll('[role="main"] a[href^="http"]').length

// List all link URLs
Array.from(document.querySelectorAll('[role="main"] a[href^="http"]'))
  .map(a => a.href)
```

### Check Storage
```javascript
// View stored settings
chrome.storage.sync.get(null, (data) => console.log(data));
```

## 🔄 Next Steps (Phase 2)

Once Phase 1 is working:
1. Replace simple notification with styled modal
2. Add "Confirm" and "Cancel" buttons
3. Improve URL display with domain highlighting
4. Add HTTPS indicator
5. Enhance visual design
6. Add keyboard shortcuts (Enter/Esc)

## 📞 Need Help?

Common issues and solutions:
- **No logs appear**: Refresh Gmail after loading extension
- **"Cannot read property" errors**: Wait for Gmail to fully load
- **Multiple notifications**: Check for duplicate event listeners
- **Storage errors**: Verify permissions in manifest.json

---

**Phase 1 Complete!** 🎉

Move to Phase 2 once all checklist items pass.