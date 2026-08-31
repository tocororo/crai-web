/* ============================================================
   NOTICIAS - Cargador dinámico desde API
   Estrategia CORS: detección de entorno + proxy local + fallback
   ============================================================ */

const NOTICIAS_API = '/api/noticias';
const NOTICIAS_ORIGIN = 'https://noticias.upr.edu.cu/feed/';

const DEFAULT_ICONS = ['fas fa-newspaper', 'fas fa-file-alt', 'fas fa-info-circle', 'fas fa-star', 'fas fa-bullhorn'];

function detectarEntorno() {
  const host = window.location.hostname;
  const proto = window.location.protocol;
  const isFile = proto === 'file:';
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  const isUPR = host.includes('upr.edu.cu') || host.includes('.upr.');
  const isPrivate = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01]))/.test(host);
  return { isLocal: isLocal || isPrivate, isUPR, isFile };
}

function construirURL() {
  const env = detectarEntorno();
  if (env.isFile) return NOTICIAS_ORIGIN;
  if (!env.isLocal) return NOTICIAS_ORIGIN;
  return NOTICIAS_API;
}

async function cargarNoticias() {
  const track = document.getElementById('news-track');
  if (!track) return;

  showLoading(track);

  const url = construirURL();

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json, text/xml, application/rss+xml, application/xml, text/plain' },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    let noticias = [];

    if (contentType.includes('json') || text.trim().startsWith('[') || text.trim().startsWith('{')) {
      noticias = parsearJSON(text);
    } else {
      noticias = parsearXML(text);
    }

    if (noticias.length === 0) throw new Error('No se encontraron noticias');

    renderizarNoticias(track, noticias);
    initCarousel('news-carousel');

  } catch (err) {
    console.warn('[Noticias] Error de carga:', err.message);
    cargarFallback(track);
  }
}

function showLoading(track) {
  track.innerHTML = `
    <div class="carousel-loading" style="display:flex;align-items:center;justify-content:center;width:100%;padding:60px 0;gap:12px;flex-direction:column;">
      <div class="loading-spinner" style="width:36px;height:36px;border-width:3px;"></div>
      <p style="color:var(--text-secondary);font-size:0.9rem;">Cargando noticias...</p>
    </div>
  `;
}

function parsearJSON(texto) {
  try {
    const data = JSON.parse(texto);
    const items = data.noticias || data.data || data.items || data.posts || data.articles || data.entries || data;
    if (Array.isArray(items)) {
      return items.map(item => ({
        titulo: item.titulo || item.title || item.Titulo || 'Sin título',
        descripcion: item.descripcion || item.description || item.descripcion_corta || item.resumen || item.excerpt || item.summary || item.contenido || '',
        imagen: item.imagen || item.image || item.Imagen || item.featured_image || item.thumbnail || item.img || item.enclosure?.url || '',
        fecha: item.fecha || item.date || item.Fecha || item.pubDate || item.created_at || item.publicado || '',
        url: item.url || item.link || item.Url || item.enlace || item.href || item.permalink || ''
      }));
    }
    if (Array.isArray(data)) {
      return data.map(item => ({
        titulo: item.titulo || item.title || 'Sin título',
        descripcion: item.descripcion || item.description || '',
        imagen: item.imagen || item.image || item.img || '',
        fecha: item.fecha || item.date || '',
        url: item.url || item.link || ''
      }));
    }
  } catch {}
  return [];
}

function parsearXML(texto) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(texto, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) return [];

  const entries = doc.querySelectorAll('item, entry');
  if (entries.length === 0) return [];

  return Array.from(entries).map(item => {
    const getTag = (tags) => {
      for (const tag of tags) {
        const el = item.querySelector(tag);
        if (el?.textContent) return el.textContent.trim();
      }
      return '';
    };

    const enclosure = item.querySelector('enclosure');
    const mediaContent = item.querySelector('media\\:content, content');
    const jmsImage = item.querySelector('jms\\:featured-image, jms-featured-image');

    let imagen = enclosure?.getAttribute('url')
      || mediaContent?.getAttribute('url')
      || jmsImage?.textContent?.trim()
      || '';

    if (!imagen) {
      const descHTML = getTag(['description', 'content\\:encoded', 'content']);
      const imgMatch = descHTML.match(/<img[^>]+src=["']([^"']+)["']/);
      if (imgMatch) imagen = imgMatch[1];
    }

    const descRaw = getTag(['description', 'descripcion']);
    const descLimpia = descRaw.replace(/<img[^>]*>/g, '').replace(/<a\s[^>]*>/g, '').replace(/<\/a>/g, '').trim();

    return {
      titulo: getTag(['title', 'titulo']),
      descripcion: descLimpia || getTag(['summary', 'content\\:encoded', 'content']),
      imagen: imagen,
      fecha: getTag(['pubDate', 'published', 'updated', 'date', 'fecha']),
      url: getTag(['link', 'url', 'enlace'])
    };
  });
}

function renderizarNoticias(track, noticias) {
  track.innerHTML = '';
  noticias = noticias.slice(0, 12);

  noticias.forEach((noticia, index) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide news-card';

    const fecha = formatearFecha(noticia.fecha);
    const descripcion = truncar(noticia.descripcion, 120);
    const url = noticia.url || '#';

    slide.innerHTML = `
      <div class="news-card-img${noticia.imagen ? ' has-image' : ''}">
        ${noticia.imagen
          ? `<img src="${noticia.imagen}" alt="${escapeHtml(noticia.titulo)}" loading="lazy">`
          : `<i class="${DEFAULT_ICONS[index % DEFAULT_ICONS.length]}" aria-hidden="true"></i>`
        }
        <span class="date-badge">${fecha}</span>
      </div>
      <div class="news-card-body">
        <h3><a href="${url}" ${url !== '#' ? 'target="_blank" rel="noopener"' : ''}>${escapeHtml(noticia.titulo)}</a></h3>
        <p>${escapeHtml(descripcion)}</p>
        <a href="${url}" class="read-more" ${url !== '#' ? 'target="_blank" rel="noopener"' : ''}>
          Leer más <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    `;

    track.appendChild(slide);
  });
}

function cargarFallback(track) {
  track.innerHTML = '';

  const fallback = [
    { titulo: 'CRAI abre convocatoria para nuevos servicios digitales', descripcion: 'El Centro de Recursos para el Aprendizaje y la Investigación anuncia la ampliación de sus servicios digitales para la comunidad universitaria.', icono: 'fas fa-newspaper', fecha: '15 Feb 2026', url: '#' },
    { titulo: 'Taller de herramientas de investigación científica', descripcion: 'El CRAI invita al taller gratuito sobre gestores bibliográficos y bases de datos académicas para estudiantes y profesores.', icono: 'fas fa-trophy', fecha: '8 Feb 2026', url: '#' },
    { titulo: 'Nuevo convenio de colaboración interbibliotecaria', descripcion: 'Se firma acuerdo que permite el acceso a más de 50 mil recursos digitales entre bibliotecas universitarias del país.', icono: 'fas fa-handshake', fecha: '1 Feb 2026', url: '#' },
    { titulo: 'Repositorio institucional alcanza 10 mil publicaciones', descripcion: 'El repositorio digital de la universidad supera los 10 mil documentos académicos y científicos disponibles en acceso abierto.', icono: 'fas fa-flask', fecha: '20 Ene 2026', url: '#' },
    { titulo: 'Conferencia sobre transformación digital en educación', descripcion: 'Expertos internacionales debatirán sobre el futuro de la educación superior y el rol de los centros de recursos para el aprendizaje.', icono: 'fas fa-globe-americas', fecha: '10 Ene 2026', url: '#' },
    { titulo: 'Curso virtual de alfabetización informacional', descripcion: 'El CRAI ofrece curso en línea para desarrollar competencias en búsqueda, evaluación y uso ético de la información académica.', icono: 'fas fa-graduation-cap', fecha: '5 Ene 2026', url: '#' },
  ];

  fallback.forEach(item => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide news-card';
    slide.innerHTML = `
      <div class="news-card-img">
        <i class="${item.icono}" aria-hidden="true"></i>
        <span class="date-badge">${item.fecha}</span>
      </div>
      <div class="news-card-body">
        <h3><a href="${item.url}">${item.titulo}</a></h3>
        <p>${item.descripcion}</p>
        <a href="${item.url}" class="read-more">Leer más <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
      </div>
    `;
    track.appendChild(slide);
  });

  initCarousel('news-carousel');
}

function formatearFecha(fecha) {
  if (!fecha || fecha === 'Sin fecha') return 'Fecha no disponible';
  try {
    const date = new Date(fecha.includes('T') || fecha.includes('-') ? fecha : fecha.replace(/^[A-Za-z]{3},?\s*/, ''));
    if (isNaN(date.getTime())) return fecha;
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return fecha;
  }
}

function truncar(texto, max) {
  if (!texto) return '';
  const limpio = texto.replace(/<[^>]*>/g, '').trim();
  return limpio.length > max ? limpio.substring(0, max).trim() + '…' : limpio;
}

function escapeHtml(texto) {
  if (!texto) return '';
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', cargarNoticias);
