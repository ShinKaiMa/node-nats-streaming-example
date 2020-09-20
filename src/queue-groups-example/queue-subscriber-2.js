'use-strict'
const nats = require('node-nats-streaming');

let subscriber = nats.connect('test-crawler-cluster', 'test-queue-groups-subscriber-2', { url: 'nats://localhost:4222' });

subscriber.on('connect', () => {
    console.log("test-queue-groups-subscriber-2 has connected to nats");
    const opts = subscriber.subscriptionOptions().setStartWithLastReceived(); // get the last message that nats recieved latest.
    const subscription = subscriber.subscribe('bar',  'bar.workers', opts);
    subscription.on('message', (msg) => {
      console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData())
    })
})
