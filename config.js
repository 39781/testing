module.exports = {	
	accessToken: "82717e62013740298f1660b33799f445",
    dialogflowAPI : "https://api.api.ai/v1/query?v=20150910",
	responseObj:{
		"conversationToken": "",
		"expectUserResponse": true,
		"expectedInputs": [
			{
				"inputPrompt": {
					"richInitialPrompt": {
						"items": [],
						"suggestions": []								
					}
				},
				"possibleIntents": [
					{
						"intent": "actions.intent.TEXT"
					}
				]
			}
		]
	},
	"flemming":"BH@hexaware.com",
	"Jhon":"bhariprasad.msc@gmail.com",
	 calendarEvent : {
		'summary': 'Appointment scheduled between Jhon - Flemming',
		'location': 'via phone',
		'description': 'Mr. Jhon need help regarding insurance coverage for assets.',
		'organizer': {
			'email': 'hexatestmailer@gmail.com',
			'self': true
		},
		'start': {
			'dateTime': '2018-06-28T09:00:00-07:00',
			'timeZone': 'Asia/Kolkata',
		},
		'end': {
			'dateTime': '2018-06-28T17:00:00-07:00',
			'timeZone': 'Asia/Kolkata',
		},
		'recurrence': [
			'RRULE:FREQ=DAILY;COUNT=2'
		],
		'attendees': [
			{'email': 'BH@hexaware.com'},
			{'email': 'bhariprasad.msc@gmail.com'},
		],
		'reminders': {
			'useDefault': false,
			'overrides': [
				{'method': 'email', 'minutes': 24 * 60},
				{'method': 'popup', 'minutes': 10},
			],
		},
	}
}

