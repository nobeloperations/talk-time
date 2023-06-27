export function createBadgesModal(body) {
    let modal = document.createElement('div');
    modal.className = 'badge-modal-wrapper'
    modal.innerHTML = `
    <div class="badge-modal-header">
    <input type="text" placeholder="Search" class="badge-search" />
    <button class="close-badge-modal">╳</button>
  </div>
  <div class="badge-modal">
    <div class="badge-item" data-badge="active_listener3.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/active_listener3.png" />
            <span>Active Listener</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="areas_of_agreement5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/areas_of_agreement5.png" />
            <span>Areas Of Agreement</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="ask_for_feedback3.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/ask_for_feedback3.png" />
            <span>Ask For Feedback</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="bee_brief6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/bee_brief6.png" />
            <span>Bee Brief</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="brainstormer5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/brainstormer5.png" />
            <span>Brainstormer</span>
        </div>
        <button class="send-badge">send</button>
  
    </div>
    <div class="badge-item" data-badge="check_for_understanding2.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/check_for_understanding2.png" />
            <span>Check For Understanding</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="clarifing_question4.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/clarifing_question4.png" />
            <span>Clarifing Question</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="decide5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/decide5.png" />
            <span>Decide</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="define_the_problem7.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/define_the_problem7.png" />
            <span>Define The Problem</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="disagreement_solver6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/disagreement_solver6.png" />
            <span>Disagreement Solver</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="encourageing_knowlege7.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/encourageing_knowlege7.png" />
            <span>Encourageing Knowlege</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="give_feedback7.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/give_feedback7.png" />
            <span>Give Feedback</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="helper5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/helper5.png" />
            <span>Helper</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="ideas_evaluation7.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/ideas_evaluation7.png" />
            <span>Ideas Evaluation</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="info_shareer4.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/info_shareer4.png" />
            <span>Info Shareer</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="mic_earned5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/mic_earned5.png" />
            <span>Mic Earned</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="muting_maestro2.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/muting_maestro2.png" />
            <span>Muting Maestro</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="norms_meeting5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/norms_meeting5.png" />
            <span>Norms Meeting</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="notes_master6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/notes_master6.png" />
            <span>Notes Master</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="online_tools6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/online_tools6.png" />
            <span>Online Tools</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="problem_pauser5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/problem_pauser5.png" />
            <span>Problem Pauser</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="questions3.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/questions3.png" />
            <span>Questions</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="ready_headset_go4.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/ready_headset_go4.png" />
            <span>Ready Headset Go</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="resource_vs_impact6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/resource_vs_impact6.png" />
            <span>Resource Vs Impact</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="screenshare2.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/screenshare2.png" />
            <span>Screenshare</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="stay_on_topic4.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/stay_on_topic4.png" />
            <span>Stay On Topic</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="teacher8.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/teacher8.png" />
            <span>Teacher</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="time_earning6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/time_earning6.png" />
            <span>Time Earning</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="to_do_tracker5.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/to_do_tracker5.png" />
            <span>To Do Tracker</span>
        </div>
        <button class="send-badge">send</button>
    </div>
    <div class="badge-item" data-badge="zen_enviroment6.png">
        <div class="span-wrapper">
            <img src="https://nobeltt.com/img/zen_enviroment6.png" />
            <span>Zen Enviroment</span>
        </div>
        <button class="send-badge">send</button>
    </div>
  </div>
      `
    modal.style.display = 'none'
    body.appendChild(modal)
}

export function createBadInternetModal(body, image) {
    const modal = document.createElement('div')
    modal.className = 'bad-internet-connection'
    modal.innerHTML = `
    <div class="bad-internet-content">
      <img src="${image}" alt="">
      <span>Your internet is bad, please, try to reconect</span>
    </div>
    <span class="close-bad-internet-modal">×</span>
    `
    modal.style.display = 'none'
    body.appendChild(modal)
}

export function createMessageModal(body) {
    let modal = document.createElement('div')
    modal.className = 'message-alert'
    modal.style.display = 'none'
    modal.innerHTML = `
    <div class="message-content">
    <img class="message-avatar"></img>
      <div class="message-text-wrapper">
        <span class="message-from"></span><br/>
        <span class="message"></span>
      </div>
    </div>
    <span class="close-message-alert">×</span>
    `
    body.appendChild(modal)
}

export function createNotesModal(body) {
    let notesModal = document.createElement('div')
    notesModal.className = 'notes-modal'
    notesModal.innerHTML = `
    <h2 class="notes-title">Add new note</h2>
    <input type="text" class="note" placeholder="Enter your note">
    <div class="tags-input-wrapper">
        <input maxlength="20" type="text" class="tags-input" placeholder="Enter your tags (max. 20 chars)">
        <button class="add-tag">Add Tag</button>
    </div>
    <div class="tags">
        <span class="no-tags">Your tags will be here...</span>
    </div>
    <hr>
    <div class="notes-buttons">
        <button class="cancel-note">Cancel</button>
        <button class="add-note">Add note</button>
    </div>
    <span class="notes-instruction">* All notes will be displayed in the dashboard page</span>
    `
    body.appendChild(notesModal)
}

export function createSendMessageModal(body) {
    let modal = document.createElement('div');
    modal.className = 'send-message-modal'
    modal.innerHTML = `
    <div class="send-message-input-wrapper">
    <input type="text" class="modal-message" placeholder="">
          <div class="modal-send">
              Send
          </div>
      </div>
      <span class="close-message-modal">×</span>
    `
    body.appendChild(modal)
}

export function createShadowModal(body) {
    let modalShadow = document.createElement('div')
    modalShadow.className = 'modal-shadow'
    body.appendChild(modalShadow)
}

export function createTopicModal(body) {
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