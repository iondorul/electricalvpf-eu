// Vitrina (electricalvpf.app/) -> dashboard, dar DOAR pentru o sesiune validă.
//
// Aplicația păstrează JWT-ul în localStorage["token"] (frontend/js/login.js, api.js, shell.js).
// Un token din localStorage nu înseamnă o sesiune validă (poate fi expirat), așa că îl validăm
// exact ca aplicația — GET /auth/me cu Authorization: Bearer — și redirecționăm doar la 2xx.
//
// Reguli:
//  - 401/403, eroare de rețea, timeout, 5xx  -> vitrina rămâne afișată (utilizatorul apasă
//    "Autentificare"). NU ștergem tokenul: curățenia sesiunii e treaba aplicației (api.js/shell.js).
//  - API_BASE_URL vine din frontend/js/config.js (neatins) — nu duplicăm adresa API aici.
//  - Cât timp verificăm, pagina e ascunsă (clasa html.session-check, setată în <head>); orice
//    ieșire din verificare o scoate. Head-ul are și un timeout de siguranță de 4 secunde.
(function () {
  "use strict";

  var root = document.documentElement;
  var CHECK_TIMEOUT_MS = 3500;
  var GENERAL_PANEL_URL = "https://electricalvpf.app/frontend/general-panel.html";
  var LOGIN_URL = "https://electricalvpf.app/frontend/login.html?returnSite=eu";

  // Panoul General Panel din vitrină (index.html, [data-panel-link]) duce implicit la
  // login; după autentificare login.js trimite deja în General Panel. Cu un token existent
  // duc direct în General Panel, iar dacă API-ul respinge tokenul (401/403) revin la login.
  function pointPanelLinks(url) {
    var links = document.querySelectorAll("[data-panel-link]");
    for (var i = 0; i < links.length; i++) links[i].setAttribute("href", url);
  }

  function showSite() {
    root.classList.remove("session-check");
  }

  var token = null;
  try {
    token = localStorage.getItem("token");
  } catch (err) {
    token = null;
  }

  // Calculatorul public poate continua un calcul autenticat către o ofertă.
  // În acel caz nu trimitem automat în dashboard înainte ca utilizatorul să
  // poată alege oferta; restul sesiunilor păstrează redirecționarea normală.
  var hasPendingJT = typeof window.JTPendingCalculation !== "undefined" && window.JTPendingCalculation.has();
  if (token) pointPanelLinks(GENERAL_PANEL_URL);

  if (!token || hasPendingJT || typeof CONFIG === "undefined" || !CONFIG.API_BASE_URL || typeof fetch !== "function") {
    showSite();
    return;
  }

  var controller = typeof AbortController === "function" ? new AbortController() : null;
  var timer = setTimeout(function () {
    if (controller) controller.abort();
    showSite();
  }, CHECK_TIMEOUT_MS);

  fetch(CONFIG.API_BASE_URL + "/auth/me", {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
    signal: controller ? controller.signal : undefined,
  })
    .then(function (response) {
      clearTimeout(timer);
      if (response.ok) {
        window.location.replace(GENERAL_PANEL_URL);
        return;
      }
      if (response.status === 401 || response.status === 403) pointPanelLinks(LOGIN_URL);
      showSite();
    })
    .catch(function () {
      clearTimeout(timer);
      showSite();
    });
})();
