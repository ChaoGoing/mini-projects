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
    </html>`);
  });

  const malitaServe = createServer(app);
  const esbuildOutput = path.resolve(process.cwd(), DEFAULT_OUTDIR);
  malitaServe.listen(port, async () => {
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

  const ws = createWebSocketServer(malitaServe);
  function sendMessage(type: string, data?: any) {
    ws.send(JSON.stringify({ type, data }));
  }
};
