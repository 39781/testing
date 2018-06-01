var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var url				= require('url')
var path			= require("path");	
var config			= require('./config');	
const uuidv1 		= require('uuid/v1');
var mail			= require('./utilities/mail');
var calendar		= require('./utilities/calender.js');	
const accountSid = 'ACff689e72e6afb4e4bb8d5bc1d34c857e';
const authToken = '29edd5d3cf99ae4fe4ec7dc88b3737cd';
const client = require('twilio')(accountSid, authToken);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var k = 0;
//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.send("welcome to macy");
});

router.get('/reply',function(req, res){
	const response = new VoiceResponse();
	console.log('req.query',req.query.SpeechResult);
	
	//var txt = q.SpeechResult.replace(/[+]/,' ');
	//console.log('text',txt);
	//req.query.SpeechResult
	dialogflowAPI(config.IAQuestions[req.query.repl], req.query.cid)
	.then(function(resp){
		k++;
		for(l=0;l<resp.result.fulfillment.messages.length;l++){
			message = resp.result.fulfillment.messages[l];
		//resp.result.fulfillment.messages.forEach(function(message){
			if(resp.result.metadata.intentName == 'IAConversation7'){
				calendar.createEvent();		
			}
			if(message.platform=='google'&&message.type=="simple_response"){						
				if(/bye/ig.test(message.textToSpeech)){
					callHistory[resp.sessionId] = 'end';
					response.hangup();					
				}else{				
					console.log('k value',k);				
					if(resp.result.metadata.intentName == 'Default Fallback Intent'&&req.query.repl<7){						
						message.textToSpeech = config.botResponses[req.query.repl];						
					}									
					response.redirect({method:'GET'},'https://fast-reef-26757.herokuapp.com/answer?SpeechResult='+encodeURIComponent(message.textToSpeech)+'&cid='+resp.sessionId);
				}
					res.writeHead(200, { 'Content-Type': 'text/xml' });
					res.end(response.toString());
					break;
			}													
		}		
	})
	.catch((err)=>{
		console.log(err);
	})		
});

router.get('/answer',function(req, res){	
	const response = new VoiceResponse();	
	/*twimlResponse.say('Thanks for contacting our sales department. Our ' +
	  'next available representative will take your call. ',
	  { voice: 'alice' });

	twimlResponse.dial(salesNumber);
	
        res.send(twimlResponse.toString());*/    
		callHistory[req.query.cid] = 'inCall';
	const gather = response.gather({
	  input: 'speech dtmf',	  
	  numDigits: 1,	  
	  speechTimeout:'auto',
	  action:'/reply?cid='+req.query.cid+'&repl='+(k),
	  method:'GET'
	});
	console.log(req.query.SpeechResult);
	
	gather.say(req.query.SpeechResult,{voice: 'woman'});	
	response.redirect({method:'GET'},'https://fast-reef-26757.herokuapp.com/answer?SpeechResult='+encodeURIComponent("are you there ")+'&cid='+req.query.cid);
	//gather.say(botRep[req.query.textResult],{ voice: 'alice' });	
	res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(response.toString());
});

router.get('/call',function(req, res){	
		k=0;
	client.calls
	  .create({
		url: 'https://fast-reef-26757.herokuapp.com/answer?SpeechResult=Hello&cid='+req.query.cid,
		//to: '+919597439539',
		to: '+919626649195',
		from: '+1 281-843-9288 ',
		method:"GET"	
	  })
	  .then(call => {
			
			callHistory[req.query.cid] = 'dialing';		  
		  	res.status(200).send("started");
	  })
	  .catch(err =>	{		
			res.status(500).send(err);
			callHistory[req.query.cid] = 'callNotConnected';		  
	  });	
});
router.get('/event',function(req, res){
	console.log(req.params, req.query);
	console.log('event');
	res.end();
});

router.post('/botHandler',function(req, res){			
	console.log('req received');	
	var len = req.body.inputs.length;
	var response = JSON.parse(JSON.stringify(config.responseObj));					
	for(i=0; i<len; i++){		
		console.log(req.body.inputs[i].intent);
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			dialogflowAPI(req.body.inputs[i].rawInputs[0].query, req.body.conversation.conversationId)
			.then(function(resp){
				for(l=0;l<resp.result.fulfillment.messages.length;l++){
					message = resp.result.fulfillment.messages[l];
				//resp.result.fulfillment.messages.forEach(function(message){		
					if(resp.result.metadata.intentName == 'customerFindReq'&&callHistory[resp.sessionId] != 'end'){
						message.textToSpeech = config.waitResponses[callHistory[resp.sessionId]];
					}						
					if(message.platform=='google'&&message.type=="simple_response"){						
						simpleResponse(response, message.textToSpeech);
					}	
					if(message.platform=='google'&&message.type=="suggestion_chips"){
						sugesstionChips(response, message.suggestions);
					}					
				};				
				if(resp.result.metadata.intentName == 'finalIntent'){
					request('https://fast-reef-26757.herokuapp.com/call?cid='+resp.sessionId, function (error, response, body) {
						  console.log('error:', error); // Print the error if one occurred
						  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
						  console.log('body:', body); // Print the HTML for the Google homepage.
					});												
					res.json(response).end();
				}else{
					res.json(response).end();
				}					
				//);						
			})
			.catch((err)=>{
				console.log(err);
			})	
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
	return response;
}

var sugesstionChips = function(response, suggestions){
	console.log(suggestions);
	response.expectedInputs[0].inputPrompt.richInitialPrompt.suggestions = suggestions;	
}
module.exports = router;



			