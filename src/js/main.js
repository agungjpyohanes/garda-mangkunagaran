/**
 * Main application script
 * Coordinates interactive modules for Garda Mangkunagaran.
 */
import { initImageFallback } from './modules/fallback.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollSpy } from './modules/scrollSpy.js';

export function initApp() {
  initImageFallback();
  initNavigation();
  initScrollSpy();
}

// Auto-initialize when loaded as a module in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
