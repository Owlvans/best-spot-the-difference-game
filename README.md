# best-spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Owlvans/best-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Owlvans/best-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Twin Vista is a spot-the-difference game that runs entirely in the browser from static files — no build step, no network. Two near-identical hand-drawn scenes sit side by side; click a difference in either picture to ring it on both. Three scenes of rising difficulty (Harbour Dawn, Market Square, Coral Reef) hide 8, 10 and 12 differences behind a countdown clock, with a hint that pulses the area to search, a mistake penalty, scoring and star ratings. All art is drawn in code on canvas, all sound is synthesised with WebAudio.

## Run it

```sh
node serve.ts        # serves game/ at http://localhost:8080
# or hand the entry in (copies game/ + screenshots/ and writes the dossier):
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=owl&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
