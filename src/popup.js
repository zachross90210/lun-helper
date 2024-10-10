import { createClient } from '@supabase/supabase-js';
import './popup.css';

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(`0x${p1}`);
        },
      ),
    );
  }

function importValues() {
    const text = document.getElementById('importData').value;
    const data = JSON.parse(text);
    console.log(data)

    Object.entries(data).forEach((entry) => {
        const item = {};
        item[entry[0]] = entry[1];
        chrome.storage.local.set(item, () => {
            // eslint-disable-next-line no-console
            console.log(`added ${entry[0]}`);
        });
    });
}


function exportValues() {
    chrome.storage.local.get(null, (items) => { // null implies all items
        // Convert object to a string.
        const result = JSON.stringify(items);
        console.log(result)

        // Save as file
        const url = `data:application/json;base64,${b64EncodeUnicode(result)}`;
        chrome.downloads.download({
            url,
            filename: 'lun_helper_export.json',
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // fetch remove/hide type
    chrome.storage.local.get(['dbHost', 'hideType', 'supaBaseKey'], (config) => {
        // connect to supabase
        try {
            const supabase = createClient(config.dbHost, config.supaBaseKey);
            console.log(supabase);
        } catch (error) {
            console.error('supabase connection failed');
        }



        try {
            document.getElementById('hideType').value = config.hideType;

        } catch (error) {
            console.error('settings frame is not open, unable to set type');
        }

        // import button click handle
        try {
            const importButton = document.getElementById('importButton');
            importButton.addEventListener('click', () => importValues());
        } catch (error) {
            console.error('settings frame is not open unable to set listener to import button');
        }


        // import button click handle
        try {
            const exportButton = document.getElementById('exportButton');
            exportButton.addEventListener('click', () => exportValues());
        } catch (error) {
            console.error('settings frame is not open unable to set listener to export button');
        }

        // add form submit handler
        try {
            document.getElementById('form_submit').addEventListener('click', (event) => {
                event.preventDefault();

                const type = document.getElementById('type').value;
                chrome.storage.local.set({ type }, () => {
                });
            });    
        } catch (error) {
            console.error('settings frame is not open unable to set listener to form submit');
        }
    
    });
}, { once: true });
