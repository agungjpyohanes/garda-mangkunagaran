/**
 * Image fallback module
 * Switches to local fallback image if primary asset fails to load,
 * or gracefully hides broken non-essential images.
 */
export function initImageFallback() {
  document.querySelectorAll('img').forEach((image) => {
    const fallback = image.dataset.fallback;
    const useFallback = () => {
      if (fallback) {
        if (image.dataset.fallbackUsed === 'true') return;
        image.dataset.fallbackUsed = 'true';
        image.src = fallback;
      } else {
        // Gracefully hide broken non-essential images
        image.style.visibility = 'hidden';
      }
    };

    image.addEventListener('error', useFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) useFallback();
  });
}
