function makeCardWhite(card) {
    card.classList.remove('redBg');
}

function makeCardRed(card) {
    card.classList.add('redBg');
}

function updateObject(bid, mode, card) {
    const item = {};
    item[bid] = true;

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

document.addEventListener('DOMContentLoaded', () => {
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
});
