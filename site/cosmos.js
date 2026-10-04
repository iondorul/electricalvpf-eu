/* Cerul vitrinei (tema întunecată): stele albe în spațiu tridimensional, care vin spre privitor
   foarte încet — călătorie calmă prin infinit. Canvas fix în spatele paginii (site/cosmos.css).
   Static la prefers-reduced-motion; oprit cât tab-ul e ascuns sau tema e luminoasă.
   Cu data-cosmos-always pe <script> (login, register, paginile legale — fundal bleumarin în ambele
   teme), cerul rămâne aprins și pe tema luminoasă; fereastra principală, opacă, îl acoperă în centru. */
(function () {
  "use strict";

  const always = !!(document.currentScript && document.currentScript.hasAttribute("data-cosmos-always"));
  const canvas = document.createElement("canvas");
  canvas.className = "cosmos-sky";
  canvas.setAttribute("aria-hidden", "true");
  if (always) canvas.classList.add("cosmos-sky--always");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  const root = document.documentElement;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DEPTH = 1600;       // adâncimea „cutiei” de stele
  const SPEED = 0.045;      // unități de adâncime / ms (~72 s de la fund până la privitor)
  let stars = [];
  let w = 0, h = 0, dpr = 1, focal = 1;
  let raf = 0, last = 0;

  function newStar(z) {
    const spread = Math.max(w, h) * 1.6;
    return {
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: z != null ? z : Math.random() * DEPTH,
      size: 0.45 + Math.random() * 0.9,
      tint: Math.random() < 0.18 ? "200,225,255" : "255,255,255",
      phase: Math.random() * Math.PI * 2,
      pulse: 0.00035 + Math.random() * 0.0006
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    focal = Math.max(w, h) * 0.55;
    const count = Math.round(Math.min(620, (w * h) / 2600));
    stars = Array.from({ length: count }, () => newStar());
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h * 0.42;
    for (const s of stars) {
      const k = focal / s.z;
      const x = cx + s.x * k, y = cy + s.y * k;
      if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
      const near = 1 - s.z / DEPTH;                         // 0 departe → 1 aproape
      const twinkle = 0.78 + 0.22 * Math.sin(time * s.pulse + s.phase);
      const fade = Math.min(1, (DEPTH - s.z) / 260);        // apar lin din adânc
      const alpha = (0.4 + 0.6 * near) * twinkle * fade;
      const r = s.size * (0.45 + 1.15 * near);
      ctx.fillStyle = "rgba(" + s.tint + "," + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(time) {
    const dt = Math.min(50, time - (last || time));
    last = time;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.z -= SPEED * dt;
      if (s.z < 1) stars[i] = newStar(DEPTH);
    }
    draw(time);
    raf = requestAnimationFrame(frame);
  }

  const active = () => (always || root.getAttribute("data-theme") === "dark") && !document.hidden;

  function update() {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (!active()) return;
    if (still.matches) draw(0);
    else raf = requestAnimationFrame(frame);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); update(); }, 150);
  });
  document.addEventListener("visibilitychange", update);
  new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  if (still.addEventListener) still.addEventListener("change", update);

  resize();
  update();
})();
