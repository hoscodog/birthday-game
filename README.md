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
- `?room=break` starts a new game in that room (`scrub`, `break`, `recovery`, `chapel`, `nursery`, `or`).

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
js/scenes/recovery.js room 3: recovery room 13 (tattoo cipher)
js/scenes/chapel.js   room 4: chapel (the safe room)
js/scenes/nursery.js  room 5: nursery
js/scenes/or.js       room 6: OR 1, the finale and birthday surprise
assets/               optional photos for the finale (see below)
```

## Walkthrough (spoilers)

1. Scrub room: the bench carving shows 1 · 20, so the locker code is 0120. Take the jellyfish, the poem page and the red yarn, then leave by the hallway door.
2. Break room: pull a shot on the espresso machine (grind, tamp, pull, steam) to recharge the flashlight. Press play on the boombox, then click it again for page II. Click the vent twice (Dio, jump scare) to get the staff badge, then use the surgical wing door.
3. Recovery room 13: flip the switch next to the light box. The X-ray shows four tattoos (rose, jellyfish, jellyfish, crescent moon). The patient chart's flash sheet gives each design a number, so the door code is 1997. Page III is in the bedside drawer. Optional: under the bed is Kagura's squeaky bone.
4. Chapel (safe room, flashlight doesn't drain): take the matches from the lost and found and light all five candles. Psalm 23:4 appears on the wall, so the nursery code is 234. Page IV is in the Bible on the lectern.
5. Nursery: click the crib for the onesie (page V) and the wristband (DOB 11/29/1997). The OR door code is 1129. Optional: Kana's tennis ball is under the rocking chair.
6. OR 1: check the back table against the count on the whiteboard. One Kelly clamp is missing (6 on the sheet, 5 on the table). A clamp slides in under the doors; use it on the broken breaker handle. In the blackout, click the hand and do the handshake: dap index fingers, finger bump, finger guns, blow the smoke. Lights on, party. The card on the cake has page VI, then the final verse and the song link.

## Photos

Put photos in `assets/` named `photo1.jpg`, `photo2.jpg`, ... up to `photo8` (`.png` works too). The first three hang as polaroids in the finale, and all of them show on the last screen. Nothing breaks if there are none.

When the lights come on, "Wes Anderson" by Alex Lahey starts playing in a Spotify player in the bottom-right corner (the track is set at the top of `js/scenes/or.js`). Spotify plays the full song only if she's logged in to Spotify in that browser; otherwise it plays a 30-second preview. If the player can't load at all, a music-box Happy Birthday plays instead, and the last screen's "Open in Spotify" link still works.

## Deploy

Push to `main`, then in GitHub: Settings → Pages → Deploy from branch → `main` / root.
