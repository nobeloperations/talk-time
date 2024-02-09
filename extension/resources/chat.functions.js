const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));

// adding user to chat list , so host can see and message 
function createChatUser(user, username) {
    const emptyListElement = document.querySelector('.empty-chat')
    const avatar = user.querySelector('.KjWwNd').src
    const usersList = document.querySelector('.chat-participants')
    const userElement = document.createElement('div')
    userElement.className = 'chat-participant'
    userElement.dataset.chatname = username.replaceAll(' ', '')
    userElement.innerHTML = `
      <img class="chat-participant-avatar" src=${avatar} />
      <div class="chat-participant-info">
        <span class="chat-participant-name">${username}</span>
        <span class="chat-participant-new-message">New message</span>
      </div>
    `
    usersList.appendChild(userElement)
    emptyListElement.style.display = 'none'
}

// create element with input and container where messages will appear
function createChatSpace(username) {
    const chatSpace = document.createElement('div')
    chatSpace.className = 'chat-container'
    chatSpace.dataset.username = username.replace(' ', '')
    chatSpace.innerHTML = `
      <div class="chat-header">
        <span class="chat-back-button">➜</span>
        <img class="chat-avatar" src="" />
        <span class="chat-name"></span>
      </div>
      <div class="chat"></div>
      <div class="chat-form">
        <input type="text" class="chat-input" placeholder="Your message here"/>
        <button class="chat-send-button">Send</button>
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
        const chatUser = document.querySelector(`.chat-participant[data-chatname=${username}`)
        const emptyMessagesList = document.querySelector('.empty-chat')
        const messagesList = document.querySelector('.chat-participants')
        messagesList.removeChild(chatUser)
        if (messagesList.children.length === 1) emptyMessagesList.style.display = 'flex'
    }
}

//function that open chat and host can choose whom to message
export function openChat(listOfMessageUsers, openChatButton) {
  listOfMessageUsers.style.display = 'flex'
  openChatButton.style.display = 'none'
  const messageIndicator = document.querySelector('.new-chat-message-indicator')
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
  const chatUser = openChatSpaceElement.closest('.chat-participant')
  let username = chatUser.querySelector('.chat-participant-name').textContent;
  let avatar = chatUser.querySelector('.chat-participant-avatar').src;

  const newMessageText = chatUser.querySelector('.chat-participant-new-message');
  newMessageText.style.display = 'none';

  const chatSpaceWrapper = document.querySelector(`.chat-container[data-username="${username.replace(' ', '')}"]`);
  const chatSpace = chatSpaceWrapper.querySelector('.chat');
  const chatSpaceUsername = chatSpaceWrapper.querySelector('.chat-name');
  const chatSpaceAvatar = chatSpaceWrapper.querySelector('.chat-avatar');

  chatSpaceAvatar.src = avatar;
  chatSpaceUsername.innerHTML = username;
  chatSpace.style.display = 'flex';
  chatSpaceWrapper.style.visibility = 'visible';
  chatSpaceWrapper.style.opacity = '1';
}

//function when user want to return from chat with certain user to list of users in chat
export function returnToMainChat(e, openChatButton) {
  const returnToMainChatButton = e.target;
  const username = returnToMainChatButton.parentElement.querySelector('.chat-name').textContent.trim().replace(' ', '')
  const chatSpace = document.querySelector(`.chat-container[data-username="${username}"`)
  chatSpace.style.visibility = 'hidden'
  chatSpace.style.opacity = '0'
  document.querySelector('.chat-wrapper').style.display = 'flex'
  openChatButton.style.display = 'flex'
}

//function that sends message from the host to participant of the meet
export async function sendChatMessage(e, MEET_CODE) {
  const sendChatMessageButton = e.target;
  const message = sendChatMessageButton.previousElementSibling;
  if (!message.value) return
  const chatSpace = sendChatMessageButton.parentElement.previousElementSibling;
  const messageElement = document.createElement('div')
  messageElement.className = 'chat-sended-message'
  messageElement.innerHTML = message.value
  chatSpace.appendChild(messageElement)
  const to = message.parentElement.previousElementSibling.previousElementSibling.querySelector('.chat-name').textContent;
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