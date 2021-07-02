function makeCardWhite(card) {
    card.parentNode.parentNode.classList.add('redBg');
}

function makeCardRed(card) {
    // card.classList.add('redBg');
    card.parentNode.parentNode.classList.add('redBg');
}

function updateObject(bid, mode, card) {
    const hButton = card.querySelector('.hideButton');
    const item = {};
    item[bid] = mode;

    chrome.storage.local.set(item, () => {
        chrome.storage.local.get('type', (res) => {
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
    chrome.storage.local.get([bid], (result) => {
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
    hideDiv.setAttribute('style', 'margin-botton: 1em;');
    hideDiv.setAttribute('class', 'buttonArea -ghost-light');

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
    hideButton.setAttribute('style', `background-color: ${color};color: white;`);
    hideButton.setAttribute('class', 'hideButton');
    hideButton.textContent = text;
    hideButton.addEventListener('click', () => hide(oid, card));

    // add button to block
    hideDiv.append(hideButton);

    const br = document.createElement('br');
    const hr = document.createElement('hr');
    hideDiv.append(br);
    hideDiv.append(hr);

    // insert hide block before link
    const target = card.querySelector('div.UIFavoriteButton');
    console.log(card, target);
    target.parentNode.insertBefore(hideDiv, target);
}

function MarkIfHidden(oid, card) {
    const bid = `b-${oid}`;
    return chrome.storage.local.get([bid], (result) => {
        if (result[bid]) {
            chrome.storage.local.get('type', (res) => {
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
    return card.querySelector('div.UIFavoriteButton').getAttribute('data-favorites')
        .split('-')[1];
}

function getObjectIDFromObjectPage(page) {
    return page.querySelector('div.UIFavoriteButton').getAttribute('data-favorites')
        .split('-')[1];
}

function processObjects() {
    document.querySelectorAll('div.Card-inner').forEach((card) => {
        // Object ID
        const oid = getObjectID(card);

        // mark card by red background if is hidden
        MarkIfHidden(oid, card);
    });
}

function addBlocks() {
    const buildingDiv = document.querySelector('.Building');
    const newBlocksDIv = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = 'Минусы комплекса:';
    newBlocksDIv.appendChild(title);
    newBlocksDIv.classList.add('redBlock');
    newBlocksDIv.classList.add('index100');
    buildingDiv.insertBefore(newBlocksDIv, buildingDiv.firstChild);

    const desc = document.createElement('textarea');
    desc.classList.add('descArea');

    const bid = getObjectIDFromObjectPage(document);

    chrome.storage.local.get(`desc-${bid}`, (result) => {
        if (result[`desc-${bid}`]) {
            desc.value = result[`desc-${bid}`];
        }
    });

    newBlocksDIv.appendChild(desc);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'save';

    saveButton.classList.add('saveButton');
    newBlocksDIv.appendChild(saveButton);

    saveButton.addEventListener('click', () => {
        const d = {};
        d[`desc-${bid}`] = desc.value;
        chrome.storage.local.set(d, () => {
            desc.style.backgroundColor = 'lightgreen';
            // set new description
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.location.href.includes('%D0%B6%D0%BA-') || document.location.href.includes('жк-')) { // жк-
        // "building page"
        addBlocks();
    } else if (document.querySelectorAll('#search-results').length > 0) {
        // search results page

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
    }
});
