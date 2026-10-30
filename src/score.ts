import type { ColorRGB } from './color';

export function similarity(a: ColorRGB, b: ColorRGB): number {
  const rMean = (a.r + b.r) / 2;
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  const wR = 2 + rMean / 256;
  const wG = 4;
  const wB = 2 + (255 - rMean) / 256;

  const distance = Math.sqrt(
    wR * dr * dr + wG * dg * dg + wB * db * db
  );
  const maxDist = Math.sqrt(
    wR * 255 ** 2 + wG * 255 ** 2 + wB * 255 ** 2
  );

  return Math.max(0, (1 - distance / maxDist) * 100);
}

export function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

export function getScoreLabel(score: number): string {
  const rounded = roundScore(score);

  if (rounded >= 95) return 'Sempurna!';
  if (rounded >= 85) return 'Luar biasa';
  if (rounded >= 70) return 'Bagus';
  if (rounded >= 50) return 'Lumayan';
  return 'Coba lagi!';
}