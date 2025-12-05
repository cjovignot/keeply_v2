// server/api/types/auth.ts
export interface JwtUserPayload {
  _id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
}
