var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var config			= require('./config');	
const uuidv1 		= require('uuid/v1');

//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.redirect("/home.html");
});



router.post('/botHandler',function(req, res){	
	//console.log('req received');
	//console.log(JSON.stringify(req.body));
	var len = req.body.inputs.length;
	var response = JSON.parse(JSON.stringify(config.responseObj));					
	for(i=0; i<len; i++){		
		//console.log(req.body.inputs[i].intent);
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			dialogflowAPI(req.body.inputs[i].rawInputs[0].query, req.body.conversation.conversationId)
			.then(function(resp){
				if(typeof(chatLog[resp.result.sessionId]) == 'undefined'){
					chatLog[resp.result.sessionId]=[];
				}
				var log = {'user':resp.result.resolvedQuery,'bot':'',intentName:resp.result.metadata.intentName};
				if(resp.result.fulfillment.speech){
					log.Bot = resp.result.fulfillment.speech;
				}
				console.log(JSON.stringify(resp));	
				for(l=0;l<resp.result.fulfillment.messages.length;l++){
					message = resp.result.fulfillment.messages[l];
				//resp.result.fulfillment.messages.forEach(function(message){											
					if(message.platform=='google'&&message.type=="simple_response"){						
						log.Bot += ','+message.textToSpeech;
						simpleResponse(response, message.textToSpeech);
					}	
					if(message.platform=='google'&&message.type=="suggestion_chips"){
						log.Bot += ', Suggesion Chips :'+JSON.stringify(message.suggestions);
						sugesstionChips(response, message.suggestions);
					}			
									
				};//);		
				chatLog[resp.result.sessionId].push(log);	
				//console.log(JSON.stringify(chatLog[resp.result.sessionId]));
				res.json(response).end();					
			});			
			break;
		}else if(req.body.inputs[i].intent == 'actions.intent.MAIN'){			
			simpleResponse(response, "Hi, I am QuoteBuy bot, How can I help you?");
			res.json(response).end();
			break;
		}
	}	
	
	
	
});

var dialogflowAPI = function(input, sessId){	
	return new Promise(function(resolve, reject){
		queryCheck(input, sessId)
		.then(function(inputQuery){
			var options = { 
				method: 'POST',
				url: config.dialogflowAPI,
				headers: {
					"Authorization": "Bearer " + config.accessToken
				},
				body:{
					sessionId: sessId,
					lang: "en",
					query:inputQuery
				},			
				json: true 
			}; 			
			//console.log(options);
			request(options, function (error, response, body) {
				if(error){
					res.json({error:"error in chat server api call"}).end();
				}else{											
					resolve(body);
				}		
			});
		})
		.catch(function(err){
			
		})
					
	});
}
var queryCheck = function(query, sessionId){
	return new Promise(function(resolve, reject){
		if(chatLog[sessionId]){
			var flag = false;
			var len = chatLog[sessionId].length--;
			if(chatLog[sessionId][len]['bot'] == 'Please share your business type?'&& chatLog[sessionId][len]['intentName'] == 'insuranceLookup'){			
				flag = true;
			}
			if(flag){			
				query = chatLog[sessionId][len-1]['user'] + query;
			}
		}
		resolve(query);		
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
	//console.log(suggestions);
	response.expectedInputs[0].inputPrompt.richInitialPrompt.suggestions = suggestions;	
}
module.exports = router;



			