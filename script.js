document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['type'], (result) => {
        document.getElementById('type').value = result;
    });

    document.getElementById('form_submit').addEventListener('click', (event) => {
        event.preventDefault();
        const type = document.getElementById('type').value;
        chrome.storage.sync.set({ type }, () => {
        });
    });
}, false);
