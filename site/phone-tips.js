// One fixed tooltip keeps the illustration and its floating icons in place.
(function () {
  "use strict";
  const chips = document.querySelectorAll("[data-phone-tip]");
  if (!chips.length) return;
  const tip = document.createElement("div");
  tip.id = "phone-benefit-tip";
  tip.className = "phone-tip";
  tip.setAttribute("role", "tooltip");
  tip.setAttribute("aria-hidden", "true");
  tip.innerHTML = '<span class="phone-tip-icon" aria-hidden="true"><i></i></span><span class="phone-tip-copy"><strong class="phone-tip-title"></strong><span class="phone-tip-description"></span></span>';
  document.body.appendChild(tip);
  let current = null;
  let frame = 0;
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function position() {
    if (!current) return;
    const rect = current.getBoundingClientRect();
    const viewport = window.visualViewport;
    const leftEdge = (viewport?.offsetLeft || 0) + 12;
    const topEdge = (viewport?.offsetTop || 0) + 12;
    const width = viewport?.width || document.documentElement.clientWidth;
    const height = viewport?.height || window.innerHeight;
    tip.style.maxWidth = Math.max(1, Math.min(320, width - 24)) + "px";
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const above = rect.top - h - 14;
    const isAbove = above >= topEdge;
    const left = Math.max(leftEdge, Math.min(rect.left + rect.width / 2 - w / 2, leftEdge + width - 24 - w));
    tip.dataset.side = isAbove ? "above" : "below";
    tip.style.setProperty("--tip-arrow-x", Math.max(18, Math.min(w - 18, rect.left + rect.width / 2 - left)) + "px");
    tip.style.left = left + "px";
    tip.style.top = Math.max(topEdge, Math.min(isAbove ? above : rect.bottom + 14, topEdge + height - 24 - h)) + "px";
    // Follow the existing floating animation while visible.
    frame = requestAnimationFrame(position);
  }

  function close() {
    cancelAnimationFrame(frame);
    tip.classList.remove("is-open");
    tip.setAttribute("aria-hidden", "true");
    if (current) {
      current.removeAttribute("aria-describedby");
      current.classList.remove("is-tip-active");
    }
    current = null;
  }

  function open(chip) {
    close();
    current = chip;
    tip.querySelector(".phone-tip-title").textContent = chip.querySelector("[data-i18n]").textContent;
    tip.querySelector(".phone-tip-description").textContent = chip.querySelector('[data-i18n$="_description"]').textContent;
    tip.querySelector(".phone-tip-icon i").className = chip.querySelector("i").className;
    chip.classList.add("is-tip-active");
    chip.setAttribute("aria-describedby", tip.id);
    tip.setAttribute("aria-hidden", "false");
    position();
    tip.classList.add("is-open");
  }

  chips.forEach((chip) => {
    chip.addEventListener("mouseenter", () => { if (canHover()) open(chip); });
    chip.addEventListener("mouseleave", () => { if (current === chip) close(); });
    chip.addEventListener("focus", () => { if (canHover()) open(chip); });
    chip.addEventListener("blur", () => { if (current === chip) close(); });
    chip.addEventListener("click", () => {
      if (!canHover()) {
        if (current === chip) close();
        else open(chip);
      }
    });
  });
  document.addEventListener("pointerdown", (event) => {
    if (current && !current.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  document.addEventListener("site:lang-applied", () => { if (current) open(current); });
  window.addEventListener("blur", close);
  window.addEventListener("scroll", close, { passive: true });
})();
