const API_BASE_URL = 'http://localhost:3000';

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
  loadSettings();
});

// Check if user is authenticated
async function checkAuthStatus() {
  const { authToken } = await chrome.storage.local.get('authToken');
  const { authSection, appSection } = getUIElements();
  
  if (authToken) {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    updateUI();
  } else {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
  }
}

// Get UI elements
function getUIElements() {
  return {
    authSection: document.getElementById('auth-section'),
    appSection: document.getElementById('app-section'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text'),
    trackingToggle: document.getElementById('tracking-toggle'),
    screenshotInterval: document.getElementById('screenshot-interval'),
    activitiesCount: document.getElementById('activities-count'),
  };
}

// Load settings from storage
async function loadSettings() {
  const { settings = {} } = await chrome.storage.local.get('settings');
  
  const elements = getUIElements();
  
  // Update toggle
  if (settings.trackingEnabled) {
    elements.trackingToggle.classList.add('active');
    elements.statusDot.classList.remove('inactive');
    elements.statusText.textContent = 'Tracking Active';
  } else {
    elements.trackingToggle.classList.remove('active');
    elements.statusDot.classList.add('inactive');
    elements.statusText.textContent = 'Tracking Paused';
  }
  
  // Update screenshot interval
  const interval = settings.screenshotIntervalSeconds || 60;
  elements.screenshotInterval.textContent = `Every ${interval} seconds`;
}

// Toggle tracking
async function toggleTracking() {
  const { settings = {} } = await chrome.storage.local.get('settings');
  settings.trackingEnabled = !settings.trackingEnabled;
  
  await chrome.storage.local.set({ settings });
  
  // Notify background script
  chrome.runtime.sendMessage({
    type: 'UPDATE_SETTINGS',
    settings,
  });
  
  loadSettings();
}

// Update UI
async function updateUI() {
  const { authToken } = await chrome.storage.local.get('authToken');
  
  if (authToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (response.ok) {
        const activities = await response.json();
        document.getElementById('activities-count').textContent = `${activities.length} activities`;
      }
    } catch (error) {
      console.error('Error fetching activities count:', error);
    }
  }
}

// Open authentication page
function openAuthPage() {
  chrome.tabs.create({ url: `${API_BASE_URL}/sign-in` });
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({ url: `${API_BASE_URL}/dashboard` });
}

// Open settings
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// Capture screenshot manually
async function captureManualScreenshot() {
  chrome.runtime.sendMessage(
    { type: 'CAPTURE_SCREENSHOT' },
    (response) => {
      if (response && response.success) {
        alert('Screenshot captured!');
      }
    }
  );
}

// Sign out user
async function signOutUser() {
  const { authToken } = await chrome.storage.local.get('authToken');
  
  if (authToken) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  
  await chrome.storage.local.remove(['authToken', 'settings']);
  await checkAuthStatus();
}

// Refresh UI every 5 seconds
setInterval(updateUI, 5000);
