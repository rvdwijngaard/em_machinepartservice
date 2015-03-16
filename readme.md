## API

### `sqs.reader(config)`

Required fields:
* `accessKeyId` AWS AccessKeyId credential
* `secretAccessKey` AWS secretAccessKey credential
* `region` AWS region
* `queueUrl` AWS SQS URL

Optional fields:
* `version` apiVersion (latest)
* `visibility` VisibilityTimeout
* `pollInterval` How often SQS is polled (1000)
* `pollingSize` How many messages should each request receive (10)
* `startPolling` Automatically start polling

Emits the following events:
* `message` (msg) received message
* `error` (err) error received by polling AWS

### `reader.receiveMessage()`

Fetches messages from the queue.

### `reader.poll()`

Calls `.receiveMessage()` continuously.

### `reader.close()`

Stops polling messages.

### `msg.ack([fn])`

Messages default properties are described [here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#receiveMessage-property).

Messages which shouldn't be delivered anymore should be removed from SQS. Invoke #ack to delete the message. An optional callback can be provided which receives `(err, data)` as parameters.

### `sqs.writer(config)`

Required fields:
* `accessKeyId` AWS AccessKeyId credential
* `secretAccessKey` AWS secretAccessKey credential
* `region` AWS region
* `queueUrl` AWS SQS URL

Emits the following events:
* `error` (err) error received by submitting to AWS

### `writer.publish(msg, [fn])`

Required fields in msg:
* `MessageBody` (String)

Optional parameter:
* `fn` will be called with `(err, data)`

### `writer.publishBatch(msgs, [fn])`

* `msgs` is an array of messages (can't bigger than 10)

Required fields in msg:
* `MessageBody` (String)

Optional parameter:
* `fn` will be called with `(err, data)`

### `writer.emit('enqueue', msg)`

Async Delivery method. Every 10th emit, `publishBatch` will be invoked with the first 10 messages stored.

Required fields in msg:
* `MessageBody` (String)

## TODO

- [ ] Make publish interface simpler (less AWSish)
- [ ] Return callbacks and Promises

## License

MIT
