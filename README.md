# DuckHunt JS AutoPlay AI

This repository is a Duck Hunt JavaScript fork with AI-assisted gameplay for detecting ducks, moving the crosshair, and firing automatically.

The project uses PixiJS for rendering, Green Sock for animation, Howler for audio, and a browser worker for machine learning inference.

## What Is Different In This Version

- The crosshair can be controlled by AI instead of relying on player clicks.
- The inference worker sends the best prediction detected for each processed frame.
- AI shots are resolved directly in the game flow instead of reusing the UI click handler.

## Repository Layout

This repository versions the source code, the static game assets, and the base HTML files in `dist/`. Webpack-generated bundles remain out of Git.

## Rendering

This game supports WebGL and Canvas rendering through the PixiJS rendering engine.

## Audio

The game attempts to use the Web Audio API and falls back to HTML5 Audio when needed. Audio playback is handled with Howler.

## Tweening

Animations are built from PixiJS movie clips generated from sprite images together with Green Sock tweens.

## Game Logic

Core game flow is implemented in JavaScript using ES6 classes and transpiled for browser compatibility.

## Working With This Repo

- Install [Node.js](https://nodejs.org/).
- Clone the repository.
- Run `npm install`.
- Run `npm start` to start the local dev server at `http://localhost:8080/`.
- Run `npm run build` to generate a production bundle.

## Working With Audio And Visual Assets

This repository keeps the source assets required by the game. If you want to rebuild generated audio or sprite assets, the following tasks are available:

- Run `npm run audio` to rebuild audio assets. This requires [ffmpeg](https://ffmpeg.org/download.html).
- Run `npm run images` to rebuild image assets. This requires [TexturePacker](https://www.codeandweb.com/texturepacker/download).

## Repository

GitHub: `https://github.com/caarlosmoura/duckhunt-js-autoplay-ai`

## Contributing

Pull requests are welcome. Run `npm run lint` before submitting changes and include generated files only when they are intentionally part of the change.
