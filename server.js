var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

var https = require('https');
var util = require('./util');
var sqs = require('sqs.js');
//var _ = require('lowdash');

var reader = sqs.reader({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  	region: 'us-west-1',
  	queueUrl: 'https://sqs.eu-west-1.amazonaws.com/831844703282/machineparts_events',
  	startPolling: true
});

var writer = sqs.writer({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  	region: 'us-west-1',
  	queueUrl: 'https://sqs.eu-west-1.amazonaws.com/831844703282/machineparts_events'	
});

reader.on('error', function(err) {
  console.error(err);
});

reader.on('message', function(msg) {
  console.log('Received %s', msg.Body);
  msg.ack(function(err){
  	console.log(err);
  });
});


app.use(morgan('combined'));
app.use(util.overrideContentType());
app.use(bodyParser.json());


app.get('/', function(req, res){
	res.status(200).send('service is online');
})

app.post('/sns', function(req, res){
	console.log(req.body);
	if (!req.headers['x-amz-sns-message-type']) return res.sendStatus(400);
	var messageType = req.headers['x-amz-sns-message-type'];
	if (messageType  === 'SubscriptionConfirmation') {
		var subscribeUrl = req.body.SubscribeURL;
		https.get(subscribeUrl, function(){
			res.sendStatus(200);
		});	
	} else if (messageType === 'Notification') {
		// store the message in the queue
		writer.publish({MessageBody : JSON.stringify(req.body)});
		res.sendStatus(200);
	}
	
});

app.post('/event', function(req, res){
	
	res.sendStatus(200);
});

var server = app.listen(process.env.PORT || 80, function() {
	var host = process.env.IP;
	var port = server.address().port;

	console.log('The api is running at http://%s:%s', host, port);
})


// we might need a different process (spawn) to process the message queue