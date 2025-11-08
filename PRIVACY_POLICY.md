# Privacy Policy for Gmail Link Interceptor

**Last Updated: November 7, 2025**

## Overview

Gmail Link Interceptor is committed to protecting your privacy. This extension operates entirely locally on your device and does not collect, transmit, or store any personal information on external servers.

## What We Don't Collect

Gmail Link Interceptor does **NOT** collect, store, or transmit:
- Personal information (name, email, address)
- Email content or metadata
- Browsing history outside of Gmail
- User credentials or passwords
- Analytics or telemetry data
- Usage patterns or behavioral data
- Device information
- Location data

## What We Store (Locally Only)

The extension stores the following data **exclusively on your device**:

### Chrome Sync Storage
This data syncs across your Chrome browsers when signed in:
- **Extension Status:** Whether the extension is enabled or disabled
- **Whitelist:** Domain names you've manually added to trusted domains
- **Feature Toggles:** Your preferences for history tracking and statistics

### Chrome Local Storage
This data stays on the current device only:
- **Link History:** Records of the last 50 intercepted links (URL, domain, timestamp, action taken, security status)
- **Statistics:** Aggregate counters (total links intercepted, opened, cancelled, etc.) and domain frequency data

**Important:** All stored data is:
- Stored locally using Chrome's built-in storage APIs
- Never transmitted to external servers
- Completely under your control
- Deletable at any time through the Options page

## How We Process Data

All link interception and analysis happens **entirely within your browser**:

1. When you click a link in Gmail, the extension:
   - Captures the URL
   - Analyzes it locally (checks for HTTPS, unusual patterns, etc.)
   - Displays a modal with information
   - Records your action (opened, cancelled, whitelisted) if tracking is enabled

2. **No network requests** are made to external services
3. **No data leaves your device** at any point
4. All processing is done client-side in JavaScript

## Third-Party Services

Gmail Link Interceptor does **NOT** use:
- Analytics services (e.g., Google Analytics, Mixpanel)
- Crash reporting services
- Advertising networks
- Error tracking services
- Any third-party data processors
- External APIs or services

**Future Note:** If we add optional features that use external services (e.g., domain reputation checks), they will:
- Be clearly disclosed
- Require explicit opt-in
- Be documented in an updated privacy policy

## Chrome Permissions Explained

The extension requests minimal permissions to function:

### "storage"
- **Purpose:** Store your settings, whitelist, history, and statistics locally on your device
- **Data Access:** Only data you explicitly create (domains you whitelist, statistics about links you click)
- **Privacy Impact:** Low - all data stays on your device

### "activeTab"
- **Purpose:** Interact with the Gmail tab when you're actively using it to detect link clicks
- **Data Access:** Only accesses the current Gmail tab when you click a link
- **Privacy Impact:** Minimal - no data collected, only used to show the confirmation modal

### "host_permissions" for https://mail.google.com/*
- **Purpose:** Function exclusively on Gmail web interface
- **Data Access:** Extension only activates on Gmail pages, nowhere else
- **Privacy Impact:** Limited scope - only works on one website you choose to use

## Your Rights and Control

You have complete control over your data:

### View Your Data
- Open Options page → Statistics tab to see aggregate numbers
- Open Options page → History tab to see recent links
- All data is transparent and viewable

### Delete Your Data
- **Clear History:** Options → History → "Clear History" button
- **Reset Statistics:** Options → Statistics → "Reset Statistics" button
- **Remove Whitelist:** Options → General → Delete domains from whitelist
- **Complete Removal:** Uninstall the extension to remove all stored data

### Disable Tracking
- **Disable History:** Options → General → Toggle off "Link History"
- **Disable Statistics:** Options → General → Toggle off "Statistics"
- **Disable Extension:** Click extension icon to toggle off (stops all interception)

### Export Your Data
- While there's no built-in export feature, you can access raw data:
  - Open Options page
  - Open Developer Console (F12)
  - Run: `chrome.storage.local.get(null, console.log)`
  - Copy the logged data

## Data Retention

- **Link History:** Automatically limited to last 50 entries (older entries auto-deleted)
- **Statistics:** Retained indefinitely unless you manually reset
- **Settings/Whitelist:** Retained until you change or delete them
- **All Data:** Completely removed when you uninstall the extension

## Security

We implement security best practices:
- No external network communication (eliminates data breach risk)
- No server-side storage (no database to hack)
- Minimal permissions requested
- Code follows Chrome extension security guidelines
- Open-source code available for security audit

## Children's Privacy

Gmail Link Interceptor does not knowingly collect data from anyone, including children under 13. Since we don't collect any personal information, there is no special treatment for children's data. However, the extension is designed for users who have Gmail accounts, which typically requires users to be 13 or older per Google's terms.

## Changes to This Privacy Policy

We may update this privacy policy if our data practices change. When we do:
- The "Last Updated" date at the top will be changed
- Significant changes will be announced on the Chrome Web Store listing
- Continued use of the extension after changes constitutes acceptance

**We will never:**
- Start collecting personal data without your explicit consent
- Change from local-only to cloud storage without clear notice
- Add tracking or analytics without disclosure

## Open Source Transparency

Gmail Link Interceptor is open source. You can:
- Review the complete source code: [GitHub Repository URL]
- Verify our privacy claims by reading the code
- Submit issues or contribute improvements
- Fork and modify for your own use

## Compliance

This extension complies with:
- **Chrome Web Store Developer Program Policies**
- **GDPR Principles:** No personal data collected, clear user control, data minimization
- **CCPA Principles:** No data sale, clear privacy notice, user rights respected
- **General Privacy Best Practices:** Transparency, minimal data collection, user control

## Contact Us

For privacy questions, concerns, or requests:

- **GitHub Issues:** [Your GitHub Repository URL]
- **Email:** [Your Contact Email]
- **Chrome Web Store:** Use the "Support" tab on the extension listing

We'll respond to privacy inquiries within 7 business days.

## Data Breach Notification

Since Gmail Link Interceptor:
- Does not collect personal data
- Does not transmit data to external servers
- Stores all data locally on your device

There is no risk of a traditional "data breach" where our servers are compromised. The only risk is if your device is compromised, which is outside the scope of this extension's security model.

## Your Consent

By installing and using Gmail Link Interceptor, you consent to this privacy policy. If you don't agree with this policy, please do not install or use the extension.

---

**Summary:** Gmail Link Interceptor respects your privacy by operating entirely locally. No personal data is collected, no information is transmitted to external servers, and you have complete control over all stored data.

For the latest version of this policy, visit: [URL where you host this document]