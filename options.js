// Gmail Link Interceptor - Options Page Logic with Statistics and History

(function() {
  'use strict';

  // Tab Management
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Load data when switching to stats or history tabs
      if (tabName === 'statistics') {
        loadStatistics();
      } else if (tabName === 'history') {
        loadHistory();
      }
    });
  });

  // Toggle Elements
  const enabledToggle = document.getElementById('enabledToggle');
  const historyToggle = document.getElementById('historyToggle');
  const statsToggle = document.getElementById('statsToggle');
  const whitelistTextarea = document.getElementById('whitelist');
  
  // Buttons
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const refreshStatsBtn = document.getElementById('refreshStatsBtn');
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const statusDiv = document.getElementById('status');

  // Load settings when page opens
  loadSettings();

  // Toggle event listeners
  enabledToggle.addEventListener('click', () => {
    enabledToggle.classList.toggle('active');
  });

  historyToggle.addEventListener('click', () => {
    historyToggle.classList.toggle('active');
  });

  statsToggle.addEventListener('click', () => {
    statsToggle.classList.toggle('active');
  });

  // Button event listeners
  saveBtn.addEventListener('click', saveSettings);
  resetBtn.addEventListener('click', resetSettings);
  refreshStatsBtn.addEventListener('click', loadStatistics);
  resetStatsBtn.addEventListener('click', resetStatistics);
  refreshHistoryBtn.addEventListener('click', loadHistory);
  clearHistoryBtn.addEventListener('click', clearHistory);

  // Load settings from storage
  function loadSettings() {
    chrome.storage.sync.get(['enabled', 'whitelist', 'historyEnabled', 'statsEnabled'], (data) => {
      // Set toggles
      const enabled = data.enabled !== false;
      const historyEnabled = data.historyEnabled !== false;
      const statsEnabled = data.statsEnabled !== false;
      
      if (enabled) enabledToggle.classList.add('active');
      if (historyEnabled) historyToggle.classList.add('active');
      if (statsEnabled) statsToggle.classList.add('active');

      // Set whitelist
      const whitelist = data.whitelist || [];
      whitelistTextarea.value = whitelist.join('\n');

      console.log('Settings loaded:', { enabled, historyEnabled, statsEnabled, whitelist });
    });
  }

  // Save settings to storage
  function saveSettings() {
    const enabled = enabledToggle.classList.contains('active');
    const historyEnabled = historyToggle.classList.contains('active');
    const statsEnabled = statsToggle.classList.contains('active');
    
    // Parse whitelist
    const whitelistText = whitelistTextarea.value.trim();
    const whitelist = whitelistText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(domain => isValidDomain(domain));

    // Save to storage
    chrome.storage.sync.set({ 
      enabled, 
      whitelist, 
      historyEnabled, 
      statsEnabled 
    }, () => {
      console.log('Settings saved:', { enabled, whitelist, historyEnabled, statsEnabled });
      showStatus('Settings saved successfully!', 'success');
    });
  }

  // Reset settings to defaults
  function resetSettings() {
    if (!confirm('Reset all settings to defaults?')) {
      return;
    }

    const defaults = {
      enabled: true,
      whitelist: [],
      historyEnabled: true,
      statsEnabled: true
    };

    chrome.storage.sync.set(defaults, () => {
      console.log('Settings reset to defaults');
      loadSettings();
      showStatus('Settings reset to defaults', 'success');
    });
  }

  // Validate domain name
  function isValidDomain(domain) {
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

    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 3000);
  }

  // Load and display statistics
  function loadStatistics() {
    chrome.storage.local.get(['stats'], (data) => {
      const stats = data.stats || getDefaultStats();
      
      // Update stat cards
      document.getElementById('stat-total').textContent = formatNumber(stats.totalIntercepted);
      document.getElementById('stat-opened').textContent = formatNumber(stats.totalOpened);
      document.getElementById('stat-cancelled').textContent = formatNumber(stats.totalCancelled);
      document.getElementById('stat-blocked').textContent = formatNumber(stats.suspiciousBlocked);
      document.getElementById('stat-https').textContent = formatNumber(stats.httpsCount);
      document.getElementById('stat-http').textContent = formatNumber(stats.httpCount);
      document.getElementById('stat-whitelisted').textContent = formatNumber(stats.totalWhitelisted);
      
      // Display top domains
      displayTopDomains(stats.domainStats);
      
      console.log('Statistics loaded:', stats);
    });
  }

  // Display top domains
  function displayTopDomains(domainStats) {
    const topDomainsContainer = document.getElementById('topDomains');
    
    // Convert to array and sort by count
    const domains = Object.entries(domainStats)
      .map(([domain, data]) => ({ domain, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    if (domains.length === 0) {
      topDomainsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-text">No data yet</div>
          <div class="empty-state-hint">Start clicking links to see statistics</div>
        </div>
      `;
      return;
    }
    
    topDomainsContainer.innerHTML = domains.map(domain => `
      <div class="domain-item">
        <div class="domain-name">${escapeHtml(domain.domain)}</div>
        <div class="domain-count">${domain.count} time${domain.count !== 1 ? 's' : ''}</div>
      </div>
    `).join('');
  }

  
  // Reset statistics
  function resetStatistics() {
    // At the top of resetStatistics()
    console.log('Reset Statistics button clicked');

    if (!confirm('This will permanently delete all statistics. Are you sure?')) {
      return;
    }

    const defaults = getDefaultStats();
    chrome.storage.local.set({ stats: defaults }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to reset statistics:', chrome.runtime.lastError);
        showStatus('Failed to reset statistics', 'error');
        return;
      }
      
      console.log('Statistics reset successfully');
      
      // Force UI refresh
      setTimeout(() => {
        loadStatistics();
        showStatus('Statistics reset successfully', 'success');
      }, 100);
    });
  }

  // Load and display history
  function loadHistory() {
    chrome.storage.local.get(['linkHistory'], (data) => {
      const history = data.linkHistory || [];
      
      const historyContainer = document.getElementById('historyContainer');
      
      if (history.length === 0) {
        historyContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔗</div>
            <div class="empty-state-text">No link history yet</div>
            <div class="empty-state-hint">Intercepted links will appear here</div>
          </div>
        `;
        return;
      }
      
      historyContainer.innerHTML = `
        <table class="history-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Domain</th>
              <th>Action</th>
              <th>Secure</th>
            </tr>
          </thead>
          <tbody>
            ${history.map(entry => `
              <tr>
                <td class="history-time">${formatDate(entry.timestamp)}</td>
                <td class="history-domain" title="${escapeHtml(entry.url)}">
                  ${escapeHtml(entry.domain)}
                </td>
                <td>
                  <span class="history-action ${entry.action}">
                    ${getActionLabel(entry.action)}
                  </span>
                </td>
                <td class="security-badge">
                  ${entry.isSecure ? '🔒' : '🔓'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      console.log('History loaded:', history.length, 'entries');
    });
  }

  // Clear history
  function clearHistory() {
    // At the top of clearHistory()  
    console.log('Clear History button clicked');
    
    if (!confirm('This will delete all link history. Are you sure?')) {
      return;
    }

    chrome.storage.local.set({ linkHistory: [] }, () => {
      console.log('History cleared');
      loadHistory();
      showStatus('History cleared successfully', 'success');
    });
  }

  // Helper: Get default stats object
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

  // Helper: Format number with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Helper: Format date
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Helper: Get action label
  function getActionLabel(action) {
    const labels = {
      'opened': '✓ Opened',
      'cancelled': '✗ Cancelled',
      'whitelisted': '⊕ Whitelisted',
      'pending': '⏳ Pending'
    };
    return labels[action] || action;
  }

  // Helper: Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Keyboard shortcuts
  whitelistTextarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      saveSettings();
    }
  });

})();