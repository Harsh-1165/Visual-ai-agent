// Content script for tracking user activities in the page

console.log('[Visual AI Agent] Content script loaded');

// Track mouse clicks
document.addEventListener('click', (e) => {
  const target = e.target;
  const elementType = target.tagName.toLowerCase();
  const elementId = target.id || '';
  const elementClass = target.className || '';
  const text = target.innerText?.substring(0, 50) || '';

  const clickData = {
    type: 'CLICK',
    elementType,
    elementId,
    elementClass,
    text,
    timestamp: Date.now(),
    x: e.clientX,
    y: e.clientY,
  };

  chrome.runtime.sendMessage({
    type: 'LOG_ACTIVITY',
    data: clickData,
  });
}, true);

// Track keyboard input (only log type, not actual keys for privacy)
let lastKeyPressTime = 0;
document.addEventListener('keydown', (e) => {
  const now = Date.now();
  
  // Debounce typing events to avoid spam
  if (now - lastKeyPressTime > 2000) {
    const typingData = {
      type: 'TYPING',
      timestamp: now,
    };

    chrome.runtime.sendMessage({
      type: 'LOG_ACTIVITY',
      data: typingData,
    });

    lastKeyPressTime = now;
  }
}, true);

// Track scrolling
let lastScrollTime = 0;
document.addEventListener('scroll', (e) => {
  const now = Date.now();
  
  // Debounce scroll events
  if (now - lastScrollTime > 1000) {
    const scrollData = {
      type: 'SCROLL',
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      timestamp: now,
    };

    chrome.runtime.sendMessage({
      type: 'LOG_ACTIVITY',
      data: scrollData,
    });

    lastScrollTime = now;
  }
}, true);

// Track form inputs
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    const inputData = {
      type: 'INPUT',
      inputType: e.target.type || 'textarea',
      timestamp: Date.now(),
    };

    chrome.runtime.sendMessage({
      type: 'LOG_ACTIVITY',
      data: inputData,
    });
  }
}, true);

// Track window focus/blur
window.addEventListener('focus', () => {
  chrome.runtime.sendMessage({
    type: 'LOG_ACTIVITY',
    data: {
      type: 'WINDOW_FOCUSED',
      timestamp: Date.now(),
    },
  });
});

window.addEventListener('blur', () => {
  chrome.runtime.sendMessage({
    type: 'LOG_ACTIVITY',
    data: {
      type: 'WINDOW_BLURRED',
      timestamp: Date.now(),
    },
  });
});

console.log('[Visual AI Agent] Event listeners attached');
