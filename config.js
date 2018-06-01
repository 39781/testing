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
			'email': 'hex.digitalinsurer@gmail.com',
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
			{'email': 'bhariprasad.msc@gmail.com'},
			{'email': 'MadhurV@hexaware.com'},
			{'email': 'MukundanM@hexaware.com'},
		],
		'reminders': {
			'useDefault': false,
			'overrides': [
				{'method': 'email', 'minutes': 24 * 60},
				{'method': 'popup', 'minutes': 10},
			],
		},
	},
	IAQuestions:["Hi, How can I help you?","Sure. Wait for a second","I have another meeting at 3 pm which will get over only by 4 pm","The earliest I can call Mr. John is around 4.15 pm","Sure. I can call Mr. John at 2.30 pm tomorrow","Can you provide the contact details of Mr. John","Thanks. I have made a note of it and I will call Mr. John at 2.30 pm tomorrow","Meanwhile, can you request Mr. John to send me a property inspection report for his Candy business","Great. Have a good day. Bye"],
	botResponses:["Hi. I am calling to book an appointment for a client, Mr. John who wants to insure the assets of his candy manufacturing business. I am looking for your time , sometime tomorrow at 3 pm","Okay","Oh","Do you have any availability between 2 to 4 pm tomorrow?","2:30 pm is fine","His mobile number is 7 2 0 0  0 5 0 0 8 5 and his email id is b h a r i p r a s a d . m s c @gmail.com","Great","Sure. I will do that. Thanks"],
	waitResponses:{
		"idle":"No Mr. Jhon, for what, what is an issue, can you explain",
		"dialing":"Sorry for the wait Mr. John, dialing going please will hold few minutes",
		"inCall":"Sorry for the wait Mr. John, I am talking with IA please wait one minute I will update appointment confirmation",
		"callNotConnected":"Sorry for the wait Mr. John, Right now I am unable to find IA, I will update appointment confirmation later"
	}	
}

