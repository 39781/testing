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
	
	console.log('req received');
	console.log(JSON.stringify(req.body));
	var len = req.body.inputs.length;
	var response = JSON.parse(JSON.stringify(config.responseObj));					
	for(i=0; i<len; i++){		
		console.log(req.body.inputs[i].intent);
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			dialogflowAPI(req.body.inputs[i].rawInputs[0].query)
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
			simpleResponse(response, "Hi, I am QuoteBuy bot, How can I help you?");
			res.json(response).end();
			break;
		}
	}	
	
	
	
});

var dialogflowAPI = function(input){	
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'POST',
			url: config.dialogflowAPI,
			headers: {
				"Authorization": "Bearer " + config.accessToken
			},
			body:{
				sessionId: uuidv1(),
				lang: "en",
				query:input
			},			
			json: true 
		}; 			
		console.log(options);
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



			