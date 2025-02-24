const amqp = require("amqplib");
const QUEUE = "order_queue";
const RABBITMQ_URL = "amqp://localhost";

//Simple send an order function using Rabbit MQ to simulate
async function sendOrder(order) {
  const connection =  await amqp.connect(RABBITMQ_URL);
  //Connect to rabbit mq
  const channel =  await connection.createChannel();
  await channel.assertQueue(QUEUE, {  durable: true  });
  const messageBuffer = Buffer.from(JSON.stringify(order));
  channel.sendToQueue(QUEUE, messageBuffer, {  persistent: true });
  console.log("Sent order:", order);
  await channel.close();
  await connection.close();
  //connection over order sent
}

// TEST
sendOrder({ orderId: 101, customerName: "Pablo Arce", items: ["Computer", "mouse"] });
