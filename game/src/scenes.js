// Senja di Taman Koi — procedural scene painters.
// One job: draw each level's picture on a canvas. Every scene is drawn from
// code only (no image files): a seeded base picture, then the differences in
// `diffs` are applied, so the left panel (no diffs) and the right panel (all
// diffs) are near-identical by construction. Coordinates are panel-local.
import { makeRng } from './rng.js';

function sky(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function disc(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 6 * s, 13 * s, 0, Math.PI * 2);
  ctx.arc(x + 36 * s, y, 15 * s, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, petal, centre) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  disc(ctx, x, y, 5, centre);
}

function koiFish(ctx, x, y, dir, body, patch) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ellipse(ctx, 0, 0, 26, 11, body);
  ellipse(ctx, -6, -3, 10, 6, patch);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(-38, -10);
  ctx.lineTo(-38, 10);
  ctx.closePath();
  ctx.fill();
  disc(ctx, 16, -3, 2.5, '#1d1b16');
  ctx.restore();
}

function lantern(ctx, x, y, color, lit) {
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 34);
  ctx.lineTo(x, y - 14);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 20, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - 20, y - 4, 40, 3);
  ctx.fillRect(x - 20, y + 4, 40, 3);
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 4, x, y, 46);
    glow.addColorStop(0, 'rgba(255,214,120,0.55)');
    glow.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 46, y - 46, 92, 92);
  }
  disc(ctx, x, y - 26, 4, '#f7c948');
  disc(ctx, x, y + 26, 4, '#f7c948');
}

function catSitting(ctx, x, y, s, tailUp) {
  ctx.fillStyle = '#3a3a3f';
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  disc(ctx, x, y - 24 * s, 12 * s, '#3a3a3f');
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y - 30 * s);
  ctx.lineTo(x - 12 * s, y - 42 * s);
  ctx.lineTo(x - 3 * s, y - 33 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 10 * s, y - 30 * s);
  ctx.lineTo(x + 12 * s, y - 42 * s);
  ctx.lineTo(x + 3 * s, y - 33 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a3a3f';
  ctx.lineWidth = 5 * s;
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(x + 14 * s, y + 16 * s);
    ctx.quadraticCurveTo(x + 30 * s, y + 8 * s, x + 26 * s, y - 14 * s);
  } else {
    ctx.moveTo(x + 14 * s, y + 16 * s);
    ctx.quadraticCurveTo(x + 30 * s, y + 18 * s, x + 34 * s, y + 6 * s);
  }
  ctx.stroke();
  disc(ctx, x - 4 * s, y - 26 * s, 1.8 * s, '#ffd166');
  disc(ctx, x + 4 * s, y - 26 * s, 1.8 * s, '#ffd166');
}

function drawKoiGarden(ctx, w, h, diffs, rng) {
  sky(ctx, w, h, [[0, '#2c1e4f'], [0.45, '#b5506e'], [0.7, '#f08a4b'], [1, '#f7c948']]);
  disc(ctx, 468, 62, 30, '#ffe9b0');
  if (!diffs.has('bulan-kawah')) {
    disc(ctx, 458, 54, 6, '#e8c97f');
    disc(ctx, 476, 70, 4, '#e8c97f');
    disc(ctx, 470, 48, 3, '#e8c97f');
  }
  cloud(ctx, 120, 70, 1, 'rgba(255,220,200,0.75)');
  cloud(ctx, 330, 48, 0.8, 'rgba(255,220,200,0.6)');
  // Distant hills and trees.
  ctx.fillStyle = '#4a2f5e';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.quadraticCurveTo(150, 190, 300, 245);
  ctx.quadraticCurveTo(450, 290, 600, 230);
  ctx.lineTo(600, 300);
  ctx.lineTo(0, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2f4a2e';
  for (let i = 0; i < 7; i++) {
    const tx = 20 + i * 86 + rng.range(-12, 12);
    ctx.beginPath();
    ctx.moveTo(tx - 26, 300);
    ctx.lineTo(tx, 232 + rng.range(-8, 8));
    ctx.lineTo(tx + 26, 300);
    ctx.closePath();
    ctx.fill();
  }
  // Grass bank.
  rect(ctx, 0, 296, w, 60, '#5d7a3a');
  rect(ctx, 0, 296, w, 8, '#7ba24e');
  // Pond.
  const water = ctx.createLinearGradient(0, 356, 0, h);
  water.addColorStop(0, '#3f8f7a');
  water.addColorStop(1, '#1d5c50');
  ctx.fillStyle = water;
  ctx.fillRect(0, 356, w, h - 356);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(80 + i * 110, 380 + (i % 2) * 40, 34, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Lily pads.
  ellipse(ctx, 90, 420, 34, 12, '#2f7a4a');
  ellipse(ctx, 470, 400, 30, 11, '#2f7a4a');
  ellipse(ctx, 540, 460, 26, 10, '#2f7a4a');
  flower(ctx, 90, 414, '#ff9ecf', '#ffe066');
  // Koi (missing on the right panel when the difference applies).
  if (!diffs.has('koi-hilang')) koiFish(ctx, 300, 392, 1, '#ff8c42', '#ffffff');
  koiFish(ctx, 180, 450, -1, '#ffffff', '#ff8c42');
  koiFish(ctx, 420, 452, 1, '#ffd166', '#ff8c42');
  // Wooden bridge over the pond's near edge.
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(120, 352);
  ctx.quadraticCurveTo(210, 300, 300, 352);
  ctx.stroke();
  ctx.strokeStyle = '#a06a35';
  ctx.lineWidth = 5;
  for (let px = 130; px <= 290; px += 24) {
    if (diffs.has('papan-jembatan') && px === 202) continue;
    const t = (px - 120) / 180;
    const py = 352 - Math.sin(t * Math.PI) * 26;
    ctx.beginPath();
    ctx.moveTo(px, py - 8);
    ctx.lineTo(px, py + 8);
    ctx.stroke();
  }
  // Lantern on a pole, left.
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(60, 60);
  ctx.lineTo(60, 150);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(60, 62);
  ctx.lineTo(96, 62);
  ctx.stroke();
  lantern(ctx, 96, 96, diffs.has('lampion-biru') ? '#4aa3df' : '#e23b3b', true);
  // Cat on the fence, right.
  rect(ctx, 470, 150, 110, 8, '#6b4423');
  rect(ctx, 474, 150, 8, 40, '#6b4423');
  rect(ctx, 568, 150, 8, 40, '#6b4423');
  catSitting(ctx, 520, 138, 1, diffs.has('ekor-kucing'));
  // Butterfly (only on the right panel when the difference applies).
  if (diffs.has('kupu-kupu')) {
    ctx.fillStyle = '#ff9ecf';
    ctx.beginPath();
    ctx.ellipse(152, 206, 9, 12, -0.5, 0, Math.PI * 2);
    ctx.ellipse(168, 206, 9, 12, 0.5, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 160, 210, 3, '#3a2b3f');
  }
  // Flowers along the bank; one extra on the right panel.
  flower(ctx, 60, 330, '#ff6b9d', '#ffe066');
  flower(ctx, 540, 330, '#c77dff', '#ffe066');
  flower(ctx, 430, 322, '#ff6b9d', '#ffe066');
  if (diffs.has('bunga-tambah')) flower(ctx, 505, 438, '#ffffff', '#f7c948');
  flower(ctx, 505, 330, '#ffd166', '#e23b3b');
}

function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.4;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

function drawNightMarket(ctx, w, h, diffs, rng) {
  sky(ctx, w, h, [[0, '#0d1030'], [0.55, '#2a1a52'], [1, '#7a2d5e']]);
  for (let i = 0; i < 40; i++) {
    star(ctx, rng.range(10, w - 10), rng.range(8, 130), rng.range(1, 2.6), '#ffe9b0');
  }
  disc(ctx, 520, 54, 24, '#ffe9b0');
  // Kite in the sky (missing on the right panel when the difference applies).
  if (!diffs.has('layang-hilang')) {
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(96, 46);
    ctx.lineTo(118, 66);
    ctx.lineTo(96, 86);
    ctx.lineTo(74, 66);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(96, 86);
    ctx.quadraticCurveTo(110, 110, 96, 130);
    ctx.stroke();
  }
  // String lights across the top.
  ctx.strokeStyle = '#3a2b1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 108);
  ctx.quadraticCurveTo(300, 150, 600, 108);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const lx = 30 + i * 66;
    const ly = 108 + Math.sin((lx / 600) * Math.PI) * 22;
    if (diffs.has('lampu-mati') && i === 3) {
      disc(ctx, lx, ly + 8, 6, '#4a4458');
      continue;
    }
    const glow = ctx.createRadialGradient(lx, ly + 8, 1, lx, ly + 8, 16);
    glow.addColorStop(0, 'rgba(255,220,120,0.9)');
    glow.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lx - 16, ly - 8, 32, 32);
    disc(ctx, lx, ly + 8, 6, '#ffd166');
  }
  // Houses behind the stalls.
  rect(ctx, 0, 190, 170, 130, '#3b2a52');
  rect(ctx, 430, 180, 170, 140, '#33244a');
  ctx.fillStyle = '#2a1c40';
  ctx.beginPath();
  ctx.moveTo(0, 190);
  ctx.lineTo(85, 150);
  ctx.lineTo(170, 190);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(430, 180);
  ctx.lineTo(515, 140);
  ctx.lineTo(600, 180);
  ctx.closePath();
  ctx.fill();
  // Window: lit on the left, dark on the right.
  rect(ctx, 516, 206, 30, 26, diffs.has('jendela-gelap') ? '#241a33' : '#ffd166');
  ctx.strokeStyle = '#241a33';
  ctx.lineWidth = 2;
  ctx.strokeRect(516, 206, 30, 26);
  // Cat on the roof (only on the right panel).
  if (diffs.has('kucing-atap')) catSitting(ctx, 386, 148, 0.8, false);
  // Bunting flags.
  for (let i = 0; i < 8; i++) {
    const fx = 30 + i * 72;
    const fy = 168 + Math.sin((fx / 600) * Math.PI) * 10;
    ctx.fillStyle = i === 7 && diffs.has('bendera-kuning') ? '#ffd166' : ['#ff6b6b', '#4aa3df', '#7bd88a', '#ff9ecf'][i % 4];
    ctx.beginPath();
    ctx.moveTo(fx - 12, fy);
    ctx.lineTo(fx + 12, fy);
    ctx.lineTo(fx, fy + 20);
    ctx.closePath();
    ctx.fill();
  }
  // Left stall with sign.
  rect(ctx, 60, 260, 150, 90, '#8a4b2a');
  rect(ctx, 50, 250, 170, 14, '#5b3a1e');
  rect(ctx, 92, 224, 86, 30, '#f5e6c8');
  ctx.fillStyle = '#3a2b1a';
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(diffs.has('tulisan-lapak') ? 'SATE' : 'BAKSO', 135, 245);
  ctx.fillStyle = '#ffd166';
  for (let i = 0; i < 4; i++) disc(ctx, 80 + i * 30, 300, 9, '#ffd166');
  // Vendor in the middle.
  disc(ctx, 300, 236, 22, '#f2c29b');
  ctx.fillStyle = '#2f7a4a';
  ctx.beginPath();
  ctx.arc(300, 300, 34, Math.PI, 0);
  ctx.fill();
  rect(ctx, 266, 300, 68, 50, '#2f7a4a');
  if (!diffs.has('topi-pedagang')) {
    ctx.fillStyle = '#e8c97f';
    ctx.beginPath();
    ctx.moveTo(272, 222);
    ctx.lineTo(328, 222);
    ctx.lineTo(300, 196);
    ctx.closePath();
    ctx.fill();
  }
  disc(ctx, 292, 234, 2.5, '#1d1b16');
  disc(ctx, 308, 234, 2.5, '#1d1b16');
  // Cart with a wheel on the right.
  rect(ctx, 340, 340, 130, 60, '#7a4a21');
  rect(ctx, 330, 330, 150, 12, '#5b3a1e');
  disc(ctx, 380, 396, 12, '#f5e6c8');
  if (!diffs.has('roda-gerobak')) {
    ctx.strokeStyle = '#3a2b1a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(440, 402, 18, 0, Math.PI * 2);
    ctx.stroke();
    disc(ctx, 440, 402, 5, '#3a2b1a');
  }
  ctx.fillStyle = '#ff6b6b';
  for (let i = 0; i < 3; i++) disc(ctx, 360 + i * 28, 330, 10, ['#ff6b6b', '#ffd166', '#7bd88a'][i]);
  // Balloons, one changes colour on the right panel.
  disc(ctx, 470, 92, 20, diffs.has('balon-hijau') ? '#7bd88a' : '#ff6b6b');
  disc(ctx, 496, 118, 16, '#4aa3df');
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(470, 112);
  ctx.quadraticCurveTo(480, 160, 470, 200);
  ctx.stroke();
  // Cobblestone street.
  rect(ctx, 0, 400, w, h - 400, '#4a3b52');
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.beginPath();
      ctx.ellipse(40 + i * 72, 420 + j * 26, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function gull(ctx, x, y, s) {
  ctx.strokeStyle = '#2b2b33';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 12 * s, y);
  ctx.stroke();
}

function drawDawnBeach(ctx, w, h, diffs, rng) {
  sky(ctx, w, h, [[0, '#ffe3a3'], [0.4, '#ffb26b'], [0.62, '#ff8a7a'], [1, '#7ec8c9']]);
  disc(ctx, 300, 120, 42, '#fff3c4');
  const sunGlow = ctx.createRadialGradient(300, 120, 10, 300, 120, 120);
  sunGlow.addColorStop(0, 'rgba(255,240,180,0.8)');
  sunGlow.addColorStop(1, 'rgba(255,240,180,0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(180, 0, 240, 240);
  if (!diffs.has('awan-hilang')) cloud(ctx, 280, 60, 1.1, 'rgba(255,255,255,0.85)');
  cloud(ctx, 90, 90, 0.9, 'rgba(255,255,255,0.7)');
  cloud(ctx, 470, 50, 0.8, 'rgba(255,255,255,0.7)');
  gull(ctx, 140, 80, 1);
  gull(ctx, 210, 60, 0.9);
  if (diffs.has('burung-tambah')) gull(ctx, 430, 92, 1);
  // Sea.
  const sea = ctx.createLinearGradient(0, 260, 0, 380);
  sea.addColorStop(0, '#2a9d8f');
  sea.addColorStop(1, '#1d6f8e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 260, w, 120);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 290 + i * 22);
    ctx.quadraticCurveTo(150, 282 + i * 22, 300, 290 + i * 22);
    ctx.quadraticCurveTo(450, 298 + i * 22, 600, 290 + i * 22);
    ctx.stroke();
  }
  if (diffs.has('ombak-tambah')) {
    ctx.beginPath();
    ctx.moveTo(140, 336);
    ctx.quadraticCurveTo(240, 322, 340, 336);
    ctx.stroke();
  }
  // Main boat with sail.
  ctx.fillStyle = '#8a4b2a';
  ctx.beginPath();
  ctx.moveTo(100, 250);
  ctx.lineTo(200, 250);
  ctx.lineTo(185, 272);
  ctx.lineTo(115, 272);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(148, 250);
  ctx.lineTo(148, 168);
  ctx.stroke();
  ctx.fillStyle = '#f5e6c8';
  ctx.beginPath();
  ctx.moveTo(148, 172);
  ctx.lineTo(148, 246);
  ctx.lineTo(196, 246);
  ctx.closePath();
  ctx.fill();
  if (diffs.has('layar-garis')) {
    ctx.strokeStyle = '#e23b3b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(156, 196);
    ctx.lineTo(180, 232);
    ctx.stroke();
  }
  // Fishing net draped on the boat (missing on the right panel).
  if (!diffs.has('jala-hilang')) {
    ctx.strokeStyle = 'rgba(245,230,200,0.9)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(186 + i * 8, 250);
      ctx.lineTo(200 + i * 8, 272);
      ctx.stroke();
    }
  }
  // Second small boat.
  ctx.fillStyle = '#2f7a4a';
  ctx.beginPath();
  ctx.moveTo(420, 300);
  ctx.lineTo(490, 300);
  ctx.lineTo(478, 316);
  ctx.lineTo(432, 316);
  ctx.closePath();
  ctx.fill();
  // Lighthouse on the right.
  ctx.fillStyle = '#f5e6c8';
  ctx.beginPath();
  ctx.moveTo(512, 260);
  ctx.lineTo(544, 260);
  ctx.lineTo(540, 150);
  ctx.lineTo(516, 150);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e23b3b';
  ctx.fillRect(512, 220, 32, 14);
  ctx.fillRect(514, 180, 28, 12);
  ctx.fillStyle = '#3a2b1a';
  ctx.beginPath();
  ctx.moveTo(514, 150);
  ctx.lineTo(542, 150);
  ctx.lineTo(528, 132);
  ctx.closePath();
  ctx.fill();
  if (!diffs.has('lampu-mercusuar')) {
    const beam = ctx.createLinearGradient(528, 96, 400, 96);
    beam.addColorStop(0, 'rgba(255,240,150,0.75)');
    beam.addColorStop(1, 'rgba(255,240,150,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(528, 88);
    ctx.lineTo(400, 70);
    ctx.lineTo(400, 122);
    ctx.lineTo(528, 104);
    ctx.closePath();
    ctx.fill();
    disc(ctx, 528, 96, 8, '#fff3c4');
  } else {
    disc(ctx, 528, 96, 8, '#8a8578');
  }
  // Sand.
  const sand = ctx.createLinearGradient(0, 380, 0, h);
  sand.addColorStop(0, '#f2d8a0');
  sand.addColorStop(1, '#e0b96f');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 380, w, h - 380);
  // Fishing rod stuck in the sand.
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(330, 380);
  ctx.lineTo(diffs.has('pancing-miring') ? 356 : 330, 300);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(90,58,30,0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(diffs.has('pancing-miring') ? 356 : 330, 300);
  ctx.quadraticCurveTo(370, 330, 352, 360);
  ctx.stroke();
  // Bucket (missing on the right panel).
  if (!diffs.has('ember-hilang')) {
    ctx.fillStyle = '#e23b3b';
    ctx.beginPath();
    ctx.moveTo(96, 420);
    ctx.lineTo(120, 420);
    ctx.lineTo(116, 448);
    ctx.lineTo(100, 448);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5b3a1e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(108, 420, 12, Math.PI, 0);
    ctx.stroke();
  }
  // Starfish (only on the right panel).
  if (diffs.has('bintang-laut')) {
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 === 0 ? 14 : 6;
      ctx.lineTo(500 + Math.cos(a) * rr, 448 + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }
  // Crab (only on the right panel).
  if (diffs.has('kepiting')) {
    ctx.fillStyle = '#e23b3b';
    ellipse(ctx, 388, 452, 16, 10, '#e23b3b');
    disc(ctx, 372, 446, 5, '#e23b3b');
    disc(ctx, 404, 446, 5, '#e23b3b');
    ctx.strokeStyle = '#e23b3b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(376, 458);
    ctx.lineTo(366, 466);
    ctx.moveTo(400, 458);
    ctx.lineTo(410, 466);
    ctx.stroke();
  }
  // Footprints in the sand.
  ctx.fillStyle = 'rgba(160,120,60,0.55)';
  for (let i = 0; i < 5; i++) {
    ellipse(ctx, 440 + i * 8, 396 + i * 4, 7, 4, 'rgba(160,120,60,0.55)');
    ellipse(ctx, 452 + i * 8, 404 + i * 4, 7, 4, 'rgba(160,120,60,0.55)');
  }
  if (diffs.has('jejak-kaki')) {
    ellipse(ctx, 470, 400, 7, 4, 'rgba(160,120,60,0.8)');
    ellipse(ctx, 482, 408, 7, 4, 'rgba(160,120,60,0.8)');
  }
  // Shells and seaweed.
  disc(ctx, 60, 470, 8, '#ff9ecf');
  disc(ctx, 250, 480, 6, '#c77dff');
  ctx.strokeStyle = '#2f7a4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(560, 470);
  ctx.quadraticCurveTo(566, 448, 560, 430);
  ctx.stroke();
}

const PAINTERS = {
  1: drawKoiGarden,
  2: drawNightMarket,
  3: drawDawnBeach,
};

// Draw one level's scene. `diffSet` holds the ids to apply; an empty set is
// the left panel, the full set is the right panel.
export function drawScene(ctx, levelId, diffSet, w, h) {
  const rng = makeRng(levelId * 1000 + 7);
  const painter = PAINTERS[levelId] ?? PAINTERS[1];
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  painter(ctx, w, h, diffSet, rng);
  ctx.restore();
}
