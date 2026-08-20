# Hexagonal binning (RevMoney)

Pointy-top is the default. `size` is center → vertex.

## Pixel ↔ axial

Pointy:

```
x = size * (√3 * q + √3/2 * r)
y = size * (3/2 * r)

q = (√3/3 * x − 1/3 * y) / size
r = (2/3 * y) / size
s = −q − r
```

Flat:

```
x = size * (3/2 * q)
y = size * (√3/2 * q + √3 * r)

q = (2/3 * x) / size
r = (−1/3 * x + √3/3 * y) / size
```

Hex path: 6 vertices, angle `60° * i − 30°` (pointy) or `60° * i` (flat).
Draw size ≈ `0.92 * layout size` so a hairline gutter reads as cells.

## Cube round (default)

```
rq, rr, rs = round(q), round(r), round(s)
dq, dr, ds = |rq−q|, |rr−r|, |rs−s|
if dq > dr and dq > ds: rq = −rr − rs
else if dr > ds:        rr = −rq − rs
else:                   rs = −rq − rr
```

Nearest hex. Equal area. No seams. **This is the production algorithm.**

## Axial floor (teaching contrast)

```
q = floor(q + 1e-9)
r = floor(r + 1e-9)
```

Fast. Voronoi cells become diamonds; the city outline shears. Ship it so
the user can *see* why cube round exists.

## Offset rows (D3 hexbin shortcut)

Pointy, even-r:

```
rowH = 1.5 * size
colW = √3 * size
row = round(y / rowH)
col = round(x / colW − (row & 1) * 0.5)
q = col − (row − (row & 1)) / 2
r = row
```

Flat, even-q: swap the roles of col/row. Close to cube round; odd/even
rows can drift.

## Aggregation

Per axial key `q:r`:

- `count` = events in the cell
- `sum` = Σ value
- `mean` = sum / count

Color by percentile of the **active** metric (drop 5% tails so outliers
don't crush the scale). Empty neighbors (6 axial dirs) render as
`--color-hex-0`.

## Events

Gaussian clusters around named districts (axial origin + weight + spread).
Seeded RNG. Bin size changes the tessellation, not the geography — events
live in a fixed cartesian space (`LAYOUT` size), hexes retile that space.
