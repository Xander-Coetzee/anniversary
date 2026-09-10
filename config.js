// ==========================================
// 💖 NFC Canvas Gift - Personal Configuration
// ==========================================
// Edit this file to customize your gift! Everything is commented so you know exactly what to change.

const GIFT_CONFIG = {
  // Names & Title
  recipientName: "My Love",
  senderName: "Xander",
  title: "Under the Same Sky",
  subtitle: "Every time you tap the canvas, I'm thinking of you.",

  // Anniversary or Special Date (Format: YYYY-MM-DD)
  // Calculates dynamic "Days Together" counter!
  anniversaryDate: "2024-01-01",

  // ------------------------------------------
  // 🎵 Music Settings
  // ------------------------------------------
  // Option A: Put an MP3 in assets/ and specify filename (e.g., "assets/our-song.mp3")
  // Option B: Provide a direct URL or leave empty to use Spotify link only
  audioSource: "assets/our-song.mp3", 
  songTitle: "Our Special Song",
  songArtist: "Favorite Artist",
  
  // Spotify Direct Link (Opened when tapping "Listen on Spotify")
  spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",

  // ------------------------------------------
  // 🔔 Discord Webhook Settings
  // ------------------------------------------
  // Paste your Discord Webhook URL here.
  // When she taps the NFC tag or presses buttons, you will get instant phone alerts!
  // (Leave empty "" during initial testing if you don't have one ready yet)
  discordWebhookUrl: "", 

  // Toggle if you want an automatic silent ping when she first scans/opens the page
  notifyOnPageLoad: true,

  // ------------------------------------------
  // 💌 "Open When..." Letters
  // ------------------------------------------
  openWhenLetters: [
    {
      id: "miss-me",
      emoji: "🧸",
      tag: "Open when...",
      title: "You miss me",
      letter: "No matter how far apart we are, remember you are always in my heart. Close your eyes, take a deep breath, and remember that I am always just one call away. I love you endlessly!"
    },
    {
      id: "stressed",
      emoji: "☕",
      tag: "Open when...",
      title: "You're feeling stressed",
      letter: "Pause for a second, unclench your jaw, and drop your shoulders. You are capable of handling whatever today brings, but you don't have to carry it alone. Drink some water, take a breath, and let me pamper you later."
    },
    {
      id: "smile",
      emoji: "✨",
      tag: "Open when...",
      title: "You need a smile",
      letter: "Did you know that you have the most breathtaking smile in the entire universe? Every moment spent with you is my favorite memory. Here is your daily reminder that you are deeply cherished."
    },
    {
      id: "cant-sleep",
      emoji: "🌙",
      tag: "Open when...",
      title: "You can't sleep",
      letter: "Look up at the stars (or this painting!). We are resting under the exact same sky. Think of our favorite cozy memories together, wrapped up in blankets with nowhere else we'd rather be. Sweet dreams, my angel."
    }
  ],

  // ------------------------------------------
  // 🎲 "Reasons Why I Love You" (Random Jar)
  // ------------------------------------------
  reasonsWhy: [
    "The way your eyes light up whenever you talk about things you love.",
    "Your laugh, which is honestly the prettiest sound in the world.",
    "How cozy and safe it feels just resting my head next to you.",
    "Your kindness, empathy, and the endless warmth you give to everyone around you.",
    "The little goofy jokes and inside references only the two of us understand.",
    "How you make even a mundane trip to the grocery store feel like an adventure.",
    "Because you are my favorite person, my best friend, and my home."
  ],

  // ------------------------------------------
  // 📍 Special Shortcuts / External Links
  // ------------------------------------------
  links: [
    {
      icon: "fa-camera",
      label: "Our Memories",
      subtitle: "Shared photo album",
      url: "https://photos.google.com" // Replace with your iCloud or Google Photos album link
    },
    {
      icon: "fa-map-pin",
      label: "Where It Began",
      subtitle: "The spot of our first date",
      url: "https://maps.google.com" // Replace with Google/Apple Maps location
    },
    {
      icon: "fa-phone",
      label: "Call Me Anytime",
      subtitle: "One tap to reach me",
      url: "tel:+1234567890" // Replace with your phone number or FaceTime link
    }
  ]
};
