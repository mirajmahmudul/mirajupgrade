(() => {
  const FORM_ENDPOINT = "https://formspree.io/f/xdkqjdnr";

  const robot = document.getElementById("vrRobot");
  const pop = document.getElementById("vrPop");
  const yesBtn = document.getElementById("vrYes");
  const noBtn = document.getElementById("vrNo");
  const panel = document.getElementById("vrPanel");
  const closeBtn = document.getElementById("vrClose");

  const logEl = document.getElementById("vrLog");
  const talkBtn = document.getElementById("vrTalk");
  const stopBtn = document.getElementById("vrStop");
  const resetBtn = document.getElementById("vrReset");
  const voiceToggleBtn = document.getElementById("vrVoiceToggle");

  const form = document.getElementById("vrForm");
  const nameIn = document.getElementById("vrName");
  const emailIn = document.getElementById("vrEmail");
  const budgetIn = document.getElementById("vrBudget");
  const msgIn = document.getElementById("vrMessage");
  const noteEl = document.getElementById("vrNote");
  const pageIn = document.getElementById("vrPage");

  if (pageIn) pageIn.value = location.href;

  // ---- Speech support ----
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasRec = !!SpeechRecognition;
  const hasTTS = "speechSynthesis" in window;

  let voiceEnabled = true;   // for TTS
  let consent = localStorage.getItem("vr_voice_consent"); // "yes" | "no" | null
  let lastAssistant = "";

  let recognition = null;
  let isListening = false;

  function bubble(text, who="bot"){
    if (!logEl) return;
    const div = document.createElement("div");
    div.className = "vr-bubble" + (who==="me" ? " me" : "");
    div.textContent = text;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function speak(text){
    lastAssistant = text;
    if (!voiceEnabled || !hasTTS) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; // Keeps English for international vibe
      u.rate = 1.05;    // Slightly faster/professional
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    } catch(_){}
  }

  function setVoiceToggleLabel(){
    if (!voiceToggleBtn) return;
    voiceToggleBtn.textContent = voiceEnabled ? "🔊 Voice: ON" : "🔇 Voice: OFF";
  }

  function openPanel(){
    if (!panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    // greet only once per open
    if (!logEl || logEl.childElementCount === 0){
      const hi = "Hi! I’m Miraj’s AI Assistant. Ask me about his Marketing Automation skills or Performance Marketing experience.";
      bubble(hi, "bot");
      speak(hi);
    }
  }

  function closePanel(){
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    stopListening();
  }

  function showPop(){
    if (!pop) return;
    pop.classList.add("is-show");
  }
  function hidePop(){
    if (!pop) return;
    pop.classList.remove("is-show");
  }

  function initRecognition(){
    if (!hasRec) return null;
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const text = ev.results?.[0]?.[0]?.transcript?.trim();
      if (text){
        bubble(text, "me");
        handleUserText(text);
      }
    };
    r.onerror = () => {
      isListening = false;
      if (noteEl) noteEl.textContent = "Mic error. Please type your message.";
    };
    r.onend = () => { isListening = false; };
    return r;
  }

  function startListening(){
    if (!hasRec){
      if (noteEl) noteEl.textContent = "Speech recognition not supported. Please type.";
      return;
    }
    if (!recognition) recognition = initRecognition();
    try{
      recognition.start();
      isListening = true;
      if (noteEl) noteEl.textContent = "Listening…";
    } catch(_){
      // sometimes start throws if already started
    }
  }

  function stopListening(){
    if (recognition && isListening){
      try{ recognition.stop(); } catch(_){}
    }
    isListening = false;
    if (noteEl) noteEl.textContent = "";
  }

  // ---- SMART RECRUITER LOGIC ----
  function handleUserText(text){
    const t = text.toLowerCase();

    // 1. Hiring / Interview Trigger
    if (t.includes("hire") || t.includes("interview") || t.includes("contact") || t.includes("resume")){
      const reply = "Excellent. Miraj is available for an internship in Busan. Please enter your email below to request an interview.";
      bubble(reply, "bot"); speak(reply);
      return;
    }

    // 2. Marketing / Content Questions (Dream Insight)
    if (t.includes("marketing") || t.includes("content") || t.includes("video") || t.includes("ad")){
      const reply = "Miraj specializes in AI-Driven Marketing. He builds automated workflows to generate short-form content and analyzes ad performance using Python and SQL.";
      bubble(reply, "bot"); speak(reply);
      return;
    }

    // 3. Tech Skills / PHP Questions (MBX)
    if (t.includes("php") || t.includes("code") || t.includes("ai") || t.includes("agent") || t.includes("backend")){
      const reply = "He is full-stack capable. He builds custom AI agents, manages MySQL databases, and automates business logic using PHP and Python.";
      bubble(reply, "bot"); speak(reply);
      return;
    }

    // 4. Projects General
    if (t.includes("project") || t.includes("portfolio")){
      const reply = "He has built RAG assistants, TradingView analyzers, and automated content pipelines. Check the Projects page for details.";
      bubble(reply, "bot"); speak(reply);
      return;
    }

    // Default Fallback
    const reply = "I can answer questions about Miraj's Marketing and AI skills. Or say 'Interview' to contact him.";
    bubble(reply, "bot"); speak(reply);
  }

  // ---- Events / bindings ----
  if (robot){
    robot.addEventListener("click", () => {
      // if consent unknown, ask once
      if (!consent){
        showPop();
      } else {
        openPanel();
      }
    });
    robot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        robot.click();
      }
    });
  }

  if (yesBtn){
    yesBtn.addEventListener("click", () => {
      consent = "yes";
      localStorage.setItem("vr_voice_consent", "yes");
      voiceEnabled = true;
      setVoiceToggleLabel();
      hidePop();
      openPanel();
      const hi = "Voice enabled. Click 'Talk' to ask me anything.";
      bubble(hi, "bot"); speak(hi);
    });
  }
  if (noBtn){
    noBtn.addEventListener("click", () => {
      consent = "no";
      localStorage.setItem("vr_voice_consent", "no");
      voiceEnabled = false;
      setVoiceToggleLabel();
      hidePop();
      openPanel();
      bubble("Voice off. You can type your questions below.", "bot");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closePanel);
  if (panel){
    panel.addEventListener("click", (e) => {
      if (e.target === panel) closePanel();
    });
  }

  if (voiceToggleBtn){
    voiceToggleBtn.addEventListener("click", () => {
      voiceEnabled = !voiceEnabled;
      if (!voiceEnabled && hasTTS) window.speechSynthesis.cancel();
      setVoiceToggleLabel();
      bubble(voiceEnabled ? "Voice turned ON." : "Voice turned OFF.", "bot");
    });
  }
  setVoiceToggleLabel();

  if (talkBtn){
    talkBtn.addEventListener("click", () => {
      startListening();
    });
  }
  if (stopBtn){
    stopBtn.addEventListener("click", stopListening);
  }
  if (resetBtn){
    resetBtn.addEventListener("click", () => {
      stopListening();
      if (logEl) logEl.innerHTML = "";
      if (noteEl) noteEl.textContent = "";
      bubble("Reset done.", "bot");
      speak("Reset done.");
    });
  }

  // Form submit -> Formspree
  if (form){
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (noteEl) noteEl.textContent = "Sending…";

      const payload = new FormData(form);
      payload.append("assistant_last_message", lastAssistant || "");

      try{
        const res = await fetch(FORM_ENDPOINT, { method:"POST", body: payload, headers: { "Accept": "application/json" }});
        if (res.ok){
          if (noteEl) noteEl.textContent = "✅ Sent! Miraj will contact you.";
          bubble("✅ Message sent successfully.", "bot");
          speak("Message sent.");
          form.reset();
        } else {
          if (noteEl) noteEl.textContent = "Error sending message.";
        }
      } catch(err){
        if (noteEl) noteEl.textContent = "Network error.";
      }
    });
  }

  // Allow other scripts (app.js) to open panel
  window.addEventListener("vr:open", (e) => {
    if (!consent){
      showPop();
    } else {
      openPanel();
      if (e?.detail?.intent === "hire"){
        bubble("Please fill the form below to schedule an interview.", "bot");
        speak("Please fill the form below to schedule an interview.");
      }
    }
  });

})();
