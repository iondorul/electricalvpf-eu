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

  // Pagina Contact în limba paginii (același tabel ca CONTACT_URLS din site/tools/build-home-pages.js).
  function updateContactLinks() {
      const urls = { en: 'https://electricalvpf.app/contact/', ro: 'https://electricalvpf.app/ro/contact/', no: 'https://electricalvpf.app/no/contact/', nl: 'https://electricalvpf.app/nl/contact/', it: 'https://electricalvpf.app/it/contact/',
          pl: 'https://electricalvpf.app/pl/contact/', sv: 'https://electricalvpf.app/sv/contact/', tr: 'https://electricalvpf.app/tr/contact/', uk: 'https://electricalvpf.app/uk/contact/', ru: 'https://electricalvpf.app/ru/contact/' };
      const url = urls[document.documentElement.lang] || 'https://electricalvpf.app/contact/';
      document.querySelectorAll('a[data-contact]').forEach((a) => a.setAttribute('href', url));
  }
  document.addEventListener('site:lang-applied', updateContactLinks);

  // Unde se află vizitatorul: linkul din meniu al secțiunii / paginii curente se colorează (is-active), în
  // meniul de sus și în cel de pe telefon. Sub „Funcționalități” (Calculator, modelul de ofertă) se colorează
  // „Funcționalități” și cercul iconiței paginii active.
  function initActiveLink() {
      const header = document.querySelector('header.site-header');
      if (!header) return;
      const links = (key) => {
          const sel = {
              product: 'a[href$="#product"]', features: 'a[href$="#features"]', workflow: 'a[href$="#workflow"]',
              pricing: 'a[href$="#pricing"]', demo: '#tutorials-dropdown-toggle, .mobile-tutorials > summary', calculator: 'a[href$="#calculator-tool"]',
              resource: 'a[data-resource="quote-template"]', contact: 'a[data-contact]',
          }[key];
          return sel ? [...header.querySelectorAll(sel)] : [];
      };
      const parents = [header.querySelector('#features-dropdown-toggle'), header.querySelector('.mobile-features:not(.mobile-explore):not(.mobile-tutorials) > summary')].filter(Boolean);
      const exploreParents = [...header.querySelectorAll('#explore-dropdown-toggle, .mobile-explore > summary')];
      let current = null;
      const setActive = (key) => {
          if (key === current) return;
          current = key;
          header.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
          links(key).forEach((a) => a.classList.add('is-active'));
          if (key === 'calculator' || key === 'resource') parents.forEach((el) => el.classList.add('is-active'));
          if (key === 'features' || key === 'workflow') exploreParents.forEach((el) => el.classList.add('is-active'));
      };

      // Paginile din afara primei pagini: pagina însăși e destinația.
      if (!document.getElementById('product')) {
          if (/\/demo\/?$/.test(window.location.pathname)) setActive('demo');
          else if (/\/contact\/?$/.test(window.location.pathname)) setActive('contact');
          else if (links('resource').some((a) => new URL(a.href, window.location.href).pathname === window.location.pathname)) setActive('resource');
          return;
      }

      // Prima pagină: secțiunea de sub meniu. Linia de referință e puțin sub meniu; câștigă cea mai interioară
      // secțiune care o atinge (Calculatorul e în interiorul „Produs”).
      const targets = [['product', 'product'], ['calculator', 'calculator-tool'], ['features', 'features'], ['workflow', 'workflow'], ['pricing', 'pricing']]
          .map(([key, id]) => [key, document.getElementById(id)]).filter(([, el]) => el);
      const spy = () => {
          const line = header.getBoundingClientRect().bottom + Math.min(160, window.innerHeight * 0.25);
          let found = 'product';
          for (const [key, el] of targets) {
              const r = el.getBoundingClientRect();
              if (r.top <= line && r.bottom > line) found = key;
          }
          // La capătul paginii, ultima secțiune (Prețuri) e cea vizibilă, chiar dacă nu ajunge sub linie.
          if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) found = 'pricing';
          setActive(found);
      };
      let ticking = false;
      window.addEventListener('scroll', () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => { ticking = false; spy(); });
      }, { passive: true });
      window.addEventListener('resize', spy);
      window.addEventListener('load', spy);
      spy();
  }

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
      // Același lucru când „Produs” vine din altă pagină (/demo/, modelele de ofertă → /#product):
      // browserul ar derula la ancoră; pagina trebuie să se deschidă de sus, exact ca la încărcarea normală.
      if (window.location.hash === '#product' && document.getElementById('product')) {
          const toTop = () => window.scrollTo(0, 0);
          toTop();
          requestAnimationFrame(toTop);
          window.addEventListener('load', () => { toTop(); setTimeout(toTop, 0); }, { once: true });
      }

      initActiveLink();

      const dropdownClosers = new Map();
      document.querySelectorAll('#explore-dropdown, #features-dropdown, #tutorials-dropdown').forEach((dropdown) => {
      const featuresDropdown = dropdown;
      const featuresDropdownToggle = dropdown.querySelector('.nav-dropdown-toggle');
      const featuresDropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
      let featuresDropdownCloseTimer;

      const canHoverFeaturesDropdown = () =>
          window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const setFeaturesDropdownOpen = (isOpen) => {
          if (isOpen) dropdownClosers.forEach((close, other) => { if (other !== dropdown) close(); });
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

      dropdownClosers.set(dropdown, () => { clearTimeout(featuresDropdownCloseTimer); setFeaturesDropdownOpen(false); });
      dropdown.addEventListener('focusout', (event) => {
          if (!dropdown.contains(event.relatedTarget)) setFeaturesDropdownOpen(false);
      });
      dropdown.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') { setFeaturesDropdownOpen(false); featuresDropdownToggle.focus(); }
          if (event.key === 'ArrowDown' && event.target === featuresDropdownToggle) {
              event.preventDefault(); setFeaturesDropdownOpen(true); featuresDropdownMenu.querySelector('a').focus();
          }
      });
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

          if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeMobileMenu();
      });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
