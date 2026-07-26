import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iausxfvlhqtlcoaovoiv.supabase.co";

const supabaseAnonKey = "sb_publishable_HIBUR248IwLNHCCYR81-CA_8ZdSUAZS";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
