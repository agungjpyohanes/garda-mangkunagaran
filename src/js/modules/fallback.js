/**
 * Image fallback module
 * Switches to local fallback image if remote or primary asset fails to load.
 */
export function initImageFallback() {
  document.querySelectorAll('img[data-fallback]').forEach((image) => {
    const fallback = image.dataset.fallback;
    const useFallback = () => {
      if (image.dataset.fallbackUsed === 'true') return;
      image.dataset.fallbackUsed = 'true';
      image.src = fallback;
    };

    image.addEventListener('error', useFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) useFallback();
  });
}
