const sharp = require(require.resolve("sharp", { paths: [process.cwd()] }));
const [src, out, preview, T0, ARCHTOP] = process.argv.slice(2);
const T = Number(T0 || 16);
(async () => {
  const X = 380, Y = 110, CW = 760, CH = 823;
  const { data, info } = await sharp(src).extract({ left: X, top: Y, width: CW, height: CH }).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels, W = info.width, H = info.height;
  const cx = W / 2, R = W * 0.47, archTop = H * Number(ARCHTOP || 0.34), cy = archTop + R;
  const insideArch = (x, y) => (y >= cy ? x >= cx - R && x <= cx + R : Math.hypot(x - cx, y - cy) <= R);
  const px = (x, y) => { const i = (y * W + x) * ch; return [data[i], data[i + 1], data[i + 2]]; };
  const diff = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  // background = region grown from the top/side borders, only outside the arch
  const bg = new Uint8Array(W * H);
  const q = [];
  const seed = (x, y) => { if (!insideArch(x, y) && !bg[y * W + x]) { bg[y * W + x] = 1; q.push(x, y); } };
  for (let x = 0; x < W; x++) seed(x, 0);
  for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }
  while (q.length) {
    const y = q.pop(), x = q.pop(); const c = px(x, y);
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const k = ny * W + nx; if (bg[k] || insideArch(nx, ny)) continue;
      const n = px(nx, ny); const L = 0.3*n[0]+0.59*n[1]+0.11*n[2];
      if (diff(c, n) < T && L > 95) { bg[k] = 1; q.push(nx, ny); }
    }
  }
  // everything outside the arch that was NOT reached is foreground (heads)
  const mask = Buffer.alloc(W * H);
  // outside the arch, only the two heads may stay; the face/neck is always kept
  const headBoxes = [[70, 25, 500, 430], [450, 230, 700, 430]];
  const inBox = (x, y) => headBoxes.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d);
  const keep = (x, y) => ((x - 268) / 62) ** 2 + ((y - 168) / 98) ** 2 <= 1 || (x >= 222 && x <= 305 && y >= 200 && y <= 285);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    mask[y * W + x] = insideArch(x, y) || keep(x, y) || (!bg[y * W + x] && inBox(x, y)) ? 255 : 0;
  // drop small isolated blobs outside the arch (globe dots, cloud specks)
  const seen = new Uint8Array(W * H);
  for (let y0 = 0; y0 < H; y0++) for (let x0 = 0; x0 < W; x0++) {
    const k0 = y0 * W + x0; if (!mask[k0] || seen[k0] || insideArch(x0, y0)) continue;
    const comp = [k0]; seen[k0] = 1; let touchesArch = false;
    for (let j = 0; j < comp.length; j++) { const k = comp[j], x = k % W, y = (k / W) | 0;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const nk = ny * W + nx; if (!mask[nk]) continue; if (insideArch(nx, ny)) { touchesArch = true; continue; } if (!seen[nk]) { seen[nk] = 1; comp.push(nk); } } }
    if (!touchesArch || comp.length < 600) for (const k of comp) mask[k] = 0;
  }
  // clean specks: open (erode then dilate) and feather
  const soft = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).median(5).blur(1.2).extractChannel(0).raw().toBuffer({ resolveWithObject: false });
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) { const i = p * ch; rgba[p*4]=data[i]; rgba[p*4+1]=data[i+1]; rgba[p*4+2]=data[i+2]; rgba[p*4+3]=soft[p]; }
  const img = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
  await img.clone().webp({ quality: 88, alphaQuality: 92 }).toFile(out);
  await sharp({ create: { width: W, height: H, channels: 4, background: "#F5EFE2" } }).composite([{ input: await img.clone().png().toBuffer() }]).png().toFile(preview);
  console.log("ok");
})();
