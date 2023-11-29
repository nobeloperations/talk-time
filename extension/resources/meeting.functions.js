//function that addes current meeting into database
export async function addMeeting(meetingName, MEET_CODE, DATE, DASHBOARD_LINK) {
    if (meetingName !== 'Ready to join?' && meetingName !== '' && meetingName !== 'Meeting details') {
        await fetch(`${DASHBOARD_LINK}/main/addmeeting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: meetingName,
                url: MEET_CODE,
                date: DATE
            })
        });
    }
}