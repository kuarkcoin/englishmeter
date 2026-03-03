import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseServer: any = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
} else {
  console.warn("Supabase env variables missing. Running in fallback mode.");
}

export { supabaseServer };
