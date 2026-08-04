// Load settings on page load
document.addEventListener('DOMContentLoaded', async () => {
  const { settings = {} } = await chrome.storage.local.get('settings');
  
  // Populate form fields
  document.getElementById('screenshot-interval').value = settings.screenshotIntervalSeconds || 60;
  document.getElementById('ai-analysis').checked = settings.aiAnalysisEnabled !== false;
  document.getElementById('excluded-urls').value = (settings.excludedUrls || []).join('\n');
  document.getElementById('whitelisted-urls').value = (settings.whitelistUrls || []).join('\n');
});

// Handle form submission
document.getElementById('settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const settings = {
    screenshotIntervalSeconds: parseInt(form.screenshotInterval.value),
    aiAnalysisEnabled: form.aiAnalysis.checked,
    excludedUrls: form.excludedUrls.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0),
    whitelistUrls: form.whitelistUrls.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0),
  };
  
  // Save to Chrome storage
  await chrome.storage.local.set({ settings });
  
  // Notify background script
  chrome.runtime.sendMessage({
    type: 'UPDATE_SETTINGS',
    settings,
  });
  
  // Show success message
  showStatus('Settings saved successfully!', 'success');
});

// Show status message
function showStatus(message, type) {
  const messageEl = document.getElementById('status-message');
  messageEl.textContent = message;
  messageEl.className = `status-message ${type}`;
  
  setTimeout(() => {
    messageEl.className = 'status-message';
  }, 3000);
}
