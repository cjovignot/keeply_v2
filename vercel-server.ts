import serverless from "serverless-http";
import app from "./server/api/index"; // ✅ extension .js obligatoire en ES Modules
export const handler = serverless(app);
