'use-strict'
const nats = require('node-nats-streaming');

let publisher = nats.connect('test-crawler-cluster', 'test-ack-publisher', { url: 'nats://localhost:4222' });

let publishTimes = 10;
publisher.on('connect', () => {
    console.log("test-ack-publisher has connected to nats");
    for (let index = 0; index < publishTimes; index++) {
        publisher.publish('bar', 'Hello NATS streaming!', (err, guid) => {
            if (err) {
                console.log('publish failed: ' + err)
            } else {
                console.log(`published message with guid: ${guid}, time: ${index+1}`)
            }
        })
    }

})
