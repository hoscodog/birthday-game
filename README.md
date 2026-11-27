# birthday-game

A small browser horror game with a birthday surprise at the end.

## Run locally

No build step. Serve the folder with any static server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly may not work because `js/main.js` is an ES module.)

## Structure

```
index.html      entry page
css/style.css   styles
js/main.js      canvas setup, input, game loop
assets/         images and sounds
```

## Deploy

Pushes to `main` can be served by GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) or by Netlify/Vercel.
