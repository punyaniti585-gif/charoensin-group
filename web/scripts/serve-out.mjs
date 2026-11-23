// Serve the static export (`next build` → ./out) for production-mode testing.
// `next start` does not work with `output: "export"`, so use:
//   npm run build && npm run preview      → http://localhost:4000
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "out");
const port = Number(process.argv[3]) || 4000;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

if (!fs.existsSync(root)) {
  console.error(`No build output at ${root} — run "npm run build" first.`);
  process.exit(1);
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = path.join(root, urlPath);
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      const notFound = path.join(root, "404.html");
      res.writeHead(404, { "Content-Type": types[".html"] });
      fs.existsSync(notFound) ? fs.createReadStream(notFound).pipe(res) : res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Production preview: http://localhost:${port}  (serving ${root})`));
