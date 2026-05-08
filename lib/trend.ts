export function fakeTrend(
  seed: number,
  length = 12,
  baseline = 50,
  variance = 30,
) {
  const out: number[] = [];
  let v = baseline;
  let s = seed;
  for (let i = 0; i < length; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    v = Math.max(4, v + (r - 0.4) * variance + i * 1.6);
    out.push(v);
  }
  return out;
}
