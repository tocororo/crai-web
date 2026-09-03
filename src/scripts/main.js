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
    { title: 'La Universidad', url: '/la-universidad', keywords: 'universidad, historia, mision, vision, autoridad' },
    { title: 'Estudios - Oferta Académica', url: '/estudios', keywords: 'estudios, programas, carreras, grado, posgrado, curso' },
    { title: 'Admisión', url: '/admision', keywords: 'admision, inscripcion, requisitos, becas, matricula' },
    { title: 'Investigación', url: '/investigacion', keywords: 'investigacion, proyectos, publicaciones, ciencia' },
    { title: 'Vida en el Campus', url: '/vida-campus', keywords: 'vida, campus, deportes, cultura, residencia' },
    { title: 'Actualidad', url: '/actualidad', keywords: 'noticias, eventos, actualidad, agenda' },
    { title: 'Portal de Transparencia', url: '/transparencia', keywords: 'transparencia, informes, datos, presupuesto' },
  ];

  let debounceTimer = null;
  let highlightedIndex = -1;
  let currentItems = [];

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
    if (query.length < 2) { closeResults(); return; }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeSearch(query), 150);
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
    const q = query.toLowerCase();
    currentItems = [];
    const results = LOCAL_PAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.keywords.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-results-empty">
          <i class="fas fa-search"></i>
          <p>No se encontraron resultados para <strong>"${escapeHtml(query)}"</strong></p>
        </div>`;
      searchResults.classList.add('active');
      currentItems = [];
      return;
    }

    let html = `<div class="search-results-group">`;
    html += `<div class="search-results-group-header"><i class="fas fa-file-alt"></i> Páginas del sitio</div>`;
    results.slice(0, 8).forEach(p => {
      currentItems.push({ url: p.url, type: 'page' });
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

    searchResults.innerHTML = html;
    searchResults.classList.add('active');
    highlightedIndex = -1;

    searchResults.querySelectorAll('.search-results-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index);
        navigateToResult(idx);
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
  // PROGRAM FILTERS
  // ==========================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programItems = document.querySelectorAll('.program-list-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'all';
      programItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  const programSearchInput = document.getElementById('program-search-input');
  const programSearchBtn = document.getElementById('program-search-btn');

  function filterPrograms(query) {
    const q = query.toLowerCase().trim();
    programItems.forEach(item => {
      const title = item.querySelector('h3')?.textContent?.toLowerCase() || '';
      const desc = item.querySelector('p')?.textContent?.toLowerCase() || '';
      const meta = item.querySelector('.program-meta')?.textContent?.toLowerCase() || '';
      if (title.includes(q) || desc.includes(q) || meta.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (programSearchInput) {
    programSearchInput.addEventListener('input', () => filterPrograms(programSearchInput.value));
    if (programSearchBtn) {
      programSearchBtn.addEventListener('click', () => filterPrograms(programSearchInput.value));
      programSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterPrograms(programSearchInput.value);
      });
    }
  }

  // ==========================================================
  // NEWS CATEGORY FILTERS
  // ==========================================================
  const newsFilterBtns = document.querySelectorAll('.news-filter-btn');
  const newsItems = document.querySelectorAll('.news-card');

  newsFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      newsFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'all';
      newsItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
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
      let valid = true;
      const fields = [
        { id: 'nombre', error: 'El nombre es obligatorio' },
        { id: 'email', error: 'El email no es válido' },
        { id: 'mensaje', error: 'El mensaje no puede estar vacío' },
      ];

      fields.forEach(({ id, error }) => {
        const input = document.getElementById(id);
        const group = input?.closest('.form-group');
        if (!group) return;
        const errorEl = group.querySelector('.form-error');
        const value = input.value.trim();

        if (!value) {
          group.classList.add('error');
          if (errorEl) errorEl.textContent = error;
          valid = false;
        } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          group.classList.add('error');
          if (errorEl) errorEl.textContent = 'Ingrese un email válido';
          valid = false;
        } else {
          group.classList.remove('error');
        }
      });

      if (valid && formSuccess) {
        contactForm.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('error');
      });
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
