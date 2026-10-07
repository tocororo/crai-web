/* ============================================================
   CRAI - Main JavaScript (ported from crai-upr)
   ============================================================ */

/* --- Carrusel --- */
function initCarousel(id) {
  const carousel = document.getElementById(id);
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const progressBar = carousel.querySelector('.carousel-progress');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  const autoplayDelay = 5000;

  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let dragIndex = 0;

  function getVisibleSlides() {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleSlides();
    return Math.max(0, slides.length - visible);
  }

  function getSlideWidth() {
    const slide = slides[0];
    const style = getComputedStyle(slide);
    return slide.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight)
      + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  function getGap() {
    if (slides.length < 2) return 0;
    const a = slides[0].getBoundingClientRect();
    const b = slides[1].getBoundingClientRect();
    return b.left - a.right;
  }

  function goTo(index, instant) {
    const max = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, max));
    const w = getSlideWidth();
    const g = getGap();
    track.style.transition = instant ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    track.style.transform = `translateX(-${currentIndex * (w + g)}px)`;
    updateDots();
    updateProgress();
    updateActiveSlide();
  }

  function updateActiveSlide() {
    const visible = getVisibleSlides();
    slides.forEach((slide, i) => {
      const isActive = i >= currentIndex && i < currentIndex + visible;
      slide.classList.toggle('carousel-slide-active', isActive);
    });
  }

  function next() {
    const max = getMaxIndex();
    if (currentIndex >= max) {
      goTo(0);
    } else {
      goTo(currentIndex + 1);
    }
  }

  function prev() {
    if (currentIndex <= 0) {
      goTo(getMaxIndex());
    } else {
      goTo(currentIndex - 1);
    }
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = getMaxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Ir a noticia ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); startAutoplay(); });
      dotsContainer.appendChild(btn);
    }
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function updateProgress() {
    if (!progressBar) return;
    const max = getMaxIndex();
    const pct = max > 0 ? (currentIndex / max) * 100 : 0;
    progressBar.style.transform = `scaleX(${pct / 100})`;
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function handleResize() {
    const max = getMaxIndex();
    if (currentIndex > max) {
      goTo(max, true);
    } else {
      goTo(currentIndex, true);
    }
    buildDots();
  }

  /* --- Drag/Swipe --- */
  function onDragStart(e) {
    isDragging = true;
    dragIndex = currentIndex;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    track.classList.add('dragging');
    track.style.transition = 'none';
    stopAutoplay();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    dragOffset = x - startX;
    const w = getSlideWidth() + getGap();
    track.style.transform = `translateX(${-(dragIndex * w) + dragOffset}px)`;
    if (e.cancelable) e.preventDefault();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    const threshold = getSlideWidth() * 0.2;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) next();
      else prev();
    } else {
      goTo(dragIndex);
    }
    dragOffset = 0;
    startAutoplay();
  }

  /* --- Eventos --- */
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  track.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);

  track.addEventListener('touchstart', onDragStart, { passive: true });
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('touchend', onDragEnd);

  track.addEventListener('dragstart', e => e.preventDefault());

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 200);
  });

  handleResize();
  startAutoplay();
}

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // LOADING OVERLAY
  // ==========================================================
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => { loader.classList.add('hidden'); }, 400);
    });
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) loader.classList.add('hidden');
    }, 2000);
  }

  // ==========================================================
  // MOBILE MENU
  // ==========================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-inner') && navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    navList.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ==========================================================
  // DROPDOWN TOGGLE (Mobile)
  // ==========================================================
  if (navList) {
    navList.querySelectorAll('.has-dropdown > a').forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const parent = this.closest('.has-dropdown');
          const isOpen = parent.classList.toggle('open');
          const arrow = this.querySelector('.dropdown-arrow');
          if (arrow) arrow.style.transform = isOpen ? 'rotate(180deg)' : '';
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 992) return;
      const isDropdown = e.target.closest('.has-dropdown');
      if (!isDropdown) {
        navList.querySelectorAll('.has-dropdown.open').forEach(el => {
          el.classList.remove('open');
          const arrow = el.querySelector('.dropdown-arrow');
          if (arrow) arrow.style.transform = '';
        });
      }
    });
  }

  // ==========================================================
  // SEARCH BAR
  // ==========================================================
  const searchToggle = document.getElementById('search-toggle');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchIcon = document.getElementById('search-icon');
  const searchClear = document.getElementById('search-clear');

  const LOCAL_PAGES = [
    { title: 'Inicio', url: '/', keywords: 'inicio, bienvenidos, crai' },
    { title: 'La Universidad', url: '/la-universidad', keywords: 'universidad, historia, mision, vision, autoridad, sedes, organigrama' },
    { title: 'Estudios - Materias de la Carrera', url: '/estudios', keywords: 'estudios, materias, asignaturas, carrera, grado, curso por encuentro' },
    { title: 'Admisión', url: '/admision', keywords: 'admision, inscripcion, requisitos, becas, matricula, calendario' },
    { title: 'Investigación', url: '/investigacion', keywords: 'investigacion, proyectos, publicaciones, ciencia, grupos' },
    { title: 'Actualidad', url: '/actualidad', keywords: 'noticias, eventos, actualidad, agenda, avisos' },
    { title: 'Portal de Transparencia', url: '/transparencia', keywords: 'transparencia, informes, datos, presupuesto, normativas' },
    { title: 'Reservar Sala', url: '/reservar', keywords: 'reservar, sala, reserva, calendario' },
  ];

  const MIN_CHARS = 2;
  let debounceTimer = null;
  let highlightedIndex = -1;
  let currentItems = [];

  // Materias inyectadas por Header.astro (fuera de este bundle)
  const MATERIAS = (() => {
    try {
      const el = document.getElementById('materias-index');
      return el ? JSON.parse(el.textContent || '[]') : [];
    } catch (e) {
      return [];
    }
  })();

  // Sin tildes ni mayúsculas: "gestion" debe encontrar "Gestión"
  const normalizeText = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        setTimeout(() => searchInput?.focus(), 100);
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar') && !e.target.closest('#search-toggle')) {
        searchBar.classList.remove('active');
        closeResults();
      }
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      closeResults();
      updateIconAndClear();
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', onSearchInput);
    searchInput.addEventListener('keydown', onSearchKeydown);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) closeResults();
    });
  }

  function onSearchInput() {
    const query = searchInput.value.trim();
    updateIconAndClear();
    if (query.length < MIN_CHARS) { closeResults(); return; }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeSearch(query), 250);
  }

  function updateIconAndClear() {
    if (searchIcon) searchIcon.classList.toggle('has-text', searchInput.value.length > 0);
    if (searchClear) searchClear.classList.toggle('visible', searchInput.value.length > 0);
  }

  function closeResults() {
    if (searchResults) searchResults.classList.remove('active');
    highlightedIndex = -1;
    currentItems = [];
  }

  function executeSearch(query) {
    const q = normalizeText(query);
    currentItems = [];

    const materiaResults = MATERIAS.filter(m =>
      normalizeText(m.title).includes(q) ||
      normalizeText(m.meta).includes(q) ||
      normalizeText(m.keywords).includes(q)
    );

    const pageResults = LOCAL_PAGES.filter(p =>
      normalizeText(p.title).includes(q) ||
      normalizeText(p.keywords).includes(q)
    );

    if (materiaResults.length === 0 && pageResults.length === 0) {
      searchResults.innerHTML = `
        <div class="search-results-empty">
          <i class="fas fa-search"></i>
          <p>No se encontraron resultados para <strong>"${escapeHtml(query)}"</strong></p>
        </div>`;
      searchResults.classList.add('active');
      bindResultEvents();
      return;
    }

    let html = '';

    if (materiaResults.length > 0) {
      html += `<div class="search-results-group">`;
      html += `<div class="search-results-group-header materia"><i class="fas fa-book-open"></i> Materias</div>`;
      materiaResults.slice(0, 6).forEach(m => {
        currentItems.push({ url: m.url });
        html += `
        <div class="search-results-item" data-index="${currentItems.length - 1}">
          <div class="search-results-item-icon materia"><i class="fas fa-book-open"></i></div>
          <div class="search-results-item-content">
            <h4>${escapeHtml(m.title)}</h4>
            <p>${escapeHtml(m.meta)}</p>
          </div>
          <span class="search-results-item-badge materia">Materia</span>
        </div>`;
      });
      html += `</div>`;
    }

    if (pageResults.length > 0) {
      html += `<div class="search-results-group">`;
      html += `<div class="search-results-group-header"><i class="fas fa-file-alt"></i> Páginas del sitio</div>`;
      pageResults.slice(0, 6).forEach(p => {
        currentItems.push({ url: p.url });
        html += `
        <div class="search-results-item" data-index="${currentItems.length - 1}">
          <div class="search-results-item-icon page"><i class="fas fa-file-alt"></i></div>
          <div class="search-results-item-content">
            <h4>${escapeHtml(p.title)}</h4>
            <p>${escapeHtml(p.keywords.split(', ').slice(0, 3).join(' · '))}</p>
          </div>
          <span class="search-results-item-badge">Página</span>
        </div>`;
      });
      html += `</div>`;
    }

    searchResults.innerHTML = html;
    searchResults.classList.add('active');
    highlightedIndex = -1;
    bindResultEvents();
  }

  function bindResultEvents() {
    searchResults.querySelectorAll('.search-results-item').forEach(el => {
      el.addEventListener('click', () => {
        navigateToResult(parseInt(el.dataset.index, 10));
      });
    });
  }

  function onSearchKeydown(e) {
    const items = searchResults.querySelectorAll('.search-results-item');
    if (items.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
        updateHighlight(items);
        break;
      case 'ArrowUp':
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        updateHighlight(items);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < currentItems.length) {
          navigateToResult(highlightedIndex);
        }
        break;
      case 'Escape':
        closeResults();
        searchInput.blur();
        searchBar.classList.remove('active');
        break;
    }
  }

  function updateHighlight(items) {
    items.forEach((el, i) => {
      el.classList.toggle('highlighted', i === highlightedIndex);
    });
    if (highlightedIndex >= 0 && items[highlightedIndex]) {
      items[highlightedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function navigateToResult(index) {
    if (index < 0 || index >= currentItems.length) return;
    const item = currentItems[index];
    if (item.url && item.url !== '#') window.location.href = item.url;
    closeResults();
    searchBar.classList.remove('active');
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================================
  // THEME TOGGLE (Dark Mode)
  // ==========================================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');

  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (themeIcon) themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      if (themeIcon) themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  }

  // ==========================================================
  // HEADER SCROLL EFFECT
  // ==========================================================
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.pageYOffset > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================================
  // BACK TO TOP BUTTON
  // ==========================================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================
  // COUNTER ANIMATION (Stats)
  // ==========================================================
  const counters = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          el.textContent = current.toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ==========================================================
  // FAQ ACCORDION
  // ==========================================================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(active => {
        active.classList.remove('active');
      });

      if (!isActive) item.classList.add('active');
    });
  });

  // ==========================================================
  // NOTICIAS - FILTRO POR CATEGORÍA
  // (La búsqueda y el filtro de materias viven en pages/estudios.astro,
  //  donde también se controla la paginación para que no se pisen.)
  // ==========================================================
  // NEWS CATEGORY FILTERS
  // ==========================================================
  const newsFilterBtns = document.querySelectorAll('.news-filter-btn');
  const newsItems = document.querySelectorAll('.blog-posts .news-card');
  const newsEmpty = document.getElementById('news-empty');

  function applyNewsFilter(filter) {
    newsFilterBtns.forEach(b => b.classList.toggle('active', (b.dataset.filter || 'all') === filter));
    let visible = 0;
    newsItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      // display '' (no inline) para que aplique el layout CSS de la tarjeta
      item.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    if (newsEmpty) newsEmpty.hidden = visible > 0;
  }

  newsFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyNewsFilter(btn.dataset.filter || 'all'));
  });

  // Categorías del sidebar: aplican el mismo filtro y llevan al listado
  document.querySelectorAll('.sidebar-categories a[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const key = link.dataset.category;
      if ([...newsFilterBtns].some(b => b.dataset.filter === key)) {
        applyNewsFilter(key);
        document.getElementById('blog-title')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==========================================================
  // CONTACT FORM VALIDATION
  // ==========================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      const subject = 'Contacto desde el sitio web — ' + data.nombre;
      const body = 'CONTACTO DESDE EL SITIO WEB\n\n'
        + 'Nombre: ' + data.nombre + '\n'
        + 'Correo: ' + data.email + '\n'
        + 'Mensaje: ' + data.mensaje + '\n\n'
        + 'Enviado desde el sitio web del CRAI.';

      const mailtoLink = 'mailto:crai_institucional@upr.edu.cu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      window.location.href = mailtoLink;

      setTimeout(() => {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      }, 1000);
    });
  }

  // ==========================================================
  // COOKIE CONSENT
  // ==========================================================
  const cookieConsent = document.getElementById('cookie-consent');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieConsent && !localStorage.getItem('cookie-consent')) {
    setTimeout(() => cookieConsent.classList.add('show'), 1000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieConsent.classList.remove('show');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      cookieConsent.classList.remove('show');
    });
  }

  // ==========================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================================
  // NEWSLETTER FORM
  // ==========================================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input?.value.trim()) {
        alert('¡Gracias por suscribirte a nuestro newsletter!');
        input.value = '';
      }
    });
  }

  // ==========================================================
  // SET ACTIVE NAV LINK
  // ==========================================================
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const clean = href.split('#')[0].replace(/\/$/, '') || '/';
    if (pathname === clean) link.classList.add('active');
    else link.classList.remove('active');
  });

  // ==========================================================
  // CAROUSEL INIT
  // ==========================================================
  initCarousel('news-carousel');

});
