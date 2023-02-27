const { sendMessageToRabbitMQ } = require("../../../helpers/common");

const controllers = {
  exampleCtrl: async (data, rabbitmq_channel) => {
    try {
      console.log(data);

      // Response to client
      await sendMessageToRabbitMQ(rabbitmq_channel, "example", {
        exampleResult: {
          message: "Example Result",
        },
      });
    } catch (error) {
      await sendMessageToRabbitMQ(rabbitmq_channel, "example", {
        exampleResult: {
          message: "Message Error",
        },
      });
    }
  },
};

module.exports = controllers;
