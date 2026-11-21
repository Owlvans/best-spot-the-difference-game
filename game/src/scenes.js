// scenes.js — the three hand-drawn scenes of Twin Vista and the differences
// hidden in them. Every scene is painted twice by the renderer: once plain
// (the left panel) and once with every difference applied (the right panel).
// A difference is a small conditional inside the painter, keyed by its id in
// the D set, and a matching hit circle in the scene's diffs list. All art is
// drawn in code on a 612 x 472 panel; decorative scatter uses a seeded RNG so
// both panels, and every load, render byte-identical pictures.

export const PANEL_W = 612;
export const PANEL_H = 472;

// mulberry32: tiny deterministic RNG for decorative scatter (stars of foam,
// sand speckles, cobble arcs) that must not differ between the two panels.
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, stroke, width) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 24 * s, y + 3 * s, 22 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 25 * s, y + 3 * s, 24 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 2 * s, y - 8 * s, 22 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, s, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function starfish(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a2) * r * 0.45, y + Math.sin(a2) * r * 0.45);
  }
  ctx.closePath();
  ctx.fill();
  circle(ctx, x, y, r * 0.16, 'rgba(0,0,0,0.18)');
}

/* ------------------------------------------------------------------ */
/* Scene 1 — Harbour Dawn                                              */
/* ------------------------------------------------------------------ */

function paintHarbour(ctx, D) {
  // Sky and sea gradients.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#33507e');
  sky.addColorStop(0.55, '#c96f5e');
  sky.addColorStop(1, '#ffc98a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 302);
  const sea = ctx.createLinearGradient(0, 300, 0, 472);
  sea.addColorStop(0, '#3d8fa3');
  sea.addColorStop(1, '#1d5f73');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 302, PANEL_W, 170);

  // Sun with a soft halo. DIFFERENCE sunFace: the right sun is smiling.
  const glow = ctx.createRadialGradient(200, 150, 10, 200, 150, 110);
  glow.addColorStop(0, 'rgba(255,214,120,0.85)');
  glow.addColorStop(1, 'rgba(255,214,120,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(80, 30, 240, 240);
  circle(ctx, 200, 150, 44, '#ffdf8a');
  circle(ctx, 200, 150, 44, 'rgba(255,255,255,0.10)');
  if (D.has('sunFace')) {
    ctx.strokeStyle = '#8a5a12';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(185, 144, 5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(215, 144, 5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(200, 156, 13, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    circle(ctx, 178, 158, 6, 'rgba(232,110,80,0.55)');
    circle(ctx, 222, 158, 6, 'rgba(232,110,80,0.55)');
  }

  cloud(ctx, 92, 66, 1.0, 'rgba(255,235,220,0.85)');
  cloud(ctx, 452, 58, 0.8, 'rgba(255,235,220,0.75)');
  cloud(ctx, 330, 108, 0.6, 'rgba(255,235,220,0.6)');

  gull(ctx, 300, 82, 1.0, '#2c3550');
  gull(ctx, 348, 104, 0.8, '#2c3550');
  // DIFFERENCE gull: a third gull flies in the right panel only.
  if (D.has('gull')) gull(ctx, 415, 95, 0.9, '#2c3550');

  // Distant hills.
  poly(ctx, [[0, 302], [0, 268], [90, 244], [190, 272], [300, 252], [420, 278], [520, 258], [612, 282], [612, 302]], '#54466b');

  // Sea sparkle (seeded, identical on both panels).
  const sparkle = rng(41);
  ctx.fillStyle = 'rgba(255,240,200,0.5)';
  for (let i = 0; i < 42; i++) {
    const x = 20 + sparkle() * 560;
    const y = 312 + sparkle() * 88;
    ctx.fillRect(x, y, 6 + sparkle() * 12, 2);
  }
  // Sun path on the water.
  ctx.fillStyle = 'rgba(255,205,110,0.35)';
  for (let i = 0; i < 9; i++) ctx.fillRect(178 + (i % 3) * 8 - i * 1.5, 308 + i * 11, 44 - i * 3, 4);

  // Houses on the left shore.
  ctx.fillStyle = '#6b4a3a';
  ctx.fillRect(36, 316, 76, 76);                    // house 1 body
  poly(ctx, [[28, 318], [74, 282], [120, 318]], '#3d2c46'); // roof
  ctx.fillStyle = '#54382a';
  ctx.fillRect(80, 252, 12, 32);                    // chimney
  // DIFFERENCE smoke: puffs rise from the chimney in the right panel only.
  if (D.has('smoke')) {
    circle(ctx, 86, 240, 7, 'rgba(240,240,245,0.75)');
    circle(ctx, 92, 226, 10, 'rgba(240,240,245,0.6)');
    circle(ctx, 84, 210, 13, 'rgba(240,240,245,0.45)');
  }
  ctx.fillStyle = '#2c3550';
  ctx.fillRect(58, 344, 18, 26);                    // door
  ctx.fillStyle = '#ffd9a0';
  ctx.fillRect(88, 330, 14, 14);                    // plain window

  ctx.fillStyle = '#77563f';
  ctx.fillRect(124, 330, 64, 62);                   // house 2 body
  poly(ctx, [[118, 332], [156, 302], [194, 332]], '#46324a');
  // DIFFERENCE window: this window is lit warm in the right panel, dark in the left.
  ctx.fillStyle = D.has('window') ? '#ffd23c' : '#22304a';
  ctx.fillRect(146, 346, 16, 16);
  ctx.strokeStyle = '#e8dcc4';
  ctx.lineWidth = 2;
  ctx.strokeRect(146, 346, 16, 16);
  line(ctx, 154, 346, 154, 362, '#e8dcc4', 2);

  // Rocky point and the lighthouse on the right.
  poly(ctx, [[452, 402], [486, 366], [540, 356], [596, 372], [612, 388], [612, 412], [452, 412]], '#4c4457');
  poly(ctx, [[452, 402], [486, 366], [540, 356], [596, 372], [612, 388], [612, 396], [452, 406]], '#5d5470');
  ctx.fillStyle = '#f4efe4';
  ctx.fillRect(518, 196, 40, 168);                  // tower
  ctx.fillStyle = '#e4572e';
  ctx.fillRect(518, 196, 40, 26);                   // top band
  // DIFFERENCE lighthouseBand: the middle band changes colour.
  ctx.fillStyle = D.has('lighthouseBand') ? '#e4572e' : '#2e8f86';
  ctx.fillRect(518, 262, 40, 30);
  ctx.fillStyle = '#f4efe4';
  ctx.fillRect(512, 178, 52, 18);                   // gallery
  ctx.fillStyle = '#2c3550';
  ctx.fillRect(524, 146, 28, 32);                   // lantern room
  circle(ctx, 538, 162, 8, '#ffe98a');              // lamp
  poly(ctx, [[518, 146], [538, 124], [558, 146]], '#2c3550'); // cap
  // DIFFERENCE flag: a pennant flies from the cap in the right panel only.
  if (D.has('flag')) {
    line(ctx, 538, 124, 538, 104, '#2c3550', 3);
    poly(ctx, [[538, 104], [562, 109], [538, 115]], '#e4572e');
  }
  // Light beam across the dusk.
  const beam = ctx.createLinearGradient(538, 162, 330, 210);
  beam.addColorStop(0, 'rgba(255,233,138,0.35)');
  beam.addColorStop(1, 'rgba(255,233,138,0)');
  ctx.fillStyle = beam;
  poly(ctx, [[532, 156], [330, 196], [330, 226], [532, 170]]);

  // Sailboat, anchored clear of the houses so its sail (and the window
  // behind where it used to drift) can both be read. DIFFERENCE sailGone:
  // the sail is missing in the right panel.
  line(ctx, 205, 296, 205, 348, '#3a2a1c', 4);      // mast
  if (!D.has('sailGone')) {
    poly(ctx, [[209, 300], [209, 344], [239, 344]], '#f7f3e8');
    poly(ctx, [[201, 306], [201, 344], [179, 344]], '#ffd9a0');
  }
  poly(ctx, [[167, 348], [245, 348], [231, 366], [179, 366]], '#8a4b2a'); // hull
  // Rowboat with an oar.
  poly(ctx, [[300, 380], [366, 380], [352, 396], [312, 396]], '#5d7a3a');
  line(ctx, 330, 384, 356, 402, '#3a2a1c', 3);
  circle(ctx, 322, 374, 6, '#2c3550');

  // Sandy foreground.
  ctx.fillStyle = '#e8cf9f';
  ctx.fillRect(0, 412, PANEL_W, 60);
  const sand = rng(97);
  ctx.fillStyle = 'rgba(160,125,70,0.5)';
  for (let i = 0; i < 60; i++) ctx.fillRect(sand() * 612, 416 + sand() * 50, 3, 2);
  ellipse(ctx, 90, 448, 16, 7, '#d9b878');
  ellipse(ctx, 420, 452, 20, 8, '#d9b878');
  // DIFFERENCE starfish: one rests on the sand in the right panel only.
  if (D.has('starfish')) starfish(ctx, 250, 440, 15, '#e8862e');
}

/* ------------------------------------------------------------------ */
/* Scene 2 — Market Square                                             */
/* ------------------------------------------------------------------ */

function paintMarket(ctx, D) {
  const sky = ctx.createLinearGradient(0, 0, 0, 330);
  sky.addColorStop(0, '#8ec9e8');
  sky.addColorStop(1, '#dff3fb');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 332);
  circle(ctx, 70, 62, 30, '#fff3b0');
  cloud(ctx, 200, 56, 0.9, 'rgba(255,255,255,0.95)');
  cloud(ctx, 500, 44, 0.75, 'rgba(255,255,255,0.9)');

  // Rooftop silhouette behind the square.
  ctx.fillStyle = '#c8d6dd';
  ctx.fillRect(0, 250, 612, 84);
  poly(ctx, [[0, 252], [60, 218], [130, 252]], '#a8bcc6');
  poly(ctx, [[420, 252], [500, 210], [580, 252]], '#a8bcc6');
  poly(ctx, [[150, 252], [215, 224], [280, 252]], '#b6c9d2');

  // Bunting strung across the square.
  const flags = ['#e4572e', '#ffd23c', '#58b368', '#4a7fc9', '#e87bb0'];
  for (const [x1, x2, sag] of [[6, 306, 46], [306, 606, 46]]) {
    ctx.strokeStyle = 'rgba(70,60,50,0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, 26);
    ctx.quadraticCurveTo((x1 + x2) / 2, 26 + sag, x2, 26);
    ctx.stroke();
    for (let i = 1; i <= 9; i++) {
      const t = i / 10;
      const x = x1 + (x2 - x1) * t;
      const y = 26 + 2 * sag * t * (1 - t) + 4;
      // DIFFERENCE bunting: one flag on the right string is missing.
      if (x1 === 306 && i === 4 && D.has('bunting')) continue;
      poly(ctx, [[x - 8, y], [x + 8, y], [x, y + 17]], flags[(i + (x1 === 306 ? 2 : 0)) % flags.length]);
    }
  }

  // Clock tower, centre back.
  ctx.fillStyle = '#d9c9a8';
  ctx.fillRect(268, 108, 76, 224);
  ctx.fillStyle = '#c3ae87';
  ctx.fillRect(268, 108, 12, 224);
  poly(ctx, [[258, 110], [306, 58], [354, 110]], '#8a4b2a');
  circle(ctx, 306, 66, 6, '#ffd23c');
  ctx.fillStyle = '#f7f1de';
  ctx.beginPath(); ctx.arc(306, 148, 31, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(306, 148, 31, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#5a4632';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ctx.fillRect(306 + Math.cos(a) * 26 - 1.5, 148 + Math.sin(a) * 26 - 1.5, 3, 3);
  }
  // DIFFERENCE clockTime: the tower clock tells a different time.
  const hourA = D.has('clockTime') ? Math.PI * 0.78 : -Math.PI / 3;
  const minA = D.has('clockTime') ? Math.PI * 1.35 : Math.PI / 6;
  line(ctx, 306, 148, 306 + Math.cos(hourA) * 16, 148 + Math.sin(hourA) * 16, '#33302a', 5);
  line(ctx, 306, 148, 306 + Math.cos(minA) * 23, 148 + Math.sin(minA) * 23, '#33302a', 3);
  circle(ctx, 306, 148, 4, '#33302a');
  ctx.fillStyle = '#8a4b2a';
  ctx.fillRect(292, 288, 28, 44);                   // tower door

  // Ground: cobbled square.
  ctx.fillStyle = '#b08968';
  ctx.fillRect(0, 332, PANEL_W, 140);
  const cob = rng(7);
  ctx.strokeStyle = 'rgba(90,64,40,0.35)';
  ctx.lineWidth = 2;
  for (let r = 0; r < 5; r++) {
    for (let i = 0; i < 12; i++) {
      const x = 16 + i * 52 + (r % 2) * 24 + cob() * 6;
      const y = 352 + r * 26;
      ctx.beginPath(); ctx.arc(x, y, 15, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    }
  }

  // Left stall: striped awning, counter, jars and crates.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(34, 252, 8, 128);
  ctx.fillRect(196, 252, 8, 128);
  for (let i = 0; i < 6; i++) {
    // DIFFERENCE awning: the stripes change colour.
    ctx.fillStyle = i % 2 ? '#f4efe4' : (D.has('awning') ? '#d94f30' : '#3f7d4e');
    poly(ctx, [[30 + i * 30, 252], [44 + i * 30, 218], [74 + i * 30, 218], [60 + i * 30, 252]], ctx.fillStyle);
  }
  ctx.fillStyle = '#96683c';
  ctx.fillRect(28, 330, 184, 14);                   // counter
  ctx.fillRect(28, 344, 184, 44);
  // Lantern on the left post. DIFFERENCE lantern: lit in the right panel.
  if (D.has('lantern')) {
    const g = ctx.createRadialGradient(48, 196, 2, 48, 196, 30);
    g.addColorStop(0, 'rgba(255,210,60,0.8)');
    g.addColorStop(1, 'rgba(255,210,60,0)');
    ctx.fillStyle = g;
    ctx.fillRect(16, 164, 64, 64);
  }
  line(ctx, 38, 218, 48, 182, '#4a3826', 3);
  ctx.fillStyle = '#2c3550';
  ctx.fillRect(40, 182, 16, 24);
  circle(ctx, 48, 194, 6, D.has('lantern') ? '#ffd23c' : '#5a6a80');
  // Jars on the counter.
  for (const [x, c] of [[52, '#c94f30'], [82, '#e8a13c'], [112, '#7ba05b']]) {
    ctx.fillStyle = c;
    ctx.fillRect(x, 300, 22, 30);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x, 300, 22, 6);
  }
  // Fruit crate. DIFFERENCE apples: three apples here, five in the right panel.
  ctx.fillStyle = '#8a6238';
  ctx.fillRect(140, 366, 76, 38);
  ctx.fillStyle = '#6e4c28';
  ctx.fillRect(140, 366, 76, 8);
  ctx.fillRect(140, 386, 76, 6);
  const appleAt = [[158, 362], [178, 358], [198, 362]];
  if (D.has('apples')) appleAt.push([168, 348], [188, 348]);
  for (const [x, y] of appleAt) {
    circle(ctx, x, y, 10, '#d94f30');
    line(ctx, x, y - 9, x + 2, y - 14, '#4a3826', 2);
  }

  // Right stall: plain awning, pots, and the bakery sign.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(404, 252, 8, 128);
  ctx.fillRect(568, 252, 8, 128);
  poly(ctx, [[398, 252], [416, 218], [586, 218], [578, 252]], '#c96f3c');
  ctx.fillStyle = '#96683c';
  ctx.fillRect(398, 330, 184, 14);
  ctx.fillRect(398, 344, 184, 44);
  for (const [x, c] of [[424, '#4a7fc9'], [458, '#7ba05b'], [492, '#c94f30']]) {
    poly(ctx, [[x, 330], [x + 26, 330], [x + 21, 302], [x + 5, 302]], c); // pots
  }
  // Hanging sign. DIFFERENCE sign: the spelling changes.
  line(ctx, 470, 218, 470, 238, '#4a3826', 3);
  line(ctx, 540, 218, 540, 238, '#4a3826', 3);
  ctx.fillStyle = '#5a4632';
  ctx.fillRect(436, 238, 138, 34);
  ctx.fillStyle = '#ffd9a0';
  ctx.font = '700 21px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(D.has('sign') ? 'BAKARY' : 'BAKERY', 505, 262);
  // DIFFERENCE parasolGone: the parasol over the right stall is missing.
  if (!D.has('parasolGone')) {
    line(ctx, 520, 330, 520, 246, '#4a3826', 4);
    poly(ctx, [[452, 252], [520, 208], [588, 252], [554, 240], [520, 250], [486, 240]], '#e87bb0');
  }
  // Balloons tied to the right post. DIFFERENCE balloon: the top one changes colour.
  line(ctx, 574, 330, 540, 190, 'rgba(60,50,40,0.6)', 1.5);
  line(ctx, 574, 330, 566, 176, 'rgba(60,50,40,0.6)', 1.5);
  ellipse(ctx, 540, 168, 15, 19, '#58b368');
  ellipse(ctx, 566, 152, 15, 19, '#e4572e');
  ellipse(ctx, 552, 128, 16, 20, D.has('balloon') ? '#8a5fc9' : '#4a7fc9');

  // Flower pot by the tower. DIFFERENCE flowers: the blooms change colour.
  poly(ctx, [[238, 452], [274, 452], [268, 420], [244, 420]], '#b05c33');
  line(ctx, 256, 420, 256, 398, '#3f7d4e', 3);
  line(ctx, 256, 412, 244, 400, '#3f7d4e', 2);
  line(ctx, 256, 412, 268, 400, '#3f7d4e', 2);
  const bloom = D.has('flowers') ? '#ffd23c' : '#e87bb0';
  circle(ctx, 244, 396, 8, bloom);
  circle(ctx, 256, 390, 9, bloom);
  circle(ctx, 268, 396, 8, bloom);

  // DIFFERENCE cat: a cat sits by the right stall in the right panel only.
  if (D.has('cat')) {
    ellipse(ctx, 548, 424, 20, 13, '#3a3f4a');
    circle(ctx, 530, 408, 11, '#3a3f4a');
    poly(ctx, [[522, 400], [518, 388], [528, 394]], '#3a3f4a');
    poly(ctx, [[534, 396], [538, 386], [542, 398]], '#3a3f4a');
    ctx.strokeStyle = '#3a3f4a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(572, 420, 12, Math.PI * 0.9, Math.PI * 1.7);
    ctx.stroke();
    circle(ctx, 526, 406, 2, '#ffd23c');
    circle(ctx, 534, 406, 2, '#ffd23c');
  }
}

/* ------------------------------------------------------------------ */
/* Scene 3 — Coral Reef                                                */
/* ------------------------------------------------------------------ */

function paintReef(ctx, D) {
  const water = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  water.addColorStop(0, '#0a3d5c');
  water.addColorStop(0.6, '#0d5a74');
  water.addColorStop(1, '#12707f');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  // Light rays from the surface. DIFFERENCE ray: one ray is missing.
  ctx.fillStyle = 'rgba(190,235,255,0.10)';
  const rays = [[60, 150], [190, 120], [330, 140], [470, 115]];
  rays.forEach(([x, w], i) => {
    if (i === 3 && D.has('ray')) return;
    poly(ctx, [[x, 0], [x + 44, 0], [x + w, 300], [x + w - 70, 300]]);
  });

  // Distant reef silhouettes.
  ctx.fillStyle = 'rgba(6,32,52,0.55)';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.quadraticCurveTo(120, 340, 260, 386);
  ctx.quadraticCurveTo(400, 424, 612, 372);
  ctx.lineTo(612, 472);
  ctx.lineTo(0, 472);
  ctx.fill();

  // Sandy floor.
  ctx.fillStyle = '#d9c08a';
  ctx.fillRect(0, 424, PANEL_W, 48);
  const sand = rng(53);
  ctx.strokeStyle = 'rgba(150,120,70,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const x = 16 + sand() * 580;
    const y = 434 + sand() * 30;
    ctx.beginPath(); ctx.arc(x, y, 10 + sand() * 12, 0.1 * Math.PI, 0.5 * Math.PI); ctx.stroke();
  }

  // Branching coral, left.
  ctx.strokeStyle = '#e87bb0';
  ctx.lineCap = 'round';
  const branch = (x, y, len, ang, w) => {
    if (len < 12 || w < 1) return;
    const x2 = x + Math.cos(ang) * len;
    const y2 = y - Math.sin(ang) * len;
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    branch(x2, y2, len * 0.72, ang - 0.42, w * 0.7);
    branch(x2, y2, len * 0.72, ang + 0.38, w * 0.7);
  };
  branch(105, 428, 52, Math.PI / 2, 9);
  ctx.strokeStyle = '#f08c3c';
  branch(150, 430, 40, Math.PI / 2, 7);

  // Fan coral, right.
  ctx.fillStyle = 'rgba(150,110,220,0.85)';
  ctx.beginPath();
  ctx.moveTo(528, 428);
  ctx.quadraticCurveTo(478, 330, 512, 268);
  ctx.quadraticCurveTo(560, 252, 584, 300);
  ctx.quadraticCurveTo(592, 366, 560, 428);
  ctx.fill();
  ctx.strokeStyle = 'rgba(220,200,255,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(528, 428);
    ctx.quadraticCurveTo(500 + i * 16, 340, 512 + i * 15, 272 + (i % 2) * 14);
    ctx.stroke();
  }

  // Seaweed cluster. DIFFERENCE weedGone: the tallest strand is missing.
  const weed = (x, h, lean, c) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x, 430);
    ctx.quadraticCurveTo(x + lean, 430 - h * 0.55, x + lean * 0.4, 430 - h);
    ctx.stroke();
  };
  weed(206, 120, 14, '#2e8f5e');
  if (!D.has('weedGone')) weed(232, 168, -10, '#37a86b');
  weed(258, 104, 18, '#2e8f5e');
  weed(420, 92, -14, '#37a86b');

  // Fish school. DIFFERENCE fishCount: five fish here, seven in the right panel.
  const fish = (x, y, s, c, flip) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, 13 * s, 7 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    poly(ctx, [[x + (flip ? -12 : 12) * s, y], [x + (flip ? -21 : 21) * s, y - 7 * s], [x + (flip ? -21 : 21) * s, y + 7 * s]], c);
    circle(ctx, x + (flip ? 7 : -7) * s, y - 1, 1.8, '#0a2e44');
  };
  fish(160, 128, 1.0, '#ffb340', false);
  fish(196, 108, 0.85, '#ffcf5e', false);
  fish(228, 138, 0.9, '#ffb340', false);
  fish(186, 158, 0.75, '#ffcf5e', false);
  fish(238, 104, 0.7, '#ffb340', false);
  if (D.has('fishCount')) {
    fish(150, 168, 0.8, '#ffcf5e', false);
    fish(262, 160, 0.75, '#ffb340', false);
  }

  // The big striped fish. DIFFERENCE fishStripe: its stripe changes colour.
  ctx.fillStyle = '#4a9fc9';
  ctx.beginPath();
  ctx.ellipse(140, 232, 44, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  poly(ctx, [[180, 232], [206, 214], [206, 250]], '#4a9fc9');
  ctx.fillStyle = D.has('fishStripe') ? '#ffffff' : '#ffd23c';
  ctx.fillRect(128, 209, 13, 46);
  circle(ctx, 116, 226, 4, '#08222f');
  line(ctx, 100, 240, 112, 240, '#08222f', 2);

  // Turtle. DIFFERENCE turtleSpot: an extra spot on the shell.
  ellipse(ctx, 362, 118, 46, 30, '#7ba05b');
  ellipse(ctx, 362, 112, 38, 23, '#93b874');
  ctx.strokeStyle = '#5d7a3a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(362, 112, 24, 14, 0, 0, Math.PI * 2); ctx.stroke();
  circle(ctx, 344, 104, 5, '#5d7a3a');
  circle(ctx, 378, 122, 5, '#5d7a3a');
  if (D.has('turtleSpot')) circle(ctx, 362, 118, 6, '#5d7a3a');
  circle(ctx, 414, 104, 13, '#93b874');             // head
  circle(ctx, 418, 100, 2.4, '#22331a');
  ellipse(ctx, 330, 140, 14, 7, '#7ba05b');        // flippers
  ellipse(ctx, 396, 142, 14, 7, '#7ba05b');

  // Octopus behind the right rocks.
  ellipse(ctx, 492, 356, 34, 28, '#8a5fc9');
  circle(ctx, 478, 344, 4, '#2c1e4a');
  circle(ctx, 506, 344, 4, '#2c1e4a');
  ctx.strokeStyle = '#8a5fc9';
  ctx.lineWidth = 9;
  for (const [dx, dy] of [[-30, 22], [-12, 30], [10, 30], [28, 20]]) {
    ctx.beginPath();
    ctx.moveTo(492 + dx * 0.6, 372);
    ctx.quadraticCurveTo(492 + dx, 388, 492 + dx * 1.25, 384 + dy * 0.3);
    ctx.stroke();
  }
  // DIFFERENCE bubbles: a bubble cluster rises over the octopus.
  if (D.has('bubbles')) {
    ctx.strokeStyle = 'rgba(220,245,255,0.85)';
    ctx.lineWidth = 2;
    for (const [x, y, r] of [[506, 268, 7], [522, 240, 10], [512, 208, 13], [528, 178, 9]]) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.22, 'rgba(255,255,255,0.7)');
    }
  }
  // Ambient bubbles (both panels, seeded).
  const bub = rng(23);
  ctx.strokeStyle = 'rgba(220,245,255,0.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.arc(30 + bub() * 550, 40 + bub() * 320, 2.5 + bub() * 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Treasure chest. DIFFERENCE chestOpen: the lid is open, gold spilling light.
  ctx.fillStyle = '#6e4c28';
  ctx.fillRect(418, 388, 76, 38);                  // base
  if (D.has('chestOpen')) {
    const g = ctx.createRadialGradient(456, 384, 4, 456, 384, 52);
    g.addColorStop(0, 'rgba(255,210,60,0.75)');
    g.addColorStop(1, 'rgba(255,210,60,0)');
    ctx.fillStyle = g;
    ctx.fillRect(400, 328, 112, 100);
    ctx.save();
    ctx.translate(418, 388);
    ctx.rotate(-0.6);
    ctx.fillStyle = '#7d5830';
    ctx.fillRect(0, -20, 76, 20);
    ctx.restore();
    ctx.fillStyle = '#ffd23c';
    for (const [x, y] of [[432, 384], [448, 380], [464, 384], [478, 382]]) circle(ctx, x, y, 6, '#ffd23c');
  } else {
    ctx.fillStyle = '#7d5830';
    ctx.beginPath();
    ctx.arc(456, 388, 38, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(418, 384, 76, 6);
  }
  ctx.fillStyle = '#ffd23c';
  ctx.fillRect(450, 392, 12, 16);                  // clasp

  // Oyster with a secret. DIFFERENCE pearl: the pearl is there in the right panel.
  ellipse(ctx, 105, 436, 26, 10, '#cbb7d9');
  ctx.fillStyle = '#a68fc0';
  ctx.beginPath();
  ctx.ellipse(105, 428, 24, 13, -0.25, Math.PI, Math.PI * 2);
  ctx.fill();
  if (D.has('pearl')) {
    circle(ctx, 105, 428, 7, '#fdf6ff');
    circle(ctx, 102, 425, 2.4, '#ffffff');
  }

  // Anchor with its rope. DIFFERENCE ropeGone: the rope is missing.
  ctx.save();
  ctx.translate(566, 372);
  ctx.rotate(0.5);
  ctx.strokeStyle = '#5a6672';
  ctx.lineWidth = 7;
  line(ctx, 0, -52, 0, 34, '#5a6672', 7);
  ctx.beginPath(); ctx.arc(0, -62, 10, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 22, 30, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
  line(ctx, -24, 6, -30, 22, '#5a6672', 7);
  line(ctx, 24, 6, 30, 22, '#5a6672', 7);
  ctx.restore();
  if (!D.has('ropeGone')) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(552, 316);
    ctx.quadraticCurveTo(520, 260, 548, 206);
    ctx.stroke();
  }

  // Sand dressing: shells, starfish, crab.
  // DIFFERENCE starfishColor: the starfish changes colour.
  starfish(ctx, 285, 444, 14, D.has('starfishColor') ? '#8a5fc9' : '#f08c3c');
  // DIFFERENCE shellColor: the spiral shell changes colour.
  ctx.strokeStyle = D.has('shellColor') ? '#2e8f86' : '#e87bb0';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 5; a += 0.25) {
    const r = 2 + a * 1.35;
    const x = 385 + Math.cos(a) * r;
    const y = 446 + Math.sin(a) * r * 0.8;
    if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // DIFFERENCE crabGone: the crab has walked off in the right panel.
  if (!D.has('crabGone')) {
    ellipse(ctx, 185, 442, 15, 9, '#d94f30');
    circle(ctx, 176, 434, 2.4, '#5c1f10');
    circle(ctx, 194, 434, 2.4, '#5c1f10');
    ctx.strokeStyle = '#d94f30';
    ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      line(ctx, 185 + s * 12, 448, 185 + s * 22, 454, '#d94f30', 3);
      line(ctx, 185 + s * 6, 450, 185 + s * 12, 456, '#d94f30', 3);
      ctx.beginPath(); ctx.arc(185 + s * 20, 432, 5, 0, Math.PI * 2); ctx.stroke();
    }
  }
}

/* ------------------------------------------------------------------ */

export const SCENES = [
  {
    id: 'harbour',
    name: 'Harbour Dawn',
    time: 240,
    paint: paintHarbour,
    diffs: [
      { id: 'sunFace', name: 'The sun is smiling', x: 200, y: 150, r: 42 },
      { id: 'gull', name: 'An extra gull', x: 415, y: 95, r: 22 },
      { id: 'smoke', name: 'Chimney smoke', x: 88, y: 228, r: 24 },
      { id: 'window', name: 'A lit window', x: 154, y: 354, r: 17 },
      { id: 'sailGone', name: 'The missing sail', x: 207, y: 322, r: 32 },
      { id: 'lighthouseBand', name: 'The lighthouse band', x: 538, y: 277, r: 24 },
      { id: 'flag', name: 'The lighthouse flag', x: 548, y: 110, r: 21 },
      { id: 'starfish', name: 'A starfish on the sand', x: 250, y: 440, r: 18 },
    ],
  },
  {
    id: 'market',
    name: 'Market Square',
    time: 300,
    paint: paintMarket,
    diffs: [
      { id: 'lantern', name: 'The lit lantern', x: 48, y: 194, r: 17 },
      { id: 'bunting', name: 'A missing bunting flag', x: 428, y: 52, r: 20 },
      { id: 'clockTime', name: 'The clock tells another time', x: 306, y: 148, r: 32 },
      { id: 'awning', name: 'The awning stripes', x: 119, y: 235, r: 34 },
      { id: 'sign', name: 'The bakery sign spelling', x: 505, y: 255, r: 30 },
      { id: 'balloon', name: 'The balloon changed colour', x: 552, y: 128, r: 22 },
      { id: 'parasolGone', name: 'The missing parasol', x: 520, y: 222, r: 26 },
      { id: 'apples', name: 'Two more apples', x: 178, y: 360, r: 25 },
      { id: 'flowers', name: 'The flowers changed colour', x: 256, y: 398, r: 20 },
      { id: 'cat', name: 'A cat by the stall', x: 545, y: 412, r: 23 },
    ],
  },
  {
    id: 'reef',
    name: 'Coral Reef',
    time: 360,
    paint: paintReef,
    diffs: [
      { id: 'ray', name: 'A missing light ray', x: 492, y: 70, r: 46 },
      { id: 'fishCount', name: 'Two more fish in the school', x: 205, y: 140, r: 44 },
      { id: 'turtleSpot', name: 'An extra spot on the turtle', x: 362, y: 115, r: 34 },
      { id: 'fishStripe', name: "The big fish's stripe", x: 134, y: 232, r: 26 },
      { id: 'weedGone', name: 'The tallest seaweed is gone', x: 232, y: 300, r: 24 },
      { id: 'bubbles', name: 'Bubbles over the octopus', x: 516, y: 226, r: 26 },
      { id: 'chestOpen', name: 'The treasure chest is open', x: 456, y: 388, r: 38 },
      { id: 'pearl', name: 'A pearl in the oyster', x: 105, y: 428, r: 18 },
      { id: 'ropeGone', name: "The anchor's rope is gone", x: 540, y: 262, r: 26 },
      { id: 'crabGone', name: 'The crab walked off', x: 185, y: 442, r: 21 },
      { id: 'starfishColor', name: 'The starfish changed colour', x: 285, y: 444, r: 17 },
      { id: 'shellColor', name: 'The shell changed colour', x: 385, y: 446, r: 16 },
    ],
  },
];
