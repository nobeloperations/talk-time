//function that creates badges modal with all badges
function createBadgesModal(body) {
    let modal = document.createElement('div');
    modal.className = 'badge-modal-wrapper'
    modal.innerHTML = `
    <div class="badge-modal-header">
    <input type="text" placeholder="Search" class="badge-search" />
    <button class="close-badges-modal">╳</button>
  </div>
  <div class="badge-modal">
    <div class="badge-item" data-badge="be_present">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/be_present.png" />
            <span>Be Present</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
    <div class="badge-item" data-badge="bee_brief">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/bee_brief.png" />
            <span>Bee Brief</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
    <div class="badge-item" data-badge="fun">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/fun.png" />
            <span>Fun</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
    <div class="badge-item" data-badge="encourage">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/encourage.png" />
            <span>Encourage</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
    <div class="badge-item" data-badge="on_time">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/on_time.png" />
            <span>On Time</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
    <div class="badge-item" data-badge="help">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/help.png" />
            <span>Help</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
    <div class="badge-item" data-badge="zen_enviroment">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/zen_enviroment.png" />
            <span>Zen Enviroment</span>
        </div>
        <button class="send-badge">Send</button>
    </div>
  </div>
      `
    modal.style.display = 'none'
    body.appendChild(modal)
}

//function that creates three modals, they are displayed when you received a message, topic changed or you recived new badge
function createMessageModals(body) {
    let messageModal = document.createElement('div')
    messageModal.className = 'message-alert'
    messageModal.style.display = 'none'
    messageModal.innerHTML = `
    <div class="message-wrapper">
    <div class="message-content">
        <img class="message-avatar"></img>
        <div class="message-text-wrapper">
            <span class="message-from"></span><br />
            <span class="message"></span>
        </div>
    </div>
    <span class="close-message-alert">×</span>
    </div>
    <div class="reply-wrapper">
        <input placeholder="Reply" type="text" class="reply-input">
        <button class="reply-button">send</button>
    </div>
    `
    let topicMessageModal = document.createElement('div')
    topicMessageModal.className = 'topic-alert'
    topicMessageModal.style.display = 'none'
    topicMessageModal.innerHTML = `
    <div class="topic-message-wrapper">
    <div class="topic-message-content">
        <img class="topic-avatar"></img>
        <div class="topic-text-wrapper">
            <span class="topic-from">Topic Change</span><br />
            <span class="topic-message"></span>
        </div>
    </div>
    <span class="close-topic-alert">×</span>
    </div>
    `

    let badgeMessageModal = document.createElement('div')
    badgeMessageModal.className = 'badges-alert'
    badgeMessageModal.style.display = 'none'
    badgeMessageModal.innerHTML = `
    <div class="badges-message-wrapper">
    <div class="badges-message-content">
        <img class="badges-avatar"></img>
        <div class="badges-text-wrapper">
            <span class="badges-from"></span><br />
            <span class="badges-message"></span>
        </div>
    </div>
    <span class="close-badges-alert">×</span>
    </div>
    `
    body.appendChild(messageModal)
    body.appendChild(badgeMessageModal)
    body.appendChild(topicMessageModal)
}

//function that creates notes modal template
function createNotesModal(body) {
    let notesModal = document.createElement('div')
    notesModal.className = 'notes-modal'
    notesModal.innerHTML = `
    <h2 class="notes-title">Add new note</h2>
    <input type="text" class="note" placeholder="Enter your note">
    <hr>
    <div class="notes-buttons">
        <button class="cancel-note">Cancel</button>
        <button class="add-note">Add note</button>
    </div>
    <span class="notes-instruction">* All notes will be displayed in the dashboard page</span>
    `
    body.appendChild(notesModal)
}

//function that create shadow block which appears behind every modal
function createShadowModal(body) {
    let modalShadow = document.createElement('div')
    modalShadow.className = 'modal-shadow'
    body.appendChild(modalShadow)
}

//function that creates modal, it appears when you want to set a new topic
function createTopicModal(body) {
    let topicModal = document.createElement('div')
    topicModal.className = 'topic-modal'
    topicModal.innerHTML = `
    <div class="topic-input-wrapper">
    <input type="text" class="topic-input" placeholder="New topic of the meeting">
        <div class="set-topic">
            Set
        </div>
    </div>
    <span class="close-topic-modal">×</span>
    `

    body.appendChild(topicModal)
}

//template for new topic and add note items in three dots menu
export const optionButtons = `

<div class="note-wrapper">
    <div class="note-img-wrapper">
    <svg class="options-img note-img" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
    viewBox="0 0 1000 1000" xml:space="preserve">
    <rect x="0" y="0" width="100%" height="100%" fill="none" />
    <g transform="matrix(1 0 0 1 500 500)" id="699643">
        <path
            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; is-custom-font: none; font-file-url: none; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
            vector-effect="non-scaling-stroke" transform=" translate(-255.9416, -256)"
            d="M 495.6 49.23 l -32.82 -32.82 C 451.8 5.471 437.5 0 423.1 0 c -14.33 0 -28.66 5.469 -39.6 16.41 L 167.5 232.5 C 159.1 240 154.8 249.5 152.4 259.8 L 128.3 367.2 C 126.5 376.1 133.4 384 141.1 384 c 0.916 0 1.852 -0.0918 2.797 -0.2813 c 0 0 74.03 -15.71 107.4 -23.56 c 10.1 -2.377 19.13 -7.459 26.46 -14.79 l 217 -217 C 517.5 106.5 517.4 71.1 495.6 49.23 z M 461.7 94.4 L 244.7 311.4 C 243.6 312.5 242.5 313.1 241.2 313.4 c -13.7 3.227 -34.65 7.857 -54.3 12.14 l 12.41 -55.2 C 199.6 268.9 200.3 267.5 201.4 266.5 l 216.1 -216.1 C 419.4 48.41 421.6 48 423.1 48 s 3.715 0.4062 5.65 2.342 l 32.82 32.83 C 464.8 86.34 464.8 91.27 461.7 94.4 z M 424 288 c -13.25 0 -24 10.75 -24 24 v 128 c 0 13.23 -10.78 24 -24 24 h -304 c -13.22 0 -24 -10.77 -24 -24 v -304 c 0 -13.23 10.78 -24 24 -24 h 144 c 13.25 0 24 -10.75 24 -24 S 229.3 64 216 64 L 71.1 63.99 C 32.31 63.99 0 96.29 0 135.1 v 304 C 0 479.7 32.31 512 71.1 512 h 303.1 c 39.69 0 71.1 -32.3 71.1 -72 L 448 312 C 448 298.8 437.3 288 424 288 z"
            stroke-linecap="round" />
    </g>
</svg>
<span class="options-span">Add note</span>
</div>
</div>

<div class="topic-wrapper">
    <div class="topic-img-wrapper">
    <svg class="options-img topic-img" viewBox="0 0 48 48" enable-background="new 0 0 48 48" id="Layer_1" version="1.1"
        xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Layer_3">

            <polygon fill="#241F20"
                points="42.25,4 36.523,4 36.25,4 34.781,4 32.312,4 31.312,4 28.781,4 27.166,4 25.25,4 25.062,4    25.062,1.625 25.062,0.375 25.062,0 11.875,0 5.75,0 5.75,22 5.75,48 11.875,48 11.875,22 19,22 22.75,22 25.062,22 25.25,22    25.25,23 25.25,25.625 25.25,26 31.312,26 32.312,26 34.25,26 36.25,26 36.523,26 42.25,26 37.25,15  " />

        </g>
    </svg>
    <span class="options-span">Topic of the meet</span>
    </div>
</div>
`
//function that creates a template for chat (list of users)
function createListOfMessageUsers(body) {
    const listOfMessageUsers = document.createElement('div')
    listOfMessageUsers.className = 'message-list-wrapper'
    listOfMessageUsers.innerHTML = `
        <button class="close-chat-button">Close</button>
        <div class="message-list">
            <div class="empty-messages-list">
                <img class="empty-messages-list-img" src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png" />
                <span class="empty-messages-list-text">Users will appear here...</span>
            </div>
        </div>
    `
    body.appendChild(listOfMessageUsers)
}

function createNewVersionModal(body) {
    const newVersionModal = document.createElement('div')
    newVersionModal.className = 'new-version-modal'
    newVersionModal.innerHTML = `
        <span>New version of talk time is available!</span>
        <span>Remove it from Chrome and download one more time</span>
        <div class="update-buttons">
        <button class="close-update">Close</button>
        <a href="https://chrome.google.com/webstore/detail/talk-time-for-google-meet/bclhnknpopffhkpodghagpcekbmljclh">
            <button class="update-link">Update it here</button>
        </a>
        </div>
    `
    body.appendChild(newVersionModal)
}

//function that added all elements, which should be added at time when user just enter google meet
export function generateHTML(body) {
    createListOfMessageUsers(body)
    createTopicModal(body)
    createShadowModal(body)
    createNotesModal(body)
    createMessageModals(body)
    createBadgesModal(body)
    createNewVersionModal(body)
}

//function that add add note and notes items to three dots menu
export function addTopicAndNotesItems(optionsWrapper) {
    const addedWrapperEl = document.createElement('div')
    addedWrapperEl.className = 'options-added-wrapper'
    addedWrapperEl.innerHTML = optionButtons

    optionsWrapper.prepend(addedWrapperEl)
}

//function that creates current topic and dashboard link items (in top left corner)
export function addTopicAndDashboardFlags(url, date, meetingName) {

    let dashboardLink = document.createElement('div');
    dashboardLink.className = 'dashboard-link-wrapper';
    dashboardLink.innerHTML = `
      <img class="dashboard-link-image" data-linkactive="" src="https://cdn-icons-png.flaticon.com/128/4050/4050374.png"/>
      <a class="dashboard-link" href="https://nobeltt.com/dashboard/${url}/${date}?q=${meetingName}">Visit dashboard</a>
    `;
    document.body.appendChild(dashboardLink);

    let topicWrapper = document.createElement('div');
    topicWrapper.className = 'curr-topic-wrapper';
    topicWrapper.innerHTML = `
      <img class="curr-topic-image" data-topicactive="" src="https://cdn-icons-png.flaticon.com/128/4886/4886806.png"/>
      <span class="curr-topic">No topic yet</span>
    `;
    document.body.appendChild(topicWrapper);
}

//function that creates open chat button (in bottom left corner)
export async function setOpenChatButton() {
    const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));
    const { host } = await new Promise(resolve => chrome.storage.local.get(['host'], resolve));
    if ((current_name && host) && current_name === host) {
      const openChat = document.createElement('div')
      openChat.className = 'open-chat-button'
      openChat.innerHTML = `
              <span class="open-chat-span">Chat</span>
              <div class="message-indicator">0</div>
            `
      document.body.appendChild(openChat)
    }
  }