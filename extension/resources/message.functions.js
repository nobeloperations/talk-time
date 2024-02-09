const { host } = await new Promise(resolve => chrome.storage.local.get(['host'], resolve));
const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));
const { startModalCountdown } = await import(chrome.runtime.getURL('./resources/helper.functions.js'));


//function that sends message to host (basically it invokes when you reply to host), cause if you`re not a host , you can`t send messages
export async function replyToHost(MEET_CODE) {
    const message = document.querySelector('.received-message-reply-input')
    if (!message.value.trim()) return;
    fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: current_name, url: MEET_CODE, message: message.value, to: host, type: "MESSAGE_TO_HOST" })
    })
        .then(() => {
            document.querySelector('.received-message-alert').style.transform = 'translate(-50%, -300%)'
            message.value = ''
        })
}

//function that ivokes when host receives the message
export function receiveMessageFromParticipant(message) {
    if (current_name === host) {
        const from = message.from.replaceAll(' ', '');
        const chatUser = document.querySelector(`.chat-participant[data-chatname=${from}`)
        const newMessageText = chatUser.querySelector('.chat-participant-new-message')
        const messageListWrapper = document.querySelector('.chat-wrapper')
        const messageIndicator = document.querySelector('.new-chat-message-indicator')
        const chatSpaceWrapper = document.querySelector(`.chat-container[data-username=${from}`)

        if (messageListWrapper.style.display === 'none') {
            messageIndicator.style.display = 'flex'
            messageIndicator.innerHTML = Number(messageIndicator.textContent) + 1
        }

        if (chatSpaceWrapper.style.opacity === '0') newMessageText.style.display = 'flex'

        const chatSpace = chatSpaceWrapper.querySelector('.chat')
        const messageElement = document.createElement('div')
        messageElement.className = 'chat-received-message'
        messageElement.innerHTML = message.message

        chatSpace.appendChild(messageElement)
    }
}

//function that invoke when you receive message from host
export function receiveMessageFromHost(message) {
    const messageElement = document.querySelector('.received-message')
    const messageFrom = document.querySelector('.received-message-sender')
    const messageModal = document.querySelector('.received-message-alert')
    const messageAvatar = document.querySelector('.received-message-avatar')

    if (message.to === current_name) {
        messageFrom.innerHTML = message.from;
        messageAvatar.src = message.avatar;
        messageElement.innerHTML = message.message;
        messageModal.style.transform = 'translate(-50%, -50%)'
    }
}

export function receiveBadgeMessage(message, date, MEET_CODE) {
    const badgesMessage = document.querySelector('.received-badge-message')
    const badgeImage = badgesMessage.querySelector('.alert-image');
    const badgesAlert = document.querySelector('.badges-alert')
    const badgesTimerSeconds = document.querySelector('.badges-timer-seconds')
    if (message.url === MEET_CODE && message.date === date) {
        startModalCountdown(badgesAlert, badgesMessage, message.message, badgesTimerSeconds, message.image)
    }
}

//function that invoke when someone has changed topic
export function receiveTopicMessage(message, date, MEET_CODE) {
    const topicMessage = document.querySelector('.new-topic-message')
    const currTopic = document.querySelector('.current-topic')
    const topicAlert = document.querySelector('.topic-alert')
    const topicTimerSeconds = document.querySelector('.topic-timer-seconds')
    if (message.url === MEET_CODE && message.date === date) {
        currTopic.innerHTML = message.message;
        startModalCountdown(topicAlert, topicMessage, message.message, topicTimerSeconds, message.image)
    }
}

//function that can be used to close messages modal (don`t depend on a class of element)
export function closeMessageModal(e) {
    const modal = e.target.parentElement;
    modal.style.transform = 'translate(-50%, -300%)'
}