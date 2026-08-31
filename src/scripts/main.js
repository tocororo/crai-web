// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  const icon = themeToggle?.querySelector('i');
  if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
}
applyTheme(document.documentElement.classList.contains('dark'));
themeToggle?.addEventListener('click', () => {
  const dark = !document.documentElement.classList.contains('dark');
  applyTheme(dark);
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
});

// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
});

// Search bar
const searchToggle = document.getElementById('search-toggle');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchResults = document.getElementById('search-results');

searchToggle?.addEventListener('click', () => {
  const hidden = searchBar?.classList.contains('hidden');
  searchBar?.classList.toggle('hidden', !hidden);
  searchToggle.setAttribute('aria-expanded', String(hidden));
  if (!hidden) searchInput?.focus();
});
searchClear?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
});

// Simple client-side search over links on the page
if (searchInput && searchResults) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const links = Array.from(document.querySelectorAll('a[href]'))
      .map((a) => ({ url: a.getAttribute('href'), text: a.textContent.trim() }))
      .filter((l) => l.text && l.url !== '#');
    const results = query ? links.filter((l) => l.text.toLowerCase().includes(query)).slice(0, 8) : [];
    searchResults.innerHTML = results.length
      ? results.map((r) => `<a href="${r.url}" class="block border-b border-border px-2 py-2 text-sm text-text hover:bg-surface-2 hover:text-primary-500 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-700">${r.text}</a>`).join('')
      : `<p class="px-2 py-2 text-sm text-text-secondary">${query ? 'Sin resultados' : 'Empieza a escribir para buscar...'}</p>`;
  });
}

// Back to top
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  backToTop?.classList.toggle('hidden', !show);
  backToTop?.classList.toggle('flex', show);
});
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Cookie consent
const cookieConsent = document.getElementById('cookie-consent');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');
let consent = null;
try { consent = localStorage.getItem('cookie-consent'); } catch {}
if (!consent) cookieConsent?.classList.remove('hidden');
cookieAccept?.addEventListener('click', () => {
  try { localStorage.setItem('cookie-consent', 'accepted'); } catch {}
  cookieConsent?.classList.add('hidden');
});
cookieDecline?.addEventListener('click', () => {
  try { localStorage.setItem('cookie-consent', 'declined'); } catch {}
  cookieConsent?.classList.add('hidden');
});

// Animated counters
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.getAttribute('data-count') || '0');
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString('es');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('es');
    }
    requestAnimationFrame(tick);
  });
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
