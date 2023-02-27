function normalizeData(data) {
  return Object.entries(data)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => {
      return {
        ...acc,
        [k]: ArrayBuffer.isView(v)
          ? v.toString("hex")
          : Array.isArray(v)
          ? v
          : v === Object(v)
          ? normalizeData(v)
          : v,
      };
    }, {});
}

const sendMessageToRabbitMQ = async (rabbitmq_channel, queue, data) => {
  data = normalizeData(data);

  try {
    await rabbitmq_channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(data))
    );
  } catch (error) {
    console.error("Error al enviar mensaje: ", error);
  }
};

module.exports = {
  sendMessageToRabbitMQ,
  normalizeData,
};
