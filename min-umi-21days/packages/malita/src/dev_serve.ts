import express from "express";
import portfinder from "portfinder";
import { ServeOnRequestArgs, serve } from "esbuild";
import {
  DEFAULT_BUILD_PORT,
  DEFAULT_ENTRY_POINT,
  DEFAULT_HOST,
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_PORT,
} from "./constants";
import path from "path";

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

  app.listen(port, async () => {
    try {
      const devServe = await serve(
        {
          port: DEFAULT_BUILD_PORT,
          host: DEFAULT_HOST,
          servedir: DEFAULT_OUTDIR,
          onRequest: (args: ServeOnRequestArgs) => {
            if (args.timeInMS) {
              console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`);
            }
          },
        },
        {
          outdir: "www",
          bundle: true,
          platform: DEFAULT_PLATFORM,
          define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
          },
          entryPoints: [path.resolve(process.cwd(), DEFAULT_ENTRY_POINT)],
        }
      );
      console.log(`server run on ${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}`);
      process.on("SIGINT", () => {
        devServe.stop();
        process.exit(0);
      });
      process.on("SIGTERM", () => {
        devServe.stop();
        process.exit(1);
      });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });
};
