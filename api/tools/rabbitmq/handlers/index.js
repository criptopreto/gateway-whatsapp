const handlers = require("require-all")({
  dirname: __dirname,
  filter: function (file) {
    let part = file.split(".");
    if (part[0] === "index") return;
    return part[0];
  },
});

const receiveMessage = (channel) => {
  for (var name in handlers) {
    channel.assertQueue(name);
    handlers[name](channel, name);
  }
};

module.exports = receiveMessage;
