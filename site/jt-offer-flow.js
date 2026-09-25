/* Public JT Calculator → ERP offer continuation.  This is loaded both on the
 * public page and on the Offers hub, because quotes.html is a redirected tab
 * source rather than a standalone runtime page. */
(function (global) {
  "use strict";
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const api = (path) => `${CONFIG.API_BASE_URL}${path}`;
  const frontendUrl = (page) => window.location.pathname.includes("/frontend/") ? page : `https://electricalvpf.app/frontend/${page}`;

  // În aplicație: t() din i18n.js (frontend/locales/*.json). Pe vitrină (fără
  // t()): dicționarul plat `translations`, în care site/plans-i18n.js copiază
  // aceleași chei jtOffer.* din frontend/locales (site/tools/sync-plans-i18n.js).
  function siteText(key) {
    if (typeof translations === "undefined") return undefined;
    const dict = translations[document.documentElement.lang];
    return (dict && dict[key]) || (translations.en && translations.en[key]);
  }
  function translate(key, fallback, vars) {
    if (typeof global.t === "function") return global.t(key, fallback, vars);
    const value = siteText(key) || fallback;
    return vars ? value.replace(/\{\{(\w+)\}\}/g, (match, name) => (name in vars ? vars[name] : match)) : value;
  }
  const text = (key, fallback, vars) => escapeHtml(translate(key, fallback, vars));
  const closeButton = () => `<button class="jt-offer-close" data-jt-close aria-label="${text("common.close", "Close")}">×</button>`;

  // Aceeași corespondență ca quoteStatusLabelPlain() din quotes.js.
  function quoteStatusLabel(status) {
    const keys = { draft: "estimating.status.draft", sent: "quotes.status.sent", approved: "quotes.status.approved", rejected: "quotes.status.rejected", expired: "quotes.status.expired", canceled: "quotes.status.canceled" };
    return keys[status] ? translate(keys[status], status) : status;
  }

  let activeCalculation = null;

  function close() { document.querySelector(".jt-offer-backdrop")?.remove(); }
  function panel(content) {
    close();
    const backdrop = document.createElement("div");
    backdrop.className = "jt-offer-backdrop";
    backdrop.innerHTML = `<section class="jt-offer-panel" role="dialog" aria-modal="true" aria-label="${text("jtOffer.dialogLabel", "Calculation in a quote")}">${content}</section>`;
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
    document.body.append(backdrop);
    backdrop.querySelectorAll("[data-jt-close]").forEach((button) => button.addEventListener("click", close));
    return backdrop;
  }

  function authChoice() {
    const root = panel(`${closeButton()}<span class="jt-offer-kicker">${text("jtOffer.kickerJt", "QUICK CABLE CALCULATOR")}</span><h3>${text("jtOffer.authTitle", "Turn the calculation into a quote")}</h3><p>${text("jtOffer.authText", "Your calculation is ready. We keep it until you choose the right quote.")}</p><ul class="jt-offer-benefits"><li>${text("jtOffer.benefitKept", "The calculation stays saved")}</li><li>${text("jtOffer.benefitAttach", "Attach it to the client and the work")}</li><li>${text("jtOffer.benefitUse", "Use it directly in the quote")}</li></ul><a class="jt-offer-primary" href="https://electricalvpf.app/frontend/register.html?returnSite=eu&return=jt-offer">${text("jtOffer.createAccount", "Create a free account")}</a><a class="jt-offer-secondary" href="https://electricalvpf.app/frontend/login.html?returnSite=eu&return=jt-offer">${text("jtOffer.haveAccount", "I already have an account")}</a>`);
    return root;
  }

  async function hasSession() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try { return (await fetch(api("/auth/me"), { headers: { Authorization: `Bearer ${token}` } })).ok; }
    catch (_) { return false; }
  }

  async function attach(quoteId, quoteNumber) {
    const calculation = activeCalculation;
    if (!calculation) return;
    const active = document.querySelector(".jt-offer-panel");
    active?.classList.add("is-busy");
    try {
      const response = await fetch(api(`/quotes/${quoteId}/calculations`), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({
          calculation_source: calculation.source,
          calculation_version: calculation.version,
          input_data: calculation.input,
          result_data: calculation.result,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.code === "CALCULATION_SAVE_LIMIT_REACHED" || payload.error === "CALCULATION_SAVE_LIMIT_REACHED") {
          active?.classList.remove("is-busy");
          // activeCalculation rămâne intenționat intact: utilizatorul poate
          // închide popup-ul și continuă cu exact calculul curent.
          panel(`${closeButton()}<span class="jt-offer-kicker">FREE</span><h3>${text("electricCalculator.saveLimit.title", "Keep your calculations")}</h3><p>${text("electricCalculator.saveLimit.message", "You've reached the Free plan limit of 10 saved calculations. Your current calculation is still here. Upgrade to Pro to save it and keep an unlimited calculation history.")}</p><a class="jt-offer-primary" href="${frontendUrl("erp-plans.html")}">${text("electricCalculator.saveLimit.upgrade", "Upgrade to Pro")}</a><button class="jt-offer-secondary" data-jt-close>${text("electricCalculator.saveLimit.continue", "Continue without saving")}</button>`);
          return;
        }
        throw new Error("attach failed");
      }
      if (payload.success === false) throw new Error("attach failed");
      // Abia acum, după confirmarea API-ului, calculul transportat e consumat.
      calculation.onSaved?.();
      const number = quoteNumber || translate("jtOffer.selectedQuote", "The selected quote");
      panel(`${closeButton()}<span class="jt-offer-kicker">${text(calculation.kickerKey, "ELECTRIC CALCULATOR")}</span><h3>${text("jtOffer.savedTitle", "Calculation saved to the quote")}</h3><p>${text(calculation.savedKey, "{{number}} now contains the calculation.", { number })}</p><a class="jt-offer-primary" href="${frontendUrl("offers.html")}?jt-open=${encodeURIComponent(quoteId)}#quotes">${text("jtOffer.openQuote", "Open the quote")}</a><button class="jt-offer-secondary" data-jt-close>${text("jtOffer.stayHere", "Stay here")}</button>`);
    } catch (_) {
      active?.classList.remove("is-busy");
      const error = active?.querySelector(".jt-offer-error");
      if (error) error.hidden = false;
    }
  }

  // "Șterge acest calcul în așteptare" = renunță DOAR la calculul transportat
  // din Calculatorul public (cheia din JTPendingCalculation). Nu atinge nicio
  // ofertă și niciun calcul deja salvat în ERP — nu face niciun request către API.
  function deleteControls() {
    const label = text("jtOffer.delete", "Delete this pending calculation");
    return `<div class="jt-offer-delete-area"><button type="button" class="jt-offer-delete" data-jt-delete><i class="fas fa-trash-can" aria-hidden="true"></i> ${label}</button><div class="jt-offer-delete-confirm" role="alertdialog" aria-labelledby="jtOfferDeleteQuestion" hidden><p id="jtOfferDeleteQuestion">${text("jtOffer.deleteConfirm", "Delete this pending calculation?")}</p><div class="jt-offer-delete-actions"><button type="button" class="jt-offer-secondary" data-jt-delete-cancel>${text("common.cancel", "Cancel")}</button><button type="button" class="jt-offer-delete" data-jt-delete-confirm>${label}</button></div></div></div>`;
  }

  function bindDelete(root) {
    const trigger = root.querySelector("[data-jt-delete]");
    const confirmBox = root.querySelector(".jt-offer-delete-confirm");
    if (!trigger || !confirmBox) return;
    trigger.addEventListener("click", () => {
      trigger.hidden = true;
      confirmBox.hidden = false;
      confirmBox.querySelector("[data-jt-delete-cancel]").focus();
    });
    confirmBox.querySelector("[data-jt-delete-cancel]").addEventListener("click", () => {
      confirmBox.hidden = true;
      trigger.hidden = false;
      trigger.focus();
    });
    confirmBox.querySelector("[data-jt-delete-confirm]").addEventListener("click", () => {
      global.JTPendingCalculation?.discard(activeCalculation?.pendingCreatedAt);
      activeCalculation = null;
      close();
    });
  }

  async function selector() {
    if (!activeCalculation) return;
    const active = panel(`${closeButton()}<span class="jt-offer-kicker">${text(activeCalculation.kickerKey, "ELECTRIC CALCULATOR")}</span><h3>${text("jtOffer.selectTitle", "Where do you want to save the calculation?")}</h3><p>${text("jtOffer.selectText", "Choose an existing quote or create a new one through the normal flow.")}</p><div class="jt-offer-list"><span>${text("jtOffer.loadingQuotes", "Loading quotes…")}</span></div><p class="jt-offer-error" hidden>${text("jtOffer.saveError", "The calculation could not be saved. It is still available and you can try again.")}</p><a class="jt-offer-secondary" href="${frontendUrl("customers.html")}#clients">${text("jtOffer.createNew", "+ Create new quote")}</a>${activeCalculation.pendingCreatedAt ? deleteControls() : ""}`);
    bindDelete(active);
    try {
      const response = await fetch(api("/quotes?page=1&limit=50"), { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error("quotes unavailable");
      const list = active.querySelector(".jt-offer-list");
      const quotes = data.data || [];
      const selectHere = text("jtOffer.selectHere", "Select / Save here");
      const noWork = translate("jtOffer.noWork", "No work");
      list.innerHTML = quotes.length ? quotes.map((quote) => `<button class="jt-offer-quote" data-id="${Number(quote.id)}" data-number="${escapeHtml(quote.quote_number)}"><strong>${escapeHtml(quote.quote_number)}</strong><span>${escapeHtml(quote.client_name || "—")} · ${escapeHtml(quote.work_name || noWork)}</span><em>${escapeHtml(quoteStatusLabel(quote.status))}</em><b>${selectHere}</b></button>`).join("") : `<span>${text("jtOffer.noQuotes", "You don't have any active quotes yet.")}</span>`;
      list.querySelectorAll(".jt-offer-quote").forEach((button) => button.addEventListener("click", () => attach(button.dataset.id, button.dataset.number)));
    } catch (_) {
      active.querySelector(".jt-offer-list").innerHTML = `<span>${text("jtOffer.quotesLoadFailed", "We couldn't load your quotes. The calculation is still saved.")}</span>`;
    }
  }

  function fromPending(pending) {
    return {
      source: "PublicQuick",
      version: `jt-${pending.version}`,
      input: pending.input,
      result: pending.result,
      kickerKey: "jtOffer.kickerJt",
      savedKey: "jtOffer.savedJt",
      pendingCreatedAt: pending.createdAt,
      onSaved: () => global.JTPendingCalculation.discard(pending.createdAt),
    };
  }

  global.JTOfferFlow = {
    async start() {
      const pending = global.JTPendingCalculation?.get();
      if (!pending) return;
      activeCalculation = fromPending(pending);
      if (await hasSession()) return selector();
      authChoice();
    },
    resume() {
      const pending = global.JTPendingCalculation?.get();
      if (!pending) return;
      activeCalculation = fromPending(pending);
      selector();
    },
    saveAuthenticated(calculation) {
      activeCalculation = calculation;
      selector();
    },
  };

  document.addEventListener("erp:hub-tab-ready", (event) => {
    if (event.detail?.tab === "quotes" && global.JTPendingCalculation?.has()) global.JTOfferFlow.resume();
  });
})(window);
