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

// function that works with countdown of window close on modals (when someone receive badge, when topic changed and modal when you reach limit of sent badges)
export function startModalCountdown(modal, modalMessageElement, modalMessage, modalTimerSeconds) {
    modal.style.transform = 'translate(-50%, 0)'
    modalMessageElement.innerHTML = modalMessage
    let n = 4;
    const timerToClose = setInterval(() => {
      modalTimerSeconds.innerHTML = n--;
    }, 1000)
    setTimeout(() => {
        modal.style.transform = 'translate(-50%, -300%)'
        clearInterval(timerToClose)
        modalTimerSeconds.innerHTML = "5";
    }, 5000)
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

// function that grab all needed data and make a request to create a new badge in db and sends a message about received badge
export async function sendBadge(e, modalShadow, DASHBOARD_LINK, MEET_CODE, DATE, badgeModalWrapper, badgesLimitAlert) {
    const sendBadgeButton = e.target;
    modalShadow.style.display = 'none';
    const { badge_name } = await new Promise(resolve => chrome.storage.local.get(["badge_name"], resolve));
    const { current_name } = await new Promise(resolve => chrome.storage.local.get(["current_name"], resolve));
    let badgeName = sendBadgeButton.previousElementSibling.querySelector('span').textContent;
    const badgeLimit = localStorage.getItem("badge_limit");
    if(+badgeLimit) {
        localStorage.setItem("badge_limit", badgeLimit - 1)
        fetch(`${DASHBOARD_LINK}/badges/givebadge/${MEET_CODE}/${badge_name}/${DATE}`, {
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
                    body: JSON.stringify({message: `${badge_name} received ${badgeName} badge from ${current_name}`, url: MEET_CODE, date: DATE, type: "BADGE" })
                });
            });
    }

    badgeModalWrapper.style.display = 'none';
    const badgesLimitTimerSeconds = document.querySelector('.badges-limit-timer-seconds')
    const badgesLimitMessage = document.querySelector('.badges-limit-message')
    
    if(!+badgeLimit) startModalCountdown(badgesLimitAlert, badgesLimitMessage, "You`ve reach the limit of sent badges for this meeting!", badgesLimitTimerSeconds)
    }

//function that creates new note
export async function createNote(modalShadow, DASHBOARD_LINK, MEET_CODE, DATE, notesModal) {
    const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));
    modalShadow.style.display = 'none'
    let note = document.querySelector('.note')
    if (note.value) {
        fetch(`${DASHBOARD_LINK}/newconclusion/${MEET_CODE}/${DATE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: note.value,
                url: MEET_CODE,
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
export function setNewTopic(topicInput, MEET_CODE, DATE, modalShadow, topicModal) {
    const topicValue = topicInput.value;
    fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: MEET_CODE, date: DATE, message: `New topic of the meeting: ${topicValue}`, type: "TOPIC" })
    })

    closeTopicModal(modalShadow, topicModal, topicInput)
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

export function openWelcomeModal(welcomeModal, modalShadow) {
    modalShadow.style.display = 'flex'
    welcomeModal.style.display = 'flex'
}

export function closeWelcomeModal(welcomeModal, modalShadow) {
    modalShadow.style.display = 'none'
    welcomeModal.style.display = 'none'
}