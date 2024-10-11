import { createClient } from '@supabase/supabase-js';

const readLocalStorage = async (key) => new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
        if (result[key] === undefined) {
            reject();
        } else {
            resolve(result[key]);
        }
    });
});

const getSupabaseConnection = async () => {
    const dbHost = await readLocalStorage('dbHost');
    const supaBaseKey = await readLocalStorage('supaBaseKey');

    // connect to supabase
    return createClient(dbHost, supaBaseKey);
};

const getExcludeType = async (connection) => {
    const { data } = await connection
        .from('config')
        .select()
        .eq('key', 'hideType');
    return data[0]["val"];
};

const supabase = async () => await getSupabaseConnection();

export {
    supabase,
    getExcludeType,
};
