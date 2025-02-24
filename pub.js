const amqp = require("amqplib");
const EXCHANGE = "announcements_exchange";
const RABBITMQ_URL = "amqp://localhost";

async function sendAnnouncement(payload) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  //fanout : all chans 
  await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
  //read the messafe from the payload
  const messageBuffer = Buffer.from(JSON.stringify(payload));
  //publish message
  channel.publish(EXCHANGE, "", messageBuffer);
  console.log("Announcement sent:", payload);
  await channel.close();
  await connection.close();
}

//TEST
sendAnnouncement({ title: "Discount Sales !!", details: "50% off starting right now !!!" });
