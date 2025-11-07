// Gmail Link Interceptor - Options Page Logic

(function() {
  'use strict';

  const enabledToggle = document.getElementById('enabledToggle');
  const whitelistTextarea = document.getElementById('whitelist');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusDiv = document.getElementById('status');

  // Load settings when page opens
  loadSettings();

  // Toggle enabled state
  enabledToggle.addEventListener('click', () => {
    enabledToggle.classList.toggle('active');
  });

  // Save button
  saveBtn.addEventListener('click', saveSettings);

  // Reset button
  resetBtn.addEventListener('click', resetSettings);

  // Load settings from storage
  function loadSettings() {
    chrome.storage.sync.get(['enabled', 'whitelist'], (data) => {
      // Set toggle state
      const enabled = data.enabled !== false; // Default to true
      if (enabled) {
        enabledToggle.classList.add('active');
      }

      // Set whitelist
      const whitelist = data.whitelist || [];
      whitelistTextarea.value = whitelist.join('\n');

      console.log('Settings loaded:', { enabled, whitelist });
    });
  }

  // Save settings to storage
  function saveSettings() {
    const enabled = enabledToggle.classList.contains('active');
    
    // Parse whitelist from textarea
    const whitelistText = whitelistTextarea.value.trim();
    const whitelist = whitelistText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(domain => isValidDomain(domain));

    // Save to storage
    chrome.storage.sync.set({ enabled, whitelist }, () => {
      console.log('Settings saved:', { enabled, whitelist });
      
      // Show success message
      showStatus('Settings saved successfully!', 'success');
      
      // Update extension icon
      chrome.runtime.sendMessage({ 
        action: 'updateIcon', 
        enabled 
      }, response => {
        // Ignore errors if background script doesn't respond
        if (chrome.runtime.lastError) {
          console.log('Background script not responding (this is OK)');
        }
      });
    });
  }

  // Reset settings to defaults
  function resetSettings() {
    if (!confirm('Reset all settings to defaults?')) {
      return;
    }

    const defaults = {
      enabled: true,
      whitelist: []
    };

    chrome.storage.sync.set(defaults, () => {
      console.log('Settings reset to defaults');
      loadSettings();
      showStatus('Settings reset to defaults', 'success');
    });
  }

  // Validate domain name
  function isValidDomain(domain) {
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
    
    if (!domainRegex.test(domain)) {
      console.warn('Invalid domain:', domain);
      return false;
    }
    
    return true;
  }

  // Show status message
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type} show`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 3000);
  }

  // Listen for Enter key in textarea (Ctrl+Enter to save)
  whitelistTextarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      saveSettings();
    }
  });

})();