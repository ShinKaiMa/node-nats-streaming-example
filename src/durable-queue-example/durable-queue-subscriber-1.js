'use-strict'
const nats = require('node-nats-streaming');

let subscriber = nats.connect('test-crawler-cluster', 'test-durable-subscriber-1', { url: 'nats://localhost:4222' });

subscriber.on('connect', () => {
    console.log("test-durable-subscriber-1 has connected to nats");
    const opts = subscriber.subscriptionOptions().setDeliverAllAvailable();
    opts.setManualAckMode(true);
    opts.setAckWait(10 * 1000) // 10s timeout, if timeout, nats-streaming server will redelivery message
    opts.setDurableName('unique-durable');
    const subscription = subscriber.subscribe('bar',  'bar.workers', opts);
    subscription.on('message', async (msg) => {
      await fakeLongProcess();
      msg.ack();
      console.log('Received and acked a message [' + msg.getSequence() + '] ' + msg.getData());
    })
})

const fakeLongProcess = async() => {
  return new Promise((resolve, _) => {
    setTimeout(()=>{
      resolve();
    }, 2500);
  })
}