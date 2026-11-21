// Senja di Taman Koi — level and difference definitions.
// One job: the data for every level: name, seed, time limit and the list of
// differences. Coordinates are panel-local (0..600 wide, 0..500 tall) and `r`
// is the click radius. The scene painters in scenes.js read these ids.
export const LEVELS = [
  {
    id: 1,
    name: 'Taman Koi Senja',
    subtitle: 'Kolam, lampion, dan seekor kucing di pagar',
    seed: 101,
    timeLimitSec: 180,
    diffs: [
      { id: 'koi-hilang', label: 'Ikan koi oranye hilang', x: 300, y: 392, r: 34 },
      { id: 'lampion-biru', label: 'Lampion berubah biru', x: 96, y: 96, r: 30 },
      { id: 'bunga-tambah', label: 'Sekuntum bunga muncul', x: 505, y: 438, r: 26 },
      { id: 'ekor-kucing', label: 'Ekor kucing terangkat', x: 520, y: 118, r: 28 },
      { id: 'bulan-kawah', label: 'Kawah di bulan hilang', x: 468, y: 62, r: 26 },
      { id: 'papan-jembatan', label: 'Papan jembatan hilang', x: 205, y: 330, r: 26 },
      { id: 'kupu-kupu', label: 'Kupu-kupu hinggap', x: 160, y: 210, r: 24 },
    ],
  },
  {
    id: 2,
    name: 'Pasar Malam Lampion',
    subtitle: 'Deretan lapak, lampu gantung, dan layang-layang',
    seed: 202,
    timeLimitSec: 165,
    diffs: [
      { id: 'tulisan-lapak', label: 'Tulisan lapak berubah', x: 128, y: 238, r: 30 },
      { id: 'balon-hijau', label: 'Balon jadi hijau', x: 470, y: 92, r: 28 },
      { id: 'topi-pedagang', label: 'Topi pedagang hilang', x: 300, y: 200, r: 28 },
      { id: 'lampu-mati', label: 'Satu lampu gantung padam', x: 232, y: 128, r: 22 },
      { id: 'roda-gerobak', label: 'Roda gerobak hilang', x: 400, y: 402, r: 28 },
      { id: 'layang-hilang', label: 'Layang-layang hilang', x: 96, y: 66, r: 26 },
      { id: 'jendela-gelap', label: 'Jendela jadi gelap', x: 528, y: 218, r: 26 },
      { id: 'kucing-atap', label: 'Kucing muncul di atap', x: 386, y: 148, r: 26 },
      { id: 'bendera-kuning', label: 'Bendera jadi kuning', x: 540, y: 168, r: 24 },
    ],
  },
  {
    id: 3,
    name: 'Pantai Fajar Nelayan',
    subtitle: 'Perahu, mercusuar, dan jejak di pasir',
    seed: 303,
    timeLimitSec: 150,
    diffs: [
      { id: 'layar-garis', label: 'Garis di layar perahu', x: 148, y: 208, r: 30 },
      { id: 'burung-tambah', label: 'Seekor camar bertambah', x: 430, y: 92, r: 26 },
      { id: 'ember-hilang', label: 'Ember di pasir hilang', x: 108, y: 432, r: 26 },
      { id: 'bintang-laut', label: 'Bintang laut muncul', x: 500, y: 448, r: 26 },
      { id: 'pancing-miring', label: 'Pancing jadi miring', x: 330, y: 300, r: 26 },
      { id: 'lampu-mercusuar', label: 'Lampu mercusuar padam', x: 528, y: 96, r: 26 },
      { id: 'ombak-tambah', label: 'Satu ombak bertambah', x: 240, y: 330, r: 28 },
      { id: 'kepiting', label: 'Kepiting muncul', x: 388, y: 452, r: 24 },
      { id: 'jala-hilang', label: 'Jala di perahu hilang', x: 210, y: 268, r: 26 },
      { id: 'awan-hilang', label: 'Awan kecil hilang', x: 300, y: 66, r: 26 },
      { id: 'jejak-kaki', label: 'Jejak kaki bertambah', x: 470, y: 400, r: 26 },
    ],
  },
];

export function levelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

export function totalDiffs() {
  return LEVELS.reduce((sum, level) => sum + level.diffs.length, 0);
}
