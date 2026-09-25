// Secțiunea "Planuri" a vitrinei — comportament (tooltip la hover, fereastră de workflow la
// click, comutator Lunar/Anual). Reproduce logica din frontend/erp-plans.html; datele
// (module, ordine, iconițe) sunt cele din MODULE_WORKFLOW-ul aplicației, iar TEXTELE vin din
// plans-i18n.js, generat din frontend/locales/*.json — nimic tradus aici.
//
// Prețurile sunt cele afișate de pagina de planuri din aplicație: Free €0/lună,
// Pro €49.00/lună sau €470.40/an (49 × 12 − 20%). Dacă se schimbă în aplicație, se schimbă și aici.
(function () {
  "use strict";

  var MODULES = [
    { id: "clients", icon: "fa-users" },
    { id: "work", icon: "fa-folder-open" },
    { id: "electricCalculator", icon: "fa-calculator" },
    { id: "materials", icon: "fa-boxes-stacked" },
    { id: "offers", icon: "fa-file-signature" },
    { id: "contracts", icon: "fa-file-contract" },
    { id: "invoices", icon: "fa-file-invoice-dollar" },
    { id: "reports", icon: "fa-chart-line" },
    { id: "jobStatus", icon: "fa-route" },
  ];

  var CHAIN = MODULES.slice();

  var BILLING = {
    month: { amount: "€49.00", periodKey: "planProPeriod", ctaKey: "planProCtaMonthly" },
    year: { amount: "€470.40", periodKey: "planProPeriodYearly", ctaKey: "planProCtaYearly" },
  };

  var grid = document.getElementById("plansGrid");
  if (!grid) return;

  function t(key) {
    var lang = document.documentElement.lang;
    var dict = (typeof translations !== "undefined" && translations[lang]) || {};
    var en = (typeof translations !== "undefined" && translations.en) || {};
    return dict[key] || en[key] || "";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(faClass) {
    var i = el("i", "fas " + faClass);
    i.setAttribute("aria-hidden", "true");
    return i;
  }

  function showsFlow(id) {
    return true;
  }

  function buildTooltip(cfg) {
    var box = el("div", "plan-tooltip");
    box.setAttribute("role", "tooltip");

    var title = el("div", "plan-tooltip-title");
    title.appendChild(icon(cfg.icon));
    title.appendChild(document.createTextNode(t("planMod_" + cfg.id)));
    box.appendChild(title);

    var desc = t("planTip_" + cfg.id);
    if (desc) box.appendChild(el("div", "plan-tooltip-desc", desc));

    if (showsFlow(cfg.id)) {
      var flow = el("div", "plan-tooltip-flow");
      CHAIN.forEach(function (m, i) {
        if (i > 0) flow.appendChild(el("span", "plan-flow-sep", "→"));
        flow.appendChild(el("span", "plan-flow-item" + (m.id === cfg.id ? " active" : ""), t("planMod_" + m.id)));
      });
      box.appendChild(flow);
    }
    return box;
  }

  function buildWindowContent(cfg) {
    var frag = document.createDocumentFragment();

    var title = el("div", "plan-window-title");
    title.appendChild(icon(cfg.icon));
    title.appendChild(document.createTextNode(t("planMod_" + cfg.id)));
    frag.appendChild(title);

    var desc = t("planTip_" + cfg.id);
    if (desc) frag.appendChild(el("div", "plan-window-desc", desc));

    if (showsFlow(cfg.id)) {
      frag.appendChild(el("div", "plan-window-timeline-label", t("planWorkflowLabel")));
      var timeline = el("div", "plan-window-timeline");
      CHAIN.forEach(function (m) {
        var step = el("div", "plan-window-step" + (m.id === cfg.id ? " active" : ""));
        step.appendChild(el("span", "plan-window-step-dot"));
        step.appendChild(el("span", "plan-window-step-label", t("planMod_" + m.id)));
        timeline.appendChild(step);
      });
      frag.appendChild(timeline);
    }
    return frag;
  }

  // Fereastra e UN singur nod, mutat în <body> — un părinte cu transform ar deveni
  // containing block pentru position:fixed și fereastra nu s-ar mai centra în viewport.
  var windowEl = null;
  function getWindow() {
    if (windowEl) return windowEl;
    windowEl = el("div", "plan-window");
    windowEl.setAttribute("role", "dialog");
    windowEl.setAttribute("aria-modal", "false");

    var close = el("button", "plan-window-close");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.appendChild(icon("fa-xmark"));
    windowEl.appendChild(close);
    windowEl.appendChild(el("div", "plan-window-body"));
    document.body.appendChild(windowEl);
    return windowEl;
  }

  function closeWindow() {
    grid.querySelectorAll(".plan-module.pinned-open").forEach(function (li) {
      li.classList.remove("pinned-open");
    });
    if (windowEl) windowEl.classList.remove("open");
  }

  function openWindow(li, cfg) {
    closeWindow();
    li.classList.add("pinned-open");
    var win = getWindow();
    var body = win.querySelector(".plan-window-body");
    body.textContent = "";
    body.appendChild(buildWindowContent(cfg));
    win.classList.add("open");
  }

  function findCfg(li) {
    var id = li.getAttribute("data-module");
    return MODULES.filter(function (m) {
      return m.id === id;
    })[0];
  }

  function renderTooltips() {
    closeWindow();
    grid.querySelectorAll(".plan-module[data-module]").forEach(function (li) {
      var cfg = findCfg(li);
      if (!cfg) return;
      var old = li.querySelector(".plan-tooltip");
      if (old) old.remove();
      li.appendChild(buildTooltip(cfg));
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".plan-window-close")) {
      closeWindow();
      return;
    }
    if (e.target.closest(".plan-window")) return;

    var li = e.target.closest("#plansGrid .plan-module[data-module]");
    if (li && !li.classList.contains("pinned-open")) {
      var cfg = findCfg(li);
      if (cfg) openWindow(li, cfg);
      return;
    }
    if (windowEl && windowEl.classList.contains("open")) closeWindow();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeWindow();
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("plan-module")) {
      e.preventDefault();
      var cfg = findCfg(e.target);
      if (cfg) openWindow(e.target, cfg);
    }
  });

  // ---- Comutator Lunar / Anual ----
  var sw = document.getElementById("billingSwitch");
  var amountEl = document.getElementById("proPlanAmount");
  var periodEl = document.getElementById("proPlanPeriod");
  var badgeEl = document.getElementById("proPlanDiscountBadge");
  var labelMonthly = document.getElementById("billingLabelMonthly");
  var labelYearly = document.getElementById("billingLabelYearly");
  var ctaEl = document.getElementById("proPlanCta");

  function applyBilling(isYearly) {
    var cfg = isYearly ? BILLING.year : BILLING.month;
    sw.setAttribute("aria-checked", String(isYearly));
    amountEl.textContent = cfg.amount;
    // data-i18n păstrează perioada corectă și după o schimbare de limbă.
    periodEl.setAttribute("data-i18n", cfg.periodKey);
    periodEl.textContent = t(cfg.periodKey);
    // Butonul Pro arată prețul perioadei alese (planProCtaMonthly/Yearly în translations.js).
    if (ctaEl) {
      ctaEl.setAttribute("data-i18n", cfg.ctaKey);
      ctaEl.textContent = t(cfg.ctaKey);
    }
    badgeEl.hidden = !isYearly;
    labelMonthly.classList.toggle("active", !isYearly);
    labelYearly.classList.toggle("active", isYearly);
  }

  if (sw && amountEl && periodEl && badgeEl && labelMonthly && labelYearly) {
    sw.addEventListener("click", function () {
      applyBilling(sw.getAttribute("aria-checked") !== "true");
    });
    labelMonthly.addEventListener("click", function () {
      applyBilling(false);
    });
    labelYearly.addEventListener("click", function () {
      applyBilling(true);
    });
  }

  // Textele tooltip-urilor se construiesc în JS (nu au data-i18n) — se refac la fiecare
  // schimbare de limbă; language-dropdown.js emite evenimentul după ce a aplicat traducerile.
  document.addEventListener("site:lang-applied", renderTooltips);
  renderTooltips();
})();
