var amqp = require("amqplib");
const receiveMessage = require("./handlers");
var channel;

const rabbitMQ = {
  sendMessage: async (queueName, message) => {
    try {
      await channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message))
      );
    } catch (error) {
      console.error("Error al enviar mensaje: ", error);
    }
  },
  connect: async () => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      channel = await connection.createChannel();
      console.info("Connected to RabbitMQ Server");
      receiveMessage(channel);
    } catch (error) {
      console.error("Error al conectar a RabbitMQ: ", error);
    }
  },
};

module.exports = rabbitMQ;
