# React Tech Slider Demo

An interactive Vite + React + TypeScript showcase for [`react-tech-slider`](https://www.npmjs.com/package/react-tech-slider). Use the playground to compare the running and fades variants, adjust slider props live, inspect generated JSX/TypeScript, and copy an install command or ready-to-use example.

## Live demo

👉 [Open the React Tech Slider Demo](https://react-tech-slider-demo-v2.vercel.app/)

## Features

### Live preview

- Compare the standard **Running** slider with the **Fades** variant.
- Switch between **desktop**, **tablet**, and **mobile** preview presets.
- Change the demonstration dataset between **Core**, **Sport**, and **Food**.
- See prop changes immediately in the preview and generated source.
- Recover from isolated preview errors without losing the rest of the playground.

### Slider controls

| Control | Range | Applies to |
| --- | --- | --- |
| Icon width | `1–10 rem`, step `0.25` | Running and Fades |
| Border width | `0–8 px`, step `1` | Running |
| Duration | `5000–120000 ms`, step `1000` | Running |
| Fades gap | `0–180 px`, step `4` | Fades |
| Fades speed | `0.25–4×`, step `0.25` | Fades |

The playground also supports:

- Border and background CSS colors.
- Eight-digit hexadecimal alpha values such as `#00000033`.
- `HexAlphaColorPicker` controls with precise text-entry fallbacks.
- Playback toggle and pause-on-hover behavior for the Running variant.
- Resetting settings to the documented defaults.

### Curated datasets

The showcase includes three package-ready datasets:

- **Core** — TypeScript, React, npm, CSS, GitHub, and pnpm.
- **Sport** — curated sports-brand records with package metadata such as `style` and `className`.
- **Food** — curated food-brand records with transition metadata.

Brand metadata is preserved in the preview, fallback image handling, and generated source. The generated examples use canonical HTTPS image URLs and the public `Brand` type exported by `react-tech-slider`.

### Generated code and installation

- Read-only highlighted JSX/TypeScript with line numbers.
- Exact source text remains available for selection and copying.
- Generated code uses the package-root import:

```tsx
import { Slider, type Brand } from "react-tech-slider";
```

- Inline install command copying for npm and pnpm.
- Clipboard success and failure feedback with a manual-copy fallback.

## Run locally

```bash
# Clone the repository
git clone https://github.com/T0N1-Dev/react-tech-slider-demo.git
cd react-tech-slider-demo

# Install the locked dependency tree
pnpm install --frozen-lockfile

# Start the Vite development server
pnpm dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Build and verify

```bash
pnpm test
pnpm build
pnpm lint
```

The production build is generated in `dist/`. Deployment platforms such as Vercel should build from the committed `package.json` and `pnpm-lock.yaml` so the published package version remains reproducible.

## Usage example

The generated examples follow the public package API. A basic Running slider looks like this:

```tsx
import { Slider, type Brand } from "react-tech-slider";

const brands: Brand[] = [
  {
    id: 1,
    name: "TypeScript",
    img: "https://cdn.simpleicons.org/typescript",
  },
  {
    id: 2,
    name: "React",
    img: "https://cdn.simpleicons.org/react",
  },
];

export function SliderExample() {
  return (
    <Slider
      brandsList={brands}
      iconWidth={5}
      borderWidth={2}
      borderColor="#7c05d8"
      backgroundColor="#00000033"
      isPlay={true}
      pauseOnHoverActive={true}
      durationMs={30000}
    />
  );
}
```

The Fades variant uses its own discriminated props:

```tsx
<Slider
  variant="fades"
  brandsList={brands}
  iconWidth={5}
  gap={96}
  speed={1}
/>
```

## Project structure

```text
src/
├── App.tsx                         # App shell and protected hero
├── styles.css                      # Showcase layout and component styles
└── showcase/
    ├── brands.ts                   # Core, Sport, and Food datasets
    ├── color.ts                    # CSS color resolution and alpha projection
    ├── codegen.ts                  # Generated package usage source
    ├── model.ts                    # Playground state and prop projection
    └── components/                 # Controls, preview, code, and install UI
```

## Dependencies

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [react-tech-slider](https://www.npmjs.com/package/react-tech-slider) `1.10.1`
- [react-colorful](https://www.npmjs.com/package/react-colorful) `5.8.0`

## Contributing

Issues and pull requests are welcome. Please keep changes focused, preserve the public package boundary, and run the test, build, and lint commands before submitting a change.

## License

This demo is licensed under the MIT License.
