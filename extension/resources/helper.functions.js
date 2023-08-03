// function that wait when element appears so app can work with it
export async function waitForElement(selector) {
    while (true) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// function that creates element (the same as document.createElement())
export function $el(tag, props) {
    let p, el = document.createElement(tag);
    if (props) {
        for (p in props) {
            el[p] = props[p];
        }
    }
    return el;
}

//function that do a small visual effects when you want to go to dashboard or see current topic of the meet
export function dashboardAndTopicVisual(el, selector, topValue) {
    const wrapper = document.querySelector(selector);
    const attr = el.dataset.active;
    el.dataset.active = attr ? '' : 'true';
    el.style.transform = attr ? `rotate(360deg)` : `rotate(-360deg)`;
    wrapper.style.top = attr ? `-${topValue}px` : '0';
}

//just styles for topic and notes modal
export function openTopicAndNotesModal(modalShadow, modal, optionsWrapper) {
    modalShadow.style.display = 'flex'
    modal.style.display = 'flex'
    optionsWrapper.style.display = 'none'
}

// function which close badges modal
export function closeBadgesModal(modalShadow, badgeModalWrapper, badgeSearchInput, badges) {
    modalShadow.style.display = 'none'
    badgeModalWrapper.style.display = 'none'
    badgeSearchInput.value = ''
    badges.forEach(badge => {
        badge.style.display = 'flex'
    })
}

// function that opens badges modal
export function openBadgesModal(e, modalShadow, badgeModalWrapper) {
    const openBadgesModalButton = e.target;
    modalShadow.style.display = 'flex'
    badgeModalWrapper.style.display = 'flex'
    let attr = openBadgesModalButton.parentElement.getAttribute('data-name')
    chrome.storage.local.set({ "badge_name": attr })
}

// function that grab all needed data and make a request to create a new badge in db and sends a message to user that he or she received badge
export async function sendBadge(e, modalShadow, LINK, url, date, badgeModalWrapper) {
    const sendBadgeButton = e.target;
    modalShadow.style.display = 'none';
    const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));
    const { badge_name } = await new Promise(resolve => chrome.storage.local.get(["badge_name"], resolve));
    let badgeName = sendBadgeButton.previousElementSibling.querySelector('span').textContent;
    let badgeImage = sendBadgeButton.previousElementSibling.querySelector('img').src

    fetch(`${LINK}badges/givebadge/${url}/${badge_name}/${date}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            badge: badgeName,
        })
    })
        .then(() => {
            fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: 'New badge!', url, date, message: `You received ${badgeName} badge from ${current_name}!`, avatar: badgeImage, to: badge_name, type: "BADGE" })
            });
        });

    badgeModalWrapper.style.display = 'none';
}

//function that creates new note
export async function createNote(modalShadow, LINK, url, date, notesModal) {
    const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));
    modalShadow.style.display = 'none'
    let note = document.querySelector('.note')
    if (note.value) {
        fetch(`${LINK}newconclusion/${url}/${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: note.value,
                url,
                tags: [],
                sender: current_name
            })
        })
            .then(() => {
                notesModal.style.display = 'none'
            })
    }
}

//function that closes notes modal
export function closeNotesModal(modalShadow, notesModal) {
    modalShadow.style.display = 'none'
    let noteInput = document.querySelector('.note')
    notesModal.style.display = 'none'
    noteInput.value = ''
}

//function that closes set new topic modal
export function closeTopicModal(modalShadow, topicModal, topicInput) {
    modalShadow.style.display = 'none'
    topicModal.style.display = 'none'
    topicInput.value = ''
}

//function that sends message to all of participants that now we have a new topic of the meet
export function setNewTopic(topicInput, url, date, modalShadow, topicModal) {
    const topicValue = topicInput.value;
    fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: "New topic!", url, date, message: `Current topic of the meeting: ${topicValue}`, avatar: 'https://cdn-icons-png.flaticon.com/128/9227/9227001.png', to: 'everyone', type: "TOPIC" })
    })

    modalShadow.style.display = 'none'
    topicModal.style.display = 'none'
    topicInput.value = ''
}

//function that open chat and host(s) can choose whom to message
export function openChat(listOfMessageUsers, openChatButton) {
    listOfMessageUsers.style.display = 'flex'
    openChatButton.style.display = 'none'
    const messageIndicator = document.querySelector('.message-indicator')
    messageIndicator.textContent = '0'
    messageIndicator.style.display = 'none'
}
//function that close chat
export function closeChat(listOfMessageUsers, openChatButton) {
    listOfMessageUsers.style.display = 'none'
    openChatButton.style.display = 'flex'
}

//function that opens chat with certain user
export function openChatSpace(e) {
    const openChatSpaceElement = e.target;
    const chatUser = openChatSpaceElement.closest('.chat-user')
    let username = chatUser.querySelector('.chat-user-name').textContent;
    let avatar = chatUser.querySelector('.chat-user-avatar').src;

    const newMessageText = chatUser.querySelector('.chat-user-new-message');
    newMessageText.style.display = 'none';

    const chatSpaceWrapper = document.querySelector(`.chat-space-wrapper[data-username="${username.replace(' ', '')}"]`);
    const chatSpace = chatSpaceWrapper.querySelector('.chat-space');
    const chatSpaceUsername = chatSpaceWrapper.querySelector('.chat-space-name');
    const chatSpaceAvatar = chatSpaceWrapper.querySelector('.chat-space-avatar');

    chatSpaceAvatar.src = avatar;
    chatSpaceUsername.innerHTML = username;
    chatSpace.style.display = 'flex';
    chatSpaceWrapper.style.visibility = 'visible';
    chatSpaceWrapper.style.opacity = '1';
}

//function when user want to return from chat with certain user to list of users in chat
export function returnToMainChat(e, openChatButton) {
    const returnToMainChatButton = e.target;
    const username = returnToMainChatButton.parentElement.querySelector('.chat-space-name').textContent.trim().replace(' ', '')
    const chatSpace = document.querySelector(`.chat-space-wrapper[data-username="${username}"`)
    chatSpace.style.visibility = 'hidden'
    chatSpace.style.opacity = '0'
    document.querySelector('.message-list-wrapper').style.display = 'flex'
    openChatButton.style.display = 'flex'
}

//function that sends message from the host to participant of the meet
export async function sendChatMessage(e, url) {
    const sendChatMessageButton = e.target;
    const message = sendChatMessageButton.previousElementSibling;
    const chatSpace = sendChatMessageButton.parentElement.previousElementSibling;
    if (!message.value) return
    const messageElement = document.createElement('div')
    messageElement.className = 'sended-message'
    messageElement.innerHTML = message.value
    chatSpace.appendChild(messageElement)
    const to = message.parentElement.previousElementSibling.previousElementSibling.querySelector('.chat-space-name').textContent;
    const { host } = await new Promise(resolve => chrome.storage.local.get(["host"], resolve));

    fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: host, url, message: message.value, to, type: "MESSAGE_FROM_HOST", avatar: 'https://cdn-icons-png.flaticon.com/128/1144/1144760.png' })
    })
        .then(() => {
            message.value = ''
        })
}

//search badges function
export function searchBadges(searchBadgesInput, badges) {
    let value = searchBadgesInput.value.toLowerCase()
    badges.forEach(badge => {
        let badgeName = badge.querySelector('.span-wrapper > span')
        if (!badgeName.textContent.toLowerCase().includes(value) && value) badge.style.display = 'none'
        else badge.style.display = 'flex'
    })
}