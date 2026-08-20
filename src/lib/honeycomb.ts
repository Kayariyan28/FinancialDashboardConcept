export const HEX_LEVELS = [
  { id: 0, label: "No coverage", range: "—" },
  { id: 1, label: "$8–12k", range: "8–12k" },
  { id: 2, label: "$12–18k", range: "12–18k" },
  { id: 3, label: "$18–24k", range: "18–24k" },
  { id: 4, label: "$24–32k", range: "24–32k" },
  { id: 5, label: "$32–40k", range: "32–40k" },
  { id: 6, label: "$40–52k", range: "40–52k" },
  { id: 7, label: "$52–64k", range: "52–64k" },
  { id: 8, label: "$64–72k", range: "64–72k" },
  { id: 9, label: "$72–80k", range: "72–80k" },
  { id: 10, label: "$80–92k", range: "80–92k" },
  { id: 11, label: "≥ $92k", range: "92k+" },
] as const;

export type BinAlgo = "cube" | "axial-floor" | "d3-offset";
export type HexOrient = "pointy" | "flat";
export type AggMode = "sum" | "mean" | "count";

export const BIN_ALGOS: { id: BinAlgo; label: string; blurb: string }[] = [
  {
    id: "cube",
    label: "Cube round",
    blurb: "Lift the point into cube coordinates (q + r + s = 0), round each axis, then restore the constraint by correcting the axis with the largest error. This is the standard nearest-hex test — bins have equal area and no seams.",
  },
  {
    id: "axial-floor",
    label: "Axial floor",
    blurb: "Drop the fractional axial pair (⌊q⌋, ⌊r⌋). Fast, but the Voronoi cells become diamonds: some hexes steal area from their neighbors and the heatmap shears.",
  },
  {
    id: "d3-offset",
    label: "Offset rows",
    blurb: "D3 hexbin’s even-r shortcut: round the row, shift odd rows by half a width, then convert offset → axial. Close to cube rounding at a lower cost; odd/even rows can still drift.",
  },
];

const DISTRICTS = [
  { id: "midtown", name: "Midtown", q: 2, r: -1, lat: 40.7549, lng: -73.984, weight: 1.35 },
  { id: "chelsea", name: "Chelsea", q: -3, r: 2, lat: 40.7465, lng: -74.0014, weight: 0.9 },
  { id: "soho", name: "SoHo", q: -1, r: 5, lat: 40.7233, lng: -73.9987, weight: 0.85 },
  { id: "downtown", name: "Downtown", q: 1, r: 6, lat: 40.7074, lng: -74.0113, weight: 1.05 },
  { id: "williamsburg", name: "Williamsburg", q: 7, r: 1, lat: 40.7081, lng: -73.9571, weight: 0.8 },
  { id: "brooklyn", name: "Brooklyn Heights", q: 6, r: 4, lat: 40.696, lng: -73.9936, weight: 0.7 },
  { id: "harlem", name: "Harlem", q: -2, r: -6, lat: 40.8116, lng: -73.9465, weight: 0.75 },
  { id: "ues", name: "Upper East", q: 4, r: -6, lat: 40.7736, lng: -73.9566, weight: 0.95 },
  { id: "uws", name: "Upper West", q: -5, r: -4, lat: 40.787, lng: -73.9754, weight: 0.88 },
  { id: "east-village", name: "East Village", q: 4, r: 3, lat: 40.7265, lng: -73.9815, weight: 0.78 },
  { id: "financial", name: "Financial Dist.", q: 0, r: 8, lat: 40.7075, lng: -74.0113, weight: 1.1 },
  { id: "midtown-west", name: "Midtown West", q: -4, r: 0, lat: 40.7606, lng: -73.993, weight: 0.92 },
  { id: "harbor", name: "Harbor", q: 3, r: 7, lat: 40.701, lng: -74.013, weight: 0.45 },
  { id: "queens", name: "Long Island City", q: 9, r: -3, lat: 40.7447, lng: -73.9485, weight: 0.6 },
] as const;

const HEX_DIRS: [number, number][] = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

export type HexEvent = {
  x: number;
  y: number;
  value: number;
  district: string;
  districtId: string;
  lat: number;
  lng: number;
};

export type HexCell = {
  id: string;
  q: number;
  r: number;
  x: number;
  y: number;
  level: number;
  value: number;
  count: number;
  mean: number;
  district: string;
  districtId: string;
  lat: number;
  lng: number;
  points: string;
};

export type HoneycombMap = {
  cells: HexCell[];
  events: HexEvent[];
  size: number;
  minX: number;
  minY: number;
  width: number;
  height: number;
  viewBox: string;
  midtownId: string;
  occupied: number;
  algo: BinAlgo;
  agg: AggMode;
};

export type BinOptions = {
  algo?: BinAlgo;
  orient?: HexOrient;
  agg?: AggMode;
  size?: number;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rand: () => number) {
  const u = Math.max(1e-9, rand());
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function axialToPixel(q: number, r: number, size: number, orient: HexOrient = "pointy") {
  if (orient === "flat") {
    return {
      x: size * (1.5 * q),
      y: size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r),
    };
  }
  return {
    x: size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r),
    y: size * 1.5 * r,
  };
}

export function pixelToAxial(
  x: number,
  y: number,
  size: number,
  algo: BinAlgo,
  orient: HexOrient,
): { q: number; r: number } {
  let qf: number;
  let rf: number;
  if (orient === "flat") {
    qf = ((2 / 3) * x) / size;
    rf = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
  } else {
    qf = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / size;
    rf = ((2 / 3) * y) / size;
  }
  const sf = -qf - rf;

  if (algo === "axial-floor") {
    return { q: Math.floor(qf + 1e-9), r: Math.floor(rf + 1e-9) };
  }

  if (algo === "d3-offset") {
    if (orient === "flat") {
      const colW = 1.5 * size;
      const rowH = Math.sqrt(3) * size;
      const col = Math.round(x / colW);
      const row = Math.round(y / rowH - (col & 1) * 0.5);
      const q = col;
      const r = row - (col - (col & 1)) / 2;
      return { q, r };
    }
    const colW = Math.sqrt(3) * size;
    const rowH = 1.5 * size;
    const row = Math.round(y / rowH);
    const col = Math.round(x / colW - (row & 1) * 0.5);
    const q = col - (row - (row & 1)) / 2;
    const r = row;
    return { q, r };
  }

  return cubeRound(qf, rf, sf);
}

function cubeRound(qf: number, rf: number, sf: number) {
  let q = Math.round(qf);
  let r = Math.round(rf);
  let s = Math.round(sf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;
  return { q, r };
}

export function hexPolygon(cx: number, cy: number, size: number, orient: HexOrient = "pointy") {
  const pts: string[] = [];
  const offset = orient === "pointy" ? 30 : 0;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - offset);
    pts.push(
      `${(cx + size * Math.cos(angle)).toFixed(2)},${(cy + size * Math.sin(angle)).toFixed(2)}`,
    );
  }
  return pts.join(" ");
}

function nearestDistrict(q: number, r: number) {
  let best: (typeof DISTRICTS)[number] = DISTRICTS[0];
  let d = Infinity;
  for (const district of DISTRICTS) {
    const n =
      (Math.abs(q - district.q) +
        Math.abs(q + r - district.q - district.r) +
        Math.abs(r - district.r)) /
      2;
    if (n < d) {
      d = n;
      best = district;
    }
  }
  return best;
}

const LAYOUT = 10;

export function generateEvents(seed: number): HexEvent[] {
  const rand = rng(seed * 97 + 11);
  const events: HexEvent[] = [];
  for (const district of DISTRICTS) {
    const origin = axialToPixel(district.q, district.r, LAYOUT, "pointy");
    const n = Math.round(170 * district.weight);
    const spread = 12.2 * (0.85 + district.weight * 0.12);
    for (let i = 0; i < n; i++) {
      const x = origin.x + gauss(rand) * spread;
      const y = origin.y + gauss(rand) * spread;
      const value = 2400 + rand() * 9200 * district.weight;
      events.push({
        x,
        y,
        value,
        district: district.name,
        districtId: district.id,
        lat: district.lat,
        lng: district.lng,
      });
    }
  }
  return events;
}

export function getHoneycomb(seed = 2024, options: BinOptions = {}): HoneycombMap {
  const algo = options.algo ?? "cube";
  const orient = options.orient ?? "pointy";
  const agg = options.agg ?? "sum";
  const size = options.size ?? 9;
  const events = generateEvents(seed);
  const buckets = new Map<string, HexEvent[]>();

  for (const event of events) {
    const { q, r } = pixelToAxial(event.x, event.y, size, algo, orient);
    const id = `${q}:${r}`;
    const list = buckets.get(id);
    if (list) list.push(event);
    else buckets.set(id, [event]);
  }

  const occupiedKeys = [...buckets.keys()];
  for (const key of occupiedKeys) {
    const [qs, rs] = key.split(":");
    const q = Number(qs);
    const r = Number(rs);
    for (const [dq, dr] of HEX_DIRS) {
      const id = `${q + dq}:${r + dr}`;
      if (!buckets.has(id)) buckets.set(id, []);
    }
  }

  const cells: HexCell[] = [];
  const values: number[] = [];
  for (const [id, list] of buckets) {
    if (list.length === 0) continue;
    const metric =
      agg === "count"
        ? list.length
        : agg === "mean"
          ? list.reduce((s, e) => s + e.value, 0) / list.length
          : list.reduce((s, e) => s + e.value, 0);
    values.push(metric);
  }
  values.sort((a, b) => a - b);
  const vmin = values[Math.floor(values.length * 0.05)] ?? 0;
  const vmax = values[Math.min(values.length - 1, Math.floor(values.length * 0.95))] ?? 1;

  for (const [id, list] of buckets) {
    const [qs, rs] = id.split(":");
    const q = Number(qs);
    const r = Number(rs);
    const { x, y } = axialToPixel(q, r, size, orient);
    const count = list.length;
    const sum = list.reduce((s, e) => s + e.value, 0);
    const mean = count ? sum / count : 0;
    const metric = agg === "count" ? count : agg === "mean" ? mean : sum;
    const district = count ? majorityDistrict(list) : nearestDistrict(q, r);
    let level = 0;
    if (count > 0) {
      const t = Math.max(0, Math.min(1, (metric - vmin) / (vmax - vmin || 1)));
      level = 1 + Math.round(t * 10);
    }
    cells.push({
      id,
      q,
      r,
      x,
      y,
      level,
      value: metric,
      count,
      mean,
      district: district.name,
      districtId: district.id,
      lat: district.lat,
      lng: district.lng,
      points: hexPolygon(x, y, size * 0.92, orient),
    });
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const cell of cells) {
    minX = Math.min(minX, cell.x);
    minY = Math.min(minY, cell.y);
    maxX = Math.max(maxX, cell.x);
    maxY = Math.max(maxY, cell.y);
  }
  const pad = size * 2.4;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  const midtown =
    cells.find((c) => c.districtId === "midtown" && c.level >= 5 && c.count > 0) ??
    cells.find((c) => c.districtId === "midtown" && c.count > 0) ??
    cells.find((c) => c.count > 0) ??
    cells[0];

  return {
    cells,
    events,
    size,
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
    viewBox: `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`,
    midtownId: midtown?.id ?? "0:0",
    occupied: cells.filter((c) => c.count > 0).length,
    algo,
    agg,
  };
}

function majorityDistrict(list: HexEvent[]) {
  const tally = new Map<string, { n: number; event: HexEvent }>();
  for (const event of list) {
    const cur = tally.get(event.districtId);
    if (cur) cur.n += 1;
    else tally.set(event.districtId, { n: 1, event });
  }
  let best = list[0];
  let n = 0;
  for (const row of tally.values()) {
    if (row.n > n) {
      n = row.n;
      best = row.event;
    }
  }
  return { id: best.districtId, name: best.district, lat: best.lat, lng: best.lng };
}

export function formatHexValue(cell: HexCell, agg: AggMode = "sum") {
  if (cell.count === 0) return "No coverage";
  if (agg === "count") return `${cell.count} deals`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cell.value);
}

export function formatCoord(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}
