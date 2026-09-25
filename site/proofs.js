// „Dovadă la click" pentru bara de încredere a vitrinei (Profesional · Securizat · În cloud · Accesibil de oriunde ·
// Creat pentru firme…). Fiecare cuvânt deschide o fereastră scurtă cu fapte verificabile și, la final, „Începe gratuit".
//
// Aceeași fereastră ca la modulele din Planuri (clasele .plan-window* din plans.css) — nu se duplică stiluri.
// Textele vin din proofs-i18n.js (scrise de mână, 10 limbi, generat de site/tools/build-proofs-i18n.js);
// titlurile și numele modulelor din translations.js / plans-i18n.js (din aplicație).
//
// Regulă: fiecare afirmație de aici trebuie să fie adevărată în aplicație/documentele legale — vezi comentariul
// din site/tools/build-proofs-i18n.js (ce s-a verificat și ce NU se promite: disponibilitate 24/7, „rambursare oricând",
// „toate datele" în export, regiunea Render).
(function () {
  "use strict";

  var PROOFS = {
    pro: {
      titleKey: "professional",
      icon: "fa-screwdriver-wrench",
      // Vocea: simplă, a electricianului — independență și control asupra informațiilor firmei; fără atac la nimeni și fără
      // promisiuni false (NU „nu ai nevoie de contabil": aplicația nu are integrare fiscală).
      lead: "proof_lead",
      paras: ["proof_para"],
      bullets: ["proof_b1", "proof_b2", "proof_b3", "proof_b5"],
      closing: "proof_close",
    },
    sec: {
      titleKey: "secure",
      icon: "fa-shield-halved",
      bullets: ["proof_s1", "proof_s2", "proof_s3", "proof_s4", "proof_s5"],
      links: [["terms", "legalTerms"], ["privacy", "legalPrivacy"]],
    },
    cloud: {
      titleKey: "cloudBased",
      icon: "fa-cloud",
      bullets: ["proof_c1", "proof_c2", "proof_c3"],
    },
    acc: {
      titleKey: "accessibleAnywhere",
      icon: "fa-globe",
      bullets: ["proof_a1", "proof_a2"],
    },
    for: {
      titleKey: "builtForElectricalBusinesses",
      icon: "fa-bolt",
      bullets: ["proof_f1", "proof_f2", "proof_f3"],
      links: [["refund-policy", "legalRefund"]],
    },
    // Secțiunea „Biroul firmei tale, în buzunar" — butonul are data-proof="phone" (nu e în bara de încredere).
    phone: {
      titleKey: "phone_pt",
      icon: "fa-mobile-screen-button",
      // [tip, cheie]: "no" = ce NU mai faci, "yes" = ce primești
      marks: [
        ["no", "phone_n1"], ["no", "phone_n2"], ["no", "phone_n3"], ["no", "phone_n4"],
        ["yes", "phone_y1"], ["yes", "phone_y2"], ["yes", "phone_y3"],
      ],
      // Aplicația este online; nota explică explicit această limită.
      closing: "phone_end",
    },
  };

  var REGISTER_URL = "https://electricalvpf.app/frontend/register.html?returnSite=eu";

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

  // Linkurile legale au un fișier separat per limbă (terms.html = română, terms-en.html etc.).
  function legalHref(slug) {
    var lang = document.documentElement.lang;
    return "https://electricalvpf.app/frontend/legal/" + slug + (!lang || lang === "ro" ? "" : "-" + lang) + ".html";
  }

  var windowEl = null;
  var openKey = null;
  var lastTrigger = null;

  function getWindow() {
    if (windowEl) return windowEl;
    windowEl = el("div", "plan-window proof-window");
    windowEl.setAttribute("role", "dialog");
    windowEl.setAttribute("aria-modal", "false");
    windowEl.setAttribute("aria-labelledby", "proofWindowTitle");

    var close = el("button", "plan-window-close");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.appendChild(icon("fa-xmark"));
    windowEl.appendChild(close);
    windowEl.appendChild(el("div", "plan-window-body"));
    document.body.appendChild(windowEl);
    return windowEl;
  }

  function buildContent(cfg) {
    var frag = document.createDocumentFragment();

    var title = el("div", "plan-window-title");
    title.id = "proofWindowTitle";
    title.appendChild(icon(cfg.icon));
    title.appendChild(document.createTextNode(t(cfg.titleKey)));
    frag.appendChild(title);

    if (cfg.lead) frag.appendChild(el("p", "proof-lead", t(cfg.lead)));

    (cfg.paras || []).forEach(function (key) {
      frag.appendChild(el("p", "plan-window-desc proof-para", t(key)));
    });

    if (cfg.bullets) {
      var ul = el("ul", "proof-list");
      cfg.bullets.forEach(function (key) {
        ul.appendChild(el("li", null, t(key)));
      });
      frag.appendChild(ul);
    }

    if (cfg.marks) {
      var marks = el("ul", "proof-list proof-marks");
      cfg.marks.forEach(function (pair) {
        var li = el("li", pair[0]);
        li.appendChild(icon(pair[0] === "yes" ? "fa-check" : "fa-xmark"));
        li.appendChild(el("span", null, t(pair[1])));
        marks.appendChild(li);
      });
      frag.appendChild(marks);
    }

    if (cfg.note) frag.appendChild(el("p", "proof-note", t(cfg.note)));

    if (cfg.closing) frag.appendChild(el("p", "proof-close", t(cfg.closing)));

    if (cfg.links) {
      var links = el("div", "proof-links");
      cfg.links.forEach(function (pair) {
        var a = el("a", null, t(pair[1]));
        a.href = legalHref(pair[0]);
        a.target = "_blank";
        a.rel = "noopener";
        links.appendChild(a);
      });
      frag.appendChild(links);
    }

    // Scopul vitrinei: în ~30 de secunde omul înțelege ce rezolvă și are încredere să înceapă.
    var cta = el("a", "proof-cta", t("startFree"));
    cta.href = REGISTER_URL;
    frag.appendChild(cta);
    return frag;
  }

  function closeProof(returnFocus) {
    if (!windowEl) return;
    windowEl.classList.remove("open");
    document.querySelectorAll("[data-proof][aria-expanded='true']").forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
    });
    var trigger = lastTrigger;
    openKey = null;
    lastTrigger = null;
    if (returnFocus && trigger) trigger.focus();
  }

  function openProof(key, trigger) {
    var cfg = PROOFS[key];
    if (!cfg) return;
    closeProof(false);
    var win = getWindow();
    var body = win.querySelector(".plan-window-body");
    body.textContent = "";
    body.appendChild(buildContent(cfg));
    win.classList.add("open");
    openKey = key;
    lastTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    win.querySelector(".plan-window-close").focus({ preventScroll: true });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".proof-window .plan-window-close")) {
      closeProof(true);
      return;
    }
    if (e.target.closest(".proof-window")) return;

    var trigger = e.target.closest("[data-proof]");
    if (trigger) {
      var key = trigger.getAttribute("data-proof");
      if (openKey === key) closeProof(true);
      else openProof(key, trigger);
      return;
    }
    if (openKey) closeProof(false);
    // Captură (true): selectorul de limbă din antet oprește propagarea click-ului (stopPropagation), iar fereastra
    // ar rămâne deschisă deasupra meniului lui. În faza de captură handler-ul rulează ÎNAINTEA oricărui stopPropagation.
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openKey) closeProof(true);
  });

  // Textul ferestrei e construit la deschidere, în limba curentă — la schimbarea limbii se închide (altfel ar rămâne vechi).
  document.addEventListener("site:lang-applied", function () {
    if (openKey) closeProof(false);
  });
})();
