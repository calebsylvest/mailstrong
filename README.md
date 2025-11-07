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

<details>
<summary>Phase 3 Planning</summary>

# Phase 3 Implementation Plan: Polish & Advanced Features

## 🎯 Phase 3 Objectives

Add professional polish and power-user features to make the extension more useful and informative while maintaining privacy and performance.

**Timeline:** 4-6 hours  
**Status:** Ready to implement after Phase 2 validation

---

## 📋 Feature Breakdown

### 3.1 Copy URL to Clipboard (CONFIRMED) - 30 minutes

#### Purpose
Allow users to copy the intercepted URL without opening it, useful for:
- Sharing suspicious links with IT security
- Pasting into URL checkers (VirusTotal, URLscan)
- Documenting phishing attempts
- Verifying links before opening

#### Implementation
Add a small "Copy" button/icon next to the URL display:

```javascript
// Add to modal HTML
<div class="gli-url-actions">
  <button class="gli-copy-btn" id="gli-copy-btn" title="Copy URL to clipboard">
    📋 Copy URL
  </button>
</div>

// Copy handler
function handleCopyURL(url) {
  navigator.clipboard.writeText(url).then(() => {
    console.log('URL copied to clipboard');
    showToast('URL copied to clipboard');
    
    // Visual feedback - change button text temporarily
    const copyBtn = document.getElementById('gli-copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    showToast('Failed to copy URL', 'error');
  });
}
```

#### User Flow
1. User sees suspicious link in modal
2. Clicks "Copy URL" button
3. Toast confirms "URL copied to clipboard"
4. User can paste into security tool or share with IT
5. Can still choose to Cancel or Open Link

#### Edge Cases
- Clipboard API requires HTTPS (Gmail is HTTPS, so OK)
- May need clipboard permission in manifest (check if needed)
- Fallback for older browsers (create temp input element)

---

### 3.2 Recent Links History (NEEDS DECISION)

#### How It Would Work

**Storage:**
- Store last 20-50 intercepted links in `chrome.storage.local`
- Include: URL, domain, timestamp, user action (opened/cancelled/whitelisted)
- Auto-prune old entries (keep last 30 days)

**Access:**
- Add "History" tab/section in Options page
- Shows table of recent links with columns:
  - Date/Time
  - Domain
  - Action Taken
  - Quick actions (Open, Whitelist, Copy)

**Data Structure:**
```javascript
{
  linkHistory: [
    {
      id: "uuid-1234",
      url: "https://example.com/path",
      domain: "example.com",
      timestamp: 1699123456789,
      action: "opened", // or "cancelled", "whitelisted"
      isSecure: true
    },
    // ... more entries
  ]
}
```

#### Why Users Would Want This

**Use Cases:**

1. **Security Review:**
   - "Did I click that suspicious link last week?"
   - Review which links you've opened vs cancelled
   - Pattern detection (multiple phishing attempts from similar domains)

2. **Accidental Cancels:**
   - User cancelled modal by mistake
   - Can find and open the link from history
   - No need to search email again

3. **Audit Trail:**
   - Corporate users may need to document which links they accessed
   - Helpful for security incident reporting
   - "I clicked a phishing link on Nov 3rd at 2pm"

4. **Learning Patterns:**
   - See which domains you frequently encounter
   - Identify candidates for whitelisting
   - Understand your email threat landscape

5. **Second Look:**
   - User wasn't sure about a link, cancelled
   - Later wants to investigate further
   - Can copy URL from history to check in security tools

**Privacy Considerations:**
- All data stored locally only
- User can clear history anytime
- Option to disable history tracking
- Auto-delete after 30 days

**UI Design:**
```
Options Page → History Tab

Recent Links (Last 30 Days)
┌────────────────────────────────────────────────────────────┐
│ Date/Time    │ Domain           │ Action      │ Secure │    │
├────────────────────────────────────────────────────────────┤
│ Nov 6, 2pm   │ example.com      │ ✓ Opened    │ 🔒     │ ⋮  │
│ Nov 6, 1pm   │ suspicious.net   │ ✗ Cancelled │ 🔓     │ ⋮  │
│ Nov 5, 4pm   │ github.com       │ ⊕ Whitelisted│ 🔒    │ ⋮  │
└────────────────────────────────────────────────────────────┘

[Clear All History]  [Export as CSV]
```

**Implementation Effort:** 1.5 hours
- 30 min: Storage schema and recording logic
- 30 min: History UI in options page
- 30 min: Search, filter, export features

**Recommendation:** This is useful for power users and security-conscious individuals, but adds complexity. Suggest implementing as **optional feature** that's disabled by default, can be enabled in settings.

---

### 3.3 Domain Reputation Checks (NEEDS DECISION)

#### What It Does
Before showing the modal, check if the domain has a known reputation (safe, suspicious, malicious) and display this info to help users make informed decisions.

#### API Options

**Option 1: Google Safe Browsing API (RECOMMENDED)**

**Pros:**
- Free tier: 10,000 requests/day (plenty for personal use)
- High accuracy, Google's threat intelligence
- Well-documented, stable API
- Privacy-preserving (uses hash prefixes)

**Cons:**
- Requires API key (users need to get their own, or you provide one)
- If you provide key, abuse could hit rate limits
- Network latency (200-500ms per check)

**Cost:** 
- FREE up to 10,000 requests/day
- $0.50 per 1,000 requests after that
- For typical user (50 emails/day), ~1,000 checks/month = FREE

**Setup:**
1. Get API key from Google Cloud Console
2. Add to manifest permissions: `"https://safebrowsing.googleapis.com/*"`
3. Make lookup request before showing modal

**Implementation:**
```javascript
async function checkDomainReputation(url) {
  const apiKey = 'YOUR_SAFE_BROWSING_API_KEY';
  const endpoint = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
  
  const request = {
    client: {
      clientId: "gmail-link-interceptor",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }]
    }
  };
  
  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify(request)
    });
    
    const data = await response.json();
    
    if (data.matches && data.matches.length > 0) {
      return {
        isSafe: false,
        threat: data.matches[0].threatType, // "MALWARE", "SOCIAL_ENGINEERING"
        confidence: 'high'
      };
    }
    
    return { isSafe: true, threat: null };
  } catch (err) {
    console.error('Reputation check failed:', err);
    return { isSafe: null, threat: null }; // Unknown, proceed with caution
  }
}
```

**Option 2: VirusTotal API**

**Pros:**
- Very comprehensive (aggregates 70+ antivirus scanners)
- URL reports, file analysis, domain info
- Community-trusted

**Cons:**
- Free tier: 4 requests/minute, 500/day (very limiting)
- Paid tier: $50+/month for higher limits
- Slower response times (1-3 seconds)
- Not practical for free extension

**Cost:** 
- FREE: 4 req/min, 500/day (too restrictive)
- Premium: $50-500/month (not viable for free extension)

**Option 3: URLhaus (Abuse.ch)**

**Pros:**
- Completely free, no API key needed
- Focuses on malware distribution URLs
- Fast, simple API

**Cons:**
- Smaller database (focuses on active threats only)
- May miss some threats
- Less comprehensive than Google Safe Browsing

**Cost:** FREE, no limits

**Recommendation:** 
Use **Google Safe Browsing API** because:
1. Free for typical usage
2. Best accuracy
3. Fast enough (with caching)
4. Industry standard

#### How It Would Work in Extension

**Flow:**
1. User clicks link
2. Extension makes API call (with 500ms timeout)
3. If known malicious → Show RED warning banner
4. If safe/unknown → Show normal modal
5. Cache results for 24 hours (avoid repeat checks)

**Visual Indicators:**
```
Known Malicious:
┌────────────────────────────────────────┐
│ ⚠️ WARNING: DANGEROUS LINK             │
│                                        │
│ This link is flagged as:               │
│ 🚨 MALWARE / PHISHING                  │
│                                        │
│ Google Safe Browsing reports this      │
│ site distributes malware or attempts   │
│ to steal personal information.         │
│                                        │
│ [DO NOT OPEN]  [Report False Positive]│
└────────────────────────────────────────┘

Known Safe:
┌────────────────────────────────────────┐
│ ✓ This domain has a good reputation   │
│   (Verified by Google Safe Browsing)  │
└────────────────────────────────────────┘
```

**Caching Strategy:**
```javascript
// Cache reputation checks
const reputationCache = {};

async function getCachedReputation(url) {
  const domain = new URL(url).hostname;
  const cached = reputationCache[domain];
  
  // Use cache if less than 24 hours old
  if (cached && Date.now() - cached.timestamp < 86400000) {
    return cached.reputation;
  }
  
  // Make new check
  const reputation = await checkDomainReputation(url);
  reputationCache[domain] = {
    reputation,
    timestamp: Date.now()
  };
  
  return reputation;
}
```

**Privacy Considerations:**
- API calls reveal which links user clicks to Google
- Use hash prefix protocol (Google recommends this)
- Add opt-in setting: "Enable reputation checks"
- Clear in privacy policy

**Implementation Effort:** 2 hours
- 1 hour: API integration and caching
- 30 min: Visual indicators in modal
- 30 min: Settings toggle and documentation

**Recommendation:** Implement as **optional feature** (disabled by default). Users enable in settings after providing their own API key OR extension includes a shared key with rate limiting.

---

### 3.4 Statistics/Analytics (Local Only) (NEEDS DECISION)

#### What Would Be Recorded

**Metrics to Track:**
1. **Link Interception Stats:**
   - Total links intercepted (all-time)
   - Links opened vs cancelled
   - Links whitelisted
   - Most common action (open/cancel ratio)

2. **Domain Statistics:**
   - Most intercepted domains
   - Domains by security level (HTTP vs HTTPS)
   - Whitelist growth over time

3. **User Behavior:**
   - Average time to decision (open vs cancel)
   - Peak interception times (which days/hours)
   - Auto-dismiss vs manual action ratio

4. **Security Insights:**
   - HTTP links encountered (insecure)
   - Suspicious patterns detected
   - Potential phishing attempts blocked

**Data Structure:**
```javascript
{
  stats: {
    totalIntercepted: 1234,
    totalOpened: 890,
    totalCancelled: 244,
    totalWhitelisted: 100,
    
    httpCount: 45,  // Insecure links
    httpsCount: 1189,
    
    suspiciousBlocked: 12,  // Had risk indicators
    
    domainStats: {
      "example.com": { 
        count: 45, 
        opened: 40, 
        cancelled: 5,
        lastSeen: 1699123456789 
      },
      "github.com": { count: 30, opened: 30, cancelled: 0 },
      // ... more domains
    },
    
    installDate: 1699000000000,
    lastReset: 1699123456789
  }
}
```

#### Why Users Would Want This

**Use Cases:**

1. **Security Awareness:**
   - "I've blocked 12 suspicious links this month!"
   - Understand personal threat exposure
   - Feel good about security practices

2. **Behavior Insights:**
   - "I open 90% of links - am I being careful enough?"
   - Identify if being too cautious or not cautious enough
   - Learn which domains to whitelist

3. **Threat Intelligence:**
   - "Which senders are most risky?"
   - See which domains appear most often
   - Pattern recognition for corporate security

4. **Extension Value:**
   - Quantify benefit: "Saved me from 50+ suspicious links"
   - Justify keeping extension installed
   - Share stats with colleagues ("You should use this too!")

5. **Audit/Compliance:**
   - Corporate users may need metrics
   - "How many potential threats did I encounter?"
   - Documentation for security reviews

#### Visual Display

**Dashboard in Options Page:**
```
Statistics Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Overall Activity
┌──────────────────────────────────────┐
│  Total Links Intercepted: 1,234      │
│  Links Opened:           890 (72%)   │
│  Links Cancelled:        244 (20%)   │
│  Links Whitelisted:      100 (8%)    │
└──────────────────────────────────────┘

🔒 Security Insights
┌──────────────────────────────────────┐
│  Secure (HTTPS):         1,189 (96%) │
│  Insecure (HTTP):        45 (4%)     │
│  Suspicious Blocked:     12          │
└──────────────────────────────────────┘

🏆 Top Domains
┌──────────────────────────────────────┐
│  1. example.com          45 times    │
│  2. github.com           30 times    │
│  3. stackoverflow.com    28 times    │
└──────────────────────────────────────┘

📅 Active Since: Nov 1, 2025 (5 days)

[Reset Statistics]  [Export Report]
```

**Benefits Callout:**
```
You've protected yourself from 12 potential threats!
Keep up the great security practices. 🛡️
```

#### Privacy & Storage

**Privacy Guarantees:**
- ALL data stored locally (`chrome.storage.local`)
- NO data sent to external servers
- NO personally identifiable information
- User can reset/clear anytime
- Optional feature (can be disabled)

**Storage Considerations:**
- Stats are small (~50KB max)
- Domain list pruned to top 50 (prevent bloat)
- Old data archived or aggregated

#### Implementation Details

**Recording Events:**
```javascript
function recordInterception(url, action) {
  chrome.storage.local.get(['stats'], (data) => {
    const stats = data.stats || getDefaultStats();
    
    stats.totalIntercepted++;
    
    if (action === 'opened') stats.totalOpened++;
    if (action === 'cancelled') stats.totalCancelled++;
    if (action === 'whitelisted') stats.totalWhitelisted++;
    
    // Update domain stats
    const domain = new URL(url).hostname;
    if (!stats.domainStats[domain]) {
      stats.domainStats[domain] = { count: 0, opened: 0, cancelled: 0, lastSeen: 0 };
    }
    stats.domainStats[domain].count++;
    stats.domainStats[domain][action]++;
    stats.domainStats[domain].lastSeen = Date.now();
    
    // Update security stats
    if (url.startsWith('https:')) {
      stats.httpsCount++;
    } else {
      stats.httpCount++;
    }
    
    chrome.storage.local.set({ stats });
  });
}
```

**Display Component:**
```javascript
function renderStatsTab() {
  chrome.storage.local.get(['stats'], (data) => {
    const stats = data.stats || getDefaultStats();
    
    document.getElementById('total-intercepted').textContent = stats.totalIntercepted;
    document.getElementById('total-opened').textContent = 
      `${stats.totalOpened} (${Math.round(stats.totalOpened/stats.totalIntercepted*100)}%)`;
    
    // Render charts, top domains, etc.
  });
}
```

#### Implementation Effort: 1.5 hours
- 30 min: Stats recording logic
- 45 min: Dashboard UI in options page
- 15 min: Reset and export functionality

**Recommendation:** Implement this - it's a great way to show value and help users understand their security posture. Make it opt-in with clear privacy messaging.

---

## 📊 Phase 3 Summary

### Confirmed Features:
1. ✅ **Copy URL to Clipboard** (30 min) - Simple, useful, no privacy concerns

### Recommended Features:
2. ✅ **Recent Links History** (1.5 hours) - Useful for security review, make opt-in
3. ✅ **Domain Reputation** (2 hours) - Powerful security feature, use Google Safe Browsing API
4. ✅ **Statistics/Analytics** (1.5 hours) - Shows value, helps users, all local

### Skipped for Now:
- ❌ Custom themes (can add later)
- ❌ Configurable timer (can revisit)

### Total Effort: ~5.5 hours

---

## 🔧 Implementation Order

### Step 1: Copy URL Button (30 min)
- Add button to modal HTML
- Implement clipboard copy
- Add visual feedback
- Test edge cases

### Step 2: Statistics Foundation (1.5 hours)
- Create stats storage schema
- Add recording hooks in content.js
- Build stats dashboard in options page
- Add reset functionality

### Step 3: Recent Links History (1.5 hours)
- Extend storage schema for history
- Record link events
- Build history tab UI
- Add search/filter/export

### Step 4: Domain Reputation (2 hours)
- Set up Google Safe Browsing API
- Implement caching layer
- Add reputation indicators to modal
- Create settings toggle

### Step 5: Testing & Polish (1 hour)
- Test all new features together
- Check performance impact
- Verify privacy (no external data leaks)
- Update documentation

---

## 🎯 Success Criteria

**Phase 3 Complete When:**
- ✅ Copy button works on all browsers
- ✅ Statistics accurately tracked and displayed
- ✅ History shows last 50 links correctly
- ✅ Reputation checks return within 1 second
- ✅ All features are opt-in with clear explanations
- ✅ No privacy leaks (audit network traffic)
- ✅ Performance remains excellent (<100ms modal)
- ✅ Settings page clearly explains each feature

---

## 🔐 Privacy & Security Considerations

**For All Features:**
- Add clear consent in settings
- Update privacy policy
- Audit all network requests
- Ensure local-first data storage
- Allow users to disable any feature
- Provide data export/delete options

**Specific to Reputation Checks:**
- Disclose that URLs are checked with Google
- Use hash prefix protocol for privacy
- Allow users to provide their own API key
- Clear cache regularly

---

## 📝 Updated Permissions

**May Need to Add:**
```json
{
  "permissions": [
    "storage",
    "activeTab",
    "clipboardWrite"  // For copy feature
  ],
  "host_permissions": [
    "https://mail.google.com/*",
    "https://safebrowsing.googleapis.com/*"  // For reputation checks
  ]
}
```

---

## 🚀 Ready to Build?

**Questions to Confirm:**
1. Should Recent Links History be **enabled by default** or **opt-in**?
2. For Domain Reputation: Should extension include **shared API key** or require users to get their own?
3. Should Statistics show a **"Threats Blocked" count** prominently to increase perceived value?
4. Any other features to add/remove from Phase 3?

Let me know your decisions and I'll start building the Phase 3 code!

</details>