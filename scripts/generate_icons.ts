const ICON_DIR = new URL("../src/icons/", import.meta.url);
const ICON_SIZES = [16, 32, 48, 128] as const;

type Rgba = [number, number, number, number];

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

function blend(source: Rgba, target: Rgba, alpha: number): Rgba {
  const inverse = 1 - alpha;
  return [
    Math.round(source[0] * alpha + target[0] * inverse),
    Math.round(source[1] * alpha + target[1] * inverse),
    Math.round(source[2] * alpha + target[2] * inverse),
    Math.round(source[3] * alpha + target[3] * inverse),
  ];
}

function roundedRectCoverage(
  x: number,
  y: number,
  size: number,
  inset: number,
  radius: number,
): number {
  const left = inset;
  const right = size - inset;
  const top = inset;
  const bottom = size - inset;
  const px = x + 0.5;
  const py = y + 0.5;
  const cx = Math.max(left + radius, Math.min(px, right - radius));
  const cy = Math.max(top + radius, Math.min(py, bottom - radius));
  const distance = Math.hypot(px - cx, py - cy);
  return Math.max(0, Math.min(1, radius + 0.5 - distance));
}

function insideLine(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  width: number,
): boolean {
  const px = x + 0.5;
  const py = y + 0.5;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = Math.max(
    0,
    Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq),
  );
  const lx = ax + dx * t;
  const ly = ay + dy * t;
  return Math.hypot(px - lx, py - ly) <= width / 2;
}

function iconPixel(x: number, y: number, size: number): Rgba {
  const transparent: Rgba = [0, 0, 0, 0];
  const inset = size * 0.08;
  const radius = size * 0.22;
  const coverage = roundedRectCoverage(x, y, size, inset, radius);
  if (coverage <= 0) return transparent;

  const top: Rgba = [28, 95, 242, 255];
  const bottom: Rgba = [16, 175, 128, 255];
  const background = blend(bottom, top, y / Math.max(1, size - 1));
  background[3] = Math.round(255 * coverage);

  const stroke = Math.max(1.4, size * 0.085);
  const cx = size / 2;
  const trayY = size * 0.7;
  const trayLeft = size * 0.29;
  const trayRight = size * 0.71;
  const stemTop = size * 0.25;
  const stemBottom = size * 0.57;
  const arrowY = size * 0.57;
  const arrowLeft = size * 0.38;
  const arrowRight = size * 0.62;
  const arrowBottom = size * 0.68;

  const isGlyph = insideLine(x, y, cx, stemTop, cx, stemBottom, stroke) ||
    insideLine(x, y, arrowLeft, arrowY, cx, arrowBottom, stroke) ||
    insideLine(x, y, arrowRight, arrowY, cx, arrowBottom, stroke) ||
    insideLine(x, y, trayLeft, trayY, trayRight, trayY, stroke) ||
    insideLine(x, y, trayLeft, trayY, trayLeft, trayY - size * 0.12, stroke) ||
    insideLine(x, y, trayRight, trayY, trayRight, trayY - size * 0.12, stroke);

  if (!isGlyph) return background;
  return blend([255, 255, 255, 255], background, 0.95);
}

async function createPng(size: number): Promise<Uint8Array> {
  const rowLength = 1 + size * 4;
  const raw = new Uint8Array(rowLength * size);
  for (let y = 0; y < size; y++) {
    raw[y * rowLength] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = iconPixel(x, y, size);
      const offset = y * rowLength + 1 + x * 4;
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
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
