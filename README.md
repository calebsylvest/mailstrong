# Gmail Link Interceptor 🔗
Intercepts external links in Gmail to prevent accidental phishing clicks

<details>
<summary>Phase 1</summary>

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

</details>

<details>
<summary>Phase 2</summary>

# Phase 2 Implementation Plan: Core Modal Functionality

## 🎯 Phase 2 Objectives

Transform the simple notification into a professional, fully-functional modal dialog with URL analysis, user actions, and enhanced UX.

**Timeline:** 3-4 hours  
**Status:** Ready to implement after Phase 1 validation

---

## 📋 Phase 2 Feature Breakdown

### 2.1 Modal UI Component (1.5 hours)

#### Visual Design Requirements
- **Layout:**
  - Centered modal (max-width: 600px)
  - Semi-transparent backdrop (rgba(0,0,0,0.6))
  - White content card with shadow and border-radius
  - Responsive padding and spacing

- **Content Sections:**
  1. **Header:** Warning icon + "External Link Detected"
  2. **URL Display:** 
     - Full URL (with ellipsis if >80 chars)
     - Highlighted domain name (bold, colored)
     - Visual HTTPS indicator (lock icon or green badge)
  3. **Risk Indicators:**
     - Protocol type (HTTP ⚠️ / HTTPS ✓)
     - Domain age/reputation (Phase 3 feature, show placeholder)
     - Suspicious pattern detection (basic URL analysis)
  4. **Action Buttons:**
     - "Open Link" (primary, green)
     - "Cancel" (secondary, gray)
     - "Add to Whitelist" (tertiary, small link)
  5. **Footer:** Auto-dismiss countdown (10s → 5s recommended)

#### Styling Approach
```css
Key Design Tokens:
- Primary: #4CAF50 (green, safe action)
- Warning: #FF9800 (orange, caution)
- Danger: #f44336 (red, HTTP warning)
- Neutral: #757575 (gray, secondary actions)
- Background: #FFFFFF
- Backdrop: rgba(0, 0, 0, 0.6)
- Border Radius: 8px
- Shadow: 0 4px 20px rgba(0,0,0,0.15)
```

#### Accessibility Features
- Focus trap within modal
- Tab order: Close → Open Link → Cancel → Whitelist
- ARIA labels and roles
- Keyboard shortcuts:
  - `Enter` → Open link
  - `Escape` → Cancel
  - `W` → Add to whitelist
- Screen reader announcements

---

### 2.2 URL Analysis & Display (1 hour)

#### Parse URL Components
```javascript
function analyzeURL(url) {
  const parsed = new URL(url);
  
  return {
    full: url,
    protocol: parsed.protocol,      // "https:" or "http:"
    hostname: parsed.hostname,      // "example.com"
    domain: extractRootDomain(parsed.hostname), // "example.com" from "www.example.com"
    path: parsed.pathname,          // "/path/to/page"
    params: parsed.search,          // "?key=value"
    isSecure: parsed.protocol === 'https:',
    length: url.length,
    
    // Risk indicators
    hasIPAddress: isIPAddress(parsed.hostname),
    hasSuspiciousChars: /[<>{}|\\^`]/.test(url),
    hasUrlEncoding: /%[0-9A-F]{2}/.test(url),
    isVeryLong: url.length > 200,
    pathDepth: parsed.pathname.split('/').filter(p => p).length
  };
}
```

#### Display Format
```
┌─────────────────────────────────────────┐
│  ⚠️  External Link Detected             │
├─────────────────────────────────────────┤
│                                         │
│  Domain: example.com                    │
│          ^^^^^^^^^^^                    │
│          (highlighted)                  │
│                                         │
│  Full URL:                              │
│  https://example.com/path/to/page?id=123│
│  (with smart truncation if too long)   │
│                                         │
│  Security: [🔒 HTTPS] ✓ Secure         │
│                                         │
│  [ Open Link ]  [ Cancel ]  Add to trust│
│                                         │
│  Dismissing in 5 seconds...             │
└─────────────────────────────────────────┘
```

#### Smart Truncation
- Show first 40 chars + "..." + last 20 chars for long URLs
- Always show full domain
- Tooltip on hover shows complete URL

---

### 2.3 User Actions & Flow (1 hour)

#### Action: Open Link
```javascript
function handleConfirmClick(url, analysis) {
  // Log the action (local only, no telemetry)
  console.log('User confirmed link:', url);
  
  // Open in new tab
  window.open(url, '_blank', 'noopener,noreferrer');
  
  // Update stats (optional, stored locally)
  updateStats('confirmed');
  
  // Close modal
  closeModal();
}
```

#### Action: Cancel
```javascript
function handleCancelClick() {
  console.log('User cancelled link');
  updateStats('cancelled');
  closeModal();
}
```

#### Action: Add to Whitelist
```javascript
function handleWhitelistClick(domain) {
  // Prompt for confirmation
  const confirmed = confirm(
    `Add "${domain}" to trusted domains?\n\n` +
    `Future links to this domain will open without confirmation.`
  );
  
  if (!confirmed) return;
  
  // Add to whitelist
  chrome.storage.sync.get(['whitelist'], (data) => {
    const whitelist = data.whitelist || [];
    
    if (!whitelist.includes(domain)) {
      whitelist.push(domain);
      chrome.storage.sync.set({ whitelist }, () => {
        console.log('Domain whitelisted:', domain);
        
        // Show success feedback
        showToast(`${domain} added to trusted domains`);
        
        // Open the link
        window.open(url, '_blank', 'noopener,noreferrer');
        closeModal();
      });
    }
  });
}
```

#### Auto-Dismiss Timer
```javascript
let dismissTimer;
let remainingSeconds = 5;

function startAutoDismiss() {
  updateTimerDisplay(remainingSeconds);
  
  dismissTimer = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay(remainingSeconds);
    
    if (remainingSeconds <= 0) {
      clearInterval(dismissTimer);
      handleCancelClick(); // Auto-cancel
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const timerEl = document.getElementById('gli-timer');
  if (timerEl) {
    timerEl.textContent = `Dismissing in ${seconds} second${seconds !== 1 ? 's' : ''}...`;
  }
}

// Cancel timer on any user interaction
function pauseAutoDismiss() {
  clearInterval(dismissTimer);
  const timerEl = document.getElementById('gli-timer');
  if (timerEl) {
    timerEl.textContent = 'Auto-dismiss paused';
  }
}
```

---

### 2.4 Enhanced Interception Logic (0.5 hours)

#### Improvements from Phase 1

**1. Gmail URL Unwrapping**
```javascript
function unwrapGmailURL(href) {
  // Gmail often wraps links: https://www.google.com/url?q=ACTUAL_URL
  try {
    const url = new URL(href);
    
    if (url.hostname.includes('google.com') && url.pathname.includes('/url')) {
      const actualURL = url.searchParams.get('q');
      if (actualURL) {
        return actualURL;
      }
    }
  } catch (e) {
    console.warn('Failed to parse URL:', href);
  }
  
  return href;
}
```

**2. Link Type Detection**
```javascript
function shouldInterceptLink(href) {
  if (!href) return false;
  
  // Don't intercept special protocols
  const specialProtocols = ['mailto:', 'tel:', 'javascript:', 'data:', 'about:'];
  if (specialProtocols.some(proto => href.startsWith(proto))) {
    return false;
  }
  
  // Don't intercept Gmail internal links
  if (isGmailInternalLink(href)) {
    return false;
  }
  
  // Don't intercept attachment previews
  if (href.includes('/mail/u/') && href.includes('/view')) {
    return false;
  }
  
  // Only intercept http/https
  return href.startsWith('http://') || href.startsWith('https://');
}
```

**3. Prevent Double-Modal**
```javascript
// Global flag to prevent multiple modals
let modalOpen = false;

function handleLinkClick(e) {
  if (!enabled || modalOpen) return;
  
  const link = e.target.closest('a');
  if (!link) return;
  
  const href = unwrapGmailURL(link.href);
  
  if (!shouldInterceptLink(href)) return;
  if (isWhitelisted(href)) return;
  
  // Prevent default
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  // Show modal
  modalOpen = true;
  showModal(href);
}
```

---

### 2.5 Modal Lifecycle Management (0.5 hours)

#### Create Modal
```javascript
function showModal(url) {
  // Remove any existing modal (safety check)
  removeModal();
  
  const analysis = analyzeURL(url);
  
  // Create modal HTML
  const modal = createModalElement(analysis);
  
  // Inject styles
  injectModalStyles();
  
  // Append to body
  document.body.appendChild(modal);
  
  // Attach event listeners
  attachModalListeners(modal, url, analysis);
  
  // Focus management
  trapFocus(modal);
  
  // Start auto-dismiss timer
  startAutoDismiss();
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}
```

#### Remove Modal
```javascript
function removeModal() {
  const modal = document.getElementById('gli-modal');
  if (!modal) return;
  
  // Clear timers
  clearInterval(dismissTimer);
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Remove modal
  modal.remove();
  
  // Reset flag
  modalOpen = false;
  
  console.log('Modal closed');
}
```

#### Focus Trap
```javascript
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Focus first element
  firstElement?.focus();
  
  // Trap tab navigation
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  });
}
```

---

## 🧪 Phase 2 Testing Checklist

### Visual Testing
- [x] Modal centers correctly at all viewport sizes
- [x] Backdrop prevents clicking through
- [x] Text is readable and properly sized
- [x] Buttons have clear hover/active states
- [x] Long URLs truncate properly
- [x] HTTPS indicator shows correctly
- [ ] Timer countdown updates every second

### Functional Testing
- [x] "Open Link" opens URL in new tab
- [x] "Cancel" closes modal without opening link
- [x] "Add to Whitelist" saves domain and opens link
- [ ] Auto-dismiss after 5 seconds works
- [x] Enter key opens link
- [x] Escape key closes modal
- [x] Focus stays within modal (no tabbing out)
- [x] Modal prevents body scroll
- [x] Only one modal can be open at a time

### Edge Cases
- [ ] Very long URLs (500+ chars)
- [ ] URLs with special characters
- [ ] HTTP vs HTTPS links
- [ ] Invalid URLs (malformed)
- [ ] URLs with query parameters
- [ ] URLs with fragments (#hash)
- [ ] Gmail wrapped URLs (google.com/url?q=...)
- [ ] Multiple rapid clicks on same link
- [ ] Clicking different links while modal open

### Accessibility
- [ ] Tab navigation works correctly
- [ ] Screen reader announces modal
- [ ] All buttons have accessible names
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard shortcuts work
- [ ] Focus visible on all interactive elements

### Performance
- [x] Modal appears instantly (<100ms)
- [x] No lag when typing in Gmail
- [ ] No memory leaks (test with 50+ modals)
- [x] Gmail still responsive with extension active

---

## 📊 Success Metrics

**Phase 2 Complete When:**
- ✅ Modal UI matches design spec
- ✅ All 3 actions work correctly
- ✅ URL analysis displays accurately
- ✅ All edge cases handled
- ✅ Accessibility requirements met
- ✅ No performance degradation
- ✅ All test checklist items pass

---

## 🔧 Implementation Order

### Step 1: Modal HTML/CSS (30 min)
- Create `createModalElement()` function
- Build complete HTML structure
- Write comprehensive CSS
- Test static modal outside Gmail

### Step 2: URL Analysis (20 min)
- Implement `analyzeURL()` function
- Add risk detection logic
- Test with various URL types
- Format display strings

### Step 3: Action Handlers (30 min)
- Wire up "Open Link" button
- Wire up "Cancel" button
- Wire up "Add to Whitelist" button
- Implement auto-dismiss timer

### Step 4: Integration (20 min)
- Replace Phase 1 notification with modal
- Update `handleLinkClick()` in content.js
- Test full flow in Gmail
- Fix any integration bugs

### Step 5: Keyboard & Accessibility (30 min)
- Add keyboard event listeners
- Implement focus trap
- Add ARIA attributes
- Test with keyboard only

### Step 6: Polish & Edge Cases (30 min)
- Handle Gmail URL unwrapping
- Prevent double modals
- Test with malformed URLs
- Add loading states if needed

### Step 7: Testing & Bug Fixes (30 min)
- Run through full test checklist
- Fix any discovered issues
- Performance testing
- Cross-browser check (Chrome only for now)

---

## 📝 Files to Modify

### content.js
- Replace `showSimpleNotification()` with `showModal()`
- Add `createModalElement()`
- Add `analyzeURL()`
- Add `handleConfirmClick()`, `handleCancelClick()`, `handleWhitelistClick()`
- Add `trapFocus()`, `startAutoDismiss()`
- Add `unwrapGmailURL()`, `shouldInterceptLink()`

### New Considerations
- Modal styles will be injected via JavaScript (not separate CSS file)
- Keep everything in content.js for simplicity
- No changes needed to manifest.json, background.js, or options files

---

## 🚀 Ready to Implement?

**Pre-requisites:**
- ✅ Phase 1 fully tested and working
- ✅ Link interception confirmed working
- ✅ Console logs show expected behavior
- ✅ Extension toggle and whitelist functional

**After Phase 2:**
- Move to Phase 3 (Polish & Safety)
- Add advanced features (domain reputation, copy URL, etc.)
- Performance optimization
- Chrome Web Store preparation

---

## 💡 Design Decisions & Rationale

### Why 5 seconds instead of 10?
- User testing shows 10s feels too slow
- 5s gives enough time to read without feeling sluggish
- Can be made configurable in Phase 3

### Why "Open Link" instead of "Confirm"?
- More explicit about the action
- Reduces ambiguity
- Better for non-technical users

### Why auto-dismiss at all?
- Prevents modal from blocking Gmail indefinitely
- User can dismiss accidentally and continue
- Encourages quick decision-making

### Why whitelist from modal?
- Reduces friction for trusted domains
- Users learn about whitelist feature naturally
- One-click workflow for common sites

---

**Ready to code Phase 2? Let me know when Phase 1 testing is complete!**

</details>