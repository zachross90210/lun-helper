function makeCardWhite(card) {
    card.classList.remove('redBg');
}

function makeCardRed(card) {
    card.classList.add('redBg');
}

function hide(oid, card) {
    // by passing an object you can define default values e.g.: []
    chrome.storage.sync.get({ ids: [] }, (result) => {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        const { ids } = result;

        if (ids.includes(oid)) {
            ids.splice(ids.indexOf(oid), 1);
            if (card) {
                makeCardWhite(card);
            }
        } else {
            ids.push({ oid });
            chrome.storage.sync.get('type', (result) => {
                if (card) {
                    if (result.type === "remove") {
                        card.closest('div.card-grid-cell').remove();
                    } else {
                        makeCardRed(card);
                    }
                }
            })
        }

        // set the new array value to the same key
        chrome.storage.sync.set({ ids: ids }, () => {
        });
    });
}


function MarkIfHidden(oid,card) {
    return chrome.storage.sync.get('ids', (result) => {
        const ids = result.ids;
        if (ids.includes(oid)) {
            chrome.storage.sync.get('type', (result) => {
                if (result.type === "remove") {
                    card.closest('div.card-grid-cell').remove();
                } else {
                    makeCardRed(card);
                }
            })
        }
    });
}



function getObjectID(card) {
    return card.querySelector('div.favorite').getAttribute('data-favorites')
        .split('-')[1];
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('div.card').forEach((card) => {
        const oid = getObjectID(card);

        // mark card by red background if is hidden
        MarkIfHidden(oid, card);

        const hideDiv = document.createElement('div');
        hideDiv.setAttribute('class', 'button -icon favorite');
        hideDiv.setAttribute('style', 'right: 50px;');
        const hideButton = document.createElement('button');
        hideButton.setAttribute('style', 'background-color: red;');
        hideButton.textContent = 'hide';

        hideButton.addEventListener('click', () => hide(oid, card));

        hideDiv.append(hideButton);

        const a = card.querySelector('a');
        card.insertBefore(hideDiv, a.querySelector('a.card-media'));
    });
});
