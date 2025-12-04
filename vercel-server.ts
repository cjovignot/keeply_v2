// vercel-server.ts
import serverless from "serverless-http";
import app from "./server/api/index.js";

export const handler = serverless(app);
