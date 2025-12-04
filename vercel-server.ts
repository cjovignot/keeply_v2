import serverless from "serverless-http";
import app from "./dist/api/index.js";

export const handler = serverless(app);