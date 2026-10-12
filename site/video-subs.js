// Subtitrarea video-urilor demo (11 octombrie 2026). În video e arsă jos o casetă cu un REZUMAT în engleză; peste ea
// (același loc, același stil, opacă) se pune subtitrarea reală — exact ce spune vocea — în limba paginii, inclusiv în
// engleză. Se vede o singură casetă: subtitrarea. Limba = limba paginii, aleasă automat; vizitatorul nu alege nimic.
// Folosit de /demo/ și de „▶ Watch now”. Fișiere (generate în tools/demo-videos): /demo/subs/<video>.<limbă>.vtt
// (textele, cu momentele vocii) + /demo/subs/burned.json (când e vizibilă caseta arsă în fiecare video).
// Ecran complet: al nostru (cadrul video + subtitrare), nu cel nativ al video-ului — acela ar arăta doar rezumatul.
(function () {
  var LANGS = ["en", "ro", "uk", "tr", "pl", "ru", "it", "nl", "no", "sv"];
  var VERSION = "20261012-phone2";
  // Caseta arsă, înregistrată pe 1920×1080: jos la 56px, lată de cel mult 960px, cel mult două rânduri de 30px.
  var REC_W = 1920, REC_H = 1080, BOTTOM = 56, BOX_W = 964, BOX_H = 118, FONT = 30, PAD_Y = 16, PAD_X = 30, RADIUS = 14;
  var MIN_FONT = 11; // pe telefon, textul la scara video-ului ar fi ilizibil
  var FS_LABEL = { en: "Full screen", ro: "Ecran complet", uk: "На весь екран", tr: "Tam ekran", pl: "Pełny ekran",
                   ru: "Во весь экран", it: "Schermo intero", nl: "Volledig scherm", no: "Fullskjerm", sv: "Helskärm" };
  var burned = null;
  var cache = {};

  function getText(url) {
    if (!cache[url]) cache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
    return cache[url];
  }

  function ts(h, m, s) { return +h * 3600 + +m * 60 + +s; }

  function parseVtt(text) {
    var cues = [];
    text.replace(/\r/g, "").split(/\n\n+/).forEach(function (block) {
      var lines = block.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var m = lines[i].match(/^(\d+):(\d+):([\d.]+)\s+-->\s+(\d+):(\d+):([\d.]+)/);
        if (m) { cues.push({ start: ts(m[1], m[2], m[3]), end: ts(m[4], m[5], m[6]), text: lines.slice(i + 1).join(" ") }); break; }
      }
    });
    return cues;
  }

  // Golurile scurte dintre două casete arse (o casetă se stinge, următoarea apare) nu sting subtitrarea.
  function mergeSpans(spans) {
    var out = [];
    spans.forEach(function (s) {
      var last = out[out.length - 1];
      if (last && s[0] - last[1] < 1) last[1] = Math.max(last[1], s[1]);
      else out.push([s[0], s[1]]);
    });
    return out;
  }

  function videoName(video) {
    var source = video.querySelector("source");
    var src = (source && source.getAttribute("src")) || video.getAttribute("src") || "";
    var m = src.match(/\/demo\/videos\/([^/?#]+)\.mp4/);
    return m ? m[1] : null;
  }

  var styled = false;
  function injectStyle() {
    if (styled) return;
    styled = true;
    var css =
      ".demo-dub-frame{position:relative;display:block;width:100%}" +
      ".dm-player>.demo-dub-frame{height:100%}" +
      ".demo-dub{position:absolute;z-index:2;pointer-events:none;display:none;box-sizing:border-box;align-items:center;" +
      "justify-content:center;text-align:center;color:#fff;font-family:Inter,system-ui,sans-serif;font-weight:600;" +
      "line-height:1.35;background:#0d121c;border:1px solid rgba(255,255,255,.14);overflow-wrap:anywhere}" +
      ".demo-dub-fs{position:absolute;top:10px;right:10px;z-index:3;width:32px;height:32px;border-radius:50%;" +
      "border:1px solid rgba(255,255,255,.3);background:rgba(10,14,24,.55);color:#fff;cursor:pointer;display:flex;" +
      "align-items:center;justify-content:center;opacity:0;transition:opacity .2s,border-color .2s;padding:0}" +
      ".demo-dub-frame:hover .demo-dub-fs,.demo-dub-fs:focus-visible,.demo-dub-frame.is-paused .demo-dub-fs," +
      ".demo-dub-frame.is-fs .demo-dub-fs{opacity:1}" +
      ".demo-dub-fs:hover,.demo-dub-fs:focus-visible{border-color:var(--accent-color,#ffc107);outline:none}" +
      ".demo-dub-fs svg{width:16px;height:16px}" +
      ".demo-dub-frame:fullscreen{background:#000;display:flex;align-items:center;justify-content:center}" +
      ".demo-dub-frame:fullscreen video{width:100%;height:100%;max-height:100%;aspect-ratio:auto;border:0;border-radius:0;object-fit:contain}" +
      // Fără API de ecran complet (iPhone): același cadru, fix peste toată pagina.
      ".demo-dub-frame.is-pseudo-fs{position:fixed;inset:0;z-index:2147483000;background:#000;display:flex;" +
      "align-items:center;justify-content:center}" +
      ".demo-dub-frame.is-pseudo-fs video{width:100%;height:100%;aspect-ratio:auto;border:0;border-radius:0;object-fit:contain}";
    var el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
  }

  var ICON_ENTER = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M1.5 5.5v-4h4M10.5 1.5h4v4M14.5 10.5v4h-4M5.5 14.5h-4v-4"/></svg>';
  var ICON_EXIT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M5.5 1.5v4h-4M14.5 5.5h-4v-4M10.5 14.5v-4h4M1.5 10.5h4v4"/></svg>';

  // Pe telefon (ecran îngust), un video cu data-phone-src trece pe varianta verticală, filmată la mărimea unui
  // telefon — pe varianta de calculator, aplicația din imagine ar fi prea mică pentru a fi citită.
  function phoneVariant(video) {
    var src = video.getAttribute("data-phone-src");
    if (!src || !window.matchMedia || !window.matchMedia("(max-width: 700px)").matches) return;
    var source = video.querySelector("source");
    if (source) source.setAttribute("src", src); else video.setAttribute("src", src);
    if (video.getAttribute("data-phone-poster")) video.setAttribute("poster", video.getAttribute("data-phone-poster"));
    video.style.aspectRatio = "9 / 16";
    video.style.maxHeight = "78vh";
    video.style.objectFit = "contain";
    var player = video.closest(".dm-player");
    if (player) { player.style.aspectRatio = "9 / 16"; player.style.maxHeight = "78vh"; player.style.margin = "0 auto"; }
    var box = video.closest(".watch-modal-box");
    if (box) box.style.width = "min(100%, calc(78vh * 9 / 16))";
    video.load();
  }

  function attach(video, lang) {
    if (!video.__dub) phoneVariant(video);
    var name = videoName(video);
    // Varianta verticală (-phone) are subtitrările ei (momentele vocii din filmarea de telefon).
    var portrait = /-phone$/.test(name || "");
    var subs = name || "";
    if (!name) return;
    if (LANGS.indexOf(lang) === -1) lang = "en";
    if (video.__dub) { video.__dub.setLang(lang); return; }
    injectStyle();

    // Cadru propriu în jurul video-ului: subtitrarea și ecranul complet stau în el.
    var frame = document.createElement("div");
    frame.className = "demo-dub-frame is-paused";
    video.parentNode.insertBefore(frame, video);
    frame.appendChild(video);
    var box = document.createElement("div");
    box.className = "demo-dub";
    box.setAttribute("aria-hidden", "true");
    frame.appendChild(box);
    var fsBtn = document.createElement("button");
    fsBtn.type = "button";
    fsBtn.className = "demo-dub-fs";
    frame.appendChild(fsBtn);

    // Ecranul complet nativ (și imagine-în-imagine) ar arăta video-ul fără subtitrare, cu rezumatul.
    video.setAttribute("controlsList", "nofullscreen");
    video.disablePictureInPicture = true;

    var dub = { lang: null, cues: [], spans: [], setLang: setLang };
    video.__dub = dub;

    function setLang(l) {
      if (dub.lang === l) return;
      dub.lang = l;
      fsBtn.setAttribute("aria-label", FS_LABEL[l] || FS_LABEL.en);
      fsBtn.title = FS_LABEL[l] || FS_LABEL.en;
      Promise.all([
        burned ? Promise.resolve(burned) : getText("https://electricalvpf.app/demo/subs/burned.json?v=" + VERSION).then(function (t) { return (burned = JSON.parse(t)); }),
        getText("https://electricalvpf.app/demo/subs/" + subs + "." + l + ".vtt?v=" + VERSION),
      ]).then(function (res) {
        if (dub.lang !== l) return;
        dub.spans = mergeSpans(res[0][name] || []);
        dub.cues = parseVtt(res[1]);
        update();
      }).catch(function () { /* fără fișier: rămâne video-ul așa cum e */ });
    }

    function isFs() { return document.fullscreenElement === frame || frame.classList.contains("is-pseudo-fs"); }

    function layout(full) {
      var w = video.clientWidth, h = video.clientHeight;
      if (!w || !h) return false;
      if (portrait) {
        // Varianta verticală nu are casetă arsă: subtitrarea stă jos, deasupra comenzilor, lizibilă pe telefon.
        var pw = Math.min(w, h * 9 / 16), ph = pw * 16 / 9;
        var pleft = video.offsetLeft + (w - pw) / 2, ptop = video.offsetTop + (h - ph) / 2;
        box.style.fontSize = Math.max(14, pw * 0.042) + "px";
        box.style.left = pleft + pw / 2 + "px";
        box.style.transform = "translateX(-50%)";
        box.style.width = "max-content";
        box.style.maxWidth = pw * 0.92 + "px";
        box.style.minWidth = "0";
        box.style.minHeight = "0";
        box.style.padding = "8px 14px";
        box.style.borderRadius = "10px";
        box.style.bottom = (frame.clientHeight - (ptop + ph)) + ph * 0.09 + "px";
        return true;
      }
      // Video-ul e 16:9 în elementul lui (benzi negre dacă proporțiile diferă, ex. pe ecran complet).
      var vw = Math.min(w, h * REC_W / REC_H), vh = vw * REC_H / REC_W;
      var k = vh / REC_H;
      var left = video.offsetLeft + (w - vw) / 2, top = video.offsetTop + (h - vh) / 2;
      var font = Math.max(FONT * k, MIN_FONT), grow = font / (FONT * k);
      box.style.fontSize = font + "px";
      box.style.left = left + vw / 2 + "px";
      box.style.transform = "translateX(-50%)";
      box.style.width = "max-content";
      box.style.maxWidth = vw * 0.92 + "px";
      if (full) {
        // Peste caseta arsă: cel puțin cât ea, ca să n-o lase să se vadă.
        box.style.padding = PAD_Y * k * grow + "px " + PAD_X * k * grow + "px";
        box.style.borderRadius = RADIUS * k + "px";
        box.style.minWidth = Math.min(BOX_W * k, vw * 0.92) + "px";
        box.style.minHeight = BOX_H * k + "px";
        box.style.bottom = (frame.clientHeight - (top + vh)) + (BOTTOM - 2) * k + "px";
      } else {
        // Fără casetă arsă (cartonașul de final): doar textul, jos de tot, cât mai mic.
        box.style.padding = 8 * k * grow + "px " + 20 * k * grow + "px";
        box.style.borderRadius = 10 * k + "px";
        box.style.minWidth = "0";
        box.style.minHeight = "0";
        box.style.bottom = (frame.clientHeight - (top + vh)) + 10 * k + "px";
      }
      return true;
    }

    function update() {
      var t = video.currentTime;
      frame.classList.toggle("is-paused", video.paused);
      frame.classList.toggle("is-fs", isFs());
      fsBtn.innerHTML = isFs() ? ICON_EXIT : ICON_ENTER;
      if (!dub.cues.length) { box.style.display = "none"; return; }
      var text = "", active = false;
      for (var i = 0; i < dub.cues.length; i++) {
        if (dub.cues[i].start <= t + 0.3) { text = dub.cues[i].text; active = t <= dub.cues[i].end; } else break;
      }
      var inSpan = dub.spans.some(function (s) { return t >= s[0] && t <= s[1]; });
      // Înainte de Play se vede posterul, care are și el rezumatul ars: îl acoperă prima replică.
      var onPoster = !video.played.length && t < 0.1 && !portrait;
      if (onPoster) { text = dub.cues[0].text; inSpan = true; }
      var show = text && (inSpan || active);
      if (!show || !layout(inSpan)) { box.style.display = "none"; return; }
      if (box.textContent !== text) box.textContent = text;
      box.style.display = "flex";
    }

    function enterPseudo() { frame.classList.add("is-pseudo-fs"); document.documentElement.style.overflow = "hidden"; update(); }
    function exitPseudo() { frame.classList.remove("is-pseudo-fs"); document.documentElement.style.overflow = ""; update(); }
    function toggleFs() {
      if (isFs()) {
        if (document.fullscreenElement === frame) document.exitFullscreen();
        else exitPseudo();
      } else if (frame.requestFullscreen && document.fullscreenEnabled) {
        frame.requestFullscreen().catch(enterPseudo);
      } else enterPseudo();
    }
    fsBtn.addEventListener("click", function (e) { e.stopPropagation(); toggleFs(); });
    video.addEventListener("dblclick", function (e) { e.preventDefault(); toggleFs(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && frame.classList.contains("is-pseudo-fs")) exitPseudo(); });
    // iPhone: butonul nativ de ecran complet nu se poate ascunde — revenim imediat în cadrul nostru.
    video.addEventListener("webkitbeginfullscreen", function () {
      setTimeout(function () { try { video.webkitExitFullscreen(); } catch (err) { /* */ } enterPseudo(); }, 0);
    });

    var raf = 0;
    function loop() { update(); raf = video.paused ? 0 : requestAnimationFrame(loop); }
    video.addEventListener("play", function () { if (!raf) raf = requestAnimationFrame(loop); });
    ["seeked", "timeupdate", "loadedmetadata", "pause", "ended"].forEach(function (e) { video.addEventListener(e, update); });
    window.addEventListener("resize", update);
    document.addEventListener("fullscreenchange", function () {
      // Dacă totuși s-a deschis ecranul complet nativ al video-ului, îl mutăm pe cadrul nostru (cu subtitrare).
      if (document.fullscreenElement === video) {
        document.exitFullscreen().then(function () { return frame.requestFullscreen(); }).catch(enterPseudo);
      }
      update();
    });
    if (window.ResizeObserver) new ResizeObserver(update).observe(frame);

    setLang(lang);
  }

  window.DemoSubs = { attach: attach, LANGS: LANGS };
})();
