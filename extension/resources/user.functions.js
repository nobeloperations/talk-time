//function that add user to database
const { REQUEST_TOKEN } = await import(chrome.runtime.getURL('../resources/env.js'));

export function addUser(users, MEET_CODE, DATE, DASHBOARD_LINK) {
    Array.from(users).forEach(user => {
        const userInfo = user.querySelector('.SKWIhd')
        const userAvatar = userInfo.querySelector('.BEaVse > img')
        const userName = userInfo.querySelector('.zSX24d > .jKwXVe > .zWGUib')
        const generalName = document.querySelector('.u6vdEc').textContent

        fetch(`${DASHBOARD_LINK}/users/create/${MEET_CODE}/${DATE}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Token': REQUEST_TOKEN
            },
            body: JSON.stringify({
                name: userName.textContent,
                avatar: userAvatar.src,
                date: DATE,
                generalName
            })
        })
    })
}