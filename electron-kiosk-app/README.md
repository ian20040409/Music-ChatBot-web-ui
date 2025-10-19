# Music ChatBot Kiosk

This folder contains a minimal Electron application that wraps the existing Music ChatBot web UI in kiosk mode. It reuses the web styling from the original project and exposes a simple kiosk-friendly interface for exhibitions.

## Development

```bash
npm install
npm run start
```

By default the bundled static `renderer/index.html` is displayed. To point the kiosk window to a development server, run:

```bash
npm run start:dev
```

and make sure `ELECTRON_START_URL` is set to the target URL (for example `http://localhost:3000`).

## Packaging

Use your preferred Electron packager (such as `electron-builder` or `electron-packager`) to build platform specific installers.
