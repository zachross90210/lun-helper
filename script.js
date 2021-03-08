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

    chrome.storage.local.get(null, (items) => { // null implies all items
    // Convert object to a string.
        const result = JSON.stringify(items);

        // Save as file
        const url = `data:application/json;base64,${btoa(result)}`;
        chrome.downloads.download({
            url,
            filename: 'filename_of_exported_file.json',
        });
    });
}

// eslint-disable-next-line no-unused-vars
function exportValues() {
    chrome.storage.local.get(null, (items) => { // null implies all items
    // Convert object to a string.
        const result = JSON.stringify(items);

        // Save as file
        const url = `data:application/json;base64,${btoa(result)}`;
        chrome.downloads.download({
            url,
            filename: 'filename_of_exported_file.json',
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['type'], (result) => {
        document.getElementById('type').value = result;
    });

    // import button click handle
    const importButton = document.getElementById('importButton');
    importButton.addEventListener('click', () => importValues());

    // import button click handle
    const exportButton = document.getElementById('exportButton');
    exportButton.addEventListener('click', () => exportValues());

    document.getElementById('form_submit').addEventListener('click', (event) => {
        event.preventDefault();
        const type = document.getElementById('type').value;
        chrome.storage.local.set({ type }, () => {
        });
    });
}, false);
