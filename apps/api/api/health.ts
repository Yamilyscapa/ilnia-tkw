import { json } from "../lib/http.js";

export const config = { runtime: "edge" };

export default async function handler(): Promise<Response> {
  return json({
    ok: true,
    service: "api",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
