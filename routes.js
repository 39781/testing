var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var config			= require('./config');	


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
	for(i=0; i<len; i++){		
		console.log(req.body.inputs[i].intent);
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			dialogflowAPI(rawInputs[0].query)
			.then(function(resp){
				console.log(JSON.stringify(resp));
				res.json(resp).end();
			})
			break;
		}else if(req.body.inputs[i].intent == 'actions.intent.MAIN'){
			var resp = {
				"conversationToken": "",
				"expectUserResponse": true,
				"expectedInputs": [
					{
						"inputPrompt": {
							"richInitialPrompt": {
								"items": [
									{
										"simpleResponse": {
											"textToSpeech": " Hai , I am PL. Hari, What can I do for you",
											"displayText": "Hai , I am PL. Hari, What can I do for you"
										}
									}
								],
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
			};
			res.json(resp).end();
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

module.exports = router;



			