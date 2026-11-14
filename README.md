# The Intuitial Bird Club

A bird photography journal, meme gallery, and browser arcade game built with plain HTML, CSS, and JavaScript.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --directory little-bird-club/dist
```

Open http://localhost:4173. No package installation or build step is required.

## Flock Invaders

- Move in four directions with the arrow keys or W/A/S/D; fire with Space; pause with P.
- On phones, use the on-screen movement and fire buttons.
- Use the Sound button to mute or enable music and effects. Audio starts after pressing Play.
- Waves 1 and 2 introduce six bird species. Every third wave (3, 6, 9, and so on) introduces a turkey vulture boss. Each encounter increases boss health, twin health, movement speed, and attack frequency within a fixed limit. Bosses fire one at a time in a repeating fan / left / right pattern, telegraph the next shooter, and pause for 2.1 seconds after each three-volley cycle. Boss shots do not track the player; firing intervals stay at or above one second and projectile speed is capped.
- Defeat the first vulture to trigger a split cinematic. Boss 1 splits into two vultures, boss 2 into three, boss 3 into four, and so on. Clear the full fight for 2,000 bonus points, one extra life, and the next wave. Every third cleared boss also awards one continue. After game over, a continue retries the current wave with three lives while retaining score and activated powers. Starting a new run resets these rewards.
- Every fifth defeated bird drops a pickup; bosses drop one every 10 seconds. Collect R for rapid fire, S for invincibility, or E for escort ships. Each lasts 12 seconds, different types stack, and collecting the same type refreshes its timer. Timers pause during breaks and boss cinematics; permanent code powers are independent.
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
