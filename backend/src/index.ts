import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { name, version } from "../package.json";

import 'dotenv/config'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { readdirSync, writeFileSync } from 'fs';

type Variables = {
    RUNPOD_API_KEY: string;
}

const CustomHono = Hono<{Variables: Variables}>;
const app = new CustomHono();
app.use("*", logger());
app.use("*", cors());

app.use("*", async (c, next) => {
    if(!c.get("RUNPOD_API_KEY")) {
        if(!process.env.RUNPOD_API_KEY) {
            throw new Error("Missing RUNPOD_API_KEY environment variable")
        }
        c.set("RUNPOD_API_KEY", process.env.RUNPOD_API_KEY)
    }

    await next();
});

app.get("/", (c) => c.text(`Hello, World! Running v${version}`));

app.get("/health", async (c) => {
    return c.json({
        "backend": "ok!"
    })
})

app.post("/create", async (c) => {
    const { prompt, size } = await c.req.json();

    const data = await (await fetch("https://api.runpod.ai/v2/stable-diffusion-v1/run",
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + c.get("RUNPOD_API_KEY")
            },
            body: JSON.stringify({
                "input": {
                    "prompt": prompt,
                    "width": size,
                    "height": size,
                }
            }) 
        })).json();

    return c.json(data);
})

app.get("/status/:job_id", async (c) => {
    const job_id = c.req.param("job_id")

    const data = await (await fetch("https://api.runpod.ai/v2/stable-diffusion-v1/status/" + job_id, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + c.get("RUNPOD_API_KEY")
            }
        })).json();

    if(data.status === "COMPLETED") {
        const localFile = readdirSync("./creations").find(file => file.startsWith(job_id))
        if(localFile) {
            return c.json({"url": "/creation/" + localFile, "status": "COMPLETED"})
        }

        const url = data.output[0].image
        const download = await fetch(url)
        if(!download.ok || !download.body) {
            throw new Error("Failed to download image?")
        }

        const filename = job_id + ".png" //+ download.headers.get('content-type')?.split('/')[1]
        const buffer = Buffer.from(await download.arrayBuffer())
        writeFileSync("./creations/" + filename, buffer)
        return c.json({"url": "/creation/" + filename, "status": "COMPLETED"})
    }

    return c.json(data);
})

app.get('/creation/*',
    serveStatic({
      root: './',
      rewriteRequestPath: (path) => path.replace(/^\/creation/, '/creations'),
    })
  )

serve(app, (addr) => {
    console.log(`${name} v${version} bound to http://[${addr.address}]:${addr.port}`);
});
