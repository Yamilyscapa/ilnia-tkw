import { getUser } from "../lib/auth.js";
import { json } from "../lib/http.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const user = await getUser(req);
  if (!user) return json({ error: "unauthorized" }, 401);

  return json({
    id: user.id,
    email: user.email
  });
}