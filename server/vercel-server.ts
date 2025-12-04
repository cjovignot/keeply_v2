import { createServer } from "@vercel/node";
import app from "./api/index";

export default createServer((req, res) => {
  app(req as any, res as any);
});