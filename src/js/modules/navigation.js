/**
 * Navigation module
 * Handles mobile hamburger toggle, keyboard accessibility (Escape), and navigation closing on click.
 */
export function initNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  const navigationLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

  if (!menuButton || !navigation) return;

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Buka navigasi');
    navigation.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Buka navigasi' : 'Tutup navigasi');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}
