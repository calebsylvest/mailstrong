// Gmail Link Interceptor - Background Service Worker
// Handles extension icon toggle and state management

console.log('Gmail Link Interceptor: Background service worker loaded');

// Initialize default settings on install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Gmail Link Interceptor: Extension installed/updated', details.reason);
  
  // Set default values
  chrome.storage.sync.get(['enabled', 'whitelist'], (data) => {
    const defaults = {
      enabled: data.enabled !== undefined ? data.enabled : true,
      whitelist: data.whitelist || []
    };
    
    chrome.storage.sync.set(defaults, () => {
      console.log('Gmail Link Interceptor: Default settings initialized', defaults);
      updateIcon(defaults.enabled);
    });
  });
});

// Handle icon click to toggle enabled/disabled state
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Gmail Link Interceptor: Icon clicked');
  
  // Only work on Gmail pages
  if (!tab.url || !tab.url.includes('mail.google.com')) {
    console.log('Gmail Link Interceptor: Not on Gmail page, ignoring');
    return;
  }
  
  try {
    // Get current state
    const data = await chrome.storage.sync.get(['enabled']);
    const newEnabled = !data.enabled;
    
    // Save new state
    await chrome.storage.sync.set({ enabled: newEnabled });
    
    console.log('Gmail Link Interceptor: State toggled', { 
      oldState: data.enabled, 
      newState: newEnabled 
    });
    
    // Update icon
    updateIcon(newEnabled);
    
    // Show notification to user
    showNotification(newEnabled);
    
  } catch (error) {
    console.error('Gmail Link Interceptor: Error toggling state', error);
  }
});

// Update icon based on enabled state
function updateIcon(enabled) {
  const iconPath = enabled ? {
    '16': 'icons/icon16.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png'
  } : {
    '16': 'icons/icon16-disabled.png',
    '48': 'icons/icon48-disabled.png',
    '128': 'icons/icon128-disabled.png'
  };
  
  const title = enabled 
    ? 'Gmail Link Interceptor (Active)' 
    : 'Gmail Link Interceptor (Disabled)';
  
  chrome.action.setIcon({ path: iconPath }, () => {
    if (chrome.runtime.lastError) {
      console.warn('Gmail Link Interceptor: Could not update icon (icons may be missing)');
    }
  });
  
  chrome.action.setTitle({ title });
  
  console.log('Gmail Link Interceptor: Icon updated', { enabled, title });
}

// Show notification when toggling
function showNotification(enabled) {
  const message = enabled 
    ? 'Link interception enabled' 
    : 'Link interception disabled';
  
  // Note: chrome.notifications requires additional permission
  // For MVP, we'll rely on the icon change and console logs
  console.log('Gmail Link Interceptor:', message);
}

// Listen for storage changes to update icon
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    updateIcon(changes.enabled.newValue);
  }
});

// Keep service worker alive (optional, for debugging)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Gmail Link Interceptor: Message received', request);
  
  if (request.action === 'ping') {
    sendResponse({ status: 'alive' });
  }
  
  return true; // Keep message channel open
});