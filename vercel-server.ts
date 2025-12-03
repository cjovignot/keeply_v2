import serverless from "serverless-http";
import app from "./server/api/index";

export const handler = serverless(app);
