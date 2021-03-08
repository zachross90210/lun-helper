// eslint-disable-next-line no-unused-vars
function exportValues() {
    chrome.storage.local.get(null, (items) => { // null implies all items
    // Convert object to a string.
        const result = JSON.stringify(items);

        // Save as file
        const url = `data:application/json;base64,${btoa(unescape(encodeURIComponent(result)))}`;
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

    const exportButton = document.getElementById('exportButton');
    exportButton.addEventListener('click', () => exportValues());

    document.getElementById('form_submit').addEventListener('click', (event) => {
        event.preventDefault();
        const type = document.getElementById('type').value;
        chrome.storage.local.set({ type }, () => {
        });
    });
}, false);
