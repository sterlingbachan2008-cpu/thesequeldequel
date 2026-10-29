# Star Drift

A small HTML canvas arcade game. Collect gold stars, dodge pink asteroids, and beat your personal best. No packages, build step, accounts, or external assets required.

## Play

Open `index.html` in a modern browser, or serve the project:

```sh
cd /workspace/thesequeldequel
python3 -m http.server 8000 --bind 0.0.0.0
```

Use left/right arrows or A/D to steer. On a touchscreen, drag the ship. Press P or use the Pause button to pause. Losing focus pauses the game automatically. Each star earns 10 points; difficulty increases over time. High scores are stored locally when browser storage is available.

## Develop

Edit `index.html`, `style.css`, and `game.js`; refresh the browser to see changes. Check JavaScript syntax with `node --check game.js`. Verify movement, star collection, collisions, pause/resume, restart, and mobile drag in a browser.
