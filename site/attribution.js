// Sursa vizitei → linkurile de înregistrare (TASK 2 SEO, pasul 3; migrarea 056).
//
// Decizia PO (PECR/ICO pentru UK): FĂRĂ cookie-uri și FĂRĂ stocare pe dispozitiv. Sursa se
// citește din URL-ul paginii curente (utm_*) și din document.referrer (doar HOSTNAME-ul unui
// site extern) și se pune, în aceeași vizită, pe linkurile „Create account” / „Începe gratuit”
// (/frontend/register...). Înregistrarea o trimite o singură dată la server (frontend/js/register.js).
// Limita asumată: dacă omul pleacă și revine altă dată, sursa nu se mai știe.
//
// Rulează și pe vitrina .eu (linkurile ei duc la electricalvpf.app/frontend/register...).
(function () {
  "use strict";

  var UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var OWN_HOSTS = /(^|\.)electricalvpf\.(app|eu)$/i;

  function visitSource() {
    var source = {};
    var params = new URLSearchParams(window.location.search);
    UTM.forEach(function (key) {
      var value = params.get(key);
      if (value) source[key] = value.slice(0, 100);
    });
    try {
      var ref = document.referrer ? new URL(document.referrer).hostname : "";
      if (ref && !OWN_HOSTS.test(ref) && ref !== window.location.hostname) source.ref = ref;
    } catch (err) {
      /* referrer invalid — ignorat */
    }
    source.lh = window.location.hostname;
    source.lp = window.location.pathname; // doar calea, fără query / fragment
    source.ll = window.SITE_PAGE_LANG || document.documentElement.lang || "";
    return source;
  }

  var SOURCE = visitSource();

  function tag(link) {
    var href = link.getAttribute("href");
    if (!href || href.indexOf("/frontend/register") === -1) return;
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return;
    }
    Object.keys(SOURCE).forEach(function (key) {
      if (SOURCE[key] && !url.searchParams.has(key)) url.searchParams.set(key, SOURCE[key]);
    });
    link.setAttribute("href", url.href);
  }

  // Delegat: prinde și linkurile create din JS (planuri, ferestre „dovadă”, calculatorul).
  ["pointerdown", "click", "keydown"].forEach(function (type) {
    document.addEventListener(type, function (event) {
      var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if (link) tag(link);
    }, true);
  });
})();
