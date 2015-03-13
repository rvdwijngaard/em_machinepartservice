var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

var https = require('https');
var util = require('./util');
//var _ = require('lowdash');


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
		res.sendStatus(200);
		// store the message in the queue
	}
	
});

app.post('/event', function(req, res){
	// receive the event message here
	// message id
	
	// parse it 
	
	// put it in the queue
	
	// process the queue asynchroniously
	
	
	res.sendStatus(200);
});

var server = app.listen(process.env.PORT || 80, function() {
	var host = process.env.IP;
	var port = server.address().port;

	console.log('The api is running at http://%s:%s', host, port);
})


// we might need a different process (spawn) to process the message queue