// Gmail Link Interceptor - Phase 3: Advanced Features
// Includes: Copy URL, Recent Links History, Statistics/Analytics

(function() {
  'use strict';

  console.log('Gmail Link Interceptor v3.0: Content script loaded');

  // Configuration
  let enabled = true;
  let whitelist = [];
  let historyEnabled = true;
  let statsEnabled = true;
  let modalOpen = false;
  let dismissTimer = null;
  let remainingSeconds = 5;

  // Load settings from storage
  chrome.storage.sync.get(['enabled', 'whitelist', 'historyEnabled', 'statsEnabled'], (data) => {
    enabled = data.enabled !== false;
    whitelist = data.whitelist || [];
    historyEnabled = data.historyEnabled !== false;
    statsEnabled = data.statsEnabled !== false;
    console.log('Gmail Link Interceptor: Settings loaded', { 
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
    console.log('Gmail Link Interceptor: Initializing...');
    waitForGmailLoad().then(() => {
      console.log('Gmail Link Interceptor: Gmail loaded, starting observation');
      injectModalStyles();
      attachInitialListeners();
      observeGmailChanges();
    });
  }

  // Wait for Gmail's main interface to load
  function waitForGmailLoad() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const mainArea = document.querySelector('[role="main"]') || 
                        document.querySelector('.AO') || 
                        document.querySelector('.nH');
        
        if (mainArea) {
          clearInterval(checkInterval);
          console.log('Gmail Link Interceptor: Main area detected');
          resolve();
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Gmail Link Interceptor: Timeout waiting for Gmail');
        resolve();
      }, 10000);
    });
  }

  // Inject modal styles into page
  function injectModalStyles() {
    if (document.getElementById('gli-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'gli-modal-styles';
    style.textContent = `
      #gli-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: gli-fadeIn 0.2s ease-out;
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
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(2px);
      }

      #gli-modal-content {
        position: relative;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: auto;
        animation: gli-slideUp 0.3s ease-out;
      }

      @keyframes gli-slideUp {
        from { 
          transform: translateY(20px);
          opacity: 0;
        }
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }

      .gli-modal-header {
        padding: 24px 24px 16px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .gli-warning-icon {
        width: 32px;
        height: 32px;
        background: #FF9800;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 20px;
        flex-shrink: 0;
      }

      .gli-modal-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .gli-modal-body {
        padding: 24px;
      }

      .gli-url-section {
        margin-bottom: 20px;
      }

      .gli-section-label {
        font-size: 12px;
        font-weight: 600;
        color: #757575;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }

      .gli-domain {
        font-size: 18px;
        font-weight: 600;
        color: #1976D2;
        word-break: break-all;
        margin-bottom: 12px;
        font-family: 'Courier New', monospace;
      }

      .gli-full-url {
        font-size: 13px;
        color: #555;
        background: #f5f5f5;
        padding: 12px;
        border-radius: 6px;
        word-break: break-all;
        font-family: 'Courier New', monospace;
        line-height: 1.5;
        max-height: 120px;
        overflow-y: auto;
        position: relative;
      }

      .gli-url-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .gli-copy-btn {
        padding: 6px 12px;
        background: #e3f2fd;
        color: #1976D2;
        border: 1px solid #90caf9;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .gli-copy-btn:hover {
        background: #bbdefb;
      }

      .gli-copy-btn.copied {
        background: #4CAF50;
        color: white;
        border-color: #4CAF50;
      }

      .gli-security-section {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 6px;
        margin-bottom: 20px;
      }

      .gli-security-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .gli-security-badge.secure {
        background: #4CAF50;
        color: white;
      }

      .gli-security-badge.insecure {
        background: #f44336;
        color: white;
      }

      .gli-security-text {
        font-size: 13px;
        color: #555;
      }

      .gli-risk-indicators {
        margin-bottom: 20px;
      }

      .gli-risk-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        font-size: 13px;
        color: #666;
      }

      .gli-risk-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      .gli-modal-footer {
        padding: 16px 24px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .gli-button-group {
        display: flex;
        gap: 12px;
      }

      .gli-button {
        flex: 1;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .gli-button:focus {
        outline: 2px solid #1976D2;
        outline-offset: 2px;
      }

      .gli-button-primary {
        background: #4CAF50;
        color: white;
      }

      .gli-button-primary:hover {
        background: #45a049;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
      }

      .gli-button-secondary {
        background: #f5f5f5;
        color: #333;
      }

      .gli-button-secondary:hover {
        background: #e0e0e0;
      }

      .gli-whitelist-link {
        text-align: center;
        font-size: 13px;
        color: #1976D2;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .gli-whitelist-link:hover {
        background: #f5f5f5;
        text-decoration: underline;
      }

      .gli-timer {
        text-align: center;
        font-size: 12px;
        color: #999;
        padding: 8px;
      }

      .gli-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #323232;
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000000;
        animation: gli-slideIn 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
    `;

    document.head.appendChild(style);
    console.log('Gmail Link Interceptor: Styles injected');
  }

  // Attach listeners to existing links
  function attachInitialListeners() {
    const links = findEmailLinks();
    console.log(`Gmail Link Interceptor: Found ${links.length} initial links`);
    
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
        console.error('Gmail Link Interceptor: Error with selector', selector, e);
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
      console.log('Gmail Link Interceptor: Whitelisted link, allowing', href);
      return;
    }

    console.log('Gmail Link Interceptor: Link intercepted', href);

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
        displayURL: url.length > 100 ? url.substring(0, 80) + '...' + url.substring(url.length - 20) : url
      };
    } catch (err) {
      console.error('Gmail Link Interceptor: Invalid URL', url, err);
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
      risks.push({ icon: '⚠️', text: 'This connection is not secure (HTTP)' });
    }
    if (analysis.isIP) {
      risks.push({ icon: '⚠️', text: 'URL uses an IP address instead of a domain' });
    }
    if (analysis.hasSuspicious) {
      risks.push({ icon: '⚠️', text: 'URL contains unusual characters' });
    }
    if (analysis.isVeryLong) {
      risks.push({ icon: 'ℹ️', text: 'This is an unusually long URL' });
    }
    
    const riskHTML = risks.length > 0 ? `
      <div class="gli-risk-indicators">
        ${risks.map(risk => `
          <div class="gli-risk-item">
            <span class="gli-risk-icon">${risk.icon}</span>
            <span>${risk.text}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    modal.innerHTML = `
      <div id="gli-modal-backdrop"></div>
      <div id="gli-modal-content">
        <div class="gli-modal-header">
          <div class="gli-warning-icon">!</div>
          <h2 class="gli-modal-title">External Link Detected</h2>
        </div>
        <div class="gli-modal-body">
          <div class="gli-url-section">
            <div class="gli-section-label">Domain</div>
            <div class="gli-domain">${analysis.hostname}</div>
          </div>
          
          <div class="gli-url-section">
            <div class="gli-section-label">Full URL</div>
            <div class="gli-full-url">${analysis.displayURL}</div>
            <div class="gli-url-actions">
              <button class="gli-copy-btn" id="gli-copy-btn" title="Copy URL to clipboard">
                📋 Copy URL
              </button>
            </div>
          </div>
          
          <div class="gli-security-section">
            <div class="gli-security-badge ${analysis.isSecure ? 'secure' : 'insecure'}">
              ${analysis.isSecure ? '🔒 HTTPS' : '🔓 HTTP'}
            </div>
            <div class="gli-security-text">
              ${analysis.isSecure ? 'Secure connection' : 'Unencrypted connection'}
            </div>
          </div>
          
          ${riskHTML}
        </div>
        <div class="gli-modal-footer">
          <div class="gli-button-group">
            <button class="gli-button gli-button-primary" id="gli-confirm-btn">
              Open Link
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
    
    console.log('Gmail Link Interceptor: Modal displayed');
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
    copyBtn.addEventListener('click', () => handleCopyURL(url));
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

  // Handle copy URL to clipboard
  function handleCopyURL(url) {
    navigator.clipboard.writeText(url).then(() => {
      console.log('Gmail Link Interceptor: URL copied to clipboard');
      
      const copyBtn = document.getElementById('gli-copy-btn');
      const originalText = copyBtn.innerHTML;
      
      copyBtn.innerHTML = '✓ Copied!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
      
      showToast('URL copied to clipboard');
    }).catch(err => {
      console.error('Gmail Link Interceptor: Failed to copy URL', err);
      showToast('Failed to copy URL');
    });
  }

  // Handle confirm action
  function handleConfirm(url, analysis) {
    console.log('Gmail Link Interceptor: User confirmed link', url);
    recordAction(url, analysis, 'opened');
    window.open(url, '_blank', 'noopener,noreferrer');
    removeModal();
  }

  // Handle cancel action
  function handleCancel(url, analysis) {
    console.log('Gmail Link Interceptor: User cancelled');
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