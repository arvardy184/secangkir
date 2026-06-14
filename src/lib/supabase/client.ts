"use client";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client (Client Components).
export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const createClient = createBrowserClient;
