import serverless from "serverless-http";
import app from "./server/api/index.ts"; // PAS de dist
export const handler = serverless(app);