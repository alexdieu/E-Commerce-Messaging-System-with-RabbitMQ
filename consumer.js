const amqp = require("amqplib");
const QUEUE = "order_queue";
const RABBITMQ_URL = "amqp://localhost";

async function consumeOrders() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  //taking on the queue
  await channel.assertQueue(QUEUE, { durable: true });
  console.log("Waiting for orders in", QUEUE);
  channel.consume(QUEUE, (msg) => { //predicate used to log
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log("Received order :", order);
      // Simulate processing (example : save to DB)
      channel.ack(msg);
    }
  });
}
//TEST
consumeOrders();
