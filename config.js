// Only declare if it doesn't exist yet
const SUPABASE_URL = 'https://txhofuhrcvmskbrbvcit.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fU3lmsGzsLld4xzqzfZG8w_ENZMM6_y';

if (typeof supabase === 'undefined') {
    var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}
