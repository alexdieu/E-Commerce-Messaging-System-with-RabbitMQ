const amqp = require("amqplib");
const express = require("express");
const router = express.Router();

const QUEUE = "order_queue";
const RABBITMQ_URL = "amqp://localhost";

async function sendOrder(order) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  const messageBuffer = Buffer.from(JSON.stringify(order));
  channel.sendToQueue(QUEUE, messageBuffer, { persistent: true });
  console.log("Sent order:", order);
  await channel.close();
  await connection.close();
}

router.post("/send-order", async (req, res) => {
  try {
    await sendOrder(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
