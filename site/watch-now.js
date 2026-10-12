// „▶ Watch now” (11 octombrie 2026): deschide Overview-ul de 90 s într-o fereastră, fără cont.
// Video-ul e servit de pe site (fără YouTube = fără cookie-uri) și se descarcă doar când se deschide fereastra.
// Închidere: X, Escape, click în afară; la închidere video-ul se oprește și focusul revine pe buton.
(function () {
  var VIDEO = "https://electricalvpf.app/demo/videos/00-overview.mp4";
  var POSTER = "https://electricalvpf.app/demo/posters/00-overview.jpg";
  var modal = null, video = null, opener = null;

  function pageLang() {
    var lang = (window.SITE_PAGE_LANG || document.documentElement.lang || "en").slice(0, 2);
    try { var stored = localStorage.getItem("locale"); if (stored) lang = stored; } catch (err) { /* fără stocare */ }
    return lang;
  }

  function text(key, fallback) {
    try {
      // translations = const global din site/translations.js (nu e proprietate pe window).
      var all = typeof translations !== "undefined" ? translations : null;
      if (!all) return fallback;
      var lang = (window.SITE_PAGE_LANG || document.documentElement.lang || "en").slice(0, 2);
      try { var stored = localStorage.getItem("locale"); if (stored && all[stored]) lang = stored; } catch (err) { /* fără stocare */ }
      return (all[lang] && all[lang][key]) || (all.en && all.en[key]) || fallback;
    } catch (err) { return fallback; }
  }

  function build() {
    modal = document.createElement("div");
    modal.className = "watch-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.hidden = true;
    modal.innerHTML =
      '<div class="watch-modal-box">' +
      '<button type="button" class="watch-modal-close"><i class="fas fa-xmark" aria-hidden="true"></i></button>' +
      '<video class="watch-modal-video" controls playsinline preload="none" poster="' + POSTER + '"' +
      ' data-phone-src="https://electricalvpf.app/demo/videos/00-overview-phone.mp4" data-phone-poster="https://electricalvpf.app/demo/posters/00-overview-phone.jpg">' +
      '<source src="' + VIDEO + '" type="video/mp4"></video>' +
      '<a class="watch-modal-more" href="https://electricalvpf.app/demo/"></a>' +
      "</div>";
    document.body.appendChild(modal);
    video = modal.querySelector("video");
    modal.querySelector(".watch-modal-close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  }

  function labels() {
    modal.setAttribute("aria-label", text("watchNowTitle", "ElectricalVPF in 90 seconds"));
    var btn = modal.querySelector(".watch-modal-close");
    btn.setAttribute("aria-label", text("watchNowClose", "Close video"));
    modal.querySelector(".watch-modal-more").textContent = text("viewTutorials", "View tutorials") + " →";
    // Subtitrarea în limba paginii, pornită automat (vocea e în engleză).
    if (window.DemoSubs) window.DemoSubs.attach(video, pageLang());
  }

  function open(e) {
    if (e) e.preventDefault();
    if (!modal) build();
    labels();
    opener = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("watch-modal-open");
    modal.querySelector(".watch-modal-close").focus();
    var played = video.play();
    if (played && played.catch) played.catch(function () { /* fără autoplay: rămâne butonul Play */ });
  }

  function close() {
    if (!modal || modal.hidden) return;
    video.pause();
    modal.hidden = true;
    document.documentElement.classList.remove("watch-modal-open");
    if (opener && opener.focus) opener.focus();
  }

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest("[data-watch-now]");
    if (trigger) open(e);
  });
})();
