import "server-only";

import { createClient } from "@supabase/supabase-js";

export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function isAuthorizedAdmin(
  request: Request
) {
  const authorization =
    request.headers.get("authorization") ?? "";

  if (!authorization.startsWith("Bearer ")) {
    return false;
  }

  const accessToken = authorization
    .slice("Bearer ".length)
    .trim();

  if (!accessToken) {
    return false;
  }

  const {
    data: { user },
    error: userError,
  } = await adminSupabase.auth.getUser(
    accessToken
  );

  if (userError || !user) {
    return false;
  }

  const { data: admin, error: adminError } =
    await adminSupabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (adminError || !admin) {
    return false;
  }

  return true;
}