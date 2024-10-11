/*
This is a Chrome extension designed to enhance the user experience on https://lun.ua,
 a website that lists thousands of residential buildings under construction.

One key feature missing from the site is the ability to hide unwanted buildings from the list,
 and that's where this extension comes in!

With the extension, you can simply press the "Hide" button on any building you don't want to see,
 and it will disappear from the listing.
  You can also export your list of hidden buildings or import it later for easy management.

*/

import "./background.css";

function makeCardWhite(card, id) {
    // remove card Red background
    // means remove entry from excluded
    console.log(`mark object with id: ${id} LISTED(white)`);
    card.parentNode.classList.remove('redBg');
}

// add class redBg
function makeCardRed(card, id) {
    // add Red background to the card entry
    // means adding entry to excluded
    console.log(`mark object with id: ${id} EXCLUDED(red)`);
    card.parentNode.classList.add('redBg');
}

function swapToggleButton(card, toggleButtonId, isHidden) {
    // here we do swap operation
    // swap show to hide, green to red and backwards
    const toggleButton = card.querySelector(toggleButtonId);


    if (isHidden === true) {
        console.log(`toggleButton set text "hide" and style "red"`);
        toggleButton.textContent = 'hide';
        toggleButton.setAttribute('style', 'background-color: red;');
    } else {
        console.log(`toggleButton set text "show" and style "green"`);
        toggleButton.textContent = 'show';
        toggleButton.setAttribute('style', 'background-color: green;');
    }
}


function updateObject(entryDbId, isHidden, card) {
    const item = {};
    const objectId = entryDbId.replace('b-', ''); // remove db prefix
    const toggleButtonId = `#toggleButton-${objectId}`;


    item[entryDbId] = isHidden; // set hidden property to object. TRUE means hidden
    console.log(`toggle button is ${toggleButtonId}`);

    // set selected entry with new hidden value
    // then update button on data return
    chrome.storage.local.set(item, () => {
        chrome.storage.local.get('type', (config) => {  // type is hide "type", could be "mark" (mark red) or "remove"
            if (card) {
                if (!isHidden) { // object is not hidden
                    if (config.hideType === 'mark' || config.hideType === undefined) {
                        makeCardWhite(card, objectId);
                    }

                    // swap toggle button
                    swapToggleButton(card, toggleButtonId, true);
                } else if (isHidden) { // object is hidden
                    if (config.hideType === 'remove') {
                        card.parentNode.remove();
                    } else {
                        makeCardRed(card, objectId);
                    }

                    // swap toggle button
                    swapToggleButton(card, toggleButtonId, false);
                }
            }
        });
    });
}

function hide(oid, card) {
    // save object to database
    // and update toggle button
    const entryDbId = `b-${oid}`;
    chrome.storage.local.get([entryDbId], (result) => {
        if (result[entryDbId]) {
            updateObject(entryDbId, false, card);
        } else {
            updateObject(entryDbId, true, card);
        }
    });
}

function addToggleButton(card, oid, isHidden) {
    // create button block
    const buttonToggleBlock = document.createElement('div');
    buttonToggleBlock.setAttribute('class', 'button -icon favorite');
    buttonToggleBlock.setAttribute('style', 'right: 50px;');
    buttonToggleBlock.setAttribute('style', 'margin-bottom: 1em;');
    buttonToggleBlock.setAttribute('class', 'buttonArea -ghost-light');
    buttonToggleBlock.setAttribute('id', `div-toggleButton-${oid}`);

    let color;
    let text;

    if (isHidden) {
        color = 'green';
        text = 'show';
    } else {
        color = 'red';
        text = 'hide';
    }

    // toggle button
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('style', `background-color: ${color};color: white;`);
    toggleButton.setAttribute('class', 'toggleButton');
    toggleButton.setAttribute('id', `toggleButton-${oid}`);
    toggleButton.textContent = text;
    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        return hide(oid, card);
    });

    // add button to block
    buttonToggleBlock.appendChild(toggleButton);

    const br = document.createElement('br');
    const hr = document.createElement('hr');
    buttonToggleBlock.appendChild(br);
    buttonToggleBlock.appendChild(hr);

    // insert hide block before link
    const target = card.querySelector('div[class="Card-favorite"]');
    target.insertBefore(buttonToggleBlock, target.firstChild);
}

function MarkIfHidden(oid, card) {
    const bid = `b-${oid}`;
    return chrome.storage.local.get([bid], (result) => {
        if (result[bid]) {
            chrome.storage.local.get('hideType', (config) => {
                if (config.hideType === 'remove') {
                    card.parentNode.remove();
                } else {
                    makeCardRed(card);
                }
            });
        }
        console.log(`add hide button for object id: ${bid}`);
        addToggleButton(card, oid, result[bid]);
    });
}

function getObjectID(card) {
    // get object ID from list page
    return card.querySelector('div.UIFavoriteButton').getAttribute('data-favorites')
        .split('-')[1];
}

function getObjectIDFromObjectPage(page) {
    // get object ID from object (detail) page
    return page.querySelector('div.UIFavoriteButton').getAttribute('data-favorites')
        .split('-')[1];
}

function processObjects() {
    console.log('process objects');
    document.querySelectorAll('div.Card').forEach((card) => {
        // Object ID
        const oid = getObjectID(card);
        console.log(`process card: ${oid}`);

        // Some cards have bigger format
        // this code make all cards same dimensions

        // remove class Card-x2
        card.classList.remove('Card-x2');
        const parentClasses = card.parentNode.classList;

        // Remove all existing column classes in one go
        parentClasses.remove('UIGrid-col-6', 'UIGrid-col-lg-8', 'UIGrid-col-md-12', 'UIGrid-col-xs-12');

        // Add the desired column classes
        parentClasses.add('UIGrid-col-3', 'UIGrid-col-lg-4', 'UIGrid-col-md-6', 'UIGrid-col-xs-6');


        // mark card by red background if is hidden
        MarkIfHidden(oid, card);
    });
}

function addBlocks() {
    const bid = getObjectIDFromObjectPage(document);

    const buildingDiv = document.querySelector('.Building');
    const newBlocksDIv = document.createElement('div');
    newBlocksDIv.classList.add('advFlawBlock', 'index100');
    buildingDiv.insertBefore(newBlocksDIv, buildingDiv.firstChild);

    const faBlock1 = document.createElement('div');
    faBlock1.classList.add('faBlock', 'marginRight05em');
    const title = document.createElement('h3');
    title.textContent = 'Минусы комплекса:';
    faBlock1.appendChild(title);

    const desc1 = document.createElement('textarea');
    desc1.classList.add('descArea');


    let desc = `flaws-${bid}`;
    chrome.storage.local.get(desc, (result) => {
        if (result[desc]) {
            desc1.value = result[desc];
        }
    });

    const faBlock2 = document.createElement('div');
    faBlock2.classList.add('faBlock');
    const title2 = document.createElement('h3');
    title2.textContent = 'Преимущества комплекса:';
    faBlock2.appendChild(title2);

    const desc2 = document.createElement('textarea');
    desc2.classList.add('descArea');

    desc = `adv-${bid}`;
    chrome.storage.local.get(desc, (result) => {
        if (result[desc]) {
            desc2.value = result[desc];
        }
    });

    faBlock1.appendChild(desc1);
    faBlock2.appendChild(desc2);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'save';

    saveButton.classList.add('saveButton');
    newBlocksDIv.appendChild(faBlock1);
    newBlocksDIv.appendChild(faBlock2);
    newBlocksDIv.appendChild(saveButton);

    saveButton.addEventListener('click', () => {
        const d = {};
        d[`flaws-${bid}`] = desc1.value;
        d[`adv-${bid}`] = desc2.value;
        chrome.storage.local.set(d, () => {
            desc1.style.backgroundColor = 'lightgreen';
            desc2.style.backgroundColor = 'lightgreen';
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
