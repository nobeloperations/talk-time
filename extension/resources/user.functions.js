//function that add user to database
export function addUser(users, url, date, LINK) {
    Array.from(users).forEach(user => {
        const userInfo = user.querySelector('.SKWIhd')
        const userAvatar = userInfo.querySelector('.BEaVse > img')
        const userName = userInfo.querySelector('.zSX24d > .jKwXVe > .zWGUib')
        const generalName = document.querySelector('.u6vdEc').textContent

        fetch(`${LINK}users/create/${url}/${date}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Token': 'Bearer 580792'
            },
            body: JSON.stringify({
                name: userName.textContent,
                avatar: userAvatar.src,
                date,
                generalName
            })
        })
    })
}