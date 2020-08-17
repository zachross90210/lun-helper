document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('div.card').forEach((card) => {
        card.setAttribute('style', 'background: rgba(250,0,0,0.2)');
        const hideDiv = document.createElement('div');
        hideDiv.setAttribute('class', 'button -icon favorite');
        hideDiv.setAttribute('style', 'right: 50px;');
        const hideButton = document.createElement('button');
        hideButton.setAttribute('style', 'background-color: red;');
        hideButton.textContent = 'hide';
        hideDiv.append(hideButton);

        const a = card.querySelector('a');
        card.insertBefore(hideDiv, a.querySelector('a.card-media'));
    });
});
