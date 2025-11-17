# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mailstrong is a Chrome extension (Manifest V3) that provides phishing protection by intercepting external links in Gmail emails. When a user clicks an external link, a modal displays security information (domain, URL, HTTPS status, suspicious patterns) before allowing the user to proceed, cancel, copy the URL, or whitelist the domain.

## Development Setup

This is a vanilla JavaScript Chrome extension with no build process or dependencies. To develop:

1. Load unpacked extension in Chrome: `chrome://extensions/` → "Load unpacked" → select this directory
2. Make changes to source files
3. Reload extension in Chrome to test changes
4. Refresh Gmail page to see content script updates

## Core Architecture

### Three-Component System

1. **content.js** (Content Script)
   - Runs on `mail.google.com/*` pages
   - Intercepts link clicks using event listeners on dynamically loaded Gmail content
   - Shows modal UI with security analysis
   - Records history and statistics to Chrome storage
   - Uses MutationObserver to detect new links as Gmail loads content dynamically

2. **background.js** (Service Worker)
   - Manages extension enable/disable toggle via icon clicks
   - Handles installation and default settings initialization
   - Lightweight state management layer

3. **options.html + options.js** (Options Page)
   - Three-tab interface: General, Statistics, History
   - Manages whitelist, toggles for features (history/stats tracking)
   - Displays analytics and recent link activity

### Storage Architecture

Uses Chrome Storage API with two areas:

- **chrome.storage.sync**: Settings that sync across devices
  - `enabled` (boolean): Extension on/off state
  - `whitelist` (array): Trusted domains
  - `historyEnabled` (boolean): Whether to record link history
  - `statsEnabled` (boolean): Whether to collect statistics

- **chrome.storage.local**: Local-only data
  - `linkHistory` (array): Last 50 intercepted links with timestamps/actions
  - `stats` (object): Aggregated statistics including domain counts, HTTPS/HTTP ratios, suspicious blocks

## Key Implementation Details

### Gmail Dynamic Content Handling

Gmail loads email content dynamically (SPA behavior). The extension handles this via:

1. **waitForGmailLoad()**: Polls for Gmail's main UI elements before initializing
2. **MutationObserver**: Continuously monitors DOM for new links in email threads
3. **Link selectors**: Multiple CSS selectors target different Gmail UI structures:
   - `[role="main"] a[href^="http"]`
   - `.a3s a[href^="http"]` (email body)
   - `.ii a[href^="http"]` (inbox items)

### Link Interception Flow

1. Links are marked with `data-gli-intercepted="true"` after attaching listeners
2. Both `mousedown` and `click` events are captured (using `true` for capture phase)
3. Gmail redirect URLs (google.com/url?q=...) are unwrapped to show actual destination
4. Whitelist check occurs before showing modal
5. Modal shows with auto-dismiss timer (5 seconds, pauses on interaction)

### Security Analysis

The `analyzeURL()` function checks for:
- HTTPS vs HTTP
- IP address usage instead of domain names
- Suspicious characters (`<>{}|\^` `)
- Unusually long URLs (>200 chars)

### Debounce/Throttling Pattern

The "Copy URL" button implements protection against rapid clicks:
- `COPY_COOLDOWN_MS = 500`: Minimum time between copy operations
- `copyInProgress` flag prevents concurrent copy attempts
- Visual feedback with "Copied!" state before re-enabling button

## File Structure

```
/
├── manifest.json          # Chrome extension manifest (V3)
├── content.js             # Main interceptor logic (~1100 lines)
├── background.js          # Service worker for icon toggle
├── options.html           # Settings UI with tabs
├── options.js             # Settings page logic
├── icons/                 # Extension icons (16, 48, 128px + disabled variants)
├── docs/planning/         # Development phases and planning docs
└── PRIVACY_POLICY.md      # Privacy documentation
```

## Testing

No automated tests. Manual testing workflow:

1. Load extension in Chrome
2. Navigate to `mail.google.com`
3. Open emails with external links
4. Click links to verify interception
5. Test modal actions: Open, Cancel, Copy URL, Whitelist
6. Check options page for history/statistics updates
7. Test edge cases: Gmail redirect URLs, rapid clicks, special protocols (mailto:, tel:)

## Common Development Tasks

### Adding New Link Selectors

If Gmail UI changes break link detection, update `findEmailLinks()` selectors in content.js:412-437.

### Modifying Modal UI

Modal styles are injected via `injectModalStyles()` in content.js:76-400. Modal HTML is generated in `createModalElement()` in content.js:576-660.

### Adjusting Security Heuristics

Modify risk detection logic in `analyzeURL()` in content.js:538-573. Add new risk indicators to the `risks` array in `createModalElement()`.

### Storage Schema Changes

When modifying storage structure, ensure backward compatibility or provide migration logic in background.js `onInstalled` handler. Update both `getDefaultStats()` functions in content.js:946-959 and options.js:304-317.

## Important Constraints

- **No external dependencies**: Pure vanilla JS, no npm packages or build process
- **Manifest V3 compliance**: Uses service worker (not background page), specific permissions model
- **Gmail-specific**: Extension only works on `mail.google.com/*`, deeply coupled to Gmail's DOM structure
- **Local data only**: No external API calls, all processing happens locally
- **50-entry history limit**: Prevents unbounded storage growth

## Chrome Web Store Preparation

See `docs/planning/chrome_store_prep.md` for publishing checklist. Key requirements:
- Screenshots showing modal, options page, and in-action views
- Privacy policy (included in PRIVACY_POLICY.md)
- Promotional images and descriptions prepared
