
//function that addes current meeting into database
export async function addMeeting(meetingName, url, date, LINK) {
    if (meetingName !== 'Ready to join?' && meetingName !== '' && meetingName !== 'Meeting details') {
        await fetch(`${LINK}main/addmeeting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: meetingName,
                url,
                date
            })
        });
    }
}