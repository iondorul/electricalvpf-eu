// Sitekey Cloudflare Turnstile — public prin design (spre deosebire de secret
// key, care rămâne doar server-side, în .env/Render, niciodată în acest fișier).
// Alegere automată după hostname, NU după un flag manual: pe orice hostname
// diferit de producție (localhost, 127.0.0.1, un IP de rețea locală etc.)
// folosim sitekey-ul de test Cloudflare "always passes"
// (1x00000000000000000000AA — documentat oficial, nu e un secret), fiindcă
// widgetul real e legat de domeniul electricalvpf.app și eșuează cu Error
// 110200 pe orice alt hostname.
const IS_PRODUCTION_HOST = window.location.hostname === "electricalvpf.app";

// Doar localhost/127.0.0.1 (backend local pornit prin `npm start`, port 3000)
// — NU orice hostname non-producție (ex. preview Cloudflare Pages), care nu
// are un backend local la care să ajungă oricum, deci rămâne pe API_BASE_URL
// de producție implicit. Backend-ul de producție (server.js) exclude explicit
// 127.0.0.1:5500 din CORS când NODE_ENV=production (hardening intenționat) —
// de-asta e nevoie de acest API local separat pentru testare pe localhost, nu
// doar de sitekey-ul de test Turnstile de mai sus.
const IS_LOCAL_DEV_HOST =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const CONFIG = {
  API_BASE_URL: IS_LOCAL_DEV_HOST
    ? "http://localhost:3000/api"
    : "https://api.electricalvpf.app/api",
  DEFAULT_PAGE_LIMIT: 10,
  TURNSTILE_SITEKEY: IS_PRODUCTION_HOST
    ? "0x4AAAAAAEhwMpJSAibPzncZ"
    : "1x00000000000000000000AA",
};

// Sesiunea de autentificare (JWT) — SINGURUL loc care știe unde stă tokenul.
// Aici și nu într-un fișier separat: config.js e încărcat înaintea oricărui
// alt script pe toate paginile (aplicație, login, vitrină).
//   • „Ține-mă minte” bifat   → localStorage (rămâne după închiderea browserului).
//   • „Ține-mă minte” nebifat → sessionStorage (dispare la închiderea tab-urilor/browserului).
// Niciodată în ambele: setToken() șterge copia din cealaltă stocare.
// sessionStorage e per tab, așa că un tab NOU (ex. „+ Add Customer”, ctrl+click)
// cere tokenul tab-urilor deja deschise prin BroadcastChannel (restore()).
// Fără cookie-uri — Politica de Cookie-uri promite că aplicația nu setează niciunul.
const AuthSession = (() => {
  const TOKEN_KEY = "token";
  const LEGACY_KEYS = ["user"];
  const CHANNEL_NAME = "evpf-auth";
  const HANDOFF_TIMEOUT_MS = 400;

  function storage(kind) {
    try {
      return kind === "local" ? window.localStorage : window.sessionStorage;
    } catch (err) {
      return null; // stocare blocată (setări de confidențialitate stricte)
    }
  }

  function read(kind) {
    try {
      return storage(kind)?.getItem(TOKEN_KEY) || null;
    } catch (err) {
      return null;
    }
  }

  function write(kind, token) {
    try {
      storage(kind)?.setItem(TOKEN_KEY, token);
    } catch (err) {
      /* stocare plină/blocată — tokenul rămâne doar în cealaltă stocare */
    }
  }

  function removeFrom(kind) {
    try {
      const s = storage(kind);
      if (!s) return;
      s.removeItem(TOKEN_KEY);
      LEGACY_KEYS.forEach((key) => s.removeItem(key));
    } catch (err) {
      /* nimic de șters */
    }
  }

  // Doar pentru a compara conturi (id-ul din payload), NU pentru validare —
  // validarea reală e mereu pe server.
  function accountId(token) {
    try {
      const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "="))).id ?? null;
    } catch (err) {
      return null;
    }
  }

  function getToken() {
    return read("local") || read("session");
  }

  function emit(type) {
    window.dispatchEvent(new CustomEvent("erp:auth-changed", { detail: { type } }));
  }

  let channel = null;
  try {
    if (typeof BroadcastChannel !== "undefined") channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (err) {
    channel = null;
  }

  function post(message) {
    try {
      channel?.postMessage(message);
    } catch (err) {
      /* canal închis — celelalte tab-uri se vor sincroniza la următoarea cerere API */
    }
  }

  if (channel) {
    channel.addEventListener("message", (event) => {
      const msg = event.data || {};
      if (msg.type === "request") {
        // Doar tokenul de sesiune se predă: unul „ținut minte” e deja vizibil
        // tab-ului nou direct din localStorage.
        const token = read("session");
        if (token) post({ type: "share", id: msg.id, token });
      } else if (msg.type === "login") {
        const previous = getToken();
        if (msg.remember) {
          removeFrom("session");
        } else {
          write("session", msg.token);
        }
        if (previous && accountId(previous) !== accountId(msg.token)) emit("account-switched");
      } else if (msg.type === "logout") {
        // O sesiune expirată (msg.token setat) închide doar tab-urile cu ACELAȘI
        // token; un logout explicit (fără token) le închide pe toate.
        const mine = getToken();
        if (msg.token && mine && mine !== msg.token) return;
        removeFrom("local");
        removeFrom("session");
        emit("logout");
      }
    });
  }

  let restorePromise = null;

  return {
    getToken,

    hasToken() {
      return Boolean(getToken());
    },

    isRemembered() {
      return Boolean(read("local"));
    },

    setToken(token, remember) {
      if (remember) {
        write("local", token);
        removeFrom("session");
      } else {
        write("session", token);
        removeFrom("local");
      }
      restorePromise = Promise.resolve(true);
      post({ type: "login", token, remember: Boolean(remember) });
    },

    // Logout explicit: șterge ambele stocări în acest tab și în toate celelalte.
    clear() {
      removeFrom("local");
      removeFrom("session");
      post({ type: "logout" });
    },

    // Token respins de server (SESSION_EXPIRED/TOKEN_INVALID): același efect,
    // dar celelalte tab-uri se închid doar dacă folosesc exact acest token.
    clearRejected(token) {
      removeFrom("local");
      removeFrom("session");
      post({ type: "logout", token: token || null });
    },

    // Rezolvă cu true dacă există un token — local sau primit de la un tab deschis.
    restore() {
      if (getToken()) return Promise.resolve(true);
      if (restorePromise) return restorePromise.then(() => Boolean(getToken()));
      if (!channel) return Promise.resolve(false);

      restorePromise = new Promise((resolve) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const timer = setTimeout(() => {
          channel.removeEventListener("message", onShare);
          resolve(Boolean(getToken()));
        }, HANDOFF_TIMEOUT_MS);

        function onShare(event) {
          const msg = event.data || {};
          if (msg.type !== "share" || msg.id !== id || !msg.token) return;
          clearTimeout(timer);
          channel.removeEventListener("message", onShare);
          if (!getToken()) write("session", msg.token);
          resolve(true);
        }

        channel.addEventListener("message", onShare);
        post({ type: "request", id });
      });
      // Un eșec nu e definitiv: tab-ul poate cere din nou (ex. după un login în alt tab).
      return restorePromise.then((ok) => {
        if (!ok) restorePromise = null;
        return ok;
      });
    },
  };
})();

window.AuthSession = AuthSession;
