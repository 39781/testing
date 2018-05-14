var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var config 			= require("./config");	
var mail			= require('./utilities/mail');	

//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.redirect("/home.html");
});

router.get('/chat', function(req, res) {
  res.redirect('/chat.html');
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
			if(body.result.metadata.intentName=='easyQuote'){
				body.result.contexts.forEach(function(context){
					if(context.name == 'easyquote-followup'){	
						conf = JSON.parse(JSON.stringify(config));						
						mail.sendMail(context.parameters.email, conf.mailContent, conf.mailAttachments);
					}
				});
			}
			res.json(body).end();
		}		
	});			
})
router.post('/botHandler',/*Authentication.SetRealm('botHandler'), Authentication.BasicAuthentication, */function(req, res){
	//console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));	
		var intentName = req.body.result.metadata.intentName;
		switch(intentName){
			case 'easyQuote':func = easyQuote;break;
			case 'feedBackOptionsIntent':func = feedBackOptionsIntent;break;
			case 'feedBackNoIntent':func = feedBackNoIntent; break;
		}
		func(req.body)
		.then((resp)=>{
			console.log(resp);
			res.json(resp).end();	
		})
		.catch((err)=>{
			res.json(err).end();	
		});
});
var feedBackNoIntent = function(reqBody){
	return new Promise(function(resolve, reject){
		resolve({		
			"speech": "",
			"displayText":"",
			"followupEvent":{
				"name":"finalIntent",
				"data":{  
					"finalMsg":"Okay, Thank you",					
				}
			}
		});
	});
}
var feedBackOptionsIntent = function(reqBody){
	return new Promise(function(resolve, reject){
		resolve({		
			"speech": "",
			"displayText":"",
			"followupEvent":{
				"name":"finalIntent",
				"data":{  
					"finalMsg":"We thank you for your valuable feedback",					
				}
			}
		});
	});
}

var easyQuote = function(reqBody){
	return new Promise(function(resolve, reject){
		resolve({		
			"speech": "",
			"displayText":"",
			"followupEvent":{
				"name":"feedBackIntent",
				"data":{  
					"confirmMsg":"Thank you for requesting a quote. We'll get back to you with the details you're looking for as soon as possible",					
				}
			}
		});
	});
}



module.exports = router;



			