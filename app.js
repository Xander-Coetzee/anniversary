// ===================================================
// Anniversary - Logika & Liefdesenjin (Afrikaans)
// ===================================================

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let isAudioPlaying = false;
let lastWebhookSent = 0;
let shuffledQuotes = [];
let quoteIndex = 0;
let quoteInterval = null;

function initApp() {
  initBackgroundStars();
  initDaysTogether();
  initMusicPlayer();
  initRotatingQuotes();
  initWebhookActions();
  initAuthGate();
}

// ---------------------------------------------------
// 1. Wagwoord & Privaatheidsbeheer (Auth Gate)
// ---------------------------------------------------
function initAuthGate() {
  const lockScreen = document.getElementById("lockScreen");
  const introScreen = document.getElementById("introScreen");
  const lockForm = document.getElementById("lockForm");
  const passwordInput = document.getElementById("passwordInput");
  const lockError = document.getElementById("lockError");

  // Kyk of die URL 'n sleutel bevat (bv. ?key=11092025 of #11092025) vir die NFC merker
  const urlParams = new URLSearchParams(window.location.search);
  const hashVal = window.location.hash.replace("#", "");
  const urlKey = urlParams.get("key") || hashVal;

  const isAlreadyUnlocked = localStorage.getItem("anniversary_authenticated") === "true";

  if (isAlreadyUnlocked || (urlKey && isPasswordValid(urlKey))) {
    localStorage.setItem("anniversary_authenticated", "true");
    lockScreen.classList.add("hidden");
    introScreen.classList.remove("hidden");
  } else {
    // Wys die wagwoordskerm
    lockScreen.classList.remove("hidden");
    introScreen.classList.add("hidden");
  }

  if (lockForm) {
    lockForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = passwordInput.value.trim();

      if (isPasswordValid(entered)) {
        localStorage.setItem("anniversary_authenticated", "true");
        spawnHearts(15);
        lockScreen.classList.add("hidden");
        introScreen.classList.remove("hidden");
      } else {
        lockError.classList.remove("hidden");
        passwordInput.classList.add("error-shake");
        setTimeout(() => passwordInput.classList.remove("error-shake"), 500);
      }
    });
  }
}

function isPasswordValid(input) {
  if (!input) return false;
  // Maak inset skoon van spasies, skuinsstrepe en koppeltekens
  const clean = input.replace(/[\/\-\.\s]/g, "").toLowerCase();
  
  if (clean === "11092025" || clean === "1109" || clean === "11september2025") {
    return true;
  }

  if (GIFT_CONFIG.acceptedPasswords) {
    return GIFT_CONFIG.acceptedPasswords.some(pw => {
      return pw.replace(/[\/\-\.\s]/g, "").toLowerCase() === clean;
    });
  }

  return false;
}

// ---------------------------------------------------
// 2. Seël / Tik om oop te maak (Ontsluit Klank op iOS)
// ---------------------------------------------------
function initSealEntrance() {
  const sealBtn = document.getElementById("sealBtn");
  const introScreen = document.getElementById("introScreen");
  const mainContent = document.getElementById("mainContent");

  if (!sealBtn) return;

  sealBtn.addEventListener("click", () => {
    spawnHearts(18);
    introScreen.classList.add("fade-out");

    setTimeout(() => {
      introScreen.classList.add("hidden");
      mainContent.classList.remove("hidden");

      // Begin musiek outomaties op herhaling
      const audio = document.getElementById("bgAudio");
      if (audio && GIFT_CONFIG.audioSource) {
        audio.loop = true;
        audio.play().then(() => {
          isAudioPlaying = true;
          updatePlayPauseUI();
        }).catch(err => {
          console.log("Outo-speel verhoed deur blaaier:", err);
        });
      }

      // Begin roulerende aanhalings
      startQuoteRotation();

      // Stil kennisgewing aan Discord dat sy die webwerf oopgemaak het
      sendDiscordWebhook(
        "🎨 Canvas Oopgemaak!",
        "Lies het pas die NFC tag geskandeer en die herdenking-blad oopgemaak! ❤️"
      );
    }, 600);
  });
}

// ---------------------------------------------------
// 3. Dae Saam Teller (Sedert 11 September 2025)
// ---------------------------------------------------
function initDaysTogether() {
  const daysCountEl = document.getElementById("daysCount");
  if (!daysCountEl) return;

  const startDate = new Date(GIFT_CONFIG.anniversaryDate || "2025-09-11");
  const today = new Date();
  
  // Bereken die verskil in dae
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  daysCountEl.textContent = diffDays;
}

// ---------------------------------------------------
// 4. Musiekspeler (Herhaling / Loop)
// ---------------------------------------------------
function initMusicPlayer() {
  const audio = document.getElementById("bgAudio");
  const playPauseBtn = document.getElementById("playPauseBtn");
  if (audio) {
    audio.loop = true; // Stel altyd op herhaling
    if (GIFT_CONFIG.audioSource) {
      audio.src = GIFT_CONFIG.audioSource;
    }
  }

  if (playPauseBtn && audio) {
    playPauseBtn.addEventListener("click", () => {
      if (!audio.src || audio.src === window.location.href) {
        showToast("Klanklêer nie gevind nie 🎵", "💡");
        return;
      }

      if (audio.paused) {
        audio.play().then(() => {
          isAudioPlaying = true;
          updatePlayPauseUI();
        }).catch(err => {
          console.error("Kon nie speel nie:", err);
          showToast("Kon nie klank speel nie", "⚠️");
        });
      } else {
        audio.pause();
        isAudioPlaying = false;
        updatePlayPauseUI();
      }
    });
  }

  initSealEntrance();
}

function updatePlayPauseUI() {
  const playIcon = document.getElementById("playIcon");
  const vinylDisc = document.getElementById("vinylDisc");

  if (!playIcon || !vinylDisc) return;

  if (isAudioPlaying) {
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
    vinylDisc.classList.add("vinyl-spinning");
  } else {
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    vinylDisc.classList.remove("vinyl-spinning");
  }
}

// ---------------------------------------------------
// 5. Roulerende Liefdesaanhalings (Elke 30 sekondes)
// ---------------------------------------------------
function initRotatingQuotes() {
  if (!GIFT_CONFIG.quotes || !GIFT_CONFIG.quotes.length) return;
  // Skommel lys ewekansig
  shuffledQuotes = [...GIFT_CONFIG.quotes].sort(() => Math.random() - 0.5);
  quoteIndex = 0;
}

function startQuoteRotation() {
  const quoteText = document.getElementById("quoteText");
  if (!quoteText || !shuffledQuotes.length) return;

  // Wys die eerste aanhaling dadelik
  quoteText.textContent = `"${shuffledQuotes[quoteIndex]}"`;

  if (quoteInterval) clearInterval(quoteInterval);

  // Verander elke 30 sekondes
  quoteInterval = setInterval(() => {
    quoteIndex = (quoteIndex + 1) % shuffledQuotes.length;

    // As ons weer by die begin kom, skommel weer vir vars variasie
    if (quoteIndex === 0) {
      shuffledQuotes.sort(() => Math.random() - 0.5);
    }

    quoteText.style.opacity = 0;
    quoteText.style.transform = "translateY(-6px)";

    setTimeout(() => {
      quoteText.textContent = `"${shuffledQuotes[quoteIndex]}"`;
      quoteText.style.opacity = 1;
      quoteText.style.transform = "translateY(0)";
    }, 400);
  }, 30000);
}

// ---------------------------------------------------
// 6. Discord Kennisgewings & Drukkies
// ---------------------------------------------------
function initWebhookActions() {
  const hugBtn = document.getElementById("sendHugBtn");
  const kissBtn = document.getElementById("sendKissBtn");

  if (hugBtn) {
    hugBtn.addEventListener("click", () => {
      spawnHearts(14);
      sendDiscordWebhook(
        "🫂 Drukkie Ontvang!",
        "Lies het pas vir jou 'n warm drukkie gestuur vanaf die canvas! ❤️"
      );
      showToast("'n Warm drukkie is na Xander gestuur! 🫂❤️", "✨");
    });
  }

  if (kissBtn) {
    kissBtn.addEventListener("click", () => {
      spawnHearts(14);
      sendDiscordWebhook(
        "💋 Dink aan Jou!",
        "Lies dink nou aan jou en stuur baie liefde! 💕"
      );
      showToast("Liefdevolle boodskap is na Xander gestuur! 💕", "💌");
    });
  }
}

async function sendDiscordWebhook(title, description) {
  if (!GIFT_CONFIG.discordWebhookUrl || GIFT_CONFIG.discordWebhookUrl.trim() === "") {
    console.log("Discord Webhook nie ingestel nie. (Gesimuleer:", title, description, ")");
    return;
  }

  const now = Date.now();
  if (now - lastWebhookSent < 4000) {
    return;
  }
  lastWebhookSent = now;

  const payload = {
    username: "Anniversary Kennisgewing",
    avatar_url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/2764.png",
    content: GIFT_CONFIG.discordUserIdToPing ? `<@${GIFT_CONFIG.discordUserIdToPing}>` : undefined,
    embeds: [
      {
        title: title,
        description: description,
        color: 16741772, // Roosrooi
        footer: {
          text: `Anniversary • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(GIFT_CONFIG.discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Kon nie webhook stuur nie:", err);
  }
}

// ---------------------------------------------------
// 7. Agtergrond Sterre Effek
// ---------------------------------------------------
function initBackgroundStars() {
  const container = document.getElementById("starsLayer");
  if (!container) return;

  const starCount = 30;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.borderRadius = "50%";
    star.style.backgroundColor = "rgba(255, 255, 255, " + (Math.random() * 0.7 + 0.3) + ")";
    star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.9)`;
    star.style.animation = `blink ${Math.random() * 3 + 2}s infinite alternate ease-in-out`;
    container.appendChild(star);
  }
}

// ---------------------------------------------------
// 8. Swaaiende Hartjies & Kennisgewings
// ---------------------------------------------------
function spawnHearts(count = 10) {
  const container = document.getElementById("heartsContainer");
  if (!container) return;

  const emojis = ["❤️", "💖", "✨", "💕", "🌸"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const startX = Math.random() * (window.innerWidth - 40);
    const startY = window.innerHeight * 0.75 + (Math.random() * 100);
    const size = Math.random() * 16 + 18;

    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${Math.random() * 1.5 + 1.8}s`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 3000);
  }
}

let toastTimeout;
function showToast(message, icon = "✨") {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast) return;

  msgEl.textContent = message;
  iconEl.textContent = icon;

  toast.classList.remove("hidden");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}
