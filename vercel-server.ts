import serverless from "serverless-http";
import app from "./server/api/index.ts";

export const handler = serverless(app);