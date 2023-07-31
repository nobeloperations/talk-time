export async function waitForElement(selector) {
    while (true) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

export function $el(tag, props) {
    let p, el = document.createElement(tag);
    if (props) {
        for (p in props) {
            el[p] = props[p];
        }
    }
    return el;
}

export function dashboardAndTopicVisual(el, selector, topValue) {
    const wrapper = document.querySelector(selector);
    const attr = el.dataset.active;
    el.dataset.active = attr ? '' : 'true';
    el.style.transform = attr ? `rotate(360deg)` : `rotate(-360deg)`;
    wrapper.style.top = attr ? `-${topValue}px` : '0';
}

export function openTopicAndNotesModal(modalShadow, modal, optionsWrapper) {
    modalShadow.style.display = 'flex'
    modal.style.display = 'flex'
    optionsWrapper.style.display = 'none'
}

export function closeBadgesModal(modalShadow, badgeModalWrapper, badgeSearchInput, badges) {
    modalShadow.style.display = 'none'
    badgeModalWrapper.style.display = 'none'
    badgeSearchInput.value = ''
    badges.forEach(badge => {
        badge.style.display = 'flex'
    })
}

export function openBadgesModal(e, modalShadow, badgeModalWrapper) {
    const openBadgesModalButton = e.target;
    modalShadow.style.display = 'flex'
    badgeModalWrapper.style.display = 'flex'
    let attr = openBadgesModalButton.parentElement.getAttribute('data-name')
    chrome.storage.local.set({ "badge_name": attr })
}

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

export function createNote(modalShadow, LINK, url, date, notesModal) {
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
                tags: []
            })
        })
            .then(() => {
                notesModal.style.display = 'none'
            })
    }
}

export function closeNotesModal(modalShadow, notesModal) {
    modalShadow.style.display = 'none'
    let noteInput = document.querySelector('.note')
    notesModal.style.display = 'none'
    noteInput.value = ''
}

export function closeTopicModal(modalShadow, topicModal, topicInput) {
    modalShadow.style.display = 'none'
    topicModal.style.display = 'none'
    topicInput.value = ''
}

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

export function openChat(listOfMessageUsers, openChatButton) {
    listOfMessageUsers.style.display = 'flex'
    openChatButton.style.display = 'none'
    const messageIndicator = document.querySelector('.message-indicator')
    messageIndicator.textContent = '0'
    messageIndicator.style.display = 'none'
}

export function closeChat(listOfMessageUsers, openChatButton) {
    listOfMessageUsers.style.display = 'none'
    openChatButton.style.display = 'flex'
}

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

export function returnToMainChat(e, openChatButton) {
    const returnToMainChatButton = e.target;
    const username = returnToMainChatButton.parentElement.querySelector('.chat-space-name').textContent.trim().replace(' ', '')
    const chatSpace = document.querySelector(`.chat-space-wrapper[data-username="${username}"`)
    chatSpace.style.visibility = 'hidden'
    chatSpace.style.opacity = '0'
    document.querySelector('.message-list-wrapper').style.display = 'flex'
    openChatButton.style.display = 'flex'
}

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

export function searchBadges(searchBadgesInput, badges) {
    let value = searchBadgesInput.value.toLowerCase()
    badges.forEach(badge => {
        let badgeName = badge.querySelector('.span-wrapper > span')
        if (!badgeName.textContent.toLowerCase().includes(value) && value) badge.style.display = 'none'
        else badge.style.display = 'flex'
    })
}