const amqp = require("amqplib");
const EXCHANGE = "announcements_exchange";
const RABBITMQ_URL = "amqp://localhost";

async function subscribeToAnnouncements() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  //fanout : to all queues !
  await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
  //temp queue for connection
  const { queue } = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue, EXCHANGE, "");
  //now able to receive messages
  console.log("Waiting for announcements in queue:", queue);
  channel.consume(queue, (msg) => {//predicate to log
    if (msg !== null) {
      const announcement = JSON.parse(msg.content.toString());
      console.log("Received announcement:", announcement);
      channel.ack(msg);
    }
  });
}
//test
subscribeToAnnouncements();
