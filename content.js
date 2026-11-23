// Mailstrong - Phase 3: Advanced Features
// Includes: Copy URL, Recent Links History, Statistics/Analytics

(function() {
  'use strict';

  console.log('Mailstrong v3.0: Content script loaded');

  // Configuration
  let enabled = true;
  let whitelist = [];
  let historyEnabled = true;
  let statsEnabled = true;
  let modalOpen = false;
  let dismissTimer = null;
  let remainingSeconds = 5;
  // Copy debounce / toast throttling state
  let copyInProgress = false;
  let lastCopyAt = 0;
  const COPY_COOLDOWN_MS = 500;
  const TOAST_COOLDOWN_MS = 1000;
  let lastToastAt = 0;

  // Inline brand marks and UI icons (content scripts can't load extension
  // images without web_accessible_resources, so these stay inline).
  const ICON_BRAND = '<svg class="gli-brand-icon" viewBox="0 0 28 40" aria-hidden="true" focusable="false"><path fill="#FF2E29" fill-rule="evenodd" clip-rule="evenodd" d="M4 4H8V0H12V4H16V0H20V4H24V0H28V28H24V32H20V36H16V40H12V36H8V32H4V28H0V0H4V4ZM12 10V18H16V10H12Z"/></svg>';
  const WORDMARK = '<svg class="gli-brand-wordmark" viewBox="0 0 145 36" aria-hidden="true" focusable="false"><g fill="currentColor">' +
    '<path d="M138.562 21.5947H131.364V20.1533H129.923V18.7119H128.49V14.3965H129.923V12.9551H131.364V11.5137H142.887V12.9551H140.004V14.3965H141.445V18.7119H140.004V20.1533H138.562V21.5947ZM132.806 20.1533H137.13V18.7119H138.562V14.3965H137.13V12.9551H132.806V14.3965H131.364V18.7119H132.806V20.1533ZM142.887 33.1084H141.445V30.2256H140.004V28.7842H131.364V27.3516H129.923V25.9189H128.49V23.0361H129.923V21.5947H131.364V24.4775H132.806V25.9189H141.445V27.3516H142.887V28.7842H144.328V31.667H142.887V33.1084ZM140.004 35.9912H131.364V34.5498H129.923V33.1084H128.49V30.2256H129.923V28.7842H131.364V33.1084H132.806V34.5498H140.004V35.9912ZM141.445 34.5498H140.004V33.1084H141.445V34.5498Z"/>' +
    '<path d="M115.869 27.3516H110.112V25.9189H111.545V14.3965H110.112V12.9551H111.545V11.5137H112.986V10.0723H114.428V12.9551H115.869V14.3965H114.428V25.9189H115.869V27.3516ZM126.671 27.3516H120.905V25.9189H122.347V14.3965H120.905V12.9551H115.869V11.5137H122.347V12.9551H123.788V14.3965H125.229V25.9189H126.671V27.3516Z"/>' +
    '<path d="M103.986 27.3516H96.7876V25.9189H95.3462V24.4775H93.9048V21.5947H92.4722V17.2793H93.9048V14.3965H95.3462V12.9551H96.7876V11.5137H103.986V12.9551H105.427V14.3965H106.869V17.2793H108.31V21.5947H106.869V24.4775H105.427V25.9189H103.986V27.3516ZM98.229 25.9189H102.544V24.4775H103.986V21.5947H105.427V17.2793H103.986V14.3965H102.544V12.9551H98.229V14.3965H96.7876V17.2793H95.3462V21.5947H96.7876V24.4775H98.229V25.9189Z"/>' +
    '<path d="M86.3545 27.3516H80.5977V25.9189H82.0303V14.3965H80.5977V12.9551H82.0303V11.5137H83.4717V10.0723H84.9131V12.9551H86.3545V14.3965H84.9131V25.9189H86.3545V27.3516ZM92.1113 14.3965H89.2373V12.9551H86.3545V11.5137H92.1113V14.3965Z"/>' +
    '<path d="M77.3628 27.3516H73.0386V25.9189H71.5972V12.9551H70.1646V11.5137H71.5972V10.0723H73.0386V8.63965H74.48V11.5137H78.8042V12.9551H74.48V25.9189H77.3628V27.3516ZM78.8042 25.9189H77.3628V24.4775H78.8042V25.9189Z"/>' +
    '<path d="M67.6421 15.8379H66.2007V14.3965H64.7681V12.9551H59.7231V11.5137H66.2007V12.9551H67.6421V15.8379ZM65.4888 27.3516H58.2817V25.9189H56.8491V22.3154H58.2817V24.4775H59.7231V25.9189H64.0474V24.4775H65.4888V21.5947H64.0474V20.1533H61.1646V18.7119H58.2817V17.2793H56.8491V14.3965H58.2817V12.9551H59.7231V15.8379H61.1646V17.2793H64.0474V18.7119H66.9214V20.1533H68.3628V24.4775H66.9214V25.9189H65.4888V27.3516Z"/>' +
    '<path d="M55.0557 27.3516H49.2988V25.9189H50.7314V4.31543H49.2988V2.87402H50.7314V1.43262H52.1729V0H53.6143V25.9189H55.0557V27.3516Z"/>' +
    '<path d="M46.064 7.19824H43.1812V4.31543H46.064V7.19824ZM47.5054 27.3516H41.7485V25.9189H43.1812V14.3965H41.7485V12.9551H43.1812V11.5137H44.6226V10.0723H46.064V25.9189H47.5054V27.3516Z"/>' +
    '<path d="M39.9463 27.3516H37.0635V25.9189H34.1895V24.4775H35.6221V18.7119H34.1895V17.2793H35.6221V14.3965H34.1895V12.9551H29.8652V14.3965H28.4238V15.8379H25.5498V14.3965H26.9824V12.9551H28.4238V11.5137H35.6221V12.9551H37.0635V14.3965H38.5049V25.9189H39.9463V27.3516ZM34.1895 20.1533H29.8652V18.7119H34.1895V20.1533ZM34.1895 27.3516H28.4238V25.9189H26.9824V24.4775H25.5498V21.5947H26.9824V20.1533H29.8652V21.5947H28.4238V24.4775H29.8652V25.9189H34.1895V27.3516Z"/>' +
    '<path d="M7.19824 27.3516H0V25.9189H2.87402V5.75684H0V4.31543H7.19824V10.0723H8.63965V14.3965H10.0723V18.7119H11.5137V23.0361H12.9551V27.3516H10.0723V23.0361H8.63965V18.7119H7.19824V14.3965H5.75684V10.0723H4.31543V25.9189H7.19824V27.3516ZM24.4775 27.3516H15.8379V25.9189H18.7119V10.0723H17.2793V4.31543H24.4775V5.75684H21.5947V25.9189H24.4775V27.3516ZM17.2793 14.3965H15.8379V10.0723H17.2793V14.3965ZM15.8379 18.7119H14.3965V14.3965H15.8379V18.7119ZM14.3965 23.0361H12.9551V18.7119H14.3965V23.0361Z"/>' +
    '</g></svg>';
  const ICON_COPY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>';
  const ICON_OPEN = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
  const ICON_LOCK = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5V3.5a3 3 0 0 1 6 0V5h1v7H2V5h1zm1.5 0h3V3.5a1.5 1.5 0 0 0-3 0V5z"/></svg>';
  const ICON_UNLOCK = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5V3.5a3 3 0 0 1 5.8-1.1l-1.4.5A1.5 1.5 0 0 0 4.5 3.5V5H10v7H2V5h1z"/></svg>';

  // Load settings from storage
  chrome.storage.sync.get(['enabled', 'whitelist', 'historyEnabled', 'statsEnabled'], (data) => {
    enabled = data.enabled !== false;
    whitelist = data.whitelist || [];
    historyEnabled = data.historyEnabled !== false;
    statsEnabled = data.statsEnabled !== false;
    console.log('Mailstrong: Settings loaded', { 
      enabled, 
      whitelist, 
      historyEnabled, 
      statsEnabled 
    });
    
    if (enabled) {
      initializeInterceptor();
    }
  });

  function initializeInterceptor() {
    console.log('Mailstrong: Initializing...');
    waitForGmailLoad().then(() => {
      console.log('Mailstrong: Gmail loaded, starting observation');
      injectModalStyles();
      attachInitialListeners();
      observeGmailChanges();
    });
  }

  // Wait for Gmail's main interface to load
  function waitForGmailLoad() {
    return new Promise((resolve) => {
      // Check if Gmail elements already exist
      const checkGmailLoaded = () => {
        return document.querySelector('[role="main"]') ||
               document.querySelector('.AO') ||
               document.querySelector('.nH') ||
               document.querySelector('[role="navigation"]') ||
               document.querySelector('.bkK') || // Gmail sidebar
               document.body.classList.contains('loaded');
      };

      // If already loaded, resolve immediately
      if (checkGmailLoaded()) {
        console.log('Mailstrong: Gmail already loaded');
        resolve();
        return;
      }

      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * 500ms = 15 seconds total

      const checkInterval = setInterval(() => {
        attempts++;

        if (checkGmailLoaded()) {
          clearInterval(checkInterval);
          console.log('Mailstrong: Gmail interface detected');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.log('Mailstrong: Proceeding without Gmail confirmation (this is normal for some Gmail views)');
          resolve();
        }
      }, 500);
    });
  }

  // Inject modal styles into page
  function injectModalStyles() {
    if (document.getElementById('gli-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'gli-modal-styles';
    style.textContent = `
      #gli-modal {
        --gli-ink: #111111;
        --gli-muted: #6b6b6b;
        --gli-surface: #f3f3f3;
        --gli-rule: #e3e3e3;
        --gli-green: #2e7d32;
        --gli-green-hover: #256b29;
        --gli-red: #c62828;
        --gli-blue: #1b6dd6;
        --gli-amber: #8a5a00;
        --gli-sans: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        --gli-mono: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--gli-sans);
        color: var(--gli-ink);
        -webkit-font-smoothing: antialiased;
        animation: gli-fadeIn 0.2s ease-out;
      }

      #gli-modal *,
      #gli-modal *::before,
      #gli-modal *::after {
        box-sizing: border-box;
      }

      @keyframes gli-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      #gli-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(17, 17, 17, 0.35);
      }

      #gli-modal-content {
        position: relative;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 24px 64px rgba(0, 0, 0, 0.18);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: auto;
        padding: 0 24px;
        animation: gli-slideUp 0.25s ease-out;
      }

      @keyframes gli-slideUp {
        from {
          transform: translateY(12px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .gli-modal-header {
        padding: 24px 0 20px;
        border-bottom: 1px solid var(--gli-rule);
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .gli-brand-icon {
        display: block;
        width: 28px;
        height: 40px;
        flex-shrink: 0;
      }

      .gli-brand-wordmark {
        display: block;
        width: 145px;
        height: 36px;
        color: var(--gli-ink);
      }

      /* Kept for screen readers; the wordmark is the visible heading. */
      .gli-modal-title {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }

      .gli-modal-body {
        padding: 24px 0 0;
      }

      .gli-url-section {
        margin-bottom: 24px;
      }

      .gli-url-section:last-child {
        margin-bottom: 0;
      }

      .gli-section-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--gli-ink);
        text-transform: uppercase;
        letter-spacing: 0.02em;
        line-height: 1.2;
        margin-bottom: 10px;
      }

      .gli-domain {
        font-size: 20px;
        font-weight: 500;
        color: var(--gli-blue);
        word-break: break-all;
        font-family: var(--gli-mono);
        line-height: 1.3;
      }

      .gli-url-box {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: var(--gli-surface);
        border-radius: 8px;
        padding: 14px 12px 14px 16px;
      }

      .gli-full-url {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        color: var(--gli-ink);
        /* allow wrapping of long URLs across lines for readability */
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;
        font-family: var(--gli-mono);
        line-height: 1.45;
        max-height: 120px;
        overflow-y: auto;
        padding-top: 2px;
      }

      .gli-copy-btn {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        margin: 0;
        background: transparent;
        color: var(--gli-ink);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .gli-copy-btn svg {
        width: 20px;
        height: 20px;
        display: block;
      }

      .gli-copy-btn:hover {
        background: var(--gli-rule);
      }

      .gli-copy-btn.copied {
        color: var(--gli-green);
      }

      .gli-btn--disabled {
        opacity: 0.6;
        pointer-events: none;
      }

      .gli-security-section {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: var(--gli-surface);
        border-radius: 8px;
      }

      .gli-security-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 10px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.02em;
        line-height: 1;
        flex-shrink: 0;
        color: #ffffff;
      }

      .gli-security-badge svg {
        width: 12px;
        height: 12px;
        display: block;
      }

      .gli-security-badge.secure {
        background: var(--gli-green);
      }

      .gli-security-badge.insecure {
        background: var(--gli-red);
      }

      .gli-security-text {
        font-size: 14px;
        color: var(--gli-ink);
        font-family: var(--gli-mono);
      }

      .gli-risk-indicators {
        margin-top: 12px;
        border-left: 3px solid var(--gli-red);
        padding: 4px 0 4px 12px;
      }

      .gli-risk-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 4px 0;
        font-size: 13px;
        line-height: 1.4;
        color: var(--gli-ink);
      }

      .gli-risk-icon {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        margin-top: 1px;
        border-radius: 50%;
        background: var(--gli-red);
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        line-height: 16px;
        text-align: center;
      }

      .gli-risk-icon.info {
        background: var(--gli-muted);
      }

      .gli-modal-footer {
        padding: 24px 0 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .gli-button-group {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
      }

      .gli-button {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 40px;
        padding: 0 24px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        transition: background 0.15s;
        font-family: var(--gli-sans);
      }

      .gli-button svg {
        width: 16px;
        height: 16px;
        display: block;
      }

      #gli-modal .gli-button:focus,
      #gli-modal .gli-copy-btn:focus {
        outline: 2px solid var(--gli-blue);
        outline-offset: 2px;
      }

      .gli-button-primary {
        background: var(--gli-green);
        color: #ffffff;
      }

      .gli-button-primary:hover {
        background: var(--gli-green-hover);
      }

      .gli-button-secondary {
        background: var(--gli-rule);
        color: var(--gli-ink);
      }

      .gli-button-secondary:hover {
        background: #d6d6d6;
      }

      .gli-whitelist-link {
        align-self: center;
        text-align: center;
        font-size: 13px;
        color: var(--gli-blue);
        cursor: pointer;
        padding: 6px 8px;
        border-radius: 4px;
      }

      .gli-whitelist-link:hover {
        text-decoration: underline;
      }

      .gli-timer {
        text-align: center;
        font-size: 13px;
        color: var(--gli-muted);
        padding: 4px 8px;
      }

      .gli-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #111111;
        color: #ffffff;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 1000000;
        animation: gli-slideIn 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
      }

      @keyframes gli-slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #gli-modal,
        #gli-modal-content,
        .gli-toast {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('Mailstrong: Styles injected');
  }

  // Attach listeners to existing links
  function attachInitialListeners() {
    const links = findEmailLinks();
    console.log(`Mailstrong: Found ${links.length} initial links`);
    
    links.forEach(link => {
      if (!link.dataset.gliIntercepted) {
        attachLinkListener(link);
      }
    });
  }

  // Find all email links
  function findEmailLinks() {
    const links = [];
    const selectors = [
      '[role="main"] a[href^="http"]',
      '.a3s a[href^="http"]',
      '.ii a[href^="http"]',
      '[role="listitem"] a[href^="http"]'
    ];

    selectors.forEach(selector => {
      try {
        const found = document.querySelectorAll(selector);
        found.forEach(link => {
          if (!isGmailInternalLink(link.href)) {
            links.push(link);
          }
        });
      } catch (e) {
        console.error('Mailstrong: Error with selector', selector, e);
      }
    });

    return links;
  }

  // Check if link is Gmail internal
  function isGmailInternalLink(href) {
    if (!href) return true;
    
    const internalPatterns = [
      /^#/,
      /^\/mail\//,
      /mail\.google\.com\/mail\/u\//
    ];

    return internalPatterns.some(pattern => pattern.test(href));
  }

  // Attach event listener to a link
  function attachLinkListener(link) {
    link.dataset.gliIntercepted = 'true';
    link.addEventListener('mousedown', handleLinkClick, true);
    link.addEventListener('click', handleLinkClick, true);
  }

  // Unwrap Gmail redirect URLs
  function unwrapGmailURL(href) {
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

  // Check if link should be intercepted
  function shouldInterceptLink(href) {
    if (!href) return false;
    
    const specialProtocols = ['mailto:', 'tel:', 'javascript:', 'data:', 'about:'];
    if (specialProtocols.some(proto => href.startsWith(proto))) {
      return false;
    }
    
    if (isGmailInternalLink(href)) {
      return false;
    }
    
    if (href.includes('/mail/u/') && href.includes('/view')) {
      return false;
    }
    
    return href.startsWith('http://') || href.startsWith('https://');
  }

  // Handle link clicks
  function handleLinkClick(e) {
    if (!enabled || modalOpen) return;

    const link = e.target.closest('a');
    if (!link) return;

    const href = unwrapGmailURL(link.href);
    
    if (!shouldInterceptLink(href)) return;
    if (isWhitelisted(href)) {
      console.log('Mailstrong: Whitelisted link, allowing', href);
      return;
    }

    console.log('Mailstrong: Link intercepted', href);

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    modalOpen = true;
    showModal(href);
  }

  // Check if URL is whitelisted
  function isWhitelisted(url) {
    if (!whitelist || whitelist.length === 0) return false;
    
    try {
      const urlObj = new URL(url);
      return whitelist.some(domain => {
        return urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain);
      });
    } catch (e) {
      return false;
    }
  }

  // Analyze URL for display and risk indicators
  function analyzeURL(url) {
    try {
      const parsed = new URL(url);
      const isSecure = parsed.protocol === 'https:';
      const hostname = parsed.hostname;
      const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
      const hasSuspicious = /[<>{}|\\^`]/.test(url);
      const isVeryLong = url.length > 200;
      
      return {
        full: url,
        protocol: parsed.protocol,
        hostname: hostname,
        pathname: parsed.pathname,
        search: parsed.search,
        isSecure: isSecure,
        isIP: isIP,
        hasSuspicious: hasSuspicious,
        isVeryLong: isVeryLong,
        // Always show the full URL in the modal; CSS will wrap long lines.
        displayURL: url
      };
    } catch (err) {
      console.error('Mailstrong: Invalid URL', url, err);
      return {
        full: url,
        protocol: 'unknown',
        hostname: 'Invalid URL',
        isSecure: false,
        isIP: false,
        hasSuspicious: true,
        isVeryLong: false,
        displayURL: url
      };
    }
  }

  // Create modal element
  function createModalElement(analysis) {
    const modal = document.createElement('div');
    modal.id = 'gli-modal';
    modal.dataset.url = analysis.full;
    
    const risks = [];
    if (!analysis.isSecure) {
      risks.push({ icon: '!', text: 'This connection is not secure (HTTP)' });
    }
    if (analysis.isIP) {
      risks.push({ icon: '!', text: 'URL uses an IP address instead of a domain' });
    }
    if (analysis.hasSuspicious) {
      risks.push({ icon: '!', text: 'URL contains unusual characters' });
    }
    if (analysis.isVeryLong) {
      risks.push({ icon: 'i', kind: 'info', text: 'This is an unusually long URL' });
    }

    const riskHTML = risks.length > 0 ? `
      <div class="gli-risk-indicators">
        ${risks.map(risk => `
          <div class="gli-risk-item">
            <span class="gli-risk-icon ${risk.kind || ''}" aria-hidden="true">${risk.icon}</span>
            <span>${risk.text}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    modal.innerHTML = `
      <div id="gli-modal-backdrop"></div>
      <div id="gli-modal-content">
        <div class="gli-modal-header">
          ${ICON_BRAND}
          ${WORDMARK}
          <h2 class="gli-modal-title">Mailstrong: External Link Detected</h2>
        </div>
        <div class="gli-modal-body">
          <div class="gli-url-section">
            <div class="gli-section-label">Domain</div>
            <div class="gli-domain">${analysis.hostname}</div>
          </div>

          <div class="gli-url-section">
            <div class="gli-section-label">Full URL</div>
            <div class="gli-url-box">
              <div class="gli-full-url">${analysis.displayURL}</div>
              <button class="gli-copy-btn" id="gli-copy-btn" title="Copy URL to clipboard" aria-label="Copy URL">${ICON_COPY}</button>
            </div>
          </div>

          <div class="gli-url-section">
            <div class="gli-section-label">Connection</div>
            <div class="gli-security-section">
              <div class="gli-security-badge ${analysis.isSecure ? 'secure' : 'insecure'}">
                ${analysis.isSecure ? ICON_LOCK + 'HTTPS' : ICON_UNLOCK + 'HTTP'}
              </div>
              <div class="gli-security-text">
                ${analysis.isSecure ? 'Secure connection' : 'Unencrypted connection'}
              </div>
            </div>
            ${riskHTML}
          </div>
        </div>
        <div class="gli-modal-footer">
          <div class="gli-button-group">
            <button class="gli-button gli-button-primary" id="gli-confirm-btn">
              Open Link ${ICON_OPEN}
            </button>
            <button class="gli-button gli-button-secondary" id="gli-cancel-btn">
              Cancel
            </button>
          </div>
          <div class="gli-whitelist-link" id="gli-whitelist-btn">
            Add "${analysis.hostname}" to trusted domains
          </div>
          <div class="gli-timer" id="gli-timer">
            Dismissing in ${remainingSeconds} seconds...
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Show modal
  function showModal(url) {
    removeModal();
    
    const analysis = analyzeURL(url);
    const modal = createModalElement(analysis);
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    attachModalListeners(modal, url, analysis);
    trapFocus(modal);
    startAutoDismiss();
    
    // Record interception in history and stats
    recordInterception(url, analysis);
    
    console.log('Mailstrong: Modal displayed');
  }

  // Attach modal event listeners
  function attachModalListeners(modal, url, analysis) {
    const confirmBtn = modal.querySelector('#gli-confirm-btn');
    const cancelBtn = modal.querySelector('#gli-cancel-btn');
    const whitelistBtn = modal.querySelector('#gli-whitelist-btn');
    const copyBtn = modal.querySelector('#gli-copy-btn');
    const backdrop = modal.querySelector('#gli-modal-backdrop');

    confirmBtn.addEventListener('click', () => handleConfirm(url, analysis));
    cancelBtn.addEventListener('click', () => handleCancel(url, analysis));
    whitelistBtn.addEventListener('click', () => handleWhitelist(url, analysis.hostname));
  copyBtn.addEventListener('click', () => handleCopyURL(url, copyBtn));
    backdrop.addEventListener('click', () => handleCancel(url, analysis));

    // Delay pause activation to avoid immediate triggering
    setTimeout(() => {
      modal.addEventListener('mouseenter', pauseAutoDismiss);
      modal.addEventListener('click', pauseAutoDismiss);
    }, 500);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
  }

  // Handle keyboard presses
  function handleKeyPress(e) {
    if (!modalOpen) return;

    if (e.key === 'Escape') {
      const modal = document.getElementById('gli-modal');
      const url = modal.dataset.url;
      const analysis = analyzeURL(url);
      handleCancel(url, analysis);
    } else if (e.key === 'Enter') {
      const modal = document.getElementById('gli-modal');
      const url = modal.dataset.url;
      const analysis = analyzeURL(url);
      if (url) handleConfirm(url, analysis);
    }
  }

  // Handle copy URL to clipboard with debounce and single-toast throttling
  function handleCopyURL(url, buttonEl) {
    const now = Date.now();
    if (copyInProgress || (now - lastCopyAt) < COPY_COOLDOWN_MS) {
      return; // ignore rapid clicks
    }

    copyInProgress = true;
    lastCopyAt = now;

    const copyBtn = buttonEl || document.getElementById('gli-copy-btn');
    const originalText = copyBtn ? copyBtn.innerHTML : null;

    // Disable UI
    if (copyBtn) {
      copyBtn.classList.add('gli-btn--disabled');
      copyBtn.setAttribute('aria-disabled', 'true');
    }

    const showCopyToastOnce = (msg) => {
      const tNow = Date.now();
      if ((tNow - lastToastAt) > TOAST_COOLDOWN_MS) {
        showToast(msg);
        lastToastAt = tNow;
      }
    };

    const finishCopy = (success) => {
      // Visual copied state
      if (copyBtn) {
        copyBtn.innerHTML = success ? ICON_CHECK : (originalText || 'Copy');
        if (success) copyBtn.classList.add('copied');
      }

      showCopyToastOnce(success ? 'URL copied to clipboard' : 'Failed to copy URL');

      // Re-enable after a short cooldown; keep "copied" state visible briefly
      setTimeout(() => {
        copyInProgress = false;
        if (copyBtn) {
          if (originalText) copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('copied');
          copyBtn.classList.remove('gli-btn--disabled');
          copyBtn.removeAttribute('aria-disabled');
        }
      }, Math.max(COPY_COOLDOWN_MS, 500));
    };

    // Try navigator.clipboard first with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        console.log('Mailstrong: URL copied to clipboard');
        finishCopy(true);
      }).catch(err => {
        console.warn('Mailstrong: Primary copy failed, trying fallback', err);
        // Fallback
        try {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          finishCopy(true);
        } catch (err2) {
          console.error('Mailstrong: Copy fallback failed', err2);
          finishCopy(false);
        }
      });
    } else {
      // Fallback when navigator.clipboard not available
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        finishCopy(true);
      } catch (err) {
        console.error('Mailstrong: Copy fallback failed', err);
        finishCopy(false);
      }
    }
  }

  // Handle confirm action
  function handleConfirm(url, analysis) {
    console.log('Mailstrong: User confirmed link', url);
    recordAction(url, analysis, 'opened');
    window.open(url, '_blank', 'noopener,noreferrer');
    removeModal();
  }

  // Handle cancel action
  function handleCancel(url, analysis) {
    console.log('Mailstrong: User cancelled');
    recordAction(url, analysis, 'cancelled');
    removeModal();
  }

  // Handle whitelist action
  function handleWhitelist(url, domain) {
    chrome.storage.sync.get(['whitelist'], (data) => {
      const currentWhitelist = data.whitelist || [];
      
      if (!currentWhitelist.includes(domain)) {
        currentWhitelist.push(domain);
        chrome.storage.sync.set({ whitelist: currentWhitelist }, () => {
          console.log('Gmail Link Interceptor: Domain whitelisted', domain);
          whitelist = currentWhitelist;
          
          const analysis = analyzeURL(url);
          recordAction(url, analysis, 'whitelisted');
          
          showToast(`${domain} added to trusted domains`);
          window.open(url, '_blank', 'noopener,noreferrer');
          removeModal();
        });
      } else {
        showToast(`${domain} is already in trusted domains`);
      }
    });
  }

  // Record interception in history
  function recordInterception(url, analysis) {
    if (!historyEnabled) return;

    chrome.storage.local.get(['linkHistory'], (data) => {
      const history = data.linkHistory || [];
      
      const entry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: url,
        domain: analysis.hostname,
        timestamp: Date.now(),
        isSecure: analysis.isSecure,
        action: 'pending'
      };
      
      history.unshift(entry);
      
      // Keep only last 50 entries
      if (history.length > 50) {
        history.splice(50);
      }
      
      chrome.storage.local.set({ linkHistory: history });
      console.log('Gmail Link Interceptor: Recorded in history', entry);
    });
  }

  // Record user action in history and statistics
  function recordAction(url, analysis, action) {
    const domain = analysis.hostname;
    
    // Update history
    if (historyEnabled) {
      chrome.storage.local.get(['linkHistory'], (data) => {
        const history = data.linkHistory || [];
        
        // Find and update the most recent pending entry for this URL
        const entry = history.find(h => h.url === url && h.action === 'pending');
        if (entry) {
          entry.action = action;
          chrome.storage.local.set({ linkHistory: history });
        }
      });
    }
    
    // Update statistics
    if (statsEnabled) {
      chrome.storage.local.get(['stats'], (data) => {
        const stats = data.stats || getDefaultStats();
        
        stats.totalIntercepted++;
        
        if (action === 'opened') stats.totalOpened++;
        if (action === 'cancelled') stats.totalCancelled++;
        if (action === 'whitelisted') stats.totalWhitelisted++;
        
        // Update domain stats
        if (!stats.domainStats[domain]) {
          stats.domainStats[domain] = { 
            count: 0, 
            opened: 0, 
            cancelled: 0, 
            whitelisted: 0,
            lastSeen: 0 
          };
        }
        stats.domainStats[domain].count++;
        if (action === 'opened') stats.domainStats[domain].opened++;
        if (action === 'cancelled') stats.domainStats[domain].cancelled++;
        if (action === 'whitelisted') stats.domainStats[domain].whitelisted++;
        stats.domainStats[domain].lastSeen = Date.now();
        
        // Update security stats
        if (analysis.isSecure) {
          stats.httpsCount++;
        } else {
          stats.httpCount++;
        }
        
        // Count suspicious links blocked
        if (action === 'cancelled' && (!analysis.isSecure || analysis.isIP || analysis.hasSuspicious)) {
          stats.suspiciousBlocked++;
        }
        
        chrome.storage.local.set({ stats });
        console.log('Gmail Link Interceptor: Stats updated', stats);
      });
    }
  }

  // Get default statistics object
  function getDefaultStats() {
    return {
      totalIntercepted: 0,
      totalOpened: 0,
      totalCancelled: 0,
      totalWhitelisted: 0,
      httpCount: 0,
      httpsCount: 0,
      suspiciousBlocked: 0,
      domainStats: {},
      installDate: Date.now(),
      lastReset: Date.now()
    };
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'gli-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Start auto-dismiss timer
  function startAutoDismiss() {
    remainingSeconds = 5;
    updateTimerDisplay();
    
    dismissTimer = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      
      if (remainingSeconds <= 0) {
        clearInterval(dismissTimer);
        const modal = document.getElementById('gli-modal');
        const url = modal.dataset.url;
        const analysis = analyzeURL(url);
        handleCancel(url, analysis);
      }
    }, 1000);
  }

  // Pause auto-dismiss
  function pauseAutoDismiss() {
    if (dismissTimer) {
      clearInterval(dismissTimer);
      dismissTimer = null;
      const timerEl = document.getElementById('gli-timer');
      if (timerEl) {
        timerEl.textContent = 'Auto-dismiss paused';
      }
    }
  }

  // Update timer display
  function updateTimerDisplay() {
    const timerEl = document.getElementById('gli-timer');
    if (timerEl) {
      timerEl.textContent = `Dismissing in ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}...`;
    }
  }

  // Remove modal
  function removeModal() {
    const modal = document.getElementById('gli-modal');
    if (!modal) return;

    clearInterval(dismissTimer);
    dismissTimer = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyPress);
    modal.remove();
    modalOpen = false;
    
    console.log('Gmail Link Interceptor: Modal closed');
  }

  // Trap focus within modal
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    setTimeout(() => firstElement?.focus(), 100);
    
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    });
  }

  // Observe Gmail DOM changes
  function observeGmailChanges() {
    const observer = new MutationObserver(() => {
      if (window.gliProcessingMutations) return;
      
      window.gliProcessingMutations = true;
      
      setTimeout(() => {
        const newLinks = findEmailLinks().filter(link => !link.dataset.gliIntercepted);
        
        if (newLinks.length > 0) {
          console.log(`Gmail Link Interceptor: Found ${newLinks.length} new links`);
          newLinks.forEach(attachLinkListener);
        }
        
        window.gliProcessingMutations = false;
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('Gmail Link Interceptor: MutationObserver started');
  }

  // Listen for settings changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.enabled) {
        enabled = changes.enabled.newValue;
        console.log('Gmail Link Interceptor: Enabled status changed', enabled);
      }
      if (changes.whitelist) {
        whitelist = changes.whitelist.newValue || [];
        console.log('Gmail Link Interceptor: Whitelist updated', whitelist);
      }
      if (changes.historyEnabled) {
        historyEnabled = changes.historyEnabled.newValue;
        console.log('Gmail Link Interceptor: History enabled changed', historyEnabled);
      }
      if (changes.statsEnabled) {
        statsEnabled = changes.statsEnabled.newValue;
        console.log('Gmail Link Interceptor: Stats enabled changed', statsEnabled);
      }
    }
  });

})();