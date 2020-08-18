function makeCardWhite(card) {
    card.classList.remove('redBg');
}

function makeCardRed(card) {
    card.classList.add('redBg');
}

function updateObject(bid, mode, card) {
    const item = {};
    item[bid] = mode;

    chrome.storage.sync.set(item, () => {
        chrome.storage.sync.get('type', (res) => {
            if (card) {
                if (mode) {
                    makeCardWhite(card);
                }
                if (res.type === 'remove') {
                    card.closest('div.card-grid-cell').remove();
                } else {
                    makeCardRed(card);
                }
            }
        });
    });
}

function hide(oid, card) {
    const bid = `b-${oid}`;
    chrome.storage.sync.get([bid], (result) => {
        if (result[bid]) {
            console.log('set false');
            updateObject(bid, false, card);
        } else {
            updateObject(bid, true, card);
        }
    });
}

function MarkIfHidden(oid, card) {
    const bid = `b-${oid}`;
    return chrome.storage.sync.get([bid], (result) => {
        if (result[bid]) {
            chrome.storage.sync.get('type', (res) => {
                if (res.type === 'remove') {
                    card.closest('div.card-grid-cell').remove();
                } else {
                    makeCardRed(card);
                }
            });
        }
    });
}

function getObjectID(card) {
    return card.querySelector('div.favorite').getAttribute('data-favorites')
        .split('-')[1];
}

function processObjects() {
    document.querySelectorAll('div.card').forEach((card) => {
        // Object ID
        const oid = getObjectID(card);

        // mark card by red background if is hidden
        MarkIfHidden(oid, card);

        // button hide block
        const hideDiv = document.createElement('div');
        hideDiv.setAttribute('class', 'button -icon favorite');
        hideDiv.setAttribute('style', 'right: 50px;');

        // hide button
        const hideButton = document.createElement('button');
        hideButton.setAttribute('style', 'background-color: red;');
        hideButton.textContent = 'hide';
        hideButton.addEventListener('click', () => hide(oid, card));

        // add button to block
        hideDiv.append(hideButton);

        // insert hide block before link
        const a = card.querySelector('a');
        card.insertBefore(hideDiv, a.querySelector('a.card-media'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const elementToObserve = document.getElementById('search-results');
    // create a new instance of `MutationObserver` named `observer`,
    // passing it a callback function
    const observer = new MutationObserver(() => {
        // process objects filtering on SPA page changed
        processObjects();
    });

    // call `observe` on that MutationObserver instance,
    // passing it the element to observe, and the options object
    observer.observe(elementToObserve, {
        characterData: false,
        childList: true,
        attributes: false,
    });

    // process objects filtering on initial page load
    processObjects();
});
