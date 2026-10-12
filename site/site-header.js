// Comportamentul antetului comun (templates/site-header.html): limba, „Funcționalități”, meniul de pe telefon,
// linkurile legale și resursa gratuită în limba paginii. Un singur fișier, pentru toate paginile publice.
(function () {
  // Dark / Light mode: vezi site/help-menu.js (butonul „?" → Afișare).

  // Linkurile legale au un fișier separat per limbă (terms.html = română, terms-en.html etc.).
  function updateLegalLinks() {
      const lang = document.documentElement.lang;
      document.querySelectorAll('a[data-legal]').forEach((a) => {
          const suffix = !lang || lang === 'ro' ? '' : '-' + lang;
          a.setAttribute('href', 'https://electricalvpf.app/frontend/legal/' + a.getAttribute('data-legal') + suffix + '.html?returnSite=eu');
      });
  }
  document.addEventListener('site:lang-applied', updateLegalLinks);

  // Resursa gratuită (model de ofertă / deviz): româna are modelul românesc, celelalte limbi modelul UK (engleză).
  // Același tabel ca site/tools/build-home-pages.js (RESOURCE_URLS) — pagina statică pornește deja corect.
  function updateResourceLinks() {
      const urls = { tr: '/tr/elektrik-isleri-teklif-sablonu/', ru: '/ru/smeta-elektromontazhnye-raboty/', ro: '/ro/model-deviz-instalatii-electrice/', no: '/no/tilbudsmal-elektriker/', nl: '/nl/offerte-sjabloon-elektricien/', it: '/it/modello-preventivo-elettricista/', pl: '/pl/wzor-oferty-elektryka/', uk: '/uk/koshtorys-elektromontazhni-roboty/', sv: '/sv/offertmall-elektriker/' };
      const url = urls[document.documentElement.lang] || '/electrical-quote-template/';
      document.querySelectorAll('a[data-resource="quote-template"]').forEach((a) => {
          a.setAttribute('href', url);
      });
  }
  document.addEventListener('site:lang-applied', updateResourceLinks);

  // Inițializare control limbă cu steaguri
  const init = () => {
      if (typeof LanguageDropdownControl !== 'undefined') {
          new LanguageDropdownControl('language-control-container');
      }

      const menuToggle = document.getElementById('mobile-menu-toggle');
      const menuClose = document.getElementById('mobile-menu-close');
      const drawer = document.getElementById('mobile-nav-drawer');
      const overlay = document.getElementById('mobile-nav-overlay');
      const internalLinks = drawer.querySelectorAll('a');
      let lastFocusedElement;

      // "Produs" înseamnă începutul paginii. O ancoră nativă către
      // #product ar alinia hero-ul sub headerul sticky, deci tratăm
      // exclusiv această destinație ca scroll la poziția inițială.
      document.querySelectorAll('a[href="#product"]').forEach((link) => {
          link.addEventListener('click', (event) => {
              event.preventDefault();
              if (window.location.hash !== '#product') {
                  window.history.pushState(null, '', '#product');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
          });
      });

      const featuresDropdown = document.getElementById('features-dropdown');
      const featuresDropdownToggle = document.getElementById('features-dropdown-toggle');
      const featuresDropdownMenu = document.getElementById('features-dropdown-menu');
      let featuresDropdownCloseTimer;

      const canHoverFeaturesDropdown = () =>
          window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const setFeaturesDropdownOpen = (isOpen) => {
          featuresDropdown.classList.toggle('is-open', isOpen);
          featuresDropdownToggle.setAttribute('aria-expanded', String(isOpen));
          featuresDropdownMenu.setAttribute('aria-hidden', String(!isOpen));
      };

      featuresDropdownToggle.addEventListener('click', () => {
          clearTimeout(featuresDropdownCloseTimer);
          setFeaturesDropdownOpen(!featuresDropdown.classList.contains('is-open'));
      });
      featuresDropdown.addEventListener('mouseenter', () => {
          if (!canHoverFeaturesDropdown()) return;
          clearTimeout(featuresDropdownCloseTimer);
          setFeaturesDropdownOpen(true);
      });
      featuresDropdown.addEventListener('mouseleave', () => {
          if (!canHoverFeaturesDropdown()) return;
          featuresDropdownCloseTimer = setTimeout(() => setFeaturesDropdownOpen(false), 150);
      });
      featuresDropdownMenu.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', () => setFeaturesDropdownOpen(false));
      });
      document.addEventListener('mousedown', (event) => {
          if (!featuresDropdown.contains(event.target)) {
              clearTimeout(featuresDropdownCloseTimer);
              setFeaturesDropdownOpen(false);
          }
      });

      const closeMobileMenu = () => {
          drawer.classList.remove('is-open');
          drawer.setAttribute('aria-hidden', 'true');
          drawer.setAttribute('inert', '');
          menuToggle.setAttribute('aria-expanded', 'false');
          overlay.hidden = true;
          document.body.classList.remove('mobile-menu-open');
          if (lastFocusedElement) lastFocusedElement.focus();
      };

      const openMobileMenu = () => {
          lastFocusedElement = document.activeElement;
          drawer.classList.add('is-open');
          drawer.setAttribute('aria-hidden', 'false');
          drawer.removeAttribute('inert');
          menuToggle.setAttribute('aria-expanded', 'true');
          overlay.hidden = false;
          document.body.classList.add('mobile-menu-open');
          menuClose.focus();
      };

      menuToggle.addEventListener('click', openMobileMenu);
      menuClose.addEventListener('click', closeMobileMenu);
      overlay.addEventListener('click', closeMobileMenu);
      internalLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
      document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && featuresDropdown.classList.contains('is-open')) {
              setFeaturesDropdownOpen(false);
              featuresDropdownToggle.focus();
          }
          if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeMobileMenu();
      });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
