# The Night Shift

A small browser horror game for Debbie's birthday. She gets paged at 3:00 AM to St. Nani Mami Hospital and works her way through the building with a flashlight, finding torn poem pages along the way.

## Run locally

No build step. Serve the folder with any static server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly won't work because the scripts are ES modules.)

Handy URL options while testing:

- `?reset` clears the saved progress.
- `?room=break` starts a new game in the break room (`scrub`, `break`, `wing`).

## Structure

```
index.html            page, HUD, dialog and modal containers
css/style.css         all styling
js/main.js            game state, render loop, flashlight, input, room switching, intro
js/ui.js              dialog box, keypad, ordered-steps puzzle, poem pages, journal, fades
js/audio.js           all sound, generated with the Web Audio API (no audio files)
js/draw.js            canvas helpers, the crocheted jellyfish, Dio
js/poems.js           the poem, split into pages
js/scenes/scrub.js    room 1: scrub room
js/scenes/breakroom.js room 2: break room
js/scenes/wing.js     placeholder for the rest of the hospital
assets/               photos to use in later rooms
```

## Walkthrough (spoilers)

1. Scrub room: the bench carving shows 1 · 20, so the locker code is 0120. Take the jellyfish, the poem page and the red yarn, then leave by the hallway door.
2. Break room: pull a shot on the espresso machine (grind, tamp, pull, steam) to recharge the flashlight. Press play on the boombox, then click it again for page II. Click the vent twice (Dio, jump scare) to get the staff badge, then use the surgical wing door.

## Deploy

Push to `main`, then in GitHub: Settings → Pages → Deploy from branch → `main` / root.
