# Mailstrong

> A pause before every link in Gmail

Phishing works because clicking is fast. Mailstrong puts a short confirmation in front of every external link in Gmail, showing where the link really goes, so you can decide before anything opens.

## What you see before a link opens

- The real destination, even behind Gmail's `google.com/url` redirects
- The domain, shown large, and the full URL
- Whether the connection is HTTPS or plain HTTP
- Warnings for warning signs: an IP address instead of a domain, unusual characters, or an unusually long URL

## What you can do

- **Open Link:** opens it in a new tab
- **Cancel** (or press Escape): closes without opening
- **Copy URL:** check the link in another tool first
- **Trust this domain:** future links to it open directly

If you do nothing, the confirmation closes after 5 seconds without opening the link. It pauses while your pointer is over it.

## History and statistics (optional)

- Your last 50 intercepted links: what you opened, cancelled or trusted, and when
- Totals for links checked, opened and cancelled, HTTPS vs HTTP, your most common domains, and suspicious links you chose not to open
- Either one can be turned off in settings

## Settings

- Manage your trusted domains
- Turn Mailstrong on or off by clicking its toolbar icon
- Works fully from the keyboard

## Privacy

- Mailstrong has no servers and sends nothing anywhere. No tracking, no analytics, no accounts.
- History and statistics stay on your device.
- Your settings and trusted domains sync between your Chrome browsers through your Google account, like any Chrome setting.
- The code is open source, here in this repo. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for the full policy.

Works on Gmail in the browser (`mail.google.com`).

---

## Install from source

To run Mailstrong from this repo instead of the Chrome Web Store:

1. Download the project zip file
1. Unzip the file
1. In Chrome, go to `chrome://extensions/`
1. Click the "Load unpacked" button (top left)
1. Navigate to the unzipped directory
1. Click the "Select" button
1. The extension is installed. Activate if not already switched on.
1. Go to `mail.google.com` and give it a try

---

Questions or ideas? [Open an issue](https://github.com/calebsylvest/mailstrong/issues).
