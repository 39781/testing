var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var config			= require('./config');	
const uuidv1 		= require('uuid/v1');
const accountSid = 'AC233d3ebceafad1c7658d64dad3ae03bd';
const authToken = '574bce6f3f25f3f744b1cf08e39ca8c3';
const client = require('twilio')(accountSid, authToken);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const twimlResponse = new VoiceResponse();
//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.send("welcome to macy");
});
router.get('/reply',function(req, res){
	console.log(req);
	res.end();
});
router.post('/answer',function(req, res){
	/*console.log(req,'req received');
	twimlResponse.say('Thanks for contacting our sales department. Our ' +
	  'next available representative will take your call. ',
	  { voice: 'alice' });

	twimlResponse.dial(salesNumber);

        res.send(twimlResponse.toString());*/
    const response = new VoiceResponse();
	const gather = response.gather({
	  input: 'speech dtmf',
	  timeout: 3,
	  numDigits: 1,
	  action:'/reply',
	  method:GET
	});
	gather.say('Hi. I am calling to book an appointment for a client, Mr. John who wants to insure the assets of his candy manufacturing business. I am looking for your time , sometime tomorrow at 3 pm');
	res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(response.toString());
})

router.get('/call',function(req, res){		
	client.calls
	  .create({
		url: 'https://fast-reef-26757.herokuapp.com/answer',
		to: '+918500050085',
		from: '+1 913-705-4764'		
	  })
	  .then(call => {
		  	console.log(call.sid);					  
	  })
	  .catch(err => res.status(500).send(err));	
});
router.post('/evevnt',function(req, res){
	console.log('event');
	res.end();
});

router.post('/botHandler',function(req, res){			
	console.log('req received');
	console.log(JSON.stringify(req.body));
	var len = req.body.inputs.length;
	var response = JSON.parse(JSON.stringify(config.responseObj));					
	for(i=0; i<len; i++){		
		console.log(req.body.inputs[i].intent);
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			dialogflowAPI(req.body.inputs[i].rawInputs[0].query, req.body.conversation.conversationId)
			.then(function(resp){
				console.log(resp);	
				for(l=0;l<resp.result.fulfillment.messages.length;l++){
					message = resp.result.fulfillment.messages[l];
				//resp.result.fulfillment.messages.forEach(function(message){											
					if(message.platform=='google'&&message.type=="simple_response"){						
						simpleResponse(response, message.textToSpeech);
					}	
					if(message.platform=='google'&&message.type=="suggestion_chips"){
						sugesstionChips(response, message.suggestions);
					}			
									
				};//);						
				res.json(response).end();					
			});			
			break;
		}else if(req.body.inputs[i].intent == 'actions.intent.MAIN'){			
			simpleResponse(response, "Hi, I'm Macy. Your friendly Personal Assistant. How can I help you today?");
			res.json(response).end();
			break;
		}
	}	
});

var dialogflowAPI = function(input, sessId){	
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'POST',
			url: config.dialogflowAPI,
			headers: {
				"Authorization": "Bearer " + config.accessToken
			},
			body:{
				sessionId: sessId,
				lang: "en",
				query:input
			},			
			json: true 
		}; 					
		request(options, function (error, response, body) {
			if(error){
				res.json({error:"error in chat server api call"}).end();
			}else{											
				resolve(body);
			}		
		});			
	});
}

var simpleResponse = function(response, responseText){
	response.expectedInputs[0].inputPrompt.richInitialPrompt.items.push({
		"simpleResponse": {
			"textToSpeech": responseText,
			"displayText": responseText
		}
	});	
}

var sugesstionChips = function(response, suggestions){
	console.log(suggestions);
	response.expectedInputs[0].inputPrompt.richInitialPrompt.suggestions = suggestions;	
}
module.exports = router;



			