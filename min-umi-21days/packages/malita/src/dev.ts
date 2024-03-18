import express from "express";
import portfinder from "portfinder";
import { build } from "esbuild";
import {
  DEFAULT_BUILD_PORT,
  DEFAULT_ENTRY_POINT,
  DEFAULT_HOST,
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_PORT,
} from "./constants";
import path from "path";
import { createServer } from "http";
import { createWebSocketServer } from "./server";

export const dev = async () => {
  const app = express();

  const port = await portfinder.getPortPromise({
    port: DEFAULT_PORT,
  });
  const esbuildOutput = path.resolve(process.cwd(), DEFAULT_OUTDIR);
  app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput));
  app.use(`/malita`, express.static(path.resolve(__dirname, "client")));
  app.get("/", (_req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Malita</title>
    </head>
    
    <body>
        <div id="malita">
            <span>loading...</span>
        </div>
    </body>
    <script src="/${DEFAULT_OUTDIR}/index.js"></script>
            <script src="/malita/client.js"></script>
    </html>`);
  });

  const malitaServe = createServer(app);

  const ws = createWebSocketServer(malitaServe);
  function sendMessage(type: string, data?: any) {
    ws.send(JSON.stringify({ type, data }));
  }
  malitaServe.listen(port, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
    try {
      await build({
        format: "iife",
        logLevel: "error",
        outdir: esbuildOutput,
        platform: DEFAULT_PLATFORM,
        bundle: true,
        watch: {
          onRebuild: (err, res) => {
            if (err) return console.error(JSON.stringify(err));
            sendMessage("reload");
          },
        },
        define: {
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        external: ["esbuild"],
        entryPoints: [path.resolve(process.cwd(), DEFAULT_ENTRY_POINT)],
      });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });
};
