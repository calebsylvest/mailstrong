// Gmail Link Interceptor - Phase 1: Foundation & Proof of Concept
// This version focuses on detection and logging before building the full modal

(function() {
  'use strict';

  console.log('Gmail Link Interceptor: Content script loaded');

  // Configuration - will be loaded from storage in Phase 2
  let enabled = true;
  let whitelist = [];

  // Load settings from storage
  chrome.storage.sync.get(['enabled', 'whitelist'], (data) => {
    enabled = data.enabled !== false; // Default to true
    whitelist = data.whitelist || [];
    console.log('Gmail Link Interceptor: Settings loaded', { enabled, whitelist });
    
    if (enabled) {
      initializeInterceptor();
    }
  });

  function initializeInterceptor() {
    console.log('Gmail Link Interceptor: Initializing...');

    // Wait for Gmail to load
    waitForGmailLoad().then(() => {
      console.log('Gmail Link Interceptor: Gmail loaded, starting observation');
      attachInitialListeners();
      observeGmailChanges();
    });
  }

  // Wait for Gmail's main interface to load
  function waitForGmailLoad() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        // Look for Gmail's main content area
        const mainArea = document.querySelector('[role="main"]') || 
                        document.querySelector('.AO') || // Gmail's main view class
                        document.querySelector('.nH'); // Gmail container
        
        if (mainArea) {
          clearInterval(checkInterval);
          console.log('Gmail Link Interceptor: Main area detected', mainArea);
          resolve();
        }
      }, 500);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Gmail Link Interceptor: Timeout waiting for Gmail to load');
        resolve();
      }, 10000);
    });
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

  // Find all email links (excluding Gmail's internal navigation)
  function findEmailLinks() {
    const links = [];
    
    // Look for links in email content areas
    const selectors = [
      '[role="main"] a[href^="http"]',  // Main content area
      '.a3s a[href^="http"]',           // Email body class
      '.ii a[href^="http"]',            // Email content wrapper
      '[role="listitem"] a[href^="http"]' // Email list items
    ];

    selectors.forEach(selector => {
      try {
        const found = document.querySelectorAll(selector);
        found.forEach(link => {
          // Exclude Gmail internal links
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

  // Check if a link is Gmail's internal navigation
  function isGmailInternalLink(href) {
    if (!href) return true;
    
    // Internal Gmail patterns to exclude
    const internalPatterns = [
      /^#/,                           // Anchor links
      /^\/mail\//,                    // Gmail paths
      /mail\.google\.com\/mail\/u\//  // Gmail URLs
    ];

    return internalPatterns.some(pattern => pattern.test(href));
  }

  // Attach event listener to a link
  function attachLinkListener(link) {
    link.dataset.gliIntercepted = 'true';
    
    // Try both mousedown and click to see which works better
    // Mousedown fires earlier and can be more reliably intercepted
    link.addEventListener('mousedown', handleLinkClick, true);
    link.addEventListener('click', handleLinkClick, true);
    
    // Also track for debugging
    console.log('Gmail Link Interceptor: Listener attached to', link.href);
  }

  // Handle link clicks - Phase 1: Just log and prevent
  function handleLinkClick(e) {
    if (!enabled) return;

    const link = e.target.closest('a');
    if (!link) return;

    const url = link.href;
    
    // Check whitelist
    if (isWhitelisted(url)) {
      console.log('Gmail Link Interceptor: Whitelisted link, allowing', url);
      return;
    }

    // PHASE 1: Log and prevent default
    console.log('Gmail Link Interceptor: Link clicked!', {
      type: e.type,
      url: url,
      target: e.target,
      currentTarget: e.currentTarget
    });

    // Parse URL info
    try {
      const urlObj = new URL(url);
      console.log('Gmail Link Interceptor: URL details', {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search
      });
    } catch (err) {
      console.error('Gmail Link Interceptor: Invalid URL', url, err);
    }

    // Prevent the link from opening
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Show a simple alert for Phase 1 testing
    showSimpleNotification(url);
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

  // Simple notification for Phase 1 (will be replaced with modal in Phase 2)
  function showSimpleNotification(url) {
    const notification = document.createElement('div');
    notification.id = 'gli-notification';
    notification.textContent = `Link intercepted: ${url}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 4px;
      z-index: 10000;
      max-width: 400px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Observe Gmail DOM changes for dynamically loaded content
  function observeGmailChanges() {
    const observer = new MutationObserver((mutations) => {
      // Throttle the processing
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

    // Observe the entire body for changes
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
    }
  });

})();