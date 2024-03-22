const { generateChatBadgeMessage } = await import(chrome.runtime.getURL('../resources/html.functions.js'));

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
export function startModalCountdown(modal, modalMessageElement, modalMessage, modalTimerSeconds, image) {
    const imageElement = modal.querySelector('.alert-image')
    imageElement.src = image
    modal.style.transform = 'translate(-50%, 0)'
    modal.style.top = '20px'
    modalMessageElement.innerHTML = modalMessage
    let n = 4;
    const timerToClose = setInterval(() => {
      modalTimerSeconds.innerHTML = n--;
    }, 1000)
    setTimeout(() => {
        modal.style.transform = 'translate(-50%, -100vh)'
        clearInterval(timerToClose)
        modalTimerSeconds.innerHTML = "5";
    }, 5000)
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

// function that opens badges modal (and check what level of badges user has)
export async function openBadgesModal(e, modalShadow, badgeModalWrapper, DASHBOARD_LINK) {
    const openBadgesModalButton = e.target;
    modalShadow.style.display = 'flex'
    badgeModalWrapper.style.display = 'flex'
    let username = openBadgesModalButton.parentElement.getAttribute('data-name')
    chrome.storage.local.set({ "badge_name": username })
    
    const response = await fetch(`${DASHBOARD_LINK}/badges/${username}`)
    let { allowedBadges } = await response.json()

    const badgesNamesElements = badgeModalWrapper.querySelectorAll('.badge .badge-name');
    const badgesLevelsElements = badgeModalWrapper.querySelectorAll('.badge .badge-level');
    let badgesLevels = [];

    badgesLevelsElements.forEach(badgesLevelElement => {
        badgesLevels.push(badgesLevelElement.textContent)
    })

    badgesNamesElements.forEach(badgeNameElement => {
        const sendBadgeButton = badgeNameElement.parentElement.parentElement.nextElementSibling;
        sendBadgeButton.disabled = !allowedBadges.includes(badgeNameElement.textContent)
    })
}

// function that grab all needed data and make a request to create a new badge in db and sends a message about received badge
    export async function sendBadge(e, modalShadow, DASHBOARD_LINK, MEET_CODE, DATE, badgeModalWrapper, badgesLimitAlert) {
        const sendBadgeButton = e.target;
        modalShadow.style.display = 'none';
        const { badge_name } = await new Promise(resolve => chrome.storage.local.get(["badge_name"], resolve));
        const { current_name } = await new Promise(resolve => chrome.storage.local.get(["current_name"], resolve));
        let badgeName = sendBadgeButton.previousElementSibling.querySelector('span').textContent;
        let badgeImageName = badgeName.split(' ').map(badge => badge.toLowerCase()).join('_');
        let badgeImageURL = `https://nobeltt.com/img/${badgeImageName}.png`
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
                    from: current_name
                })
            })
                .then(() => {
                    let message = `${badge_name} received an upvote on a ${badgeName} badge from ${current_name}`;
                    fetch('https://adventurous-glorious-actor.glitch.me/send-messages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({message, url: MEET_CODE, date: DATE, type: "BADGE", image: badgeImageURL })
                    })
                    .then(() => {
                        badgeModalWrapper.style.display = 'none';
                        const badgesLimitTimerSeconds = document.querySelector('.badges-limit-timer-seconds')
                        const badgesLimitMessage = document.querySelector('.exhausted-badges-limit-message')
                        
                        if(!+badgeLimit) startModalCountdown(badgesLimitAlert, badgesLimitMessage, "You`ve reach the limit of sent badges for this meeting!", badgesLimitTimerSeconds, "https://cdn-icons-png.flaticon.com/128/3563/3563395.png")
                    });
                })
        }

        
    }

//function that creates new note
export async function addNote(modalShadow, DASHBOARD_LINK, MEET_CODE, DATE, notesModal) {
    const { current_name } = await new Promise(resolve => chrome.storage.local.get(['current_name'], resolve));
    let note = document.querySelector('.create-note-input')
    if (note.value) {
        fetch(`${DASHBOARD_LINK}/newnote/${MEET_CODE}/${DATE}`, {
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
            modalShadow.style.display = 'none'
        })
    }
}

//function that closes notes modal
export function closeNotesModal(modalShadow, notesModal) {
    modalShadow.style.display = 'none'
    let noteInput = document.querySelector('.create-note-input')
    notesModal.style.display = 'none'
    noteInput.value = ''
}

//search badges function
export function searchBadges(searchBadgesInput, badges) {
    let value = searchBadgesInput.value.toLowerCase()
    badges.forEach(badge => {
        let badgeName = badge.querySelector('.badge-name')
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