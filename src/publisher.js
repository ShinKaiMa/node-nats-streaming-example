'use-strict'
const nats = require('node-nats-streaming');

let client = nats.connect('test-crawler-cluster', 'test-publisher', { url: 'nats://localhost:4222' });

client.on('connect', () => {
    client.publish('foo', 'Hello NATS streaming!', (err, guid) => {
        if (err) {
            console.log('publish failed: ' + err)
        } else {
            console.log('published message with guid: ' + guid)
        }
    })
})
