// Configuration
const API_BASE_URL = 'http://localhost:3000';
let screenshotInterval = 60; // Default 60 seconds
let isTracking = true;

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Visual AI Agent] Extension installed');
  initializeUserSettings();
});

// Retrieve user settings from Chrome storage
function initializeUserSettings() {
  chrome.storage.local.get(['settings'], (result) => {
    if (result.settings) {
      isTracking = result.settings.trackingEnabled !== false;
      screenshotInterval = result.settings.screenshotIntervalSeconds || 60;
      console.log('[Visual AI Agent] Settings loaded:', result.settings);
    }
    startScreenshotScheduler();
  });
}

// Start periodic screenshot capture
function startScreenshotScheduler() {
  if (screenshotInterval > 0) {
    setInterval(captureScreenshot, screenshotInterval * 1000);
  }
}

// Capture screenshot from active tab
async function captureScreenshot() {
  try {
    if (!isTracking) return;

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      console.log('[Visual AI Agent] No active tab found');
      return;
    }

    // Capture visible tab
    const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
    
    // Get auth token from storage
    const { authToken } = await chrome.storage.local.get('authToken');
    
    if (!authToken) {
      console.log('[Visual AI Agent] Not authenticated');
      return;
    }

    // Convert to base64 and send to server
    const screenshotData = {
      screenshotUrl: screenshot,
      thumbnailUrl: screenshot, // For now, use same as full screenshot
      captureTime: new Date().toISOString(),
      aiAnalysis: null, // Will be populated by backend
    };

    await fetch(`${API_BASE_URL}/api/screenshots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(screenshotData),
    });

    console.log('[Visual AI Agent] Screenshot captured and sent');
  } catch (error) {
    console.error('[Visual AI Agent] Screenshot capture error:', error);
  }
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'LOG_ACTIVITY') {
    logActivity(request.data, sender.tab);
    sendResponse({ success: true });
  } else if (request.type === 'CAPTURE_SCREENSHOT') {
    captureScreenshot().then(() => sendResponse({ success: true }));
    return true; // Keep the channel open for async response
  } else if (request.type === 'UPDATE_SETTINGS') {
    updateSettings(request.settings);
    sendResponse({ success: true });
  }
});

// Log activity to server
async function logActivity(activityData, tab) {
  try {
    const { authToken } = await chrome.storage.local.get('authToken');
    
    if (!authToken) return;

    const activity = {
      eventType: activityData.type,
      eventData: activityData,
      url: tab.url,
      tabTitle: tab.title,
    };

    await fetch(`${API_BASE_URL}/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(activity),
    });

    console.log('[Visual AI Agent] Activity logged:', activityData.type);
  } catch (error) {
    console.error('[Visual AI Agent] Activity logging error:', error);
  }
}

// Update settings
async function updateSettings(newSettings) {
  isTracking = newSettings.trackingEnabled !== false;
  screenshotInterval = newSettings.screenshotIntervalSeconds || 60;
  
  await chrome.storage.local.set({ settings: newSettings });
  
  console.log('[Visual AI Agent] Settings updated:', newSettings);
  
  // Restart scheduler if interval changed
  if (screenshotInterval > 0) {
    startScreenshotScheduler();
  }
}

// Handle tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (isTracking) {
      logActivity({ type: 'TAB_CHANGED', timestamp: Date.now() }, tab);
    }
  });
});

// Handle URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && isTracking) {
    logActivity({ type: 'URL_CHANGED', newUrl: changeInfo.url, timestamp: Date.now() }, tab);
  }
});

console.log('[Visual AI Agent] Background service worker initialized');
