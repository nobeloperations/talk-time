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

//function that open chat and host can choose whom to message
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
export async function sendChatMessage(e, MEET_CODE) {
  const sendChatMessageButton = e.target;
  const message = sendChatMessageButton.previousElementSibling;
  if (!message.value) return
  const chatSpace = sendChatMessageButton.parentElement.previousElementSibling;
  const messageElement = document.createElement('div')
  messageElement.className = 'sended-message'
  messageElement.innerHTML = message.value
  chatSpace.appendChild(messageElement)
  const to = message.parentElement.previousElementSibling.previousElementSibling.querySelector('.chat-space-name').textContent;
  const { host } = await new Promise(resolve => chrome.storage.local.get(["host"], resolve));

  fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: host, url: MEET_CODE, message: message.value, to, type: "MESSAGE_FROM_HOST", avatar: 'https://cdn-icons-png.flaticon.com/128/1144/1144760.png' })
  })
      .then(() => {
          message.value = ''
      })
}