# The Intuitial Bird Club

A bird photography journal, meme gallery, and browser arcade game built with plain HTML, CSS, and JavaScript.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --directory little-bird-club/dist
```

Open http://localhost:4173. No package installation or build step is required.

## Flock Invaders

- Choose Easy, Normal, or Hard before starting a run. Easy keeps the original gameplay; Normal makes enemies and their projectiles 25% faster, and Hard makes them 50% faster. Higher modes also shorten enemy firing intervals, while boss volleys retain a minimum one-second interval and a 2.1-second break after every three volleys. The mode stays fixed through pauses and continues; a new run can use a different mode.
- Move in four directions with the arrow keys or W/A/S/D; fire with Space; pause with P.
- On phones, use the on-screen movement and fire buttons.
- Use the Sound button to mute or enable music and effects. Audio starts after pressing Play.
- Waves 1 and 2 introduce six bird species. Bosses alternate every third wave: turkey vulture on waves 3, 9, 15; seagull on waves 6, 12, 18. Each species grows stronger on its next encounter. Vultures keep their repeating fan / left / right volleys, minimum one-second firing interval, and 2.1-second rest after each three-volley cycle. Defeat the first vulture to trigger its split cinematic: the first vulture encounter splits into two birds, the next into three, and so on.
- The seagull is a wide, two-frame boss with a single health bar: 80 HP on its first encounter, increasing by 20 HP each time it returns. It fires a crescent of 20 blue shots with three missing positions forming a dodge corridor. The gap cycles center / right / center / left, with dashed blue guides during the final 0.8 seconds before firing. Shots travel straight without tracking. Above half health, crescents fire every 3 seconds on Easy, 2.4 on Normal, and 2 on Hard. At half health and below, each volley becomes a three-crescent burst with changing openings: 1.1 seconds between crescents, followed by a 1.8-second recovery on Easy; these intervals are divided by the mode’s speed multiplier on Normal and Hard. Between crescents, the seagull also locks onto the player’s position with a pink reticle for 0.6 seconds, then fires three aimed shots at that fixed position. Aimed volleys repeat every 2.2 seconds above half health and 1.65 seconds at half health or below, divided by the mode’s speed multiplier. These shots do not home after firing.
- Clear either boss for 2,000 bonus points, one extra life, and the next wave. Every third cleared boss also awards one continue. After game over, a continue retries the current wave with three lives while retaining score and activated powers. Starting a new run resets these rewards.
- Every fifth defeated bird drops a pickup; bosses drop one every 10 seconds. Collect the gold lightning bolts for rapid fire, blue shield for invincibility, or green ship formation for escorts. Each lasts 12 seconds, different types stack, and collecting the same type refreshes its timer. Timers pause during breaks and boss cinematics; permanent code powers are independent.
- The best score is stored in the browser's local storage.

## Files

| Path | Purpose |
| --- | --- |
| `little-bird-club/dist/index.html` | Page and game controls |
| `little-bird-club/dist/style.css`, `meme.css` | Site styling |
| `little-bird-club/dist/app.js` | Gallery, filters, photo viewer, and comparison slider |
| `little-bird-club/dist/game.js` | Gameplay, sprites, effects, and music |
| `little-bird-club/dist/assets/` | Photographs, video clips, sprites, and music |

The application files live in `little-bird-club/dist/`; this folder is the editable source, not disposable build output.

## Hosting

The GitHub Actions workflow in `.github/workflows/bird-review-pages.yml` publishes the static site to GitHub Pages. It runs when website files change on `main`, and can also be started manually from the Actions tab. The repository's Pages publishing source is **GitHub Actions**.

Website: https://ksantiagobah.github.io/BirdReview/

## Bird GIFs

`bird-gifs/` contains transparent, looping 256×256 GIFs for the cardinal, parakeet, robin, sparrow, dove, pigeon, and turkey vulture. Each has exactly two wing poses at 180 milliseconds per frame, exported from the game's existing sprite sheets. These exports are separate from the sprite sheets used by the game.

## Check changes

```sh
node --check little-bird-club/dist/app.js
node --check little-bird-club/dist/game.js
git diff --check
```

Then preview the site and check gallery filters, photo/video viewing, keyboard and touch controls, music, mute/pause, and both boss phases. There is no committed automated test suite.

## Credits and licensing

See [CREDITS.md](CREDITS.md) for asset provenance and music credits. A project-wide license has not been selected, and music license documentation has not been supplied.

Deployment archives, preview screenshots, generation prompt notes, and the backed-up standalone Git history are excluded from this repository.
