const sharp = require(require.resolve("sharp", { paths: [process.cwd()] }));
const [src, out, preview] = process.argv.slice(2);
(async () => {
  // Crop around both figures
  const X = 380, Y = 110, CW = 760, CH = 823;
  const { data, info } = await sharp(src).extract({ left: X, top: Y, width: CW, height: CH }).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels, W = info.width, H = info.height;
  const outBuf = Buffer.alloc(W * H * 4);
  const cx = W / 2, R = W * 0.47, archTop = H * 0.30, cy = archTop + R; // arch: semicircle + rect below cy
  const sm = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * ch, o = (y * W + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // signed distance inside arch (positive inside)
    let inside;
    if (y >= cy) inside = Math.min(x - (cx - R), (cx + R) - x);
    else inside = R - Math.hypot(x - cx, y - cy);
    const archA = sm(-1.5, 1.5, inside);
    // sky key: bright, low-saturation pixels become transparent
    const L = 0.3 * r + 0.59 * g + 0.11 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const keyA = Math.max(sm(200, 168, L), sm(38, 70, sat));
    const a = Math.max(archA, keyA);
    outBuf[o] = r; outBuf[o + 1] = g; outBuf[o + 2] = b; outBuf[o + 3] = Math.round(a * 255);
  }
  // soften the keyed edge a touch: erode tiny specks via a small median on alpha
  const img = sharp(outBuf, { raw: { width: W, height: H, channels: 4 } });
  await img.clone().webp({ quality: 88, alphaQuality: 90 }).toFile(out);
  // preview on the page cream
  await sharp({ create: { width: W, height: H, channels: 4, background: "#F5EFE2" } })
    .composite([{ input: await img.clone().png().toBuffer() }]).png().toFile(preview);
  console.log("ok", W, H);
})();
