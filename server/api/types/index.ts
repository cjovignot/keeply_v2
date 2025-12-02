// server/api/types/index.ts

import type { Request } from "express"; // <— IMPORTANT
import type { JwtUserPayload } from "./auth";

// Re-exports
export * from "./googleAuth";
export * from "./entities/user";
export * from "./entities/box";
export * from "./entities/storage";
export * from "./links";

export interface AuthRequest extends Request {
  user?: JwtUserPayload | null;
}
