const amqp = require("amqplib");
const io = require("./socket-server");
const QUEUE = "order_queue";
const RABBITMQ_URL = "amqp://localhost";

async function consumeOrders() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  //taking on the queue
  await channel.assertQueue(QUEUE, { durable: true });
  console.log("Waiting for orders in", QUEUE);
  channel.consume(QUEUE, (msg) => {
    //predicate used to log
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log("Received order:", order);

      // Emitir la orden a todos los clientes conectados
      io.emit("newOrder", {
        order,
        timestamp: new Date().toLocaleString(),
      });

      channel.ack(msg);
    }
  });
}

// No ejecutamos consumeOrders() automáticamente
if (require.main === module) {
  consumeOrders().catch(console.error);
}
