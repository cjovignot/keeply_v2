// server/api/types/index.ts

import type { Request } from "express"; // <— IMPORTANT
import type { JwtUserPayload } from "./auth.js";

// Re-exports
export * from "./googleAuth/index.js";
export * from "./entities/user.js";
export * from "./entities/box.js";
export * from "./entities/storage.js";
export * from "./links/index.js";

export interface AuthRequest extends Request {
  user?: JwtUserPayload | null;
}
