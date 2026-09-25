// Shared, DOM-free calculation core. This is the single source of truth for
// the ERP Electric Calculator and public calculator widgets.
//
// Reference conditions for IZ_TABLE: copper, PVC (70 C conductor), 30 C
// ambient air, one circuit, no grouping or other correction factors. Values
// are derived from IEC 60364-5-52 / I7 reference tables.
export const IZ_TABLE = {
  2: {
    B2: { 1.5: 16.5, 2.5: 23, 4: 30, 6: 38, 10: 52, 16: 69, 25: 90, 35: 111, 50: 133, 70: 168, 95: 201 },
    C: { 1.5: 19.5, 2.5: 27, 4: 36, 6: 46, 10: 63, 16: 85, 25: 112, 35: 138, 50: 168, 70: 213, 95: 258 },
  },
  3: {
    B2: { 1.5: 15, 2.5: 20, 4: 27, 6: 34, 10: 46, 16: 62, 25: 80, 35: 99, 50: 118, 70: 149, 95: 179 },
    C: { 1.5: 17.5, 2.5: 24, 4: 32, 6: 41, 10: 57, 16: 76, 25: 96, 35: 119, 50: 144, 70: 184, 95: 223 },
  },
};
export const SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95];
export const BREAKER_STEPS = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100];
export const RHO_CU_70C = 0.0225;

function assertFinite(name, value) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be a finite number.`);
}
function assertPositive(name, value) {
  assertFinite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero.`);
}
function validateCategory(category) {
  if (!category || typeof category !== "object") throw new TypeError("category is required.");
  const { phases, voltage, voltageDropLimitPct } = category;
  if (!((phases === 1 && voltage === 230) || (phases === 3 && voltage === 400))) {
    throw new RangeError("Only 230 V single-phase and 400 V three-phase categories are supported.");
  }
  assertPositive("voltageDropLimitPct", voltageDropLimitPct);
}
function validateCosPhi(cosPhi) {
  assertFinite("cosPhi", cosPhi);
  if (cosPhi <= 0 || cosPhi > 1) throw new RangeError("cosPhi must be greater than zero and no greater than one.");
}
function loadedConductors(category) {
  validateCategory(category);
  return category.phases === 3 ? 3 : 2;
}

export function getIz(section, installMethod, conductorCount) {
  assertFinite("section", section);
  if (!SECTIONS.includes(section)) throw new RangeError(`Unsupported conductor section: ${section}.`);
  if (!IZ_TABLE[conductorCount]) throw new RangeError(`Unsupported loaded-conductor count: ${conductorCount}.`);
  if (!IZ_TABLE[conductorCount][installMethod]) throw new RangeError(`Unsupported installation method: ${installMethod}.`);
  return IZ_TABLE[conductorCount][installMethod][section];
}

export function computeIb(powerKw, category, cosPhi) {
  assertPositive("powerKw", powerKw);
  validateCategory(category);
  validateCosPhi(cosPhi);
  const powerWatts = powerKw * 1000;
  return category.phases === 1
    ? powerWatts / (category.voltage * cosPhi)
    : powerWatts / (Math.sqrt(3) * category.voltage * cosPhi);
}

export function computeVoltageDropPct(section, lengthM, ib, category, cosPhi) {
  assertFinite("section", section);
  if (!SECTIONS.includes(section)) throw new RangeError(`Unsupported conductor section: ${section}.`);
  assertPositive("lengthM", lengthM);
  assertPositive("ib", ib);
  validateCategory(category);
  validateCosPhi(cosPhi);

  // Resistance-only steady-state approximation: reactance is intentionally not
  // invented. The resistive AC component is R * cos(phi), for both circuit
  // types; with cos(phi)=1 this preserves the former 230 V calculation.
  const voltageDrop = category.phases === 1
    ? (2 * RHO_CU_70C * lengthM * ib * cosPhi) / section
    : (Math.sqrt(3) * RHO_CU_70C * lengthM * ib * cosPhi) / section;
  return (voltageDrop / category.voltage) * 100;
}

// Nominal overload-protection selection only: this verifies Ib <= In <= Iz.
// It does not verify loop impedance, fault current, disconnection time, or
// circuit-breaker breaking capacity.
export function pickBreaker(ib, iz) {
  assertPositive("ib", ib);
  assertPositive("iz", iz);
  return BREAKER_STEPS.find((step) => step >= ib && step <= iz) || null;
}

export function evaluateSection(section, installMethod, lengthM, ib, category, cosPhi) {
  const iz = getIz(section, installMethod, loadedConductors(category));
  const voltageDropPct = computeVoltageDropPct(section, lengthM, ib, category, cosPhi);
  const breaker = pickBreaker(ib, iz);
  return { section, iz, breaker, voltageDropPct, ok: iz >= ib && voltageDropPct <= category.voltageDropLimitPct && breaker !== null };
}

export function findSmallestValidSection(installMethod, lengthM, ib, category, fromSection, cosPhi) {
  assertPositive("lengthM", lengthM);
  assertPositive("ib", ib);
  validateCategory(category);
  validateCosPhi(cosPhi);
  if (fromSection !== null && fromSection !== undefined && !SECTIONS.includes(fromSection)) {
    throw new RangeError(`Unsupported conductor section: ${fromSection}.`);
  }
  if (!IZ_TABLE[loadedConductors(category)][installMethod]) throw new RangeError(`Unsupported installation method: ${installMethod}.`);
  const start = fromSection ? SECTIONS.indexOf(fromSection) + 1 : 0;
  for (let index = start; index < SECTIONS.length; index += 1) {
    const evaluation = evaluateSection(SECTIONS[index], installMethod, lengthM, ib, category, cosPhi);
    if (evaluation.ok) return evaluation;
  }
  return null;
}
