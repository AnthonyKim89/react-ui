// Handlers for notifying the native (iOS) app of some things when running in a WebView.
// The functions here do nothing when we are *not* in a native WebView environment.

export function notifyPageLoaded() {
  notify('pageLoaded');
}

export function notifyAppMaximized() {
  notify('appMaximized');
}

export function notifyAppRestored() {
  notify('appRestored');
}

function notify(message) {
  const handler = getHandler();
  if (handler) {
    handler.postMessage(message);
  }
}


function getHandler() {
  if (window.webkit && window.webkit.messageHandlers) {
    return window.webkit.messageHandlers.swiftHandler;
  }
}