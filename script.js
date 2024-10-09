// eslint-disable-next-line no-unused-vars
function importValues() {
    const text = document.getElementById('importData').value;
    const data = JSON.parse(text);

    Object.entries(data).forEach((entry) => {
        const item = {};
        // eslint-disable-next-line prefer-destructuring
        item[entry[0]] = entry[1];
        chrome.storage.local.set(item, () => {
            // eslint-disable-next-line no-console
            console.log(`added ${entry[0]}`);
        });
    });
}

// eslint-disable-next-line no-unused-vars
function exportValues() {
    chrome.storage.local.get(null, (items) => { // null implies all items
        // Convert object to a string.
        const result = JSON.stringify(items);

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
    chrome.storage.local.get(['type'], (result) => {
        try {
            document.getElementById('type').value = result;

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
