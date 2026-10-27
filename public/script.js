/**
 * Garda Mangkunagaran - Client Application Script
 * Modular client entry point connecting src/js/ modules.
 */
import { initImageFallback } from '/src/js/modules/fallback.js';
import { initNavigation } from '/src/js/modules/navigation.js';
import { initScrollSpy } from '/src/js/modules/scrollSpy.js';

export function init() {
  initImageFallback();
  initNavigation();
  initScrollSpy();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
