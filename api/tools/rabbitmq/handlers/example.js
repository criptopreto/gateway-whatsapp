const { exampleCtrl } = require("../controllers/example.ctrl");

const handle = (channel, name) => {
  channel.consume(
    name,
    function (msg) {
      let message = JSON.parse(msg.content.toString());
      let key = Object.keys(message)[0];
      if (key === "exampleCtrl") exampleCtrl(message[key]);
      else {
        console.log("Error", message);
      }
    },
    { noAck: true }
  );
};

module.exports = handle;
