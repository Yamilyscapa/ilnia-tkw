// Seed one demo user for the current environment (chosen by APP_ENV from the
// loaded .env). Premium + beta so it can see every gated flag. Idempotent.
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const appEnv = process.env.APP_ENV === "production" ? "production" : "staging";

const email = `user@${appEnv === "production" ? "prod" : "staging"}.com`;
const password = "Password123!";

const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

async function findUserId(target: string): Promise<string | null> {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email === target);
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
}

let userId: string;
const { data: created, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  const existing = await findUserId(email);
  if (!existing) throw error;
  userId = existing;
  await admin.auth.admin.updateUserById(userId, { password });
  console.log(`exists:  ${email}`);
} else {
  userId = created.user!.id;
  console.log(`created: ${email}`);
}

const { error: profileError } = await admin
  .from("profiles")
  .update({ is_premium: true, is_beta: true })
  .eq("id", userId);
if (profileError) throw profileError;

console.log(`  password: ${password}`);
console.log(`  tier:     premium + beta`);
