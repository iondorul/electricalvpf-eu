// Videourile demo, în limba vizitatorului (22 octombrie 2026): fiecare video e filmat în aplicație în acea limbă
// (firmă demo din țara respectivă, aplicația în limba ei) și are voce în limba ei. Fără subtitrări: nu e nimic de citit.
// Un singur format: vertical, la mărimea unui telefon. Fișiere: /demo/v/<limbă>/<video>.mp4 (+ .jpg = posterul),
// generate de tools/demo-videos/lang/web.py; duratele în site/demo-durations.js.
// Folosit de /demo/ și de „▶ Watch now”: <video data-demo="01-add-client"> → DemoVideos.attach(video, limbă).
(function () {
  var LANGS = ["en", "ro", "uk", "tr", "pl", "ru", "it", "nl", "no", "sv"];
  var VERSION = "20261023-it-brian";

  function fileFor(lang, name, ext) { return "https://electricalvpf.app/demo/v/" + lang + "/" + name + "." + ext + "?v=" + VERSION; }

  function attach(video, lang) {
    var name = video.getAttribute("data-demo");
    if (!name) return;
    // O limbă ale cărei videouri nu sunt încă pe site (fără durate în demo-durations.js) → engleza.
    var ready = window.DEMO_DURATIONS;
    if (LANGS.indexOf(lang) === -1 || (ready && !ready[lang])) lang = "en";
    if (video.getAttribute("data-demo-lang") === lang) return;
    var wasPlaying = !video.paused;
    video.setAttribute("data-demo-lang", lang);
    video.setAttribute("poster", fileFor(lang, name, "jpg"));
    var source = video.querySelector("source");
    if (!source) { source = document.createElement("source"); source.type = "video/mp4"; video.appendChild(source); }
    source.setAttribute("src", fileFor(lang, name, "mp4"));
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

  window.DemoVideos = { attach: attach, duration: duration, LANGS: LANGS };
})();
