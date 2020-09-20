'use-strict'
const nats = require('node-nats-streaming');

let client = nats.connect('test-crawler-cluster', 'test-subscriber', { url: 'nats://localhost:4222' });

client.on('connect', () => {
    console.log("test-subscriber has connected to nats");
    // const opts = client.subscriptionOptions().setStartWithLastReceived(); // get the last message that nats recieved latest.
    // const opts = client.subscriptionOptions().setDeliverAllAvailable(); // get all messages from nats stored
    // const opts = client.subscriptionOptions().setStartAtSequence(1); // get message(s) from specific sequence
    // const opts = client.subscriptionOptions().setDeliverAllAvailable(); // get message(s) from first sequence
    // const opts = client.subscriptionOptions().setStartTime(new Date('2020-09-19')); // get message(s) from specific time
    const opts = client.subscriptionOptions().setStartAtTimeDelta(10000 * 1000) // 10000 seconds ago
    const subscription = client.subscribe('foo', opts);
    subscription.on('message', (msg) => {
      console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData())
    })
})
