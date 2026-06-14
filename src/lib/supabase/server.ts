// ADR: Why PostgreSQL (Supabase) over MongoDB
// Warung data is relational: owner -> warung -> vibe_tags (array).
// PostgreSQL's array type + RLS + Auth integration outweighs MongoDB's flexibility
// for this schema. Supabase also provides built-in Auth, removing a third service dependency.

import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

// Server-side Supabase client (Server Components, Route Handlers, Server Actions).
export function createServerClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as any),
            );
          } catch {
            // Called from a Server Component — cookies are read-only here.
            // Session refresh is handled by middleware, so this is safe to ignore.
          }
        },
      },
    },
  );
}

export const createClient = createServerClient;
