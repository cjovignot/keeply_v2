import serverless from "serverless-http";
import app from "./server/api/index.js"; // PAS de dist
export const handler = serverless(app);