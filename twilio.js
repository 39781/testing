
const accountSid = 'AC233d3ebceafad1c7658d64dad3ae03bd';
	const authToken = '574bce6f3f25f3f744b1cf08e39ca8c3';
	const client = require('twilio')(accountSid, authToken);

	client.calls
	  .create({
		url: 'http://demo.twilio.com/docs/voice.xml',
		to: '+8500050085',
		from: '+8500050085'
	  })
	  .then(call => process.stdout.write(call.sid))
	  .catch(err => console.log(err));