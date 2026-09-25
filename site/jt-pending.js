/* Shared, browser-local hand-off for Public JT Calculator → ERP offer.
 * It contains only the calculation the visitor chose to save; it expires after
 * 24 hours and is deliberately kept until the API confirms an attachment. */
(function (global) {
  "use strict";
  const KEY = "electricalvpf:pending-jt-calculation:v1";
  const MAX_AGE_MS = 24 * 60 * 60 * 1000;

  function read() {
    try {
      const pending = JSON.parse(localStorage.getItem(KEY));
      if (!pending || pending.version !== 1 || pending.returnIntent !== "attach-to-offer" ||
          !pending.expiresAt || Date.now() > new Date(pending.expiresAt).getTime()) {
        localStorage.removeItem(KEY);
        return null;
      }
      return pending;
    } catch (_) { return null; }
  }

  global.JTPendingCalculation = {
    key: KEY,
    get: read,
    has: () => Boolean(read()),
    save({ input, result }) {
      const now = new Date();
      const pending = {
        version: 1,
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + MAX_AGE_MS).toISOString(),
        input,
        result,
        returnIntent: "attach-to-offer",
      };
      localStorage.setItem(KEY, JSON.stringify(pending));
      return pending;
    },
    clear() { localStorage.removeItem(KEY); },
    // Șterge DOAR calculul identificat prin createdAt — dacă între timp a fost
    // salvat un calcul mai nou (alt tab), acela rămâne neatins.
    discard(createdAt) {
      const pending = read();
      if (!pending || !createdAt || pending.createdAt !== createdAt) return false;
      localStorage.removeItem(KEY);
      return true;
    },
  };
})(window);
