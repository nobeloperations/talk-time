const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));

// adding user to chat list , so host can see and message 
function createChatUser(user, username) {
    const emptyListElement = document.querySelector('.empty-messages-list')
    const avatar = user.querySelector('.KjWwNd').src
    const usersList = document.querySelector('.message-list')
    const userElement = document.createElement('div')
    userElement.className = 'chat-user'
    userElement.dataset.chatname = username.replaceAll(' ', '')
    userElement.innerHTML = `
      <img class="chat-user-avatar" src=${avatar} />
      <div class="chat-user-info">
        <span class="chat-user-name">${username}</span>
        <span class="chat-user-new-message">New message</span>
      </div>
    `
    usersList.appendChild(userElement)
    emptyListElement.style.display = 'none'
}

// create element with input and container where messages will appear
function createChatSpace(username) {
    const chatSpace = document.createElement('div')
    chatSpace.className = 'chat-space-wrapper'
    chatSpace.dataset.username = username.replace(' ', '')
    chatSpace.innerHTML = `
      <div class="chat-space-header">
        <span class="chat-space-arrow-back">➜</span>
        <img class="chat-space-avatar" src="chat-space-img" />
        <span class="chat-space-name"></span>
      </div>
      <div class="chat-space"></div>
      <div class="chat-space-form">
        <input type="text" class="chat-space-input" placeholder="Your message here"/>
        <button class="chat-space-button">Send</button>
      </div>
    `
    document.body.appendChild(chatSpace)
}

//function that invokes two functions to completely add user to chat 
export function addUserToChat(nodes) {
    Array.from(nodes).forEach(async user => {
        const username = user.querySelector('.zWGUib').textContent.trim()
        if (current_name !== username) {
            createChatUser(user, username)
            createChatSpace(username)
        }
    })
}

//if user leaves meet , we remove it from chat
export function removeUserFromChat(mutation) {
    const removedUser = mutation.removedNodes[0]
    const username = removedUser.querySelector('.zWGUib').textContent.replaceAll(' ', '')
    if (username) {
        const chatUser = document.querySelector(`.chat-user[data-chatname=${username}`)
        const emptyMessagesList = document.querySelector('.empty-messages-list')
        const messagesList = document.querySelector('.message-list')
        messagesList.removeChild(chatUser)
        if (messagesList.children.length === 1) emptyMessagesList.style.display = 'flex'
    }
}