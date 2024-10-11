import {createClient} from "@supabase/supabase-js";

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
      resolve(result[key]);
      }
     });
    });
  };

const getSupabaseConnection = async () => {
  const dbHost = await readLocalStorage('dbHost');
  const supaBaseKey = await readLocalStorage('supaBaseKey');

  // connect to supabase
  return createClient(dbHost, supaBaseKey);
}
const getExcludeType = async (connection) => {
  const { data, error } = await connection
    .from('config')
    .select()
    .eq('key', 'hideType');
  console.log(error);
  console.log(data)
  return data[0]["val"];
}

const supabase = async () => await getSupabaseConnection();

export {
  supabase,
  getExcludeType,
};
