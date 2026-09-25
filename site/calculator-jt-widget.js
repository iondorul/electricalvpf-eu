import { computeIb, findSmallestValidSection } from "../frontend/js/calculator-core.js";

const form = document.querySelector("#calculator-tool form");
const out = document.querySelector("#calcWidgetResult");
const technicalCopy = document.querySelector("#calcTechnicalCopy");
let latestCalculation = null;

function message(key, fallback) {
  const dictionaries = typeof translations !== "undefined" ? translations : null;
  const dict = dictionaries && dictionaries[document.documentElement.lang];
  return (dict && dict[key]) || (dictionaries && dictionaries.en && dictionaries.en[key]) || fallback;
}

function resultRow(label, value, status = "") {
  return `<div class="calc-result-row${status ? ` calc-result-row-${status}` : ""}"><span>${label}</span><strong>${value}</strong></div>`;
}

function apiUrl(path) { return `${CONFIG.API_BASE_URL}${path}`; }
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function authenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const response = await fetch(apiUrl("/auth/me"), { headers: { Authorization: `Bearer ${token}` } });
    return response.ok;
  } catch (_) { return false; }
}

function closeSavePanel() { document.querySelector(".jt-save-backdrop")?.remove(); }
function showSavePanel(content) {
  closeSavePanel();
  const backdrop = document.createElement("div");
  backdrop.className = "jt-save-backdrop";
  backdrop.innerHTML = `<section class="jt-save-panel" role="dialog" aria-modal="true" aria-label="Salvează calculul în ofertă">${content}</section>`;
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeSavePanel(); });
  document.body.append(backdrop);
  backdrop.querySelectorAll("[data-jt-close]").forEach((button) => button.addEventListener("click", closeSavePanel));
  return backdrop;
}

async function attachToQuote(quoteId, quoteNumber) {
  const pending = JTPendingCalculation.get();
  if (!pending) return;
  const panel = document.querySelector(".jt-save-panel");
  panel?.classList.add("is-busy");
  try {
    const response = await fetch(apiUrl(`/quotes/${quoteId}/calculations`), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ calculation_source: "PublicQuick", calculation_version: `jt-${pending.version}`, input_data: pending.input, result_data: pending.result }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (payload.code === "CALCULATION_SAVE_LIMIT_REACHED" || payload.error === "CALCULATION_SAVE_LIMIT_REACHED") {
        panel?.classList.remove("is-busy");
        // JTPendingCalculation nu este șters: calculul curent rămâne disponibil.
        showSavePanel(`<button class="jt-save-close" data-jt-close aria-label="Close">×</button><span class="jt-save-kicker">FREE</span><h3>Keep your calculations</h3><p>You've reached the Free plan limit of 10 saved calculations. Your current calculation is still here. Upgrade to Pro to save it and keep an unlimited calculation history.</p><a class="jt-save-primary" href="https://electricalvpf.app/frontend/erp-plans.html">Upgrade to Pro</a><button class="jt-save-secondary" data-jt-close>Continue without saving</button>`);
        return;
      }
      throw new Error("attach failed");
    }
    JTPendingCalculation.clear();
    showSavePanel(`<button class="jt-save-close" data-jt-close aria-label="Închide">×</button><span class="jt-save-kicker">CALCULATOR JT</span><h3>Calcul salvat în ofertă</h3><p>${escapeHtml(quoteNumber || "Oferta selectată")} conține acum calculul JT.</p><a class="jt-save-primary" href="https://electricalvpf.app/frontend/quotes.html?jt-open=${encodeURIComponent(quoteId)}">Deschide oferta</a><button class="jt-save-secondary" data-jt-close>Rămâi la calculator</button>`);
  } catch (_) {
    panel?.classList.remove("is-busy");
    const error = panel?.querySelector(".jt-save-error");
    if (error) error.hidden = false;
  }
}

async function openQuoteSelector() {
  const panel = showSavePanel(`<button class="jt-save-close" data-jt-close aria-label="Închide">×</button><span class="jt-save-kicker">CALCULATOR JT</span><h3>Unde vrei să salvezi calculul?</h3><p class="jt-save-copy">Alege o ofertă existentă sau continuă fluxul normal pentru una nouă.</p><div class="jt-save-list"><span class="jt-save-loading">Se încarcă ofertele…</span></div><p class="jt-save-error" hidden>Calculul nu a putut fi salvat. Rămâne disponibil și poți reîncerca.</p><button class="jt-save-secondary" data-jt-new>+ Creează ofertă nouă</button>`);
  panel.querySelector("[data-jt-new]").addEventListener("click", () => { window.location.href = "https://electricalvpf.app/frontend/clients.html?jt-pending=1"; });
  try {
    const response = await fetch(apiUrl("/quotes?page=1&limit=50"), { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error("quotes unavailable");
    const list = panel.querySelector(".jt-save-list");
    const quotes = data.data || [];
    list.innerHTML = quotes.length ? quotes.map((quote) => `<button class="jt-save-quote" data-id="${Number(quote.id)}" data-number="${escapeHtml(quote.quote_number)}"><strong>${escapeHtml(quote.quote_number)}</strong><span>${escapeHtml(quote.client_name || "—")} · ${escapeHtml(quote.work_name || "Fără lucrare")}</span><em>${escapeHtml(quote.status)}</em></button>`).join("") : "<span class=\"jt-save-empty\">Nu ai încă oferte active.</span>";
    list.querySelectorAll(".jt-save-quote").forEach((button) => button.addEventListener("click", () => attachToQuote(button.dataset.id, button.dataset.number)));
  } catch (_) {
    panel.querySelector(".jt-save-list").innerHTML = "<span class=\"jt-save-empty\">Nu am putut încărca ofertele. Încearcă din nou.</span>";
  }
}

async function saveCalculation() {
  if (!latestCalculation) return;
  JTPendingCalculation.save(latestCalculation);
  JTOfferFlow.start();
}

function renderTechnicalDetails() {
  if (!technicalCopy) return;
  technicalCopy.innerHTML = message("calcTechnicalHtml", "");
}

renderTechnicalDetails();
document.addEventListener("site:lang-applied", renderTechnicalDetails);

const validation = {
  power: "Puterea trebuie să fie între 0,1 și 10 kW.",
  length: "Lungimea trebuie să fie mai mare decât 0 m.",
  voltage: "Selectează alimentarea 230 V sau 400 V.",
};

// `form.elements.length` este numărul controalelor, nu inputul name="length".
// namedItem() evită această coliziune cu proprietatea nativă a colecției.
function getCalculatorField(fieldName) {
  return form?.elements.namedItem(fieldName);
}

function setFieldError(fieldName, text = "") {
  const field = getCalculatorField(fieldName);
  const error = document.getElementById(`calc${fieldName[0].toUpperCase()}${fieldName.slice(1)}Error`);
  if (!field || !error) return;
  const invalid = Boolean(text);
  field.classList.toggle("is-invalid", invalid);
  field.setAttribute("aria-invalid", String(invalid));
  error.textContent = text;
}

function clearFieldError(fieldName) { setFieldError(fieldName); }

function clearPreviousResult() {
  latestCalculation = null;
  out.innerHTML = "";
  out.classList.remove("is-visible");
}

function validateCalculatorInputs() {
  const powerRaw = getCalculatorField("power").value.trim();
  const lengthRaw = getCalculatorField("length").value.trim();
  const powerKw = Number(powerRaw);
  const lengthM = Number(lengthRaw);
  const voltage = Number(getCalculatorField("voltage").value);
  let valid = true;

  if (!powerRaw || !Number.isFinite(powerKw) || powerKw < 0.1 || powerKw > 10) {
    setFieldError("power", validation.power);
    valid = false;
  } else clearFieldError("power");

  if (!lengthRaw || !Number.isFinite(lengthM) || lengthM <= 0) {
    setFieldError("length", validation.length);
    valid = false;
  } else clearFieldError("length");

  if (voltage !== 230 && voltage !== 400) {
    setFieldError("voltage", validation.voltage);
    valid = false;
  } else clearFieldError("voltage");

  return { valid, powerKw, lengthM, voltage };
}

function validateFieldWhileEditing(fieldName) {
  const raw = getCalculatorField(fieldName).value.trim();
  const value = Number(raw);
  const invalid = fieldName === "power"
    ? !raw || !Number.isFinite(value) || value < 0.1 || value > 10
    : !raw || !Number.isFinite(value) || value <= 0;
  setFieldError(fieldName, invalid ? validation[fieldName] : "");
}

["power", "length"].forEach((fieldName) => {
  getCalculatorField(fieldName)?.addEventListener("input", () => validateFieldWhileEditing(fieldName));
});
getCalculatorField("voltage")?.addEventListener("change", () => {
  const valid = Number(getCalculatorField("voltage").value) === 230 || Number(getCalculatorField("voltage").value) === 400;
  setFieldError("voltage", valid ? "" : validation.voltage);
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const { valid, powerKw, lengthM, voltage } = validateCalculatorInputs();
  if (!valid) {
    clearPreviousResult();
    return;
  }

  const isThreePhase = voltage === 400;
  const cosPhi = isThreePhase ? 0.9 : 1;
  const category = isThreePhase
    ? { phases: 3, voltage: 400, voltageDropLimitPct: 5 }
    : { phases: 1, voltage: 230, voltageDropLimitPct: 5 };
  const ib = computeIb(powerKw, category, cosPhi);
  const result = findSmallestValidSection("B2", lengthM, ib, category, null, cosPhi);

  if (!result) {
    out.textContent = message("calcNoResult", "No suitable standard section was found for these simplified assumptions.");
    out.classList.add("is-visible");
    return;
  }

  const cable = `${isThreePhase ? 5 : 3}×${result.section} mm² Cu`;
  const protection = `${isThreePhase ? "C" : "B"}${result.breaker}`;
  out.innerHTML = [
    resultRow(message("calcResultCable", "Recommended cable"), cable, "primary"),
    resultRow(message("calcResultProtection", "Nominal protection"), protection),
    resultRow(message("calcResultVoltageDrop", "Voltage drop"), `${result.voltageDropPct.toFixed(1)}% <em>✓ ${message("calcResultOk", "OK")}</em>`, "ok"),
    resultRow(message("calcResultCurrent", "Calculation current (Ib)"), `${ib.toFixed(1)} A`),
    resultRow(message("calcResultCapacity", "Cable capacity (Iz)"), `${result.iz.toFixed(0)} A`),
  ].join("");
  latestCalculation = {
    input: { powerKw, lengthM, voltage, installationMethod: "B2", cosPhi },
    result: {
      currentA: ib,
      recommendedSectionMm2: result.section,
      cable,
      nominalProtection: protection,
      izA: result.iz,
      voltageDropPct: result.voltageDropPct,
    },
  };
  out.querySelector("#saveJTCalculation")?.addEventListener("click", saveCalculation);
  out.classList.remove("is-visible");
  requestAnimationFrame(() => out.classList.add("is-visible"));
});
