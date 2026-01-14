
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const SUPABASE_URL = 'https://sgcyftyqdzvinecjglpe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HuZBr9n8OWpOPJYfN6wpiA_pcxosgH4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
