# Senja di Taman Koi — Cari Perbedaannya

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/berkahmuse/spotdiff-senja-koi/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/berkahmuse/spotdiff-senja-koi/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

**Senja di Taman Koi** adalah game cari perbedaan (*spot the difference*) orisinal berbahasa Indonesia: dua gambar nyaris identik berdampingan, temukan semua perbedaannya sebelum waktu habis. Dibuat untuk kompetisi [Make the best spot the difference game](https://make.fun/c/best-spot-the-difference-game-20261121-0451) di make.fun.

## Cara main

- **Klik** perbedaan di gambar mana pun (kiri atau kanan) — lingkaran emas menandai temuanmu.
- **Keyboard:** panah / WASD menggerakkan bidikan, Enter menandai, `H` petunjuk, `R` ulang level, `M` suara, `Esc` jeda, `1/2/3` pilih level.
- Klik yang salah: −25 poin dan −5 detik. Temuan beruntun menaikkan kombo sampai x5.
- Petunjuk (maks 3 per level) menyorot satu perbedaan yang belum ditemukan, harganya 50 poin.

## Tiga tempat, 27 perbedaan

1. **Taman Koi Senja** (7 perbedaan, 180 detik) — kolam koi, lampion, dan kucing di pagar.
2. **Pasar Malam Lampion** (9 perbedaan, 165 detik) — lapak, lampu gantung, dan layang-layang.
3. **Pantai Fajar Nelayan** (11 perbedaan, 150 detik) — perahu, mercusuar, dan jejak di pasir.

Semua gambar digambar prosedural dari kode (canvas 2D) — asli, tanpa foto, aset pinjaman, atau request jaringan. Suara disintesis dengan WebAudio.

## Menjalankan

```sh
node serve.ts        # game di http://localhost:8082
```

Buka di desktop Chrome, tanpa build step. Tangkapan layar dibuat dari render game sendiri lewat `?shot=cover|start|play|win` (lihat `shots.json`).

## Struktur

- `game/index.html`, `game/style.css` — halaman dan bingkai game
- `game/src/main.js` — bootstrap + loop animasi
- `game/src/game.js` — state machine, aturan, skor, timer
- `game/src/render.js` — HUD, panel, penanda, partikel, overlay
- `game/src/scenes.js` — tiga lukisan prosedural (kolam, pasar, pantai)
- `game/src/differences.js` — definisi level dan perbedaan
- `game/src/input.js` — mouse + keyboard
- `game/src/audio.js` — efek suara WebAudio
- `game/src/shots.js` — preset tangkapan layar deterministik
- `main.ts` — program entri make.fun (menyalin `game/` + `screenshots/` ke `/output`)

## Lisensi

MIT — lihat [LICENSE](LICENSE).
