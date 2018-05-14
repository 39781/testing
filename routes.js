var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	



//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.redirect("/home.html");
});



router.post('/botHandler',/*Authentication.SetRealm('botHandler'), Authentication.BasicAuthentication, */function(req, res){
	
	console.log('req received');
	res.end();
});
router.post('/botHandler2',/*Authentication.SetRealm('botHandler'), Authentication.BasicAuthentication, */function(req, res){
	
	console.log('req received to botHandler2');
	var resp = {						
			
				"speech": "its me",
				"text": "its me"
			}
	res.json(resp).end();
});
module.exports = router;



			