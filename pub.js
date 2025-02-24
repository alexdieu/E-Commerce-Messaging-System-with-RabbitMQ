const amqp = require("amqplib");
const EXCHANGE = "announcements_exchange";
const RABBITMQ_URL = "amqp://localhost";

async function sendAnnouncement(payload) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
  const messageBuffer = Buffer.from(JSON.stringify(payload));
  channel.publish(EXCHANGE, "", messageBuffer);
  console.log("Announcement sent:", payload);
  await channel.close();
  await connection.close();
}

//TEST
sendAnnouncement({ title: "Discount Sales !!", details: "50% off starting right now !!!" });
