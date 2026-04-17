(() => {
  // --- LANGUAGE TOGGLE LOGIC ---
  const langKey = "portfolio_lang_pref";
  
  // Function to apply language based on saved preference
  function applyLanguage() {
    const pref = localStorage.getItem(langKey) || "en";
    const enDivs = document.querySelectorAll('.lang-en');
    const koDivs = document.querySelectorAll('.lang-ko');
    
    if (pref === "ko") {
      enDivs.forEach(el => el.style.display = 'none');
      koDivs.forEach(el => el.style.display = 'block');
    } else {
      enDivs.forEach(el => el.style.display = 'block');
      koDivs.forEach(el => el.style.display = 'none');
    }
  }

  // Global toggle function attached to window
  window.toggleLanguage = function() {
    const current = localStorage.getItem(langKey) || "en";
    const newLang = current === "en" ? "ko" : "en";
    localStorage.setItem(langKey, newLang);
    applyLanguage();
  };

  // Apply language immediately on load
  applyLanguage();


  // --- MOBILE NAV TOGGLE ---
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (toggle && nav){
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!nav.contains(t) && !toggle.contains(t) && !t.closest('.lang-btn')){
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- REVEAL ANIMATIONS ---
  const els = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting){
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));

  // --- CTA BUTTON ---
  const btn = document.getElementById("openDealFromHome");
  if (btn){
    btn.addEventListener("click", () => {
      const openEvt = new CustomEvent("vr:open", { detail: { intent: "hire" }});
      window.dispatchEvent(openEvt);
    });
  }
})();
