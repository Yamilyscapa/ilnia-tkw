import type { User } from "@supabase/supabase-js";
import { userClient } from "./supabase.js";

export async function getUser(req: Request): Promise<User | null> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";

  if (!token) return null;

  const { data, error } = await userClient(token).auth.getUser();

  if (error || !data.user) return null;

  return data.user;
}