const ICON_DIR = new URL("../src/icons/", import.meta.url);
const ICON_SIZES = [16, 32, 48, 128] as const;
const DESIGN_SIZE = 128;
const SAMPLE_GRID = 4;

type Rgba = [number, number, number, number];
type Point = { x: number; y: number };

const transparent: Rgba = [0, 0, 0, 0];
const ink: Rgba = [28, 27, 24, 1];
const paper: Rgba = [255, 250, 241, 1];
const white: Rgba = [255, 255, 255, 1];
const yellow: Rgba = [245, 213, 74, 1];
const green: Rgba = [42, 177, 123, 1];
const lineInk: Rgba = [62, 58, 50, 1];

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u32(value: number): Uint8Array {
  return new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ]);
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const crc = crc32(concat([typeBytes, data]));
  return concat([u32(data.length), typeBytes, data, u32(crc)]);
}

async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const copy = new Uint8Array(data.length);
  copy.set(data);
  const stream = new Blob([copy.buffer]).stream().pipeThrough(
    new CompressionStream("deflate"),
  );
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function over(bottom: Rgba, top: Rgba): Rgba {
  const alpha = top[3] + bottom[3] * (1 - top[3]);
  if (alpha <= 0) return transparent;
  return [
    (top[0] * top[3] + bottom[0] * bottom[3] * (1 - top[3])) / alpha,
    (top[1] * top[3] + bottom[1] * bottom[3] * (1 - top[3])) / alpha,
    (top[2] * top[3] + bottom[2] * bottom[3] * (1 - top[3])) / alpha,
    alpha,
  ];
}

function withAlpha(color: Rgba, alpha: number): Rgba {
  return [color[0], color[1], color[2], color[3] * alpha];
}

function insideRoundRect(
  x: number,
  y: number,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
): boolean {
  const right = left + width;
  const bottom = top + height;
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  return Math.hypot(x - cx, y - cy) <= radius;
}

function insideCircle(
  x: number,
  y: number,
  cx: number,
  cy: number,
  radius: number,
): boolean {
  return Math.hypot(x - cx, y - cy) <= radius;
}

function insidePolygon(x: number, y: number, points: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const pi = points[i];
    const pj = points[j];
    if (
      (pi.y > y) !== (pj.y > y) &&
      x < ((pj.x - pi.x) * (y - pi.y)) / (pj.y - pi.y) + pi.x
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function drawRoundRect(
  pixel: Rgba,
  x: number,
  y: number,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
  color: Rgba,
): Rgba {
  return insideRoundRect(x, y, left, top, width, height, radius)
    ? over(pixel, color)
    : pixel;
}

function drawCircle(
  pixel: Rgba,
  x: number,
  y: number,
  cx: number,
  cy: number,
  radius: number,
  color: Rgba,
): Rgba {
  return insideCircle(x, y, cx, cy, radius) ? over(pixel, color) : pixel;
}

function drawPolygon(
  pixel: Rgba,
  x: number,
  y: number,
  points: Point[],
  color: Rgba,
): Rgba {
  return insidePolygon(x, y, points) ? over(pixel, color) : pixel;
}

function renderSample(x: number, y: number): Rgba {
  let pixel = transparent;

  pixel = drawRoundRect(pixel, x, y, 13, 15, 102, 98, 26, withAlpha(ink, 0.12));
  pixel = drawRoundRect(pixel, x, y, 10, 10, 104, 104, 27, ink);
  pixel = drawRoundRect(pixel, x, y, 15, 15, 94, 94, 23, paper);

  pixel = drawRoundRect(pixel, x, y, 29, 20, 45, 27, 14, ink);
  pixel = drawRoundRect(pixel, x, y, 34, 25, 35, 17, 9, yellow);

  pixel = drawRoundRect(pixel, x, y, 21, 33, 73, 58, 19, ink);
  pixel = drawPolygon(pixel, x, y, [
    { x: 42, y: 84 },
    { x: 39, y: 101 },
    { x: 56, y: 87 },
  ], ink);
  pixel = drawRoundRect(pixel, x, y, 27, 39, 61, 46, 14, white);
  pixel = drawPolygon(pixel, x, y, [
    { x: 45, y: 79 },
    { x: 43, y: 91 },
    { x: 55, y: 81 },
  ], white);

  pixel = drawRoundRect(pixel, x, y, 40, 52, 34, 6, 3, lineInk);
  pixel = drawRoundRect(pixel, x, y, 40, 65, 24, 6, 3, lineInk);

  pixel = drawCircle(pixel, x, y, 89, 84, 28, withAlpha(ink, 0.16));
  pixel = drawCircle(pixel, x, y, 86, 81, 28, ink);
  pixel = drawCircle(pixel, x, y, 86, 81, 22, white);

  pixel = drawPolygon(pixel, x, y, [
    { x: 75, y: 79 },
    { x: 82, y: 79 },
    { x: 82, y: 65 },
    { x: 91, y: 65 },
    { x: 91, y: 79 },
    { x: 98, y: 79 },
    { x: 86.5, y: 94 },
  ], ink);
  pixel = drawPolygon(pixel, x, y, [
    { x: 79, y: 81 },
    { x: 84, y: 81 },
    { x: 84, y: 69 },
    { x: 89, y: 69 },
    { x: 89, y: 81 },
    { x: 94, y: 81 },
    { x: 86.5, y: 90 },
  ], green);

  return pixel;
}

function samplePixel(x: number, y: number, size: number): Rgba {
  const scale = DESIGN_SIZE / size;
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;

  for (let sy = 0; sy < SAMPLE_GRID; sy++) {
    for (let sx = 0; sx < SAMPLE_GRID; sx++) {
      const sampleX = (x + (sx + 0.5) / SAMPLE_GRID) * scale;
      const sampleY = (y + (sy + 0.5) / SAMPLE_GRID) * scale;
      const pixel = renderSample(sampleX, sampleY);
      r += pixel[0] * pixel[3];
      g += pixel[1] * pixel[3];
      b += pixel[2] * pixel[3];
      a += pixel[3];
    }
  }

  const count = SAMPLE_GRID * SAMPLE_GRID;
  if (a <= 0) return transparent;
  return [r / a, g / a, b / a, a / count];
}

async function createPng(size: number): Promise<Uint8Array> {
  const rowLength = 1 + size * 4;
  const raw = new Uint8Array(rowLength * size);
  for (let y = 0; y < size; y++) {
    raw[y * rowLength] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = samplePixel(x, y, size);
      const offset = y * rowLength + 1 + x * 4;
      raw[offset] = Math.round(r);
      raw[offset + 1] = Math.round(g);
      raw[offset + 2] = Math.round(b);
      raw[offset + 3] = Math.round(a * 255);
    }
  }

  const ihdr = concat([
    u32(size),
    u32(size),
    new Uint8Array([8, 6, 0, 0, 0]),
  ]);

  return concat([
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", await deflate(raw)),
    pngChunk("IEND", new Uint8Array()),
  ]);
}

await Deno.mkdir(ICON_DIR, { recursive: true });

for (const size of ICON_SIZES) {
  const png = await createPng(size);
  const path = new URL(`icon-${size}.png`, ICON_DIR);
  await Deno.writeFile(path, png);
  console.log(`Wrote ${decodeURIComponent(path.pathname)}`);
}
