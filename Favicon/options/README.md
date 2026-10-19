# Favicon options

Review only; the current site favicon remains active.

- **01-signal-star: Signal star** — A bold evolution of the current mark.
- **02-mh-monogram: MH monogram** — Personal identity, clear and direct.
- **03-terminal: Terminal** — A simple nod to systems and scripting.
- **04-hawk: Hawk** — An abstract signature tied to your name.
- **05-red-m: Red M** — One initial, strong at small sizes.

Each option has a vector SVG, a 512×512 PNG, and a 32×32 ICO. The comparison PNG shows enlarged marks and native-size light/dark tab mockups. Inspect at 100% zoom to judge 16px legibility.

After choosing, generate the complete active favicon set (96px, 180px, 192px, 512px, ICO and SVG) from that option, then update the asset generator so it preserves the choice.

Regenerate review assets with `PORTFOLIO_DEPS` pointing at the existing runtime node_modules and `node tools/generate-favicon-options.cjs`.
