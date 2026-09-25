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
