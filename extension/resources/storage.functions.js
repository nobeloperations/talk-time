export async function setCurrentName(nodes) {
    return new Promise(function (resolve, reject) {
        Array.from(nodes).forEach(user => {
            const username = user.querySelector('.zWGUib');
            if (username?.nextElementSibling?.textContent === '(You)') {
                chrome.storage.local.set({ "current_name": username.textContent.trim() });
            }
        });
        resolve();
    });
}

export async function setHost(nodes) {
    return new Promise(function (resolve, reject) {
        Array.from(nodes).forEach(user => {
            const meetingHostElement = user.querySelector('.d93U2d').textContent
            if (meetingHostElement.trim() === 'Meeting host') {
                const username = user.querySelector('.zWGUib').textContent.trim()
                chrome.storage.local.set({ "host": username })
            }
        });
        resolve();
    });
}
