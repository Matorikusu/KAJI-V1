import type { FileMap } from "@/lib/detect";

export type Sample = {
  id: string;
  name: string;
  blurb: string;
  files: FileMap;
};

const vitePkg = (name: string) =>
  JSON.stringify(
    {
      name,
      private: true,
      type: "module",
      scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
      dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
      devDependencies: {
        vite: "^6.0.0",
        "@vitejs/plugin-react": "^4.3.0",
      },
    },
    null,
    2,
  );

const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
`;

const indexHtml = (title: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const mainTsx = `import { createRoot } from "react-dom/client";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(<App />);
`;

export const SAMPLES: Sample[] = [
  {
    id: "north",
    name: "North",
    blurb: "React + Vite",
    files: {
      "package.json": vitePkg("north"),
      "index.html": indexHtml("North"),
      "vite.config.ts": viteConfig,
      "src/main.tsx": mainTsx,
      "src/App.tsx": `import "./app.css";

const rows = [
  ["N-104", "Wool coat", "On hand"],
  ["N-221", "Field notebook", "Low"],
  ["N-308", "Brass lamp", "On hand"],
];

export function App() {
  return (
    <main>
      <header>
        <p>Inventory</p>
        <h1>North</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Sku</th>
            <th>Item</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
`,
      "src/app.css": `html, body, #root { margin: 0; min-height: 100%; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
main { padding: 48px 40px; }
header p { margin: 0; letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: #8a8882; font-family: system-ui, sans-serif; }
h1 { font-weight: 400; font-size: 48px; letter-spacing: -0.04em; margin: 8px 0 32px; }
table { width: min(640px, 100%); border-collapse: collapse; }
th, td { text-align: left; padding: 12px 0; border-bottom: 1px solid #2a2a2c; }
th { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8a8882; font-weight: 500; }
`,
    },
  },
  {
    id: "quill",
    name: "Quill",
    blurb: "Static site",
    files: {
      "index.html": `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Quill</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <article>
      <h1>Quill</h1>
      <p>A place to write without the rest of the internet.</p>
    </article>
  </body>
</html>`,
      "styles.css": `html, body { margin: 0; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
article { max-width: 36rem; margin: 20vh auto; padding: 0 1.5rem; }
h1 { font-weight: 400; letter-spacing: -0.03em; }
`,
    },
  },
  {
    id: "harbor",
    name: "Harbor",
    blurb: "React + Vite",
    files: {
      "package.json": vitePkg("harbor"),
      "index.html": indexHtml("Harbor"),
      "vite.config.ts": viteConfig,
      "src/main.tsx": mainTsx,
      "src/App.tsx": `import "./app.css";

const tide = [
  ["06:40", "Skua", "In"],
  ["08:15", "Lark", "Out"],
  ["11:05", "Tern", "In"],
];

export function App() {
  return (
    <main>
      <p>Today</p>
      <h1>Harbor</h1>
      <ul>
        {tide.map(([time, name, dir]) => (
          <li key={time}>
            <span>{time}</span>
            <strong>{name}</strong>
            <em>{dir}</em>
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
      "src/app.css": `html, body, #root { margin: 0; min-height: 100%; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
main { padding: 48px 40px; }
p { margin: 0; letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: #8a8882; font-family: system-ui, sans-serif; }
h1 { font-weight: 400; font-size: 48px; letter-spacing: -0.04em; margin: 8px 0 32px; }
ul { list-style: none; padding: 0; margin: 0; width: min(420px, 100%); }
li { display: grid; grid-template-columns: 4.5rem 1fr 3rem; gap: 12px; padding: 14px 0; border-bottom: 1px solid #2a2a2c; }
em { font-style: normal; color: #8a8882; }
`,
    },
  },
];

export function getSample(id: string) {
  return SAMPLES.find((s) => s.id === id);
}
