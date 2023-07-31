const { host } = await new Promise(resolve => chrome.storage.local.get(['host'], resolve));
const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));

export async function sendMessageToHost(url) {
    const message = document.querySelector('.reply-input')
    if (!message.value.trim()) return;
    fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: current_name, url, message: message.value, to: host, type: "MESSAGE_TO_HOST" })
    })
        .then(() => {
            document.querySelector('.message-alert').style.display = 'none'
            document.querySelector('.modal-shadow').style.display = 'none'
            message.value = ''
        })
}

export function messageToHost(message) {
    if (current_name === host) {
        const from = message.from.replaceAll(' ', '');
        const chatUser = document.querySelector(`.chat-user[data-chatname=${from}`)
        const newMessageText = chatUser.querySelector('.chat-user-new-message')
        const messageListWrapper = document.querySelector('.message-list-wrapper')
        const messageIndicator = document.querySelector('.message-indicator')
        if (messageListWrapper.style.display === 'none') {
            messageIndicator.style.display = 'flex'
            messageIndicator.innerHTML = Number(messageIndicator.textContent) + 1
        }
        const chatSpaceWrapper = document.querySelector(`.chat-space-wrapper[data-username=${from}`)
        if (chatSpaceWrapper.style.opacity === '0') newMessageText.style.display = 'flex'
        const chatSpace = chatSpaceWrapper.querySelector('.chat-space')
        const messageElement = document.createElement('div')
        messageElement.className = 'received-message'
        messageElement.innerHTML = message.message
        chatSpace.appendChild(messageElement)
    }
}

function setMessageContent(from, avatar, messageEl, messageModal, message, modalShadow) {
    from.innerHTML = message.from
    avatar.src = message.avatar;
    messageEl.innerHTML = message.message
    messageModal.style.display = 'flex'
    modalShadow.style.display = 'flex'
}

export function messageFromHost(message) {
    const messageElement = document.querySelector('.message')
    const modalShadow = document.querySelector('.modal-shadow')
    const messageFrom = document.querySelector('.message-from')
    const messageModal = document.querySelector('.message-alert')
    const messageAvatar = document.querySelector('.message-avatar')
    if (message.to === current_name) { setMessageContent(messageFrom, messageAvatar, messageElement, messageModal, message, modalShadow) }
}


export function messageBadge(message, date, parsed_URL) {
    const badgesMessage = document.querySelector('.badges-message')
    const modalShadow = document.querySelector('.modal-shadow')
    const badgesFrom = document.querySelector('.badges-from')
    const badgesMessageModal = document.querySelector('.badges-alert')
    const badgesAvatar = document.querySelector('.badges-avatar')
    if (message.url === parsed_URL && message.date === date && current_name === message.to) setMessageContent(badgesFrom, badgesAvatar, badgesMessage, badgesMessageModal, message, modalShadow)
}

export function messageTopic(message, date, parsed_URL) {
    const topicMessage = document.querySelector('.topic-message')
    const currTopic = document.querySelector('.curr-topic')
    const modalShadow = document.querySelector('.modal-shadow')
    const topicFrom = document.querySelector('.topic-from')
    const topicMessageModal = document.querySelector('.topic-alert')
    const topicAvatar = document.querySelector('.topic-avatar')
    if (message.url === parsed_URL && message.date === date) {
        setMessageContent(topicFrom, topicAvatar, topicMessage, topicMessageModal, message, modalShadow)
        currTopic.innerHTML = message.message;
    }
}
