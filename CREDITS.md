# Credits and asset provenance

## Photography and video

The photographs and short video clips in `little-bird-club/dist/assets/IMG_*` come from Intuitial's supplied personal bird and wildlife collection. The website credits the photography to its owner.

## Sprite artwork and effects

The bird sprite sheets were generated with OpenAI's image generation tool using photographs from the supplied collection as species references:

- `bird-sprites.png`: cardinal and parakeet animation frames.
- `bird-neighbors.png`: original expanded bird roster artwork.
- `bird-neighbors-flapping.png`: robin, sparrow, dove, pigeon, and turkey vulture wing animation frames.
- `spacecraft.png`: flagship and escort spacecraft sprites, generated with the built-in OpenAI image generation tool.
- `seagull-boss.png`: two-frame seagull boss, generated and widened with the built-in OpenAI image generation tool using the existing sprite sheet as a style reference.

The two-frame GIF exports in `bird-gifs/` are derived from those sprite sheets.

Arcade effects and stylized chirps, coos, and hisses are synthesized in `game.js` with Web Audio. They are not field recordings. The split and defeat sequences and the lightning, shield, and escort pickup icons are drawn in the game's canvas.

### Seagull artwork prompt

The final built-in imagegen edit used the first generated seagull sheet as its reference:

> Edit this two-frame seagull boss sprite sheet. Make this seagull noticeably WIDER and more imposing, distinct as a powerful arcade boss. Give him a broad heavy chest and very long, thick outstretched gray wings with bold black tips; overall bird silhouette about 1.7 times wider than tall even in the raised-wing pose. Keep white head and chest, yellow beak, orange feet, stern eyes, chunky pixel art, dark purple outline, and genuinely transparent background. Exactly two animation frames side by side in equal square cells: wings angled upward on left, wings angled downward on right. Keep body center and scale identical between frames, keep complete birds inside each cell with margins. No accessories, crown, text, border, background or extra birds. Make the body muscular and boss-like and the wingspan the dominant feature.

### Spacecraft artwork prompt

> Use case: stylized-concept. Asset type: two spacecraft sprites for a top-down pixel-art browser arcade shooter. Exactly TWO equal square cells in one horizontal row, genuinely transparent background. Left cell: player flagship facing straight UP viewed directly from above, sleek angular interceptor with swept wings, pointed nose, layered silver-gray armor, lime green accent panels, cyan glass cockpit and twin small bright orange engine exhausts at bottom. Right cell: escort wingman also facing straight UP viewed directly from above, a different smaller and narrower fighter silhouette with swept fins, steel gray armor, cyan blue accent panels and cockpit, orange engines. Chunky crisp 16-bit pixel-art sprites, dark purple outlines and rich readable shaded panels, matching a whimsical bird arcade game but serious cool spacecraft. Both silhouettes centered in their own cell with complete wings and nose and exhaust visible and 12 percent transparent margins on every side. Clear independent sprites, no scene, no background, no text, no border, no labels, no weapons fire, no stars, no extra ships. Output wide 2:1 image.

## Music

Credits below follow the supplied filenames and the game's displayed credits.

| Track | Artist | Project file | Original supplied filename |
| --- | --- | --- | --- |
| Cruising Down 8bit Lane | Monument Music | `little-bird-club/dist/assets/level-cruising-8bit.mp3` | `monument_music-cruising-down-8bit-lane-159615.mp3` |
| Blood Ascendant | David J. Barrios | `little-bird-club/dist/assets/boss-blood-ascendant.mp3` | `davidjbarrios-epic-boss-battle-instrumental-metal-quotblood-ascendantquot-515739.mp3` |

The original source URLs, applicable license terms, and any download certificates were not supplied with these tracks. This credit file records their provenance; it does not establish their redistribution license. Add that documentation here when available.

## Project license

No project-wide license has been selected. Third-party music is credited separately from the application code and supplied photographs.
