document.addEventListener('DOMContentLoaded', () => {
  const geoCoords = {
    'C878%2BQ4Q': { coords: [22.3950, -83.7300], name: 'Dirección Biblioteca Hermanos Saiz Montes de Oca', address: 'Calle José Martí No 300, Barrio Segundo Sur, e/27 de Noviembre y González Alcorta, Pinar del Río, Cuba.' },
    'C8C5%2BWFH': { coords: [22.3547, -83.7348], name: 'Dirección Biblioteca Nancy Uranga Romagoza', address: 'Calle Capitán San Luis s/n, Pinar del Río, Cuba.' },
    'C8FF%2BVJM': { coords: [22.4298, -83.7034], name: 'Dirección Biblioteca "Rafael María Mendive"', address: 'Calle Los Pinos final, esquina avenida Borrego. Reparto Hermanos Cruz, Pinar del Río, Cuba.' }
  };
  const map = L.map('campus-map').setView([22.3950, -83.7300], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  const markers = {};
  Object.entries(geoCoords).forEach(([geo, data]) => {
    markers[geo] = L.marker(data.coords).addTo(map).bindPopup('<strong>' + data.name + '</strong><br>' + data.address);
  });
  const cards = Array.from(document.querySelectorAll('[data-campus-geo]'));
  function showPlace(card) {
    const geo = card.getAttribute('data-campus-geo');
    if (!geo || !geoCoords[geo]) return;
    map.flyTo(geoCoords[geo].coords, 16);
    if (markers[geo]) markers[geo].openPopup();
    cards.forEach((c) => {
      const active = c === card;
      c.classList.toggle('campus-active', active);
      c.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  cards.forEach((card) => {
    card.addEventListener('click', () => showPlace(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showPlace(card);
      }
    });
  });
});
