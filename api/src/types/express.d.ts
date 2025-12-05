// server/types/express.d.ts

import type { JwtUserPayload } from "./auth.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUserPayload | null;
  }
}
