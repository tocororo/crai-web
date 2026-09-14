document.addEventListener('DOMContentLoaded', () => {
  const geoCoords = {
    'C878+Q4Q': [22.3950, -83.7300],
    'C8C5+WFH': [22.3547, -83.7348],
    'C8FF+VJM': [22.4298, -83.7034],
    'C8P8+RJ8': [22.3950, -83.7300]
  };
  const map = L.map('campus-map').setView([22.3950, -83.7300], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  const markers = {};
  Object.entries(geoCoords).forEach(([geo, coords]) => {
    markers[geo] = L.marker(coords).addTo(map).bindPopup(geo);
  });
  const cards = Array.from(document.querySelectorAll('[data-campus-geo]'));
  function showPlace(card) {
    const geo = card.getAttribute('data-campus-geo');
    if (!geo || !geoCoords[geo]) return;
    map.flyTo(geoCoords[geo], 16);
    if (markers[geo]) markers[geo].openPopup();
    cards.forEach((c) => c.classList.toggle('campus-active', c === card));
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
