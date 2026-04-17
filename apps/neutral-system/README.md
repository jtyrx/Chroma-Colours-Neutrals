# Neutral System Builder

Workbench for generating **systematic neutral palettes** with [Color.js](https://colorjs.io/) (OKLCH-first). It models a Kiselev-style workflow: build a **global lightness ladder**, map **fills / strokes / text / alt** for **light** and **dark elevated** themes, preview in mock UI, and **export** JSON, CSS variables, CSV, or a Tailwind `@theme` snippet.

## Run

From the repository root (npm workspaces):

```bash
npm install
npm run dev:neutral
```

Opens on port **3001** by default (`next dev -p 3001`).

```bash
npm run build:neutral
```

## Presets

Use **Export → Download preset** to save `globalConfig` and `systemConfig`. **Load preset** restores them via a custom window event (in-app).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- `colorjs.io` only for color math in `lib/neutral-engine/`
