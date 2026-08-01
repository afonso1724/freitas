(function () {
  const TURQUOISE = '#40E0D0';
  const INK = '#09090B';

  
  const WHATSAPP = {
    ketsia: '938214731',
    micaela: '990418488',
  };

  const RSVP_MESSAGE =
    'Saudações! Venho por esta menssagem confirmar a minha presença na tua festa de anos.';

  const VENUE_ADDRESS = 'Condomínio Girassol, casa 1363';

  // Cole o src do iframe: Google Maps → Compartilhar → Incorporar um mapa
  // Deixe vazio ('') para usar busca automática pelo endereço acima
  const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63064.52132558014!2d13.298893481284937!3d-8.922970853121983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f7a41acbe2eb%3A0x3bea673924b4e5ed!2sCondom%C3%ADnio%20Girasol%20-Casa!5e0!3m2!1spt-BR!2sus!4v1785596165732!5m2!1spt-BR!2sus';
  // =======================================

  function buildWaLink(phone) {
    const text = encodeURIComponent(RSVP_MESSAGE);
    return `https://wa.me/${phone}?text=${text}`;
  }

  function getMapEmbedUrl() {
    if (MAP_EMBED_URL) return MAP_EMBED_URL;
    const q = encodeURIComponent(VENUE_ADDRESS);
    return `https://maps.google.com/maps?q=${q}&hl=pt-BR&z=16&output=embed`;
  }

  function getMapsExternalUrl() {
    const q = encodeURIComponent(VENUE_ADDRESS);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  document.getElementById('rsvp-ketsia').href = buildWaLink(WHATSAPP.ketsia);
  document.getElementById('rsvp-micaela').href = buildWaLink(WHATSAPP.micaela);

  const venueAddressEl = document.getElementById('venue-address');
  if (venueAddressEl) venueAddressEl.textContent = VENUE_ADDRESS;

  const mapsExternalLink = document.getElementById('maps-external-link');
  if (mapsExternalLink) mapsExternalLink.href = getMapsExternalUrl();

  const welcome = document.getElementById('welcome');
  const welcomeBtn = document.getElementById('welcome-btn');
  const invite = document.getElementById('invite');

  function fireConfetti() {
    if (typeof confetti !== 'function') return;

    const defaults = {
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
      origin: { y: 0.55 },
    };

    confetti({
      ...defaults,
      colors: [TURQUOISE, INK, '#00CED1', '#FFFFFF'],
    });

    confetti({
      ...defaults,
      particleCount: 50,
      angle: 60,
      origin: { x: 0, y: 0.6 },
      colors: [TURQUOISE, INK],
    });

    confetti({
      ...defaults,
      particleCount: 50,
      angle: 120,
      origin: { x: 1, y: 0.6 },
      colors: [TURQUOISE, INK],
    });
  }

  function revealSections() {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  function openInvite() {
    welcomeBtn.disabled = true;
    fireConfetti();
    welcome.classList.add('welcome-leaving');

    setTimeout(() => {
      welcome.classList.add('hidden');
      invite.classList.remove('invite-hidden', 'pointer-events-none', 'opacity-0');
      invite.classList.add('invite-visible');
      revealSections();
      initCarousel();
      initScrollReveal();
    }, 650);
  }

  welcomeBtn.addEventListener('click', openInvite);

  /* Mapa incorporado */
  const toggleMapBtn = document.getElementById('toggle-map-btn');
  const mapPanel = document.getElementById('map-panel');
  const venueMap = document.getElementById('venue-map');
  const mapLabel = document.getElementById('toggle-map-label');
  let mapLoaded = false;

  if (toggleMapBtn && mapPanel && venueMap) {
    toggleMapBtn.addEventListener('click', () => {
      const willOpen = !mapPanel.classList.contains('is-open');

      if (willOpen) {
        mapPanel.hidden = false;
        mapPanel.classList.add('is-open');
        if (!mapLoaded) {
          venueMap.src = getMapEmbedUrl();
          mapLoaded = true;
        }
        toggleMapBtn.setAttribute('aria-expanded', 'true');
        if (mapLabel) mapLabel.textContent = 'Fechar mapa';
      } else {
        mapPanel.classList.remove('is-open');
        toggleMapBtn.setAttribute('aria-expanded', 'false');
        if (mapLabel) mapLabel.textContent = 'Abrir mapa incorporado';
        setTimeout(() => {
          if (!mapPanel.classList.contains('is-open')) {
            mapPanel.hidden = true;
          }
        }, 450);
      }
    });
  }

  /* Carrossel */
  let carouselInitialized = false;

  function initCarousel() {
    if (carouselInitialized) return;
    carouselInitialized = true;

    const inner = document.querySelector('.carousel-inner');
    const slides = document.querySelectorAll('.carousel-slide');
    const prev = document.querySelector('.carousel-prev');
    const next = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!inner || !slides.length || !prev || !next || !dotsContainer) return;

    let index = 0;
    const total = slides.length;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    function goTo(i) {
      index = (i + total) % total;
      inner.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('active', j === index));
    }

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));

    let touchStartX = 0;
    inner.parentElement.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    inner.parentElement.addEventListener(
      'touchend',
      (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) goTo(index + (diff < 0 ? 1 : -1));
      },
      { passive: true }
    );
  }

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      observer.observe(el);
    });
  }
})();