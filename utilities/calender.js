const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var {calendarEvent}   = require('./../config');
// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'credentials.json';

// Load client secrets from a local file.
var calender = {
	createEvent:function(){
		try {
		  const content = fs.readFileSync('./utilities/client_secret.json');
		  return authorize(JSON.parse(content), createEvent);
		} catch (err) {
		  return console.log('Error loading client secret file:', err);
		}
	}
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  let token = {};
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    token = fs.readFileSync(TOKEN_PATH);
  } catch (err) {
    return getAccessToken(oAuth2Client, callback);
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  return callback(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      } catch (err) {
        console.error(err);
      }
      return callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function createEvent(auth) {
	const calendar = google.calendar({version: 'v3', auth});
	//google_calendar.events.insert('sujith@toobler.com', addEventBody,option, function(addEventError, addEventResponse){
	 calendar.events.insert({	 
	  calendarId: 'primary',
	  resource: calendarEvent,
	  sendNotifications:true
	},function(err, logInfo) {
	  if (err) {
		console.log('There was an error contacting the Calendar service: ' + err);
		return;
	  }
	  return logInfo.htmlLink;
	});
}

module.exports = calender;

