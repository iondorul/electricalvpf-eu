// Butonul „?” (Ajutor) din antetul vitrinei — la fel ca în aplicație — cu două opțiuni:
//   • Afișare: un singur rând care arată ACȚIUNEA posibilă (pe întunecat: ☀ „Schimbă pe modul luminos",
//     pe luminos: 🌙 „Schimbă pe modul întunecat") + starea curentă, mic, dedesubt („Ecran acum: întunecat").
//   • Contact: fereastra cu email / telefon / website (aceleași date și texte ca Ajutor → Contact din aplicație).
// Tema folosește aceeași cheie ("theme") ca aplicația; implicit rămâne întunecat (scriptul din <head>).
// Fereastra Contact refolosește clasele .plan-window* (ca ferestrele „dovadă") — fără stiluri duplicate.
(function () {
  "use strict";

  var CONTACT = {
    email: "support-erp@electricalvpf.app",
    phone: "+40 732 611 124",
    website: "electricalvpf.app",
    websiteHref: "#pricing", // website-ul duce la Prețuri (pe aceeași pagină)
  };

  var root = document.documentElement;

  // Mesajul pre-scris în WhatsApp, în limba activă a site-ului.
  var WHATSAPP_TEXT = {
    ro: "Bună ziua! Sunt interesat de ElectricalVPF pentru firma mea. Aș dori mai multe detalii.",
    en: "Hello! I'm interested in ElectricalVPF for my company. I'd like to know more.",
    uk: "Добрий день! Мене цікавить ElectricalVPF для моєї компанії. Хотів би дізнатися більше.",
    tr: "Merhaba! Şirketim için ElectricalVPF ile ilgileniyorum. Daha fazla bilgi almak isterim.",
    pl: "Dzień dobry! Jestem zainteresowany ElectricalVPF dla mojej firmy. Chciałbym dowiedzieć się więcej.",
    ru: "Здравствуйте! Меня интересует ElectricalVPF для моей компании. Хотел бы узнать подробнее.",
    it: "Salve! Sono interessato a ElectricalVPF per la mia azienda. Vorrei avere più informazioni.",
    nl: "Hallo! Ik ben geïnteresseerd in ElectricalVPF voor mijn bedrijf. Ik wil graag meer weten.",
    no: "Hei! Jeg er interessert i ElectricalVPF for firmaet mitt. Jeg vil gjerne vite mer.",
    sv: "Hej! Jag är intresserad av ElectricalVPF för mitt företag. Jag vill gärna veta mer."
  };
  // Emailul deschide aplicația de email a vizitatorului, cu destinatar, subiect și același mesaj.
  function mailHref() {
    var text = WHATSAPP_TEXT[root.lang] || WHATSAPP_TEXT.en;
    return "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("ElectricalVPF") + "&body=" + encodeURIComponent(text);
  }
  // Emailul: mailto nu face nimic pe un calculator fără program de email setat (cei care
  // folosesc Gmail/Yahoo în browser). La click apare sub adresă alegerea: Gmail · Outlook ·
  // Yahoo (compunere în browser, cu subiect + mesaj) · aplicația de email · copiază adresa.
  var MAIL_LABELS = {
    ro: ["Aplicația de email", "Copiază adresa", "Adresă copiată"],
    en: ["Email app", "Copy address", "Address copied"],
    uk: ["Поштова програма", "Копіювати адресу", "Адресу скопійовано"],
    tr: ["E-posta uygulaması", "Adresi kopyala", "Adres kopyalandı"],
    pl: ["Aplikacja pocztowa", "Kopiuj adres", "Adres skopiowany"],
    ru: ["Почтовая программа", "Копировать адрес", "Адрес скопирован"],
    it: ["App di posta", "Copia indirizzo", "Indirizzo copiato"],
    nl: ["E-mailapp", "Adres kopiëren", "Adres gekopieerd"],
    no: ["E-postapp", "Kopier adresse", "Adresse kopiert"],
    sv: ["E-postapp", "Kopiera adress", "Adress kopierad"]
  };
  function mailChoices() {
    var L = MAIL_LABELS[root.lang] || MAIL_LABELS.en;
    var to = CONTACT.email, su = "ElectricalVPF", body = WHATSAPP_TEXT[root.lang] || WHATSAPP_TEXT.en;
    var enc = encodeURIComponent;
    var wrap = el("div", "help-mail-choices");
    wrap.hidden = true;
    [
      ["Gmail", "https://mail.google.com/mail/?view=cm&fs=1&to=" + enc(to) + "&su=" + enc(su) + "&body=" + enc(body)],
      ["Outlook", "https://outlook.live.com/mail/0/deeplink/compose?to=" + enc(to) + "&subject=" + enc(su) + "&body=" + enc(body)],
      ["Yahoo", "https://compose.mail.yahoo.com/?to=" + enc(to) + "&subject=" + enc(su) + "&body=" + enc(body)],
      [L[0], mailHref(), true]
    ].forEach(function (c) {
      var a = el("a", "help-mail-choice", c[0]);
      a.href = c[1];
      if (!c[2]) { a.target = "_blank"; a.rel = "noopener"; }
      wrap.appendChild(a);
    });
    var copy = el("button", "help-mail-choice help-mail-copy");
    copy.type = "button";
    copy.setAttribute("aria-label", L[1]);
    copy.title = L[1];
    copy.appendChild(icon("fa-copy"));
    copy.addEventListener("click", function () {
      var done = function () { copy.firstChild.className = "fas fa-check"; copy.title = L[2]; copy.setAttribute("aria-label", L[2]); };
      if (navigator.clipboard) navigator.clipboard.writeText(to).then(done, function () {});
    });
    wrap.appendChild(copy);
    return wrap;
  }
  function whatsappHref() {
    var text = WHATSAPP_TEXT[root.lang] || WHATSAPP_TEXT.en;
    return "https://wa.me/40732611124?text=" + encodeURIComponent(text);
  }

  function t(key) {
    var dict = (typeof translations !== "undefined" && translations[root.lang]) || {};
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
    var i = el("i", faClass.indexOf("fab ") === 0 ? faClass : "fas " + faClass);
    i.setAttribute("aria-hidden", "true");
    return i;
  }

  // ------------------------------------------------------------------ afișare (temă)
  var isDark = function () { return root.getAttribute("data-theme") !== "light"; };

  function renderThemeItems() {
    var dark = isDark();
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var iconEl = btn.querySelector("[data-theme-icon]");
      var label = btn.querySelector("[data-theme-label]");
      var state = btn.querySelector("[data-theme-state]");
      // Iconița arată modul în care TRECI (pe întunecat → soare, pe luminos → lună).
      if (iconEl) iconEl.className = "fas " + (dark ? "fa-sun" : "fa-moon");
      if (label) label.textContent = t(dark ? "themeToLight" : "themeToDark");
      if (state) state.textContent = t(dark ? "themeNowDark" : "themeNowLight");
      btn.setAttribute("aria-label", t(dark ? "themeToLight" : "themeToDark"));
    });
  }

  function toggleTheme() {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (err) { /* stocare indisponibilă */ }
    renderThemeItems();
  }

  // ------------------------------------------------------------------ fereastra Contact
  var contactWindow = null;
  var contactTrigger = null;

  function contactRow(faClass, labelKey, text, href, external) {
    var row = el("div", "help-contact-row");
    row.appendChild(icon(faClass));
    var box = el("div");
    box.appendChild(el("div", "help-contact-label", t(labelKey)));
    var a = el("a", null, text);
    a.href = href;
    if (external) { a.target = "_blank"; a.rel = "noopener"; }
    box.appendChild(a);
    row.appendChild(box);
    return row;
  }

  function buildContact() {
    var body = contactWindow.querySelector(".plan-window-body");
    body.textContent = "";
    var title = el("div", "plan-window-title");
    title.id = "helpContactTitle";
    title.appendChild(icon("fa-envelope"));
    title.appendChild(document.createTextNode(t("helpContactItem")));
    body.appendChild(title);
    body.appendChild(el("p", "plan-window-desc help-contact-intro", t("helpContactIntro")));
    var mailRow = contactRow("fa-envelope", "helpEmailLabel", CONTACT.email, mailHref());
    var choices = mailChoices();
    mailRow.lastChild.appendChild(choices);
    mailRow.querySelector("a").addEventListener("click", function (e) {
      e.preventDefault();
      choices.hidden = !choices.hidden;
    });
    body.appendChild(mailRow);
    body.appendChild(contactRow("fab fa-whatsapp", "helpPhoneLabel", CONTACT.phone, whatsappHref(), true));
    body.appendChild(contactRow("fa-globe", "helpWebsiteLabel", CONTACT.website, CONTACT.websiteHref));
  }

  function openContact(trigger) {
    if (!contactWindow) {
      contactWindow = el("div", "plan-window help-contact-window");
      contactWindow.setAttribute("role", "dialog");
      contactWindow.setAttribute("aria-labelledby", "helpContactTitle");
      var close = el("button", "plan-window-close");
      close.type = "button";
      close.setAttribute("aria-label", "Close");
      close.appendChild(icon("fa-xmark"));
      contactWindow.appendChild(close);
      contactWindow.appendChild(el("div", "plan-window-body"));
      document.body.appendChild(contactWindow);
    }
    buildContact();
    contactTrigger = trigger;
    contactWindow.classList.add("open");
    contactWindow.querySelector(".plan-window-close").focus({ preventScroll: true });
  }

  function closeContact(returnFocus) {
    if (!contactWindow || !contactWindow.classList.contains("open")) return;
    contactWindow.classList.remove("open");
    if (returnFocus && contactTrigger && contactTrigger.offsetParent !== null) contactTrigger.focus();
    contactTrigger = null;
  }

  // ------------------------------------------------------------------ dropdown-ul „?”
  var dropdown = document.getElementById("help-dropdown");
  var toggle = document.getElementById("help-dropdown-toggle");
  var menu = document.getElementById("help-dropdown-menu");

  var closeTimer = null;
  var openedByHover = false;
  var canHover = function () { return window.matchMedia("(hover: hover) and (pointer: fine)").matches; };

  function setOpen(open) {
    if (!dropdown) return;
    clearTimeout(closeTimer);
    if (open) positionMenu();
    dropdown.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    if (!open) {
      openedByHover = false;
      // Lista de limbi (acordeon) se strânge la loc, ca meniul să se redeschidă compact.
      var lang = menu.querySelector(".lang-dropdown-wrapper.is-open .lang-btn");
      if (lang) lang.click();
    }
  }

  // Același meniu (un singur exemplar în pagină) stă pe desktop în bara de navigare, iar pe mobil
  // în antet, lângă ☰ — meniul lateral rămâne doar pentru navigare. Se mută la schimbarea lățimii.
  var mobileQuery = window.matchMedia("(max-width: 1099px)");
  function placeDropdown() {
    if (!dropdown) return;
    var slot = document.getElementById(mobileQuery.matches ? "help-slot-mobile" : "help-slot-desktop");
    if (slot && dropdown.parentElement !== slot) {
      setOpen(false);
      slot.appendChild(dropdown);
    }
  }
  placeDropdown();
  if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", placeDropdown);

  // Pe mobil panoul stă fix sub antet, pe lățimea ecranului (fără să iasă din ecran).
  function positionMenu() {
    if (!mobileQuery.matches) { menu.style.top = ""; return; }
    var header = document.querySelector(".site-header");
    menu.style.top = Math.round(header.getBoundingClientRect().bottom + 8) + "px";
  }

  if (dropdown) {
    // Desktop: se deschide la hover, se închide cu o mică întârziere (poți ajunge liniștit la meniu).
    dropdown.addEventListener("mouseenter", function () {
      if (!canHover()) return;
      clearTimeout(closeTimer);
      if (!dropdown.classList.contains("is-open")) { openedByHover = true; setOpen(true); }
    });
    dropdown.addEventListener("mouseleave", function () {
      if (!canHover()) return;
      closeTimer = setTimeout(function () { setOpen(false); }, 220);
    });
    // Click (telefon, tastatură): comută. Pe desktop, primul click după hover nu-l închide imediat.
    toggle.addEventListener("click", function () {
      if (openedByHover) { openedByHover = false; return; }
      setOpen(!dropdown.classList.contains("is-open"));
    });
    document.addEventListener("mousedown", function (e) {
      if (!dropdown.contains(e.target)) setOpen(false);
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".help-contact-window .plan-window-close")) { closeContact(true); return; }
    // Website → Prețuri: fereastra se închide, pagina derulează la secțiune.
    if (e.target.closest('.help-contact-window a[href="#pricing"]')) closeContact(false);
    if (contactWindow && contactWindow.classList.contains("open") && !e.target.closest(".help-contact-window") && !e.target.closest("[data-help-contact]")) {
      closeContact(false);
    }
    var themeBtn = e.target.closest("[data-theme-toggle]");
    if (themeBtn) { toggleTheme(); return; }
    var contactBtn = e.target.closest("[data-help-contact]");
    if (contactBtn) {
      setOpen(false);
      // Din meniul de pe mobil: închidem întâi meniul lateral, ca fereastra să nu stea peste el.
      var drawer = document.getElementById("mobile-nav-drawer");
      if (drawer && drawer.classList.contains("is-open")) document.getElementById("mobile-menu-close").click();
      openContact(dropdown && dropdown.contains(contactBtn) ? toggle : contactBtn);
    }
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (contactWindow && contactWindow.classList.contains("open")) { closeContact(true); return; }
    if (dropdown && dropdown.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
  });

  // Textele construite din JS se refac la schimbarea limbii (ca tooltip-urile de module).
  document.addEventListener("site:lang-applied", function () {
    renderThemeItems();
    if (contactWindow && contactWindow.classList.contains("open")) buildContact();
  });

  renderThemeItems();
})();
