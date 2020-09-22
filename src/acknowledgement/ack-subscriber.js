'use-strict'
const nats = require('node-nats-streaming');

let subscriber = nats.connect('test-crawler-cluster', 'test-ack-subscriber', { url: 'nats://localhost:4222' });

subscriber.on('connect', () => {
    console.log("test-ack-subscriber has connected to nats");
    const opts = subscriber.subscriptionOptions().setStartWithLastReceived(); // get the last message that nats recieved latest.
    // const opts = subscriber.subscriptionOptions().setDeliverAllAvailable();
    opts.setManualAckMode(true);
    opts.setAckWait(10 * 1000) // 10s timeout, if timeout, nats-streaming server will redelivery message
    
    /**
     * specifies the maximum number of outstanding acknowledgements,
     * in this (1) situation, subscriber just consume one message in one time. (like what nodejs single main thread do)
     * if you want your subscriber perform multi-thread behind lib-uv thread pool, just change maxInFlight param.
     */
    opts.setMaxInFlight(1);
    const subscription = subscriber.subscribe('bar',  'bar.workers', opts);
    subscription.on('message', async(msg) => {
      console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData());
      await fakeLongProcess();
      msg.ack();
    })
})


const fakeLongProcess = async() => {
  return new Promise((resolve, _) => {
    setTimeout(()=>{
      resolve();
    }, 5000);
  })
}