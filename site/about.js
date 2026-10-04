(function () {
  "use strict";
  const copy = {
    ro: {
      section: "Despre", menu: "Omul, experiența și AI-ul din spatele aplicației", close: "Închide",
      era: "Experiență umană · Era AI", tagline: "Din lumea lucrărilor electrice. Cu instrumentele unei noi ere.",
      human: "Două domenii. Aceeași practică.", humanText: "ElectricalVPF îmbină pregătirea în ingineria calculatoarelor cu experiența practică în dezvoltare software și instalații electrice industriale. Aplicația pornește din nevoile reale ale lucrului în teren și ale organizării unei firme.",
      ai: "Dezvoltare asistată de AI", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini și Copilot au fost folosite în procesul de dezvoltare, pentru idei, cod și revizuire. Direcția și deciziile rămân umane.",
      care: "Încredere prin lucruri verificabile", careText: "Datele unei firme cer grijă. Dezvoltarea include teste și revizuirea codului. Contribuția AI nu înlocuiește verificarea și nu reprezintă o certificare de securitate.",
      footer: "Experiență practică. Instrumente noi. Responsabilitate umană."
    },
    it: {
      section: "Informazioni", menu: "La persona, l’esperienza e l’IA dietro l’applicazione", close: "Chiudi",
      era: "Esperienza umana · L’era dell’IA", tagline: "Dal mondo degli impianti elettrici. Con gli strumenti di una nuova era.",
      human: "Due discipline. Esperienza sul campo.", humanText: "ElectricalVPF unisce la formazione in ingegneria informatica all’esperienza pratica nello sviluppo software e negli impianti elettrici industriali. L’applicazione nasce dalle esigenze reali del lavoro sul campo e dell’organizzazione di un’impresa.",
      ai: "Sviluppo assistito dall’IA", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini e Copilot sono stati utilizzati nello sviluppo per idee, codice e revisione. La direzione e le decisioni restano umane.",
      care: "Fiducia attraverso fatti verificabili", careText: "I dati di un’impresa richiedono cura. Lo sviluppo comprende test e revisione del codice. Il contributo dell’IA non sostituisce la verifica e non costituisce una certificazione di sicurezza.",
      footer: "Esperienza pratica. Nuovi strumenti. Responsabilità umana."
    },
    nl: {
      section: "Over", menu: "De persoon, ervaring en AI achter de applicatie", close: "Sluiten",
      era: "Menselijke ervaring · Het AI-tijdperk", tagline: "Vanuit de elektrotechnische praktijk. Met de middelen van een nieuw tijdperk.",
      human: "Twee vakgebieden. Praktijkervaring.", humanText: "ElectricalVPF combineert een opleiding in computertechniek met praktijkervaring in softwareontwikkeling en industriële elektrische installaties. De applicatie is ontstaan vanuit de werkelijke behoeften op de werkvloer en bij het organiseren van een bedrijf.",
      ai: "Ontwikkeling met ondersteuning van AI", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini en Copilot zijn tijdens de ontwikkeling gebruikt voor ideeën, code en beoordeling. Mensen bepalen de richting en nemen de beslissingen.",
      care: "Vertrouwen door controleerbaar werk", careText: "Bedrijfsgegevens verdienen zorg. Testen en codebeoordeling maken deel uit van de ontwikkeling. De bijdrage van AI vervangt geen controle en vormt geen beveiligingscertificering.",
      footer: "Praktijkervaring. Nieuwe middelen. Menselijke verantwoordelijkheid."
    },
    no: {
      section: "Om", menu: "Mennesket, erfaringen og KI-en bak applikasjonen", close: "Lukk",
      era: "Menneskelig erfaring · KI-æraen", tagline: "Fra elektrofaget. Med verktøyene fra en ny æra.",
      human: "To fagområder. Praktisk erfaring.", humanText: "ElectricalVPF kombinerer utdanning innen dataingeniørfaget med praktisk erfaring fra programvareutvikling og industrielle elektriske installasjoner. Applikasjonen tar utgangspunkt i reelle behov i feltarbeidet og i organiseringen av en bedrift.",
      ai: "Utvikling med støtte fra KI", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini og Copilot ble brukt i utviklingen til ideer, kode og gjennomgang. Mennesker setter retningen og tar beslutningene.",
      care: "Tillit gjennom etterprøvbart arbeid", careText: "Bedriftsdata krever omtanke. Utviklingen omfatter testing og kodegjennomgang. Bidrag fra KI erstatter ikke kontroll og utgjør ingen sikkerhetssertifisering.",
      footer: "Praktisk erfaring. Nye verktøy. Menneskelig ansvar."
    },
    pl: {
      section: "O aplikacji", menu: "Człowiek, doświadczenie i AI stojące za aplikacją", close: "Zamknij",
      era: "Ludzkie doświadczenie · Era AI", tagline: "Ze świata instalacji elektrycznych. Z narzędziami nowej ery.",
      human: "Dwie dziedziny. Praktyczne doświadczenie.", humanText: "ElectricalVPF łączy wykształcenie w zakresie inżynierii komputerowej z praktycznym doświadczeniem w tworzeniu oprogramowania i przemysłowych instalacjach elektrycznych. Aplikacja powstała z rzeczywistych potrzeb pracy w terenie i organizacji firmy.",
      ai: "Rozwój wspomagany przez AI", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini i Copilot były wykorzystywane podczas tworzenia aplikacji do opracowywania pomysłów, kodu i jego przeglądu. Kierunek i decyzje pozostają w rękach człowieka.",
      care: "Zaufanie oparte na weryfikowalnej pracy", careText: "Dane firmy wymagają troski. Proces rozwoju obejmuje testy i przegląd kodu. Wkład AI nie zastępuje weryfikacji i nie stanowi certyfikatu bezpieczeństwa.",
      footer: "Praktyczne doświadczenie. Nowe narzędzia. Ludzka odpowiedzialność."
    },
    ru: {
      section: "О приложении", menu: "Человек, опыт и ИИ за созданием приложения", close: "Закрыть",
      era: "Человеческий опыт · Эра ИИ", tagline: "Из мира электромонтажных работ. С инструментами новой эпохи.",
      human: "Две области. Практический опыт.", humanText: "ElectricalVPF сочетает образование в области компьютерной инженерии с практическим опытом разработки программного обеспечения и работы с промышленными электроустановками. Приложение создано на основе реальных потребностей работы на объектах и организации деятельности компании.",
      ai: "Разработка с помощью ИИ", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini и Copilot использовались при разработке для поиска идей, написания и проверки кода. Направление работы и решения остаются за человеком.",
      care: "Доверие через проверяемую работу", careText: "Данные компании требуют бережного отношения. Разработка включает тестирование и проверку кода. Участие ИИ не заменяет проверку и не является сертификацией безопасности.",
      footer: "Практический опыт. Новые инструменты. Ответственность человека."
    },
    sv: {
      section: "Om", menu: "Människan, erfarenheten och AI bakom applikationen", close: "Stäng",
      era: "Mänsklig erfarenhet · AI-eran", tagline: "Från elarbetets verklighet. Med en ny eras verktyg.",
      human: "Två områden. Praktisk erfarenhet.", humanText: "ElectricalVPF förenar en utbildning inom datateknik med praktisk erfarenhet av programvaruutveckling och industriella elinstallationer. Applikationen utgår från verkliga behov i fältarbetet och i organiseringen av ett företag.",
      ai: "Utveckling med stöd av AI", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini och Copilot har använts under utvecklingen för idéer, kod och granskning. Människor bestämmer riktningen och fattar besluten.",
      care: "Förtroende genom verifierbart arbete", careText: "Företagsdata kräver omsorg. Utvecklingen omfattar tester och kodgranskning. AI:s bidrag ersätter inte verifiering och utgör ingen säkerhetscertifiering.",
      footer: "Praktisk erfarenhet. Nya verktyg. Mänskligt ansvar."
    },
    tr: {
      section: "Hakkında", menu: "Uygulamanın arkasındaki insan, deneyim ve yapay zekâ", close: "Kapat",
      era: "İnsan deneyimi · Yapay zekâ çağı", tagline: "Elektrik işlerinin içinden. Yeni bir çağın araçlarıyla.",
      human: "İki alan. Pratik deneyim.", humanText: "ElectricalVPF, bilgisayar mühendisliği eğitimini yazılım geliştirme ve endüstriyel elektrik tesisatlarındaki pratik deneyimle birleştirir. Uygulama, saha çalışmalarının ve bir işletmenin yönetiminin gerçek ihtiyaçlarından doğmuştur.",
      ai: "Yapay zekâ destekli geliştirme", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini ve Copilot geliştirme sürecinde fikir üretme, kod yazma ve inceleme için kullanılmıştır. Yönü insanlar belirler, kararları insanlar verir.",
      care: "Doğrulanabilir çalışmalarla güven", careText: "İşletme verileri özen gerektirir. Geliştirme süreci testleri ve kod incelemesini içerir. Yapay zekânın katkısı doğrulamanın yerini almaz ve bir güvenlik sertifikası niteliği taşımaz.",
      footer: "Pratik deneyim. Yeni araçlar. İnsan sorumluluğu."
    },
    uk: {
      section: "Про застосунок", menu: "Людина, досвід і ШІ за створенням застосунку", close: "Закрити",
      era: "Людський досвід · Ера ШІ", tagline: "Зі світу електромонтажних робіт. З інструментами нової епохи.",
      human: "Дві галузі. Практичний досвід.", humanText: "ElectricalVPF поєднує освіту в галузі комп’ютерної інженерії з практичним досвідом розробки програмного забезпечення та роботи з промисловими електроустановками. Застосунок створено на основі реальних потреб роботи на об’єктах та організації діяльності компанії.",
      ai: "Розробка за підтримки ШІ", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini і Copilot використовувалися під час розробки для пошуку ідей, написання та перевірки коду. Напрям роботи й рішення залишаються за людиною.",
      care: "Довіра через роботу, яку можна перевірити", careText: "Дані компанії потребують дбайливого ставлення. Розробка включає тестування та перевірку коду. Внесок ШІ не замінює перевірку й не є сертифікацією безпеки.",
      footer: "Практичний досвід. Нові інструменти. Людська відповідальність."
    },
    en: {
      section: "About", menu: "The person, experience and AI behind the application", close: "Close",
      era: "Human experience · The AI era", tagline: "From electrical work. With the tools of a new era.",
      human: "Two disciplines. Practical experience.", humanText: "ElectricalVPF combines a background in computer engineering with practical experience in software development and industrial electrical installations. The application is grounded in the real needs of field work and running a business.",
      ai: "AI-assisted development", aiText: "ChatGPT, Meta AI, Claude, Codex, Gemini and Copilot were used during development for ideas, code and review. Direction and decisions remain human.",
      care: "Trust through verifiable work", careText: "Business data deserves care. Development includes testing and code review. AI contributions do not replace verification or constitute a security certification.",
      footer: "Practical experience. New tools. Human responsibility."
    }
  };
  let dialog;
  let previousOverflow;
  const text = () => copy[document.documentElement.lang] || copy.en;
  const soundLabels = {
    ro: ["Pornește sunetul cosmic", "Oprește sunetul cosmic"],
    en: ["Enable cosmic sound", "Mute cosmic sound"],
    it: ["Attiva il suono cosmico", "Disattiva il suono cosmico"],
    nl: ["Kosmisch geluid aanzetten", "Kosmisch geluid uitzetten"],
    no: ["Slå på kosmisk lyd", "Slå av kosmisk lyd"],
    pl: ["Włącz kosmiczny dźwięk", "Wyłącz kosmiczny dźwięk"],
    ru: ["Включить космический звук", "Выключить космический звук"],
    sv: ["Slå på kosmiskt ljud", "Stäng av kosmiskt ljud"],
    tr: ["Kozmik sesi aç", "Kozmik sesi kapat"],
    uk: ["Увімкнути космічний звук", "Вимкнути космічний звук"]
  };
  let muted = false, ambience = null, soundButton;
  try { muted = localStorage.getItem("evpf-about-muted") === "true"; } catch (_) {}
  function updateSoundButton() {
    if (!soundButton) return;
    const playing = !!ambience && ambience.context.state === "running";
    const labels = soundLabels[document.documentElement.lang] || soundLabels.en;
    soundButton.title = labels[playing ? 1 : 0];
    soundButton.setAttribute("aria-label", soundButton.title);
    soundButton.setAttribute("aria-pressed", String(playing));
  }
  function stopSound() {
    const old = ambience;
    ambience = null;
    if (old) {
      const now = old.context.currentTime;
      old.master.gain.cancelScheduledValues(now);
      old.master.gain.setTargetAtTime(0, now, 0.06);
      setTimeout(() => { old.context.close().catch(() => {}); }, 350);
    }
    updateSoundButton();
  }
  function startSound() {
    if (muted || ambience || !dialog?.open || document.hidden) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { soundButton.hidden = true; return; }
    try {
      const context = new AudioContext();
      const master = context.createGain();
      ambience = { context, master };
      master.gain.value = 0;
      master.connect(context.destination);
      // Restore the original sustained cosmic texture on the public site.
      // The application uses a higher, open fifth/ninth voicing and slower drift.
      const insideApp = !!document.getElementById("helpMenuBtn");
      const frequencies = insideApp
        ? [73.416, 146.832, 220, 329.628, 440, 659.255]
        : [65.406, 130.813, 196.22, 261.626, 392.44, 523.252];
      frequencies.forEach((frequency, i) => {
        const tone = context.createOscillator();
        const level = context.createGain();
        const drift = context.createOscillator();
        const depth = context.createGain();
        tone.type = "sine";
        tone.frequency.value = frequency;
        tone.detune.value = (i % 2 ? 1 : -1) * (insideApp ? 2 : 3);
        level.gain.value = i < 2 ? (insideApp ? 0.16 : 0.19) : (insideApp ? 0.065 : 0.055);
        drift.frequency.value = insideApp ? 0.035 + i * 0.009 : 0.055 + i * 0.013;
        depth.gain.value = i < 2 ? 0.035 : 0.025;
        drift.connect(depth).connect(level.gain);
        tone.connect(level).connect(master);
        tone.start(); drift.start();
      });
      master.gain.setTargetAtTime(0.12, context.currentTime, 1.2);
      const session = ambience;
      context.onstatechange = updateSoundButton;
      context.resume().then(updateSoundButton).catch(() => {
        if (ambience === session) stopSound();
      });
      updateSoundButton();
    } catch (_) { stopSound(); }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSound(); else startSound();
  });
  window.addEventListener("pagehide", stopSound);
  function node(tag, cls, content) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content) el.textContent = content;
    return el;
  }
  function render() {
    const t = text();
    document.querySelectorAll("[data-about-text]").forEach(el => { el.textContent = t[el.dataset.aboutText]; });
    if (!dialog) return;
    updateSoundButton();
    dialog.querySelector(".about-close").setAttribute("aria-label", t.close);
    dialog.querySelector(".about-bar-label").textContent = t.section + " / ElectricalVPF";
    dialog.querySelector(".about-coordinate").textContent = t.era;
    const body = dialog.querySelector(".about-content");
    body.replaceChildren();
    const title = node("h2", null, "ElectricalVPF");
    title.id = "about-title";
    body.append(title, node("p", "about-tagline", t.tagline));
    ["human", "ai", "care"].forEach((key, index) => {
      const block = node("section", "about-block");
      const content = node("div");
      content.append(node("h3", null, t[key]), node("p", "about-copy", t[key + "Text"]));
      if (key === "ai") {
        const tools = node("ul", "about-tools");
        ["ChatGPT", "Meta AI", "Claude", "Codex", "Gemini", "Copilot"].forEach(name => tools.append(node("li", null, name)));
        content.append(tools);
      }
      block.append(node("span", "about-number", "0" + (index + 1)), content);
      body.append(block);
    });
    const footer = node("div", "about-footer");
    footer.append(node("span", null, "✦"), node("span", null, t.footer));
    body.append(footer);
  }
  // Centrarea poate cădea pe jumătăți de pixel (bara de derulare, lățimi impare),
  // iar liniile fine (conturul X-ului) ies estompate: fereastra se aliniază la
  // pixeli întregi după animația de deschidere și la redimensionare.
  function snapToPixels() {
    if (!dialog || !dialog.open) return;
    dialog.style.translate = "";
    const r = dialog.getBoundingClientRect();
    dialog.style.translate = `${Math.round(r.left) - r.left}px ${Math.round(r.top) - r.top}px`;
  }
  window.addEventListener("resize", snapToPixels);

  // Stelele din fereastră: spațiu 3D, drift foarte lent spre privitor; rulează doar cât
  // fereastra e deschisă; statice la prefers-reduced-motion.
  let sky = null;
  function createSky(canvas) {
    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const DEPTH = 900, SPEED = 0.028;
    let w = 0, h = 0, stars = [], raf = 0, last = 0;
    const star = z => ({
      x: (Math.random() - 0.5) * 900, y: (Math.random() - 0.5) * 500,
      z: z != null ? z : Math.random() * DEPTH,
      size: 0.4 + Math.random() * 0.8, phase: Math.random() * 6.3, pulse: 0.0004 + Math.random() * 0.0006,
      tint: Math.random() < 0.2 ? "190,225,255" : "255,255,255"
    });
    function size() {
      // offsetWidth/Height: mărimea reală, neafectată de animația de deschidere (scale .95).
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stars.length) stars = Array.from({ length: 90 }, () => star());
    }
    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      const focal = w * 0.5;
      for (const s of stars) {
        const k = focal / s.z, x = w / 2 + s.x * k, y = h / 2 + s.y * k;
        if (x < -3 || x > w + 3 || y < -3 || y > h + 3) continue;
        const near = 1 - s.z / DEPTH;
        const a = (0.35 + 0.65 * near) * (0.78 + 0.22 * Math.sin(time * s.pulse + s.phase)) * Math.min(1, (DEPTH - s.z) / 160);
        ctx.fillStyle = `rgba(${s.tint},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, s.size * (0.45 + 1.1 * near), 0, 6.2832); ctx.fill();
      }
    }
    function frame(time) {
      const dt = Math.min(50, time - (last || time)); last = time;
      stars.forEach((s, i) => { s.z -= SPEED * dt; if (s.z < 1) stars[i] = star(DEPTH); });
      draw(time);
      raf = requestAnimationFrame(frame);
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }
    function start() {
      stop(); size();
      if (still.matches) draw(0); else raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", () => { if (raf || (dialog && dialog.open)) { size(); if (still.matches) draw(0); } });
    document.addEventListener("visibilitychange", () => { if (!dialog || !dialog.open) return; if (document.hidden) stop(); else start(); });
    return { start, stop };
  }

  function open() {
    // Vitrina: #help-dropdown-toggle; aplicația (după login): #helpMenuBtn.
    const toggle = document.getElementById("help-dropdown-toggle") || document.getElementById("helpMenuBtn");
    const menu = document.getElementById("help-dropdown-menu");
    document.getElementById("help-dropdown")?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-hidden", "true");
    if (!dialog) {
      dialog = node("dialog", "about-window");
      dialog.setAttribute("aria-labelledby", "about-title");
      const bar = node("div", "about-bar");
      // X-ul și cercul desenate vectorial: cerc perfect, contur continuu (nu un „×” de text).
      const close = node("button", "about-close");
      close.type = "button";
      close.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15.25"/><path d="M11.5 11.5l9 9M20.5 11.5l-9 9"/></svg>';
      close.addEventListener("click", () => dialog.close());
      soundButton = node("button", "about-sound");
      soundButton.type = "button";
      soundButton.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15.25"/><path d="M8 13h4l5-4v14l-5-4H8Z"/><path class="about-sound-waves" d="M20 12q4 4 0 8m3-11q7 7 0 14"/><path class="about-sound-muted" d="m21 13 5 6m0-6-5 6"/></svg>';
      soundButton.addEventListener("click", () => {
        muted = !!ambience && ambience.context.state === "running";
        try { localStorage.setItem("evpf-about-muted", String(muted)); } catch (_) {}
        if (muted) stopSound(); else { stopSound(); startSound(); }
      });
      const controls = node("div", "about-controls");
      controls.append(soundButton, close);
      bar.append(node("span", "about-bar-label"), controls);
      const cosmos = node("div", "about-cosmos");
      cosmos.setAttribute("aria-hidden", "true");
      // Cer în mișcare (canvas, stele care vin încet spre privitor) + orbite SVG pe care câte o
      // stea se mișcă foarte lent + nucleul care plutește. Calm: nimic brusc.
      cosmos.innerHTML = '<canvas class="about-sky"></canvas>' +
        '<svg class="about-orbits" viewBox="0 0 540 158">' +
        '<g transform="rotate(-23 270 79)"><ellipse class="about-orbit-line" cx="270" cy="79" rx="130" ry="43"/>' +
        '<circle class="about-planet" r="2.6"><animateMotion dur="80s" repeatCount="indefinite" path="M140,79 a130,43 0 1,0 260,0 a130,43 0 1,0 -260,0"/></circle></g>' +
        '<g transform="rotate(29 270 79)"><ellipse class="about-orbit-line about-orbit-line--cross" cx="270" cy="79" rx="110" ry="36"/>' +
        '<circle class="about-planet about-planet--small" r="1.9"><animateMotion dur="120s" begin="-45s" repeatCount="indefinite" path="M380,79 a110,36 0 1,0 -220,0 a110,36 0 1,0 220,0"/></circle></g>' +
        '</svg>' +
        '<span class="about-core"><svg viewBox="0 0 30 38"><path d="M18 3 5 22h10l-3 13 13-20H15Z"/></svg></span><span class="about-coordinate"></span>';
      sky = createSky(cosmos.querySelector(".about-sky"));
      dialog.append(bar, cosmos, node("div", "about-content"));
      document.body.append(dialog);
      dialog.addEventListener("click", event => {
        if (event.target !== dialog) return;
        const r = dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
      });
      dialog.addEventListener("close", () => {
        sky.stop();
        stopSound();
        document.body.style.overflow = previousOverflow;
        toggle?.focus({ preventScroll: true });
      });
    }
    if (dialog.open) return;
    render();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.style.translate = "";
    dialog.showModal();
    dialog.addEventListener("animationend", snapToPixels, { once: true });
    setTimeout(snapToPixels, 700); // și fără animație (prefers-reduced-motion)
    dialog.querySelector(".about-close").focus();
    sky.start();
    startSound();
  }
  document.querySelectorAll("[data-help-about]").forEach(button => button.addEventListener("click", open));
  document.addEventListener("site:lang-applied", render);
  // În aplicație: limba se schimbă din Setări (i18n.js), iar shell.js deschide fereastra.
  document.addEventListener("erp:locale-changed", render);
  window.ElectricalVpfAbout = { open };
  render();
})();
