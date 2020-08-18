function makeCardWhite(card) {
    card.classList.remove('redBg');
}

function makeCardRed(card) {
    card.classList.add('redBg');
}

function updateObject(bid, mode, card) {
    const hButton = card.querySelector('.hideButton');
    const item = {};
    item[bid] = mode;

    chrome.storage.sync.set(item, () => {
        chrome.storage.sync.get('type', (res) => {
            if (card) {
                if (!mode) {
                    if (res.type === 'mark') {
                        makeCardWhite(card);
                    }

                    hButton.textContent = 'hide';
                    hButton.setAttribute('style', 'background-color: red;');
                    // hButton.setAttribute('style', 'color: black;');
                } else if (mode) {
                    if (res.type === 'remove') {
                        card.closest('div.card-grid-cell').remove();
                    } else {
                        makeCardRed(card);
                    }
                    hButton.textContent = 'show';
                    hButton.setAttribute('style', 'background-color: green;');
                }
            }
        });
    });
}

function hide(oid, card) {
    const bid = `b-${oid}`;
    chrome.storage.sync.get([bid], (result) => {
        if (result[bid]) {
            updateObject(bid, false, card);
        } else {
            updateObject(bid, true, card);
        }
    });
}

function addHideButton(card, oid, isHidden) {
    // button hide block
    const hideDiv = document.createElement('div');
    hideDiv.setAttribute('class', 'button -icon favorite');
    hideDiv.setAttribute('style', 'right: 50px;');

    let color;
    let text;

    if (isHidden) {
        color = 'green';
        text = 'show';
    } else {
        color = 'red';
        text = 'hide';
    }

    // hide button
    const hideButton = document.createElement('button');
    hideButton.setAttribute('style', `background-color: ${color};`);
    hideButton.setAttribute('class', 'hideButton');
    hideButton.textContent = text;
    hideButton.addEventListener('click', () => hide(oid, card));

    // add button to block
    hideDiv.append(hideButton);

    // insert hide block before link
    const a = card.querySelector('a');
    card.insertBefore(hideDiv, a.querySelector('a.card-media'));
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

        addHideButton(card, oid, result[bid]);
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
