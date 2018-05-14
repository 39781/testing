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
                                "textToSpeech": "Howdy! I can tell you fun facts about almost any number, like 42. What do you have in mind?",
                                "displayText": "Howdy! I can tell you fun facts about almost any number. What do you have in mind?"
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
}
	res.json(resp).end();
});

router.post('/dialogflowAPI',function(req, res){
	var options = { 
		method: 'POST',
		url: config.dialogflowAPI,
		headers: {
			"Authorization": "Bearer " + config.accessToken
		},
		body:req.body,			
		json: true 
	}; 			
	request(options, function (error, response, body) {
		if(error){
			res.json({error:"error in chat server api call"}).end();
		}else{		
			getIntent(body)
			.then((resp)=>{
				res.json(resp).end();
			})
			.catch((err)=>{
				res.json(err).end();
			})	
			

		}		
	});			
})

module.exports = router;



			