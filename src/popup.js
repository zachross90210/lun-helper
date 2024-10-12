import './popup.css';
import { supabase, getExcludeType } from './db.js';

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
        encodeURIComponent(str).replace(
            /%([0-9A-F]{2})/g,
            (match, p1) => String.fromCharCode(`0x${p1}`),
        ),
    );
}
//
const setDbConnectionConfig = () => {
  console.log('set db connection config');
  const { dbHost, supaBaseKey } = JSON.parse(document.getElementById("importConfig").value);
  chrome.storage.local.set({
    dbHost: dbHost,
    supaBaseKey: supaBaseKey
  }, () => {
    console.log('Stored');
  });
}


const importValues = async () => {
    console.log('start import');
    const text = document.getElementById('importData').value;
    const data = JSON.parse(text);
    const connection = await supabase();
    const insertDataItems = {};

    Object.entries(data).forEach((entry) => {
        if (entry[0].includes('b-')) {
            const _id = entry[0].replace('b-', '');
            insertDataItems[`${_id}`] = {
                id: _id,
                isHidden: entry[1],
            };
            console.log(`create document with id ${_id}`);
        } else if (entry[0].includes('desc-')) {
            const _id = entry[0].replace('desc-', '');

            if (!Object.keys(insertDataItems).includes(`${_id}`)) {
                insertDataItems[`${_id}`] = {};
            }

            // default values
            insertDataItems[`${_id}`].id = _id;
            insertDataItems[`${_id}`].isHidden = false;

            insertDataItems[`${_id}`].flaws = entry[1];
            console.log(`update document with id ${_id}`);
        }
    });
    console.log(Object.values(insertDataItems));
    // insert data
    const { data: d, error } = await connection
        .from('investment_projects')
        .insert(Object.values(insertDataItems)).select();
    console.log(data, error);
};

// export investment projects
const exportValues = async () => {
    const connection = await supabase();
    const { data: investment_projects, error } = await connection.from('investment_projects').select('*');
    const result = JSON.stringify(investment_projects);
    console.log(result);
    const url = `data:application/json;base64,${b64EncodeUnicode(result)}`;
    await chrome.downloads.download({
        url,
        filename: 'lun_helper_export.json',
    });
};

document.addEventListener('DOMContentLoaded', () => {
            // import button click handle
            try {
                const importButton = document.getElementById('importButton');
                importButton.addEventListener('click', () => importValues());
            } catch (error) {
                console.error('settings frame is not open unable to set listener to import button');
            }

            // import config button click handle
            try {
                const importButton = document.getElementById('importConfigButton');
                importButton.addEventListener('click', () => setDbConnectionConfig());
            } catch (error) {
                console.error('settings frame is not open unable to set listener to import button');
            }

            // export button click handle
            try {
                const exportButton = document.getElementById('exportButton');
                exportButton.addEventListener('click', () => exportValues());
            } catch (error) {
                console.error('settings frame is not open unable to set listener to export button');
            }

    supabase().then((connection) => {
        getExcludeType(connection).then((hideType) => {
            try {
                document.getElementById('hideType').value = hideType;
            } catch (error) {
                console.error('settings frame is not open, unable to set type');
            }

            // add form submit handler
            try {
                document.getElementById('form_submit').addEventListener('click', (event) => {
                    event.preventDefault();

                    // objects mark or remove
                    const hideType = document.getElementById('type').value;

                    // hideType write to database

                    connection
                        .from('config')
                        .update({ key: hideType })
                        .eq('key', 'hideType')
                        .then(() => {
                            console.log('hideType written to database');
                        });
                });
            } catch (error) {
                console.error('settings frame is not open unable to set listener to form submit');
            }
        });
    });
}, { once: true });
