/* ACB JUDO — shared chrome: logo, header, footer, interactions */
(function () {
  var PAGES = [
    { href: 'index.html',   label: 'Accueil',          id: 'accueil' },
    { href: 'club.html',    label: 'Le club',          id: 'club'    },
    { href: 'cours.html',   label: 'Cours & horaires', id: 'cours'   },
    { href: 'tarifs.html',  label: 'Tarifs',           id: 'tarifs'  },
    { href: 'galerie.html', label: 'Galerie',          id: 'galerie' },
    { href: 'contact.html', label: 'Contact',          id: 'contact' }
  ];

  // ensō mark — generated dry-brush ring
  function ensoSVG() {
    return '<img src="assets/enso.webp" alt="" aria-hidden="true" style="width:100%;height:100%;object-fit:contain;display:block">';
  }

  function brandHTML(onHero) {
    return '<a class="brand' + (onHero ? ' on-hero' : '') + '" href="index.html" aria-label="ACB Judo — accueil">' +
      '<span class="logo-mark">' + ensoSVG() + '</span>' +
      '<span class="logo-word"><span class="lw-1">ACB</span>' +
      '<span class="lw-2">Judo<span class="dot"></span></span></span></a>';
  }

  var current = (document.body.getAttribute('data-page') || '').toLowerCase();
  var onHero = document.body.hasAttribute('data-hero');

  /* ---------- header ---------- */
  var header = document.createElement('header');
  header.className = 'site-header' + (onHero ? '' : ' solid');
  var navLinks = PAGES.map(function (p) {
    return '<a class="navlink' + (p.id === current ? ' active' : '') + '" href="' + p.href + '">' + p.label + '</a>';
  }).join('');
  header.innerHTML =
    brandHTML(onHero) +
    '<nav class="nav" aria-label="Navigation principale">' + navLinks +
      '<a class="btn btn-red btn-sm nav-cta desktop" href="tarifs.html#inscription">S\u2019inscrire</a>' +
    '</nav>' +
    '<button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button>';
  document.body.insertBefore(header, document.body.firstChild);

  /* ---------- mobile menu ---------- */
  var menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML = PAGES.map(function (p, i) {
    return '<a href="' + p.href + '">' + p.label + '<span class="idx">0' + (i + 1) + '</span></a>';
  }).join('') +
  '<a href="tarifs.html#inscription" style="color:var(--red)">S\u2019inscrire<span class="idx">\u2192</span></a>';
  document.body.insertBefore(menu, header.nextSibling);

  var burger = header.querySelector('.burger');
  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { toggleMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  /* ---------- solidify header on scroll ---------- */
  if (onHero) {
    var onScroll = function () { header.classList.toggle('solid', window.scrollY > window.innerHeight * 0.7); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- footer ---------- */
  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
  '<div class="wrap">' +
    '<div class="footer-top">' +
      '<div class="footer-col footer-brand">' +
        '<img class="footer-logo" src="assets/logo.webp" alt="ACB Judo \u2014 Ath\u00e9l\u00e9tic Club de Bobigny" width="300" height="150">' +
        '<p>ACB Judo \u2014 section judo de l\u2019Ath\u00e9l\u00e9tic Club de Bobigny. Le judo pour tous, d\u00e8s 2 ans et demi, en loisir comme en comp\u00e9tition.</p>' +
        '<div style="margin-top:1.4em;display:flex;gap:10px">' +
          '<a class="pill" href="https://facebook.com" target="_blank" rel="noopener" style="color:#cfcabf;border-color:#2a2823">Facebook</a>' +
          '<a class="pill" href="https://instagram.com" target="_blank" rel="noopener" style="color:#cfcabf;border-color:#2a2823">Instagram</a>' +
          '<a class="pill" href="https://wa.me/33787023215" target="_blank" rel="noopener" style="color:#cfcabf;border-color:#2a2823">WhatsApp</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-col"><h4>Naviguer</h4><ul>' +
        PAGES.map(function (p) { return '<li><a href="' + p.href + '">' + p.label + '</a></li>'; }).join('') +
        '<li><a href="marque.html">Identit\u00e9 & logo</a></li>' +
      '</ul></div>' +
      '<div class="footer-col"><h4>Les dojos</h4>' +
        '<address>Gymnase Jean-Pierre Timbaud<br>160 rue Lacide Villard<br><br>Gymnase Paul \u00c9luard<br><br>Gymnase Marcel Cachin<br><br>Le Prisme \u00b7 Bobigny</address>' +
      '</div>' +
      '<div class="footer-col"><h4>Contact</h4>' +
        '<address>Espace Maurice Niles<br>11 rue du 8 Mai 1945<br>93000 Bobigny<br><br>' +
        '<a href="tel:+33787023215">07 87 02 32 15</a><br>' +
        '<a href="tel:+33950845890">09 50 84 58 90</a><br>' +
        '<a href="mailto:direction.acbjudo@gmail.com">direction.acbjudo@gmail.com</a></address>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<span>\u00a9 <span class="yr"></span> ACB Judo \u00b7 Bobigny (93)</span>' +
      '<span class="ffj">Affili\u00e9 \u00e0 la F\u00e9d\u00e9ration Fran\u00e7aise de Judo</span>' +
      '<span>Maquette \u2014 contenus & photos \u00e0 confirmer</span>' +
    '</div>' +
  '</div>';
  document.body.appendChild(footer);
  var yr = footer.querySelector('.yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- scroll reveal (robust: rAF + scroll fallback, IO as enhancement) ---------- */
  function revealNow() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in');
    });
  }
  requestAnimationFrame(revealNow);
  window.addEventListener('load', revealNow);
  window.addEventListener('scroll', revealNow, { passive: true });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
  /* timers (not rAF) still fire in offscreen iframes: snap in-view content visible even if transitions are frozen */
  setTimeout(function () {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) el.classList.add('shown');
    });
  }, 1500);
})();
