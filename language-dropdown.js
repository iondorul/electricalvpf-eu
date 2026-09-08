class LanguageDropdownControl {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.toggleId = `${containerId}-toggle`;
    this.menuId = `${containerId}-menu`;
    this.currentLang = localStorage.getItem("electricalvpf_lang") || "en";

    // Listă completă cu codurile pentru steaguri oficiale (folosind coduri ISO pentru imagini SVG sau clase dedicate)
    this.languages = [
      { code: "en", name: "English", flagCode: "gb" },
      { code: "it", name: "Italiano", flagCode: "it" },
      { code: "nl", name: "Nederlands", flagCode: "nl" },
      { code: "no", name: "Norsk", flagCode: "no" },
      { code: "pl", name: "Polski", flagCode: "pl" },
      { code: "ro", name: "Română", flagCode: "ro" },
      { code: "ru", name: "Русский", flagCode: "ru" },
      { code: "sv", name: "Svenska", flagCode: "se" },
      { code: "tr", name: "Türkçe", flagCode: "tr" },
      { code: "uk", name: "Українська", flagCode: "ua" },
    ];
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.attachEvents();
    this.applyLanguage(this.currentLang);
  }

  render() {
    const currentLangObj =
      this.languages.find((l) => l.code === this.currentLang) ||
      this.languages[0];

    this.container.innerHTML = `
            <div class="lang-dropdown-wrapper" style="position: relative; display: inline-block;">
                <button id="${this.toggleId}" class="lang-btn" style="background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-main); padding: 8px 14px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 0.9rem;">
                    <img src="https://flagcdn.com/20x15/${currentLangObj.flagCode}.png" alt="${currentLangObj.name}" style="width: 20px; height: 15px; border-radius: 2px; object-fit: cover;">
                    <span>${currentLangObj.name} <span aria-hidden="true" style="font-size: 0.75rem; letter-spacing: 0.04em;">(${currentLangObj.code.toUpperCase()})</span></span>
                    <span style="font-size: 0.7rem; opacity: 0.7;">▼</span>
                </button>
                <div id="${this.menuId}" class="lang-menu" style="display: none; position: absolute; right: 0; top: 115%; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 10px 25px var(--shadow-color); z-index: 1000; min-width: 190px; max-height: 260px; overflow-y: auto; padding: 6px 0;">
                    ${this.languages
                      .map(
                        (lang) => `
                        <div class="lang-option ${lang.code === this.currentLang ? "active" : ""}" data-code="${lang.code}" style="padding: 9px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: var(--text-main); transition: background 0.15s;">
                            <img src="https://flagcdn.com/20x15/${lang.flagCode}.png" alt="${lang.name}" style="width: 20px; height: 15px; border-radius: 2px; object-fit: cover;">
                            <span>${lang.name} <span aria-hidden="true" style="font-size: 0.75rem; letter-spacing: 0.04em;">(${lang.code.toUpperCase()})</span></span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `;
  }

  attachEvents() {
    const btn = document.getElementById(this.toggleId);
    const menu = document.getElementById(this.menuId);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
      menu.style.display = "none";
    });

    menu.querySelectorAll(".lang-option").forEach((option) => {
      option.addEventListener("click", () => {
        const selectedLang = option.getAttribute("data-code");
        this.currentLang = selectedLang;
        localStorage.setItem("electricalvpf_lang", selectedLang);
        this.render();
        this.attachEvents();
        this.applyLanguage(selectedLang);
      });
    });
  }

  applyLanguage(lang) {
    if (typeof translations === "undefined" || !translations[lang]) return;
    const dict = translations[lang];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (dict[key]) el.setAttribute("aria-label", dict[key]);
    });

    const title = document.querySelector("title[data-i18n]");
    if (title && dict[title.dataset.i18n])
      document.title = dict[title.dataset.i18n];
    document.documentElement.lang = lang;
  }
}
