import { createClient } from '@supabase/supabase-js';

const getSupabaseConnection = async () => {
    return chrome.storage.local.get(['dbHost', 'supaBaseKey']).then((data) => {
      return createClient(data["dbHost"], data["supaBaseKey"])
    });
}

const getExcludeType = async (connection) => {
    const { data } = await connection
        .from('config')
        .select()
        .eq('key', 'hideType');
    return data[0]["val"];
};

const supabase = async () => getSupabaseConnection();

export {
    supabase,
    getExcludeType,
};
