const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const amqp = require("amqplib");

const QUEUE = "order_queue";
const RABBITMQ_URL = "amqp://localhost";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "consumer.html"));
});

async function startConsumer(port) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  console.log(`Consumer on port ${port} waiting for orders in ${QUEUE}`);

  channel.consume(QUEUE, (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log(`Consumer ${port} received order:`, order);

      io.emit("newOrder", {
        order,
        timestamp: new Date().toLocaleString("en-US"),
        consumerId: port,
      });

      channel.ack(msg);
    }
  });
}

// Función para iniciar un servidor consumer
function startConsumerServer(port) {
  app.use(express.static(path.join(__dirname)));

  http.listen(port, () => {
    console.log(`Consumer running on http://localhost:${port}`);
    startConsumer(port).catch(console.error);
  });
}

// Si este archivo se ejecuta directamente
if (require.main === module) {
  // Tomar el puerto de los argumentos de línea de comando o usar uno por defecto
  const port = process.argv[2] || 3001;
  startConsumerServer(port);
}
