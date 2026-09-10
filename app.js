// ===================================================
// Under the Same Sky - Interactive Logic & Audio Engine
// ===================================================

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let isAudioPlaying = false;
let lastWebhookSent = 0;
let lastReasonIndex = -1;

function initApp() {
  populatePersonalData();
  initStarsBackground();
  initAudioPlayer();
  initSealEntrance();
  initWebhookActions();
  initEnvelopes();
  initReasonsJar();
  initLinks();
  initModal();
}

// ---------------------------------------------------
// 1. Populate Personal Content from config.js
// ---------------------------------------------------
function populatePersonalData() {
  if (typeof GIFT_CONFIG === "undefined") return;

  // Titles
  document.title = GIFT_CONFIG.title || "Under the Same Sky";
  const introTitle = document.getElementById("introTitle");
  if (introTitle) introTitle.textContent = `For ${GIFT_CONFIG.recipientName || "You"}`;

  const mainTitle = document.getElementById("mainTitle");
  if (mainTitle) mainTitle.textContent = GIFT_CONFIG.title;

  const mainSubtitle = document.getElementById("mainSubtitle");
  if (mainSubtitle) mainSubtitle.textContent = GIFT_CONFIG.subtitle;

  const modalSender = document.getElementById("modalSender");
  if (modalSender) modalSender.textContent = GIFT_CONFIG.senderName || "Me";

  // Spotify Direct Link
  const spotifyLink = document.getElementById("spotifyDirectLink");
  if (spotifyLink && GIFT_CONFIG.spotifyUrl) {
    spotifyLink.href = GIFT_CONFIG.spotifyUrl;
  }

  // Days Together Counter
  if (GIFT_CONFIG.anniversaryDate) {
    const start = new Date(GIFT_CONFIG.anniversaryDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysCount = document.getElementById("daysCount");
    if (daysCount) daysCount.textContent = diffDays;
  }
}

// ---------------------------------------------------
// 2. Stars Background Generator
// ---------------------------------------------------
function initStarsBackground() {
  const container = document.getElementById("starsLayer");
  if (!container) return;

  const starCount = 35;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 2.5 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.borderRadius = "50%";
    star.style.backgroundColor = "rgba(255, 255, 255, " + (Math.random() * 0.7 + 0.3) + ")";
    star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`;
    star.style.animation = `blink ${Math.random() * 3 + 2}s infinite alternate ease-in-out`;
    container.appendChild(star);
  }
}

// ---------------------------------------------------
// 3. Wax Seal Tap-to-Reveal (Unlocks Audio on iOS)
// ---------------------------------------------------
function initSealEntrance() {
  const sealBtn = document.getElementById("sealBtn");
  const introScreen = document.getElementById("introScreen");
  const mainContent = document.getElementById("mainContent");

  if (!sealBtn) return;

  sealBtn.addEventListener("click", () => {
    // Spawn heart explosion
    spawnHearts(15);

    // Fade out intro
    introScreen.classList.add("fade-out");

    setTimeout(() => {
      introScreen.classList.add("hidden");
      mainContent.classList.remove("hidden");

      // Auto start audio if available
      const audio = document.getElementById("bgAudio");
      if (audio && GIFT_CONFIG.audioSource) {
        audio.play().then(() => {
          isAudioPlaying = true;
          updatePlayPauseUI();
        }).catch(err => {
          console.log("Audio autoplay prevented, ready on manual play:", err);
        });
      }

      // Notify Discord that she scanned the tag!
      if (GIFT_CONFIG.notifyOnPageLoad) {
        sendDiscordWebhook("🎨 Canvas Scanned!", `Your girlfriend just tapped the NFC tag and opened the canvas website! ❤️`);
      }
    }, 600);
  });
}

// ---------------------------------------------------
// 4. Audio Player Engine
// ---------------------------------------------------
function initAudioPlayer() {
  const audio = document.getElementById("bgAudio");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const progressFill = document.getElementById("progressFill");
  const progressContainer = document.getElementById("progressContainer");
  const trackTitle = document.getElementById("trackTitle");
  const trackArtist = document.getElementById("trackArtist");
  const currentTimeEl = document.getElementById("currentTime");
  const totalDurationEl = document.getElementById("totalDuration");

  if (!audio) return;

  if (GIFT_CONFIG.songTitle) trackTitle.textContent = GIFT_CONFIG.songTitle;
  if (GIFT_CONFIG.songArtist) trackArtist.textContent = GIFT_CONFIG.songArtist;

  if (GIFT_CONFIG.audioSource) {
    audio.src = GIFT_CONFIG.audioSource;
  } else {
    trackArtist.textContent = "Tap 'Open Spotify' above to listen!";
  }

  // Play / Pause Toggle
  playPauseBtn.addEventListener("click", () => {
    if (!audio.src) {
      showToast("Add your audio file to assets/our-song.mp3! 🎵", "💡");
      return;
    }

    if (audio.paused) {
      audio.play().then(() => {
        isAudioPlaying = true;
        updatePlayPauseUI();
      }).catch(e => {
        console.error("Audio playback error:", e);
        showToast("Audio couldn't start", "⚠️");
      });
    } else {
      audio.pause();
      isAudioPlaying = false;
      updatePlayPauseUI();
    }
  });

  // Time & Progress Updates
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    totalDurationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    isAudioPlaying = false;
    updatePlayPauseUI();
    progressFill.style.width = "0%";
  });

  // Seek bar click
  if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
      if (!audio.duration) return;
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      audio.currentTime = (clickX / width) * audio.duration;
    });
  }
}

function updatePlayPauseUI() {
  const playIcon = document.getElementById("playIcon");
  const vinylDisc = document.getElementById("vinylDisc");

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

function formatTime(secs) {
  const m = Math.floor(secs / 60) || 0;
  const s = Math.floor(secs % 60) || 0;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// ---------------------------------------------------
// 5. Discord Webhook & Reverse Notifications
// ---------------------------------------------------
function initWebhookActions() {
  const hugBtn = document.getElementById("sendHugBtn");
  const coffeeBtn = document.getElementById("sendCoffeeBtn");
  const kissBtn = document.getElementById("sendKissBtn");

  if (hugBtn) {
    hugBtn.addEventListener("click", () => {
      spawnHearts(12);
      sendDiscordWebhook(
        "🫂 Hug Received!",
        `She just sent you a warm hug from the canvas! ❤️`
      );
      showToast("Sent a warm hug to Xander! 🫂❤️", "✨");
    });
  }

  if (coffeeBtn) {
    coffeeBtn.addEventListener("click", () => {
      spawnHearts(8);
      sendDiscordWebhook(
        "☕ Coffee & Treat Voucher Redeemed!",
        `She redeemed her Coffee Voucher! Time to bring or make her a sweet treat! ☕🍰`
      );
      showToast("Coffee voucher sent to Xander! ☕✨", "🎉");
    });
  }

  if (kissBtn) {
    kissBtn.addEventListener("click", () => {
      spawnHearts(12);
      sendDiscordWebhook(
        "💋 Thinking of You!",
        `She tapped 'Thinking of You' on the canvas! 💕`
      );
      showToast("Thinking of you note sent! 💕", "💌");
    });
  }
}

async function sendDiscordWebhook(title, description) {
  if (!GIFT_CONFIG.discordWebhookUrl || GIFT_CONFIG.discordWebhookUrl.trim() === "") {
    console.log("Discord Webhook URL not set in config.js. (Simulated:", title, description, ")");
    return;
  }

  // Prevent spamming (5-second throttle)
  const now = Date.now();
  if (now - lastWebhookSent < 4000) {
    console.log("Throttled webhook request");
    return;
  }
  lastWebhookSent = now;

  const payload = {
    username: "NFC Canvas Heartbeat",
    avatar_url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/2764.png",
    embeds: [
      {
        title: title,
        description: description,
        color: 16741772, // Rose/Pink accent
        footer: {
          text: `Under the Same Sky • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(GIFT_CONFIG.discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed to send webhook:", err);
  }
}

// ---------------------------------------------------
// 6. "Open When..." Envelopes
// ---------------------------------------------------
function initEnvelopes() {
  const container = document.getElementById("envelopesGrid");
  if (!container || !GIFT_CONFIG.openWhenLetters) return;

  container.innerHTML = "";
  GIFT_CONFIG.openWhenLetters.forEach(letter => {
    const card = document.createElement("div");
    card.className = "envelope-card";
    card.innerHTML = `
      <span class="env-emoji">${letter.emoji || "💌"}</span>
      <span class="env-tag">${letter.tag || "Open when..."}</span>
      <h4 class="env-title">${letter.title}</h4>
    `;

    card.addEventListener("click", () => {
      openLetterModal(letter);
      // Optional: notify Discord she opened this specific letter
      sendDiscordWebhook(
        "💌 Letter Opened",
        `She just opened the "${letter.title}" letter on the canvas! 🥺`
      );
    });

    container.appendChild(card);
  });
}

// ---------------------------------------------------
// 7. Reasons Why Jar
// ---------------------------------------------------
function initReasonsJar() {
  const nextBtn = document.getElementById("nextReasonBtn");
  const reasonText = document.getElementById("reasonText");

  if (!nextBtn || !reasonText || !GIFT_CONFIG.reasonsWhy) return;

  nextBtn.addEventListener("click", () => {
    spawnHearts(5);
    const reasons = GIFT_CONFIG.reasonsWhy;
    if (!reasons.length) return;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * reasons.length);
    } while (reasons.length > 1 && nextIndex === lastReasonIndex);

    lastReasonIndex = nextIndex;

    reasonText.style.opacity = 0;
    setTimeout(() => {
      reasonText.textContent = `"${reasons[nextIndex]}"`;
      reasonText.style.opacity = 1;
    }, 200);
  });
}

// ---------------------------------------------------
// 8. Quick Shortcuts / Links
// ---------------------------------------------------
function initLinks() {
  const container = document.getElementById("linksGrid");
  if (!container || !GIFT_CONFIG.links) return;

  container.innerHTML = "";
  GIFT_CONFIG.links.forEach(link => {
    const item = document.createElement("a");
    item.className = "link-item";
    item.href = link.url;
    item.target = "_blank";
    item.rel = "noopener noreferrer";

    item.innerHTML = `
      <div class="link-icon">
        <i class="fa-solid ${link.icon || 'fa-arrow-up-right-from-square'}"></i>
      </div>
      <div class="link-text">
        <strong>${link.label}</strong>
        <small>${link.subtitle}</small>
      </div>
    `;

    container.appendChild(item);
  });
}

// ---------------------------------------------------
// 9. Letter Modal
// ---------------------------------------------------
function initModal() {
  const modal = document.getElementById("letterModal");
  const closeBtn = document.getElementById("closeModalBtn");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

function openLetterModal(letter) {
  const modal = document.getElementById("letterModal");
  const emoji = document.getElementById("modalEmoji");
  const tag = document.getElementById("modalTag");
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("modalLetterText");

  if (!modal) return;

  emoji.textContent = letter.emoji || "💌";
  tag.textContent = letter.tag || "Open when...";
  title.textContent = letter.title;
  text.textContent = letter.letter;

  modal.classList.remove("hidden");
}

// ---------------------------------------------------
// 10. Floating Hearts & Confetti Generator
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

// ---------------------------------------------------
// 11. Toast Utility
// ---------------------------------------------------
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
