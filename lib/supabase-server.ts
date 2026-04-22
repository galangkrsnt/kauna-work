import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key — bypasses RLS for server-side ops.
// Always pair with Clerk auth() to verify user identity before any write.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
