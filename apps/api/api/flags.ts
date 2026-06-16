import { getBearerToken } from "../lib/auth.js";
import { userClient } from "../lib/supabase.js";
import { json } from "../lib/http.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const token = getBearerToken(req);
  if (!token) return json({ error: "unauthorized" }, 401);

  const supabase = userClient(token);
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) return json({ error: "unauthorized" }, 401);

  // RLS decides which rows come back, so the query stays unfiltered.
  const { data: flags, error } = await supabase
    .from("feature_flags")
    .select("key, description, requires_premium, requires_beta")
    .order("key");

  if (error) return json({ error: error.message }, 500);

  return json({ flags });
}
