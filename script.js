// eslint-disable-next-line no-unused-vars
function exportValues() {
    chrome.storage.sync.get(null, (items) => { // null implies all items
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
    chrome.storage.sync.get(['type'], (result) => {
        document.getElementById('type').value = result;
    });

    const exportButton = document.getElementById('exportButton');
    exportButton.addEventListener('click', () => exportValues());

    document.getElementById('form_submit').addEventListener('click', (event) => {
        event.preventDefault();
        const type = document.getElementById('type').value;
        chrome.storage.sync.set({ type }, () => {
        });
    });
}, false);
