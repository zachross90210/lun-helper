function makeCardWhite(card) {
    // remove card red background
    card.parentNode.classList.remove('redBg');
}

// add class redBg
function makeCardRed(card) {
    // add red background to the card entry
    card.parentNode.classList.add('redBg');
}

function updateObject(bid, mode, card) {
    const item = {};
    item[bid] = mode;
    const oid = bid.replace('b-', ''); // remove db prefix
    const hButton = card.querySelector('#hideButton-' + oid);
    console.log('.hideButton-' + oid);

    chrome.storage.local.set(item, () => {
        chrome.storage.local.get('type', (res) => {
            if (card) {
                if (!mode) {
                    if (res.type === 'mark') {
                        makeCardWhite(card);
                    }

                   hButton.textContent = 'hide';
                   hButton.setAttribute('style', 'background-color: red;');
                } else if (mode) {
                    if (res.type === 'remove') {
                        card.parentNode.remove();
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
    // delete existing hide button
    // card.querySelector('#hideButton-' + oid);
    // card.querySelector('#hideButton-' + oid);

    // button hide block
    const hideDiv = document.createElement('div');
    hideDiv.setAttribute('class', 'button -icon favorite');
    hideDiv.setAttribute('style', 'right: 50px;');
    hideDiv.setAttribute('style', 'margin-bottom: 1em;');
    hideDiv.setAttribute('class', 'buttonArea -ghost-light');
    hideDiv.setAttribute('id', 'div-hideButton-' + oid);

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
    hideButton.setAttribute('id', 'hideButton-' + oid);
    hideButton.textContent = text;
    hideButton.addEventListener('click', (event) => {
        event.preventDefault();
        return hide(oid, card);
    });

    // add button to block
    hideDiv.appendChild(hideButton);

    const br = document.createElement('br');
    const hr = document.createElement('hr');
    hideDiv.appendChild(br);
    hideDiv.appendChild(hr);

    // insert hide block before link
    const target = card.querySelector('div[class="Card-favorite"]');
    console.log(hideDiv.innerHTML)
    target.insertBefore(hideDiv, target.firstChild);
}

function MarkIfHidden(oid, card) {
    const bid = `b-${oid}`;
    return chrome.storage.local.get([bid], (result) => {
        if (result[bid]) {
            chrome.storage.local.get('type', (res) => {
                if (res.type === 'remove') {
                    card.parentNode.remove();
                } else {
                    makeCardRed(card);
                }
            });
        }
        console.log('add hide button for object id: ' + bid);
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
    console.log('process objects');
    document.querySelectorAll('div.Card').forEach((card) => {
        // Object ID
        const oid = getObjectID(card);
        console.log('process card: ' + oid);

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
    console.log('DOM content loaded');
    if (document.querySelectorAll('input[data-event-category="view_building_about"]').length) {
        // eslint-disable-next-line no-console
        console.log('This is building page', window.location.href);
        // "building page"
        addBlocks();
    } else if (document.querySelectorAll('#search-results').length > 0) {
        // eslint-disable-next-line no-console
        console.log('This is search results page', window.location.href);
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
}, { once: true }); // prevent DOM load event calls twice
