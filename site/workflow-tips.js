// Tooltip-urile pașilor din „Flux de lucru" (#workflow) — afișate deasupra pasului.
// Aceeași familie vizuală și același comportament ca meniul „Funcționalități" din antet:
// se deschide la hover (doar pe dispozitive cu mouse), se închide după 150ms, la tap pe
// telefon, la focus din tastatură, și se închide la Escape / click în afară.
// Panoul e UNUL singur, atașat la <body> cu position: fixed — banda de pași are
// overflow-x: auto, care ar tăia un tooltip poziționat în interiorul ei.
// Textul vine din <span class="wf-tip-source" data-i18n="wfTip_*" hidden> din fiecare pas,
// deci e tradus de același mecanism ca restul paginii (site/language-dropdown.js).
(function () {
  "use strict";

  var chain = document.querySelector(".workflow-chain");
  if (!chain) return;
  var steps = Array.prototype.slice.call(chain.querySelectorAll(".workflow-step"));
  if (!steps.length) return;

  var GAP = 12;     // același decalaj ca .nav-dropdown-menu (top: calc(100% + 12px))
  var MARGIN = 12;  // distanța minimă față de marginile ecranului
  var CLOSE_DELAY = 150;
  var SHIFT_LEFT = 104; // cât din tooltip rămâne în stânga mijlocului pasului (~2,7 cm)

  var tip = document.createElement("div");
  tip.className = "wf-tip";
  tip.id = "wf-tip";
  tip.setAttribute("role", "tooltip");
  tip.innerHTML = '<span class="wf-tip-title"><i aria-hidden="true"></i><span></span></span><p class="wf-tip-text"></p>';
  document.body.appendChild(tip);
  var titleIcon = tip.querySelector(".wf-tip-title i");
  var titleEl = tip.querySelector(".wf-tip-title span");
  var textEl = tip.querySelector(".wf-tip-text");

  var current = null;
  var closeTimer;
  var focusedAt = 0;

  var canHover = function () {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  };

  function position() {
    if (!current) return;
    var r = current.getBoundingClientRect();
    var w = tip.offsetWidth;
    var h = tip.offsetHeight;
    // Deplasat spre dreapta: începe puțin înainte de mijlocul pasului și curge spre dreapta,
    // în sensul citirii, ca pasul și textul să se vadă împreună.
    var left = r.left + r.width / 2 - SHIFT_LEFT;
    // Nu iese din banda pașilor (primul/ultimul pas) și nici din ecran.
    var box = chain.getBoundingClientRect();
    var minLeft = Math.max(MARGIN, box.left);
    var maxLeft = Math.min(window.innerWidth - MARGIN, box.right) - w;
    left = Math.max(minLeft, Math.min(left, maxLeft));
    // Deasupra pasului; dedesubt doar dacă sus nu e loc (ex. pasul e lipit de marginea de sus).
    var topLimit = MARGIN + (document.querySelector(".site-header") || { offsetHeight: 0 }).offsetHeight;
    var above = r.top - GAP - h >= topLimit;
    var top = above ? r.top - GAP - h : r.bottom + GAP;
    tip.classList.toggle("is-above", above);
    tip.style.left = Math.round(left) + "px";
    tip.style.top = Math.round(top) + "px";
  }

  function open(step) {
    clearTimeout(closeTimer);
    var source = step.querySelector(".wf-tip-source");
    var icon = step.querySelector("i");
    var name = step.querySelector("strong");
    if (!source) return;
    if (current && current !== step) current.removeAttribute("aria-describedby");
    current = step;
    // Aceeași iconiță ca pasul (și ca în sidebar-ul aplicației), apoi numele modulului.
    titleIcon.className = icon ? icon.className : "";
    titleEl.textContent = name ? name.textContent.trim() : "";
    textEl.textContent = source.textContent.trim();
    step.setAttribute("aria-describedby", tip.id);
    position();
    tip.classList.add("is-open");
  }

  function close() {
    clearTimeout(closeTimer);
    tip.classList.remove("is-open");
    if (current) current.removeAttribute("aria-describedby");
    current = null;
  }

  function closeLater() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, CLOSE_DELAY);
  }

  // Cu o sesiune salvată, pasul duce direct în modul (paza aplicației verifică tokenul).
  // Fără sesiune rămâne href-ul din HTML: login.html?return=<modul>.
  var hasToken = false;
  try { hasToken = !!(window.AuthSession && AuthSession.hasToken()); } catch (err) { /* stocare indisponibilă */ }
  if (hasToken) {
    steps.forEach(function (step) {
      var page = step.getAttribute("data-app-page");
      if (page) step.setAttribute("href", "https://electricalvpf.app/frontend/" + page);
    });
  }

  steps.forEach(function (step) {
    step.addEventListener("mouseenter", function () { if (canHover()) open(step); });
    step.addEventListener("mouseleave", function () { if (canHover()) closeLater(); });
    step.addEventListener("focus", function () { focusedAt = Date.now(); open(step); });
    step.addEventListener("blur", function () { if (current === step) closeLater(); });
    // Pasul e link spre modulul din aplicație. Cu mouse: click = deschide modulul.
    // Pe telefon/tabletă: primul tap arată descrierea, al doilea tap pe același pas
    // deschide modulul. (Un tap declanșează întâi focus, care deschide tooltip-ul —
    // de aceea un tooltip deschis cu mai puțin de 400ms înainte nu contează ca „deja văzut".)
    step.addEventListener("click", function (e) {
      if (canHover()) return;
      var alreadyShown = current === step && tip.classList.contains("is-open") && Date.now() - focusedAt >= 400;
      if (!alreadyShown) {
        e.preventDefault();
        focusedAt = Date.now() - 400;
        open(step);
      }
    });
  });

  document.addEventListener("mousedown", function (e) {
    if (current && !current.contains(e.target)) close();
  });
  document.addEventListener("touchstart", function (e) {
    if (current && !current.contains(e.target)) close();
  }, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && current) close();
  });
  window.addEventListener("scroll", position, { passive: true });
  window.addEventListener("resize", position);
  chain.addEventListener("scroll", close, { passive: true });
})();
