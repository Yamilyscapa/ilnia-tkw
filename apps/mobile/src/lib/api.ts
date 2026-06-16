import { env } from "@/config/env";

import { supabase } from "./supabase";

export type Flag = {
  key: string;
  description: string | null;
  requires_premium: boolean;
  requires_beta: boolean;
};

export type Me = {
  id: string;
  email: string;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Typed client for the backend data API. Auth stays with the Supabase SDK;
// this only reads the current session token and attaches it to each request.
class ApiClient {
  constructor(private readonly baseUrl: string) {}

  me() {
    return this.request<Me>("/api/me");
  }

  flags = {
    list: () => this.request<{ flags: Flag[] }>("/api/flags").then((r) => r.flags),
  };

  private async request<T>(path: string): Promise<T> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new ApiError(res.status, await res.text());

    return res.json() as Promise<T>;
  }
}

export const api = new ApiClient(env.apiUrl);
