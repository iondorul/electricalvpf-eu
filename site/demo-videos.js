// Videourile demo, în limba vizitatorului (22 octombrie 2026): fiecare video e filmat în aplicație în acea limbă
// (firmă demo din țara respectivă, aplicația în limba ei) și are voce în limba ei. Fără subtitrări: nu e nimic de citit.
// Un singur format: vertical, la mărimea unui telefon. Fișiere: /demo/v/<limbă>/<video>.mp4 (+ .jpg = posterul),
// generate de tools/demo-videos/lang/web.py; duratele în site/demo-durations.js.
// Folosit de /demo/ și de „▶ Watch now”: <video data-demo="01-add-client"> → DemoVideos.attach(video, limbă).
// Din 24 octombrie 2026, prezentarea (00-overview) are și varianta de CALCULATOR (00-overview-desktop: aplicația filmată
// pe ecran lat, ecrane premium de început și final). Pe calculator se folosește ea, într-un player lat (clasa
// is-landscape pe .dm-featured / .watch-modal-box), cu un buton real „Începe gratuit” peste ecranul de final.
(function () {
  var LANGS = ["en", "ro", "uk", "tr", "pl", "ru", "it", "nl", "no", "sv"];
  var VERSION = "20261024-premium";

  function isDesktop() {
    return !!(window.matchMedia && window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)").matches);
  }

  // Butonul „Începe gratuit” din ecranul de final e desenat în video: peste el punem un link adevărat,
  // vizibil (clicabil) doar în ultimele secunde.
  function endCta(video, on) {
    var box = video.parentElement;
    var a = box.querySelector(".demo-end-cta");
    if (!on) { if (a) a.hidden = true; return; }
    if (!a) {
      a = document.createElement("a");
      a.className = "demo-end-cta";
      a.href = "https://electricalvpf.app/frontend/register.html?returnSite=eu";
      a.hidden = true;
      if (getComputedStyle(box).position === "static") box.style.position = "relative";
      box.appendChild(a);
      var css = document.createElement("style");
      css.textContent = ".demo-end-cta{position:absolute;z-index:2;border-radius:14px;border:1px solid transparent}" +
        ".demo-end-cta:hover,.demo-end-cta:focus-visible{border-color:#f97316;outline:none}";
      document.head.appendChild(css);
      var place = function () {
        var show = video.duration && video.currentTime >= video.duration - 10 && video.getAttribute("data-demo-file") === "00-overview-desktop";
        a.hidden = !show;
        if (!show) return;
        var w = video.clientWidth, h = video.clientHeight;
        a.style.left = video.offsetLeft + w * 0.28 + "px";
        a.style.top = video.offsetTop + h * 0.745 + "px";
        a.style.width = w * 0.44 + "px";
        a.style.height = h * 0.1 + "px";
      };
      video.addEventListener("timeupdate", place);
      video.addEventListener("ended", place);
      video.addEventListener("seeked", place);
    }
    var label = "Start free";
    try { var all = typeof translations !== "undefined" ? translations : null; var l = video.getAttribute("data-demo-lang"); if (all) label = (all[l] && all[l].startFree) || all.en.startFree; } catch (err) { /* fără traduceri */ }
    a.setAttribute("aria-label", label);
  }

  function fileFor(lang, name, ext) { return "https://electricalvpf.app/demo/v/" + lang + "/" + name + "." + ext + "?v=" + VERSION; }

  function attach(video, lang) {
    var name = video.getAttribute("data-demo");
    if (!name) return;
    // O limbă ale cărei videouri nu sunt încă pe site (fără durate în demo-durations.js) → engleza.
    var ready = window.DEMO_DURATIONS;
    if (LANGS.indexOf(lang) === -1 || (ready && !ready[lang])) lang = "en";
    var file = name;
    if (name === "00-overview" && isDesktop() && ready && ready[lang] && ready[lang]["00-overview-desktop"]) file = "00-overview-desktop";
    var holder = video.closest(".dm-featured, .watch-modal-box");
    if (holder) holder.classList.toggle("is-landscape", file === "00-overview-desktop");
    if (video.getAttribute("data-demo-lang") === lang && video.getAttribute("data-demo-file") === file) return;
    var wasPlaying = !video.paused;
    video.setAttribute("data-demo-lang", lang);
    video.setAttribute("data-demo-file", file);
    endCta(video, file === "00-overview-desktop");
    video.setAttribute("poster", fileFor(lang, file, "jpg"));
    var source = video.querySelector("source");
    if (!source) { source = document.createElement("source"); source.type = "video/mp4"; video.appendChild(source); }
    source.setAttribute("src", fileFor(lang, file, "mp4"));
    video.load();
    if (wasPlaying) { var p = video.play(); if (p && p.catch) p.catch(function () { /* fără autoplay */ }); }
  }

  // Durata afișată pe card („1:05”), pentru limba aleasă.
  function duration(lang, name) {
    var all = window.DEMO_DURATIONS || {};
    var s = (all[lang] && all[lang][name]) || (all.en && all.en[name]);
    if (!s) return "";
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  window.DemoVideos = { attach: attach, duration: duration, LANGS: LANGS, isDesktop: isDesktop };
})();
