/**
 * ScrollSpy module
 * Observes page sections and highlights the corresponding navigation link.
 */
export function initScrollSpy() {
  const navigationLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  if (!navigationLinks.length) return;

  if ('IntersectionObserver' in window) {
    const sections = navigationLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = navigationLinks.find((link) => link.hash === `#${entry.target.id}`);
        navigationLinks.forEach((link) => link.classList.toggle('is-current', link === activeLink));
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach((section) => observer.observe(section));
  }
}
