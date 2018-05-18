 exports.langDetect=function(callback){
 const Translate = require('@google-cloud/translate');

// Creates a client
const translate = new Translate({keyFilename: 'NewAgent-713947e4e3e2.json'});
 const text = 'restablecer mi cuenta';

translate
  .detect(text)
  .then(results => {
    let detections = results[0];
    detections = Array.isArray(detections) ? detections : [detections];
    console.log(results);
    console.log('Detections:');
    detections.forEach(detection => {
      //console.log(`${detection.input} => ${detection.language}`);
	  callback(`${detection.language}`);
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
 }
 exports.langTranslate=function(callback){
  const Translate = require('@google-cloud/translate');

// Creates a client
const translate = new Translate({keyFilename: 'NewAgent-713947e4e3e2.json'});
  const text = 'restablecer mi cuenta';
  const target = 'en';
  translate
  .translate(text, target)
  .then(results => {
    let translations = results[0];
    translations = Array.isArray(translations)
      ? translations
      : [translations];

    console.log('Translations:');
    translations.forEach((translation, i) => {
      callback(`${translation}`);
	  //console.log(`${text[i]} => (${target}) ${translation}`);
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
  }
  
 // module.exports = multiLingual;