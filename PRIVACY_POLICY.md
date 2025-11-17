# Privacy Policy for Mailstrong

**Last Updated: November 16, 2025**

## Overview

Mailstrong is committed to protecting your privacy. This extension operates entirely locally on your device and does not collect, transmit, or store any personal information on external servers.

## What We Don't Collect

Mailstrong does **NOT** collect, store, or transmit:
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

1. **When you click a link in Gmail**, the extension:
   - Captures the URL before it opens
   - Analyzes it locally (checks for HTTPS, unusual patterns, suspicious characters, etc.)
   - Displays a confirmation modal with security information
   - Records your action (opened, cancelled, whitelisted) if tracking is enabled in settings

2. **100% Local Processing:**
   - No network requests are made to external services
   - No data leaves your device at any point
   - All processing is done client-side in JavaScript
   - Your browsing activity remains completely private

## Third-Party Services

Mailstrong does **NOT** use:
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

The extension requests **only essential permissions** to function. Here's what each permission does:

### Storage Permission
- **What it does:** Stores your settings, whitelist, history, and statistics locally
- **What we access:** Only data you explicitly create through the extension
- **Privacy impact:** Low - all data remains on your device, never transmitted elsewhere

### Active Tab Permission
- **What it does:** Allows the extension to detect link clicks on the active Gmail tab
- **What we access:** Only the current Gmail tab, and only when you click a link
- **Privacy impact:** Minimal - no data is collected or stored from tab access

### Host Permission (mail.google.com)
- **What it does:** Enables the extension to run exclusively on Gmail's web interface
- **What we access:** Extension activates only on Gmail pages
- **Privacy impact:** Limited scope - the extension cannot access any other websites you visit

## Your Rights and Control

You have **complete control** over your data at all times:

### View Your Data
- **Statistics:** Options page → Statistics tab displays aggregate metrics
- **History:** Options page → History tab shows your last 50 intercepted links
- **Whitelist:** Options page → General tab lists all trusted domains
- All stored data is transparent and easily viewable

### Delete Your Data
- **Clear History:** Options → History → "Clear History" button (removes all link records)
- **Reset Statistics:** Options → Statistics → "Reset Statistics" button (resets all counters)
- **Remove Whitelist Entries:** Options → General → Delete individual domains or clear all
- **Complete Removal:** Uninstalling the extension permanently removes all stored data

### Control Tracking
- **Disable History Tracking:** Options → General → Toggle off "Link History"
- **Disable Statistics:** Options → General → Toggle off "Statistics"
- **Disable Extension:** Click the extension icon to toggle off (stops all link interception)
- All tracking features are opt-in by default but can be disabled at any time

### Export Your Data
While there's no built-in export feature, you can manually access your raw data:
1. Open the Options page
2. Open browser Developer Console (press F12)
3. Run: `chrome.storage.local.get(null, console.log)`
4. Copy the logged data from the console

## Data Retention

- **Link History:** Automatically limited to last 50 entries (older entries auto-deleted)
- **Statistics:** Retained indefinitely unless you manually reset
- **Settings/Whitelist:** Retained until you change or delete them
- **All Data:** Completely removed when you uninstall the extension

## Security Measures

Mailstrong implements security best practices to protect your privacy:

- **No External Communication:** Zero network requests eliminates data breach and interception risks
- **No Server-Side Storage:** No databases to hack or compromise
- **Minimal Permissions:** Only requests essential permissions required for core functionality
- **Chrome Security Standards:** Code follows official Chrome extension security guidelines
- **Open Source Transparency:** Complete source code available for independent security audits
- **Local-Only Processing:** All URL analysis happens on your device, never on external servers

## Children's Privacy

Mailstrong does not knowingly collect data from anyone, including children under 13. Since we don't collect any personal information, there is no special treatment for children's data. However, the extension is designed for users who have Gmail accounts, which typically requires users to be 13 or older per Google's terms.

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

Mailstrong is open source. You can:
- Review the complete source code: https://github.com/calebsylvest/mailstrong
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

- **GitHub Issues:** https://github.com/calebsylvest/mailstrong/issues
- **Email:** caleb.sylvest@gmail.com
- **Chrome Web Store:** Use the "Support" tab on the extension listing

We'll respond to privacy inquiries within 7 business days.

## Data Breach Notification

Since Mailstrong:
- Does not collect personal data
- Does not transmit data to external servers
- Stores all data locally on your device

There is no risk of a traditional "data breach" where our servers are compromised. The only risk is if your device is compromised, which is outside the scope of this extension's security model.

## Limitation of Liability and Disclaimer

**IMPORTANT - PLEASE READ CAREFULLY**

### No Warranty

Mailstrong is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, either express or implied, including but not limited to:
- Warranties of merchantability
- Fitness for a particular purpose
- Non-infringement
- Accuracy or completeness

### User Responsibility

While Mailstrong is designed to help protect you from phishing and malicious links, you acknowledge and agree that:

1. **The extension is a tool, not a guarantee:** Mailstrong provides warnings and information, but it cannot detect all phishing attempts or malicious links
2. **You make the final decision:** You are solely responsible for determining whether to click any link
3. **No substitute for vigilance:** This extension does not replace the need for user awareness and caution when handling emails and links
4. **Technical limitations:** The extension may not detect sophisticated phishing attempts or zero-day threats

### Limitation of Liability

To the fullest extent permitted by applicable law, the creator, developer, and distributor of Mailstrong shall NOT be liable for:

1. **Any damages whatsoever** arising from your use or inability to use the extension, including but not limited to:
   - Direct, indirect, incidental, or consequential damages
   - Loss of data, profits, or business opportunities
   - Security breaches, identity theft, or financial losses
   - Damages resulting from clicking on phishing or malicious links
   - Any other losses or damages of any kind

2. **User actions or inactions**, including but not limited to:
   - Choosing to open a link despite warnings
   - Failing to recognize phishing attempts
   - Whitelisting malicious domains
   - Disabling the extension or its features
   - Any decisions made based on the extension's warnings or lack thereof

3. **Technical failures**, including but not limited to:
   - Software bugs or errors
   - Compatibility issues with browsers or other extensions
   - False positives or false negatives in link analysis
   - Failure to intercept certain links
   - Data loss or corruption

4. **Third-party actions**, including but not limited to:
   - Phishing attacks that bypass the extension
   - Malicious websites or email senders
   - Changes to Gmail's interface that affect functionality
   - Browser updates that impact the extension

### Maximum Liability Cap

In no event shall the total aggregate liability of the creator of Mailstrong exceed the amount you paid for the extension (which is $0.00 for the free version).

### Indemnification

You agree to indemnify, defend, and hold harmless the creator, developer, and any associated parties from any claims, damages, losses, liabilities, and expenses (including reasonable attorney fees) arising from:
- Your use or misuse of the extension
- Your violation of this policy or any applicable laws
- Any decisions you make regarding links, whether based on the extension's warnings or not

### Acknowledgment

By installing and using Mailstrong, you acknowledge that:
- You have read and understood this limitation of liability
- You accept full responsibility for your online security decisions
- You will not hold the creator liable for any damages or losses
- You use this extension at your own risk

**If you do not agree to these terms, do not install or use Mailstrong.**

## Your Consent

By installing and using Mailstrong, you consent to this privacy policy and the limitation of liability stated above. If you don't agree with this policy, please do not install or use the extension.

---

**Summary:** Mailstrong respects your privacy by operating entirely locally. No personal data is collected, no information is transmitted to external servers, and you have complete control over all stored data. However, you use this extension at your own risk and are solely responsible for your security decisions.

For the latest version of this policy, visit: https://github.com/calebsylvest/mailstrong