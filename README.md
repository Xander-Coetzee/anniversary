# 🌌 Under the Same Sky — NFC Canvas Gift Website

A personalized, interactive web app designed to launch instantly when your girlfriend taps the physical NFC sticker on your hand-drawn canvas gift.

Designed with romantic celestial glassmorphism, background art (`UmbraEarth1050.jpg`), custom vinyl music player, Discord reverse-notifications ("Send a Hug", "Coffee Voucher"), interactive "Open When..." letters, and memory links.

---

## ✨ Features

1. **Magical Reveal Entrance**:
   - Tap the glowing wax seal to break the seal and unlock the canvas.
   - **Crucial iOS perk**: Solves Apple Safari's strict autoplay restrictions by using the user's first tap to seamlessly initialize and play the audio with sound!
2. **Vinyl Music Player**:
   - Supports local MP3 playback with a spinning vinyl disc animation, progress bar, and seek bar.
   - Direct button to launch Spotify via Universal Links.
3. **Discord "Thinking of You" Webhooks**:
   - Instant silent ping to your Discord channel when she scans the canvas.
   - Interactive buttons:
     - **Send a Hug 🫂**: Pings your phone and bursts floating hearts across her screen.
     - **Coffee Voucher ☕**: Redeems a coffee/treat request straight to your Discord.
     - **Thinking of You 💋**: Quick greeting.
     - Notifies you whenever she opens an "Open When..." letter!
4. **"Open When..." Digital Envelopes**:
   - Interactive cards (*"Open when you miss me"*, *"Open when you're stressed"*, etc.) with heartfelt modal popups.
5. **Love Reasons Randomizer**:
   - Dynamic jar of compliments and favorite memories that picks a new reason each tap.
6. **Days Together Counter**:
   - Dynamically calculated from your anniversary date.
7. **Quick Links**:
   - One-tap links to shared photo albums, first date coordinates on Google/Apple Maps, or direct FaceTime/call.

---

## 🛠️ Quick Customization (`config.js`)

All personal information is cleanly organized in [`config.js`](./config.js):

1. **Names & Anniversary**:
   ```javascript
   recipientName: "Her Name",
   senderName: "Your Name",
   anniversaryDate: "2024-01-01", // YYYY-MM-DD
   ```
2. **Your Song**:
   - Drop your audio file into `assets/` (e.g. `assets/our-song.mp3`).
   - Or paste your Spotify track link in `spotifyUrl`.
3. **Discord Webhook**:
   - In Discord: Go to **Server Settings -> Integrations -> Webhooks -> New Webhook -> Copy Webhook URL**.
   - Paste it into `discordWebhookUrl`:
     ```javascript
     discordWebhookUrl: "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
     ```
4. **Letters & Reasons**:
   - Customize the text in `openWhenLetters` and `reasonsWhy` to your own memories and inside jokes!

---

## 🌐 100% Free Hosting (GitHub Pages)

GitHub Pages hosts this website completely free forever with HTTPS.

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name the repo: `canvas-gift` (or whatever you prefer).
3. Choose **Public** (or **Private** if you use Cloudflare Pages/Vercel).
4. Do not initialize with README (we already have one).

### Step 2: Push Your Code
Run these commands in PowerShell inside `C:\Users\xander\source\repos\canvas-gift`:
```powershell
git add .
git commit -m "Initial commit for NFC Canvas Gift"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/canvas-gift.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub -> **Settings** -> **Pages** (in the left sidebar).
2. Under **Build and deployment -> Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. In ~60 seconds, your site will be live at:
   ```text
   https://<YOUR_GITHUB_USERNAME>.github.io/canvas-gift/
   ```

> **Security Note regarding Discord Webhook on Public Repos:**  
> If you make the GitHub repo public, your webhook URL is readable in `config.js`. If you prefer keeping the repo private or hiding the URL:
> - You can host for free on **Cloudflare Pages** (supports private GitHub repos for free).
> - Or leave the repo public and use a free 5-line Cloudflare Worker as a proxy!

---

## 📱 Writing to the Physical NFC Tag

Follow the steps from your **NFC Gift and Homelab Guide**:

1. Open **NFC Tools** on your Samsung Galaxy A34.
2. Select **Write** -> **Add a record** -> **URL / URI**.
3. Enter your live website URL:
   ```text
   https://<YOUR_GITHUB_USERNAME>.github.io/canvas-gift/
   ```
4. Tap **Write** and touch the tag to the back of your phone.
5. When tested on her iPhone (top rim near front camera), iOS will automatically display the drop-down banner opening Safari straight to your gift!
