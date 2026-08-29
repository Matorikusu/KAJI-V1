import type { FileMap } from "@/lib/detect";

export type Sample = {
  id: string;
  name: string;
  blurb: string;
  files: FileMap;
};

export const SAMPLES: Sample[] = [
  {
    id: "north",
    name: "North",
    blurb: "React + Vite",
    files: {
      "package.json": JSON.stringify(
        {
          name: "north",
          private: true,
          type: "module",
          scripts: { dev: "vite", build: "tsc -b && vite build", preview: "vite preview" },
          dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
          devDependencies: {
            vite: "^6.0.0",
            typescript: "^5.7.0",
            "@vitejs/plugin-react": "^4.0.0",
          },
        },
        null,
        2,
      ),
      "index.html": `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>North</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
`,
      "tsconfig.json": `{ "compilerOptions": { "jsx": "react-jsx", "strict": true } }`,
      "src/main.tsx": `import { createRoot } from "react-dom/client";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(<App />);
`,
      "src/App.tsx": `export function App() {
  return (
    <main>
      <h1>North</h1>
      <p>Inventory, quiet and close at hand.</p>
    </main>
  );
}
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
    blurb: "Next.js",
    files: {
      "package.json": JSON.stringify(
        {
          name: "harbor",
          private: true,
          scripts: { dev: "next dev", build: "next build", start: "next start" },
          dependencies: { next: "^15.0.0", react: "^19.0.0", "react-dom": "^19.0.0" },
        },
        null,
        2,
      ),
      "next.config.mjs": "export default {};\n",
      "app/layout.tsx": `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      "app/page.tsx": `export default function Page() {
  return (
    <main>
      <h1>Harbor</h1>
      <p>Arrivals, departures, the day’s tide.</p>
    </main>
  );
}
`,
    },
  },
];

export function getSample(id: string) {
  return SAMPLES.find((s) => s.id === id);
}
