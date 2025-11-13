# Music-ChatBot Web UI

A responsive single-page interface for interacting with a music-focused chatbot. The UI ships with a RAG knowledge-base option, local/offline model slots, a suggestion carousel, and onboarding safeguards such as Google reCAPTCHA and audio-based feedback cues. It is fully client-side and can be hosted on any static server.

## ✨ Features
- **Multi-mode selector** – Toggle between RAG, local, and Ollama (disabled placeholder) modes via both radio buttons and a mobile-friendly dropdown.
- **Suggestion chips** – Tap-to-fill prompt ideas rendered as animated pills with horizontal scrolling on mobile.
- **PWA-ready** – Includes a service worker (`static/sw.js`), manifest, and install banner hook for a near-native feel.
- **Google reCAPTCHA gate** – Blocks interaction until the user verifies they’re human; the verification modal can be retriggered at any time.
- **Advanced style presets** – Temperature/token sliders plus one-click “Scholar / Chat / Creative” presets and a rounded, touch-friendly control panel.
- **Sound effects & micro-animations** – Click/thinking audio cues, hover states, and glassmorphic gradients keep the experience lively.
- **Mobile-first layout** – Input stays docked at the bottom, safe-area aware, with a condensed “回答風格” button for quick access.

## 🗂 Project Structure
```
.
├── index.html             # Main page (Bootstrap-powered layout)
├── static/
│   ├── style.css          # Global, mobile, and dark-mode styling
│   ├── app.js             # UI logic, reCAPTCHA flow, audio hooks, presets
│   ├── manifest.webmanifest
│   ├── sw.js              # Service worker for offline cache
│   ├── *.mp3              # UI sound effects
│   └── icon/              # PWA icons / favicons
└── LICENSE
```

## 🚀 Getting Started
1. **Clone**
   ```bash
   git clone https://github.com/ian20040409/Music-ChatBot-web-ui.git
   cd Music-ChatBot-web-ui
   ```
2. **Serve statically** (pick one)
   - Open `index.html` directly in a modern browser, or
   - Use a simple server for proper PWA/reCAPTCHA behavior:
     ```bash
     python3 -m http.server 8080
     # visit http://localhost:8080
     ```
3. **Complete reCAPTCHA** when prompted; once verified, the chat input and suggestion chips are unlocked.

## ⚙️ Configuration Tips
- **Google reCAPTCHA**: replace the site key inside `static/app.js` with your own credentials for production deployments.
- **Model endpoints**: wire up your API calls inside `app.js` (the current version only simulates responses via front-end logic).
- **Branding**: swap icons/images under `static/icon/`, adjust gradients in `static/style.css`, and update copy in `index.html`.
- **Audio**: replace the MP3 files in `static/` or mute interactions by removing the sound hooks in `app.js`.

## 📄 License
This project is released under the MIT License. See [`LICENSE`](LICENSE) for details.
