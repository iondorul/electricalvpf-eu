// Fereastra de abonare la noutăți (site-ul public, migrarea 084) — double opt-in, fără să deranjeze:
//  - apare după 30 s pe pagină SAU după ce vizitatorul a derulat jumătate din ea, cel mult o dată pe vizită;
//  - „Nu acum” / X / Esc → nu mai apare 30 de zile; nu apare abonaților confirmați (marcați de pagina de
//    confirmare), celor dezabonați, nici celor logați în aplicație;
//  - nu blochează pagina (card în colț / jos pe telefon); bifa de acord e NEBIFATĂ și obligatorie;
//  - abonarea devine activă doar după linkul din emailul de confirmare.
// Faza 1: doar paginile în română și engleză (decizie PO, 21 oct 2026).
(function () {
  const LANGS = ["en", "ro"];
  const DELAY_MS = 30000;
  const SNOOZE_MS = 30 * 24 * 3600 * 1000;
  const KEY_STATE = "evpf-newsletter";            // "subscribed" | "unsubscribed" — permanent
  const KEY_SNOOZE = "evpf-newsletter-snooze";    // momentul refuzului / al ultimei cereri
  const KEY_SHOWN = "evpf-newsletter-shown";      // sessionStorage: o singură apariție pe vizită

  const lang = document.documentElement.lang;
  if (!LANGS.includes(lang)) return;
  // Doar pe electricalvpf.app (și local): API-ul acceptă cereri doar de aici (CORS) — nu pe vitrina veche .eu.
  if (!/(^|\.)electricalvpf\.app$|^localhost$|^127\.0\.0\.1$/.test(location.hostname)) return;
  const get = (store, key) => { try { return window[store].getItem(key); } catch (e) { return null; } };
  const set = (store, key, value) => { try { window[store].setItem(key, value); } catch (e) { /* stocare indisponibilă */ } };
  if (get("localStorage", KEY_STATE)) return;
  const snoozed = Number(get("localStorage", KEY_SNOOZE) || 0);
  if (snoozed && Date.now() - snoozed < SNOOZE_MS) return;
  if (get("sessionStorage", KEY_SHOWN)) return;
  if (window.AuthSession && typeof AuthSession.hasToken === "function" && AuthSession.hasToken()) return;

  const L = (key) => {
    const l = document.documentElement.lang;
    const dict = (typeof translations !== "undefined" && (translations[l] || translations.en)) || {};
    return dict[key] || (translations.en && translations.en[key]) || "";
  };
  let card = null;

  function snooze() { set("localStorage", KEY_SNOOZE, String(Date.now())); }
  function close() {
    if (!card) return;
    card.classList.remove("is-open");
    const el = card;
    card = null;
    setTimeout(() => el.remove(), 250);
    document.removeEventListener("keydown", onKey);
  }
  function onKey(event) { if (event.key === "Escape") { snooze(); close(); } }

  function build() {
    const suffix = lang === "ro" ? "" : "-" + lang;
    card = document.createElement("section");
    card.className = "nl-popup";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-labelledby", "nlPopupTitle");
    card.innerHTML = `
      <button type="button" class="nl-close" aria-label=""><i class="fas fa-xmark" aria-hidden="true"></i></button>
      <h2 id="nlPopupTitle" class="nl-title"></h2>
      <p class="nl-text"></p>
      <form class="nl-form" novalidate>
        <input type="email" name="email" class="nl-email" maxlength="254" autocomplete="email" required>
        <div class="nl-hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>
        <label class="nl-consent"><input type="checkbox" name="consent"><span></span></label>
        <div class="nl-message" role="status" aria-live="polite"></div>
        <div class="nl-actions">
          <button type="submit" class="btn-primary nl-subscribe"></button>
          <button type="button" class="nl-later"></button>
        </div>
      </form>
      <p class="nl-sender"><span></span> <a class="nl-privacy" href="https://electricalvpf.app/frontend/legal/privacy${suffix}.html?returnSite=eu#newsletter"></a></p>`;
    const $ = (sel) => card.querySelector(sel);
    $(".nl-close").setAttribute("aria-label", L("newsletter.close"));
    $(".nl-title").textContent = L("newsletter.title");
    $(".nl-text").textContent = L("newsletter.text");
    $(".nl-email").setAttribute("placeholder", L("newsletter.email"));
    $(".nl-email").setAttribute("aria-label", L("newsletter.email"));
    $(".nl-consent span").textContent = L("newsletter.consent");
    $(".nl-subscribe").textContent = L("newsletter.subscribe");
    $(".nl-later").textContent = L("newsletter.notNow");
    $(".nl-sender span").textContent = L("newsletter.sender");
    $(".nl-privacy").textContent = L("newsletter.privacy");

    const dismiss = () => { snooze(); close(); };
    $(".nl-close").addEventListener("click", dismiss);
    $(".nl-later").addEventListener("click", dismiss);
    document.addEventListener("keydown", onKey);

    // Succes: formularul dispare și locul lui îl ia un mesaj limpede — bifă, „Verifică-ți emailul”,
    // adresa la care a plecat linkul, ce are de făcut și unde să caute dacă nu-l vede. Omul știe exact unde e.
    function showDone(email) {
      card.classList.add("is-done");
      $(".nl-form").remove();
      $(".nl-text").remove();
      $(".nl-sender").remove();
      const title = $(".nl-title");
      title.innerHTML = '<i class="fas fa-circle-check nl-done-icon" aria-hidden="true"></i> ';
      title.appendChild(document.createTextNode(L("newsletter.doneTitle")));
      const sent = document.createElement("p");
      sent.className = "nl-done-sent";
      const [before, after] = L("newsletter.doneSent").split("{email}");
      const strong = document.createElement("strong");
      strong.textContent = email;
      sent.append(before || "", strong, after || "");
      const next = document.createElement("p");
      next.className = "nl-text";
      next.textContent = L("newsletter.doneNext");
      const spam = document.createElement("p");
      spam.className = "nl-done-spam";
      spam.textContent = L("newsletter.doneSpam");
      const ok = document.createElement("button");
      ok.type = "button";
      ok.className = "btn-primary nl-subscribe nl-done-close";
      ok.textContent = L("newsletter.doneClose");
      ok.addEventListener("click", close);
      card.append(sent, next, spam, ok);
      card.setAttribute("aria-live", "polite");
      ok.focus();
    }

    const form = $(".nl-form");
    const message = $(".nl-message");
    const consent = $(".nl-consent");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $(".nl-subscribe");
      if (button.disabled) return;
      const email = form.elements.email.value.trim();
      message.className = "nl-message";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.textContent = L("newsletter.errorEmail");
        message.classList.add("is-error");
        form.elements.email.focus();
        return;
      }
      if (!form.elements.consent.checked) {
        // Niciun buton mort: bifa necesară clipește, iar mesajul spune de ce.
        message.textContent = L("newsletter.consentRequired");
        message.classList.add("is-error");
        consent.classList.remove("is-pulsing");
        void consent.offsetWidth;
        consent.classList.add("is-pulsing");
        return;
      }
      button.disabled = true;
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/newsletter/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, consent: true, language: document.documentElement.lang, website: form.elements.website.value }),
        });
        const body = await response.json().catch(() => ({}));
        if (response.ok) {
          snooze();
          showDone(email);
        } else {
          message.textContent = L(body.code === "NEWSLETTER_INVALID_EMAIL" ? "newsletter.errorEmail"
            : body.code === "TOO_MANY_REQUESTS" ? "newsletter.errorTooMany" : "newsletter.errorGeneric");
          message.classList.add("is-error");
        }
      } catch (error) {
        message.textContent = L("newsletter.errorGeneric");
        message.classList.add("is-error");
      } finally {
        button.disabled = false;
      }
    });

    document.body.appendChild(card);
    requestAnimationFrame(() => card && card.classList.add("is-open"));
  }

  let shown = false;
  function show() {
    if (shown) return;
    shown = true;
    window.removeEventListener("scroll", onScroll);
    clearTimeout(timer);
    // Nu peste o altă fereastră deschisă de vizitator (ex. o „dovadă”, Contactul din meniul „?”).
    // Doar ferestrele vizibile cu adevărat: unele stau în DOM închise, în interiorul unui strat ascuns.
    const visible = (el) => el.getClientRects().length > 0
      && (typeof el.checkVisibility !== "function" || el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
    if ([...document.querySelectorAll(".plan-window.is-open, .plan-window[open], [role='dialog'][aria-modal='true']:not([hidden])")].some(visible)) {
      shown = false;
      timer = setTimeout(show, 15000);
      return;
    }
    set("sessionStorage", KEY_SHOWN, "1");
    build();
  }
  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable > 0 && window.scrollY / scrollable >= 0.5) show();
  }
  let timer = setTimeout(show, DELAY_MS);
  window.addEventListener("scroll", onScroll, { passive: true });
})();
