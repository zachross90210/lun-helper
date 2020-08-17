document.addEventListener("DOMContentLoaded", function () {
    console.log(document);

    chrome.storage.sync.get(['type'], (result) => {
        document.getElementById('type').value = result;
    });

    document.getElementById('form_submit').addEventListener('click', function () {
        event.preventDefault();
        let type = document.getElementById('type').value;
        console.log(`set type to ${type}`);
        chrome.storage.sync.set({"type": type}, function () {
            console.log('hide type is set to ' + type);
        });
    });
}, false);
