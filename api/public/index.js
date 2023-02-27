// -----------------------------------------------------
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1Nzg5NzcyNywiZXhwIjoxNjU3OTg0MTI3fQ.i4rE7cpaF1tIc9jYEeGcwEMdLHVgCK4Vq14avEpyJlQ";
const socket = io();
const session_id = localStorage.getItem("session_id");
const userID = localStorage.getItem("userId");

if (session_id) {
  console.log("Hay ID");
  socket.auth = { session_id: session_id, user_id: "63c25a7f1375715f912b1539" };
} else {
  socket.auth = { user_id: "63c25a7f1375715f912b1539" };
}

console.log(socket.auth, { session_id: session_id });
socket.connect();

// -----------------------------------------------------
const message = document.getElementById("message");
const Device = document.getElementById("device");
const serialized = document.getElementById("serialized");
const btn = document.getElementById("send");
//
const chatId = document.getElementById("chat_id");
const btn2 = document.getElementById("send2");
const mensajes = document.getElementById("mensajes");
//
const channel_name = document.getElementById("channel_name");
const delete_name = document.getElementById("delete_channel");
const channel_id = document.getElementById("channel_id");
const btn_create_channel = document.getElementById("createChannel");
const btn_delete_channel = document.getElementById("deleteChannel");
const socket_status = document.getElementById("socket_status");

const channel_list = document.getElementById("channels_list");

const formMedia = document.getElementById("form-media");

// -----------------------------------------------------

// A
const chid_a = document.getElementById("chid_a");
const phone_a = document.getElementById("phone_a");
const message_a = document.getElementById("message_a");
const destinatary_a = document.getElementById("destinatary_a");
const btn_send_a = document.getElementById("send_a");

// B
const chid_b = document.getElementById("chid_b");
const phone_b = document.getElementById("phone_b");
const message_b = document.getElementById("message_b");
const destinatary_b = document.getElementById("destinatary_b");
const btn_send_b = document.getElementById("send_b");

// Multimedia
const media_name = document.getElementById("media_name");
const mime_type = document.getElementById("mime_type");
const phone_mm = document.getElementById("phone_mm");
const message_mm = document.getElementById("message_mm");
const destinatary_mm = document.getElementById("destinatary_mm");
const media_type = document.getElementById("type");
const btn_send_mm = document.getElementById("send_mm");

const btn_login = document.getElementById("login");

// -----------------------------------------------------

formMedia.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("OK");
  let formData = new FormData(formMedia);
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function () {
    console.log(this.responseText);
  });

  oReq.open("POST", "/message/medias");
  oReq.send(formData);
});

btn_login.addEventListener("click", function () {
  let oReq = new XMLHttpRequest();

  oReq.addEventListener("load", function () {
    console.log(JSON.parse(this.responseText));
    try {
      let data_login = JSON.parse(this.responseText);
      if (data_login?.message === "successful login") {
        localStorage.setItem("token", data_login.token);
      } else {
        console.log(data_login);
        alert("Login failed");
      }
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  });
  oReq.open("POST", `/auth/login`);
  oReq.setRequestHeader("Content-Type", "application/json");
  oReq.send(JSON.stringify({ email: "admin@vtech.com", password: "123456" }));
});

btn_send_a.addEventListener("click", () => {
  console.log("Enviando a", destinatary_a.value);
  socket.emit("chat:message:send", {
    message: message_a.value,
    phone: phone_a.value,
    destination: destinatary_a.value,
  });

  console.log(
    "chat:message:send - DATA => ",
    message_a.value,
    phone_a.value,
    destinatary_a.value
  );
});

btn_send_b.addEventListener("click", () => {
  socket.emit("chat:message:send", {
    message: message_b.value,
    phone: phone_b.value,
    destination: destinatary_b.value,
  });
});

btn_send_mm.addEventListener("click", () => {
  socket.emit("chat:message:send", {
    message: message_mm.value,
    phone: phone_mm.value,
    destination: destinatary_mm.value,
    media: [
      {
        type: "image",
        filename: "01ddf038d3793d9cc148a6907a9efbc3",
        mimetype: "image/jpeg",
      },
      {
        type: "image",
        filename: "c6a02a104d19c4854b737de3a5396986",
        mimetype: "image/jpeg",
      },
    ],
  });
});

btn.addEventListener("click", () => {
  socket.emit("chat:message:send", {
    message: message.value,
    phone: Device.value,
    destination: serialized.value,
    media: {
      filename: "2bed9e6303b4bada158651434941e3ea",
      mimetype: "image/png",
      type: "image",
    },
  });
  console.log(
    "chat:message:send - DATA => ",
    message.value,
    Device.value,
    serialized.value
  );
  document.getElementById("message").value = "";
});

function handleChannel(channel_id, phone) {
  let oReq = new XMLHttpRequest();
  token = localStorage.getItem("token");
  console.log(token);

  oReq.addEventListener("load", function () {
    console.log(this.responseText);
  });
  oReq.open("POST", `/sync-up/connect`);
  oReq.setRequestHeader("Content-Type", "application/json");
  oReq.setRequestHeader("Authorization", `Bearer ${token}`);
  oReq.send(JSON.stringify({ channel_id: channel_id, phone: phone }));
}

function logout(phone) {
  let oReq = new XMLHttpRequest();

  oReq.addEventListener("load", function () {
    console.log(this.responseText);
  });
  oReq.open("POST", `/sync-up/logout`);
  oReq.setRequestHeader("Content-Type", "application/json");
  oReq.setRequestHeader("Authorization", `Bearer ${token}`);
  oReq.send(JSON.stringify({ phone: phone }));
}

function testChannel(channel_id) {
  console.log("handleChannel", channel_id);
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function () {
    console.log(this.responseText);
  });
  oReq.open("GET", `/test/channel/${channel_id}`);
  oReq.send();
}

function deleteChannel(channel_id) {
  socket.emit("socket:channel:delete", { channel_id: channel_id });
}

function getChannels() {
  socket.emit("socket:channel:get", {});
}

function renderChannel(channel) {
  let node = document.createElement("li");
  node.className = "channel-item";
  node.innerHTML = `
  <div class="channel-name">${channel.name}</div>
  <div class="channel-number">${channel?.data_channel_type?.number}</div>
  <div class="channel-id">${channel.id}</div>
  <button class="connect" onclick="handleChannel('${channel.id}', '${channel.number}')">Connect Device</button>
  <button onclick="testChannel('${channel.id}')">Test Channel</button>
  <button class="delete" onclick="deleteChannel('${channel.id}')">Delete Channel</button>
  <button class="logout" onclick="logout('${channel.number}')">Log out</button>
  `;
  return node;
}

btn_create_channel.addEventListener("click", () => {
  console.log("New Channel");
  socket.emit("socket:channel:new", {
    channel_name: channel_name.value,
    channel_type: "CH_WS_QR",
    data_channel_type: {
      number: channel_id.value,
    },
  });
});

btn_delete_channel.addEventListener("click", () => {
  console.log("Delete Channel");
  deleteChannel(delete_name.value);
});

function renderRealtimeMessage(msg) {
  let node = document.createElement("div");
  node.className = "message-box-holder";
  switch (msg.type) {
    case "stickerMessage": // Sticker
      node.innerHTML = `
      <div class="sticker-box ${
        msg.message.key.fromMe ? "sticker-partner" : ""
      }">
      <div style="width:100%;max-width:300px;">
          <img src="/assets/stickers/${
            msg.file.name
          }" alt="img" style="width:100%;height:auto" onerror="this.onerror=null;this.src='/images/perro.jpg';"/>
      </div>
      </div>`;
      break;
    case "imageMessage": // Imagen
      node.innerHTML = `
        <div class="image-box ${
          msg.message.key.fromMe ? "message-partner" : ""
        }">
        <div style="width:100%;max-width:300px;">
            <img src="/assets/images/${
              msg.file.name
            }" alt="img" style="width:100%;height:auto" onerror="this.onerror=null;this.src='/images/perro.jpg';"/>
            ${
              msg.message.message.imageMessage.caption
                ? '<p class="caption">' +
                  msg.message.message.imageMessage.caption +
                  "</p>"
                : ""
            }
        </div>
        </div>`;
      break;
    case "extendedTextMessage":
      node.innerHTML = `
      <div class="message-box ${
        msg.message.key.fromMe ? "message-partner" : ""
      }"><p>${msg.message.message.extendedTextMessage.text}</p></div>`;
      break;
    case "conversation":
      node.innerHTML = `
        <div class="message-box ${
          msg.message.key.fromMe ? "message-partner" : ""
        }"><p>${msg.message.message.conversation}</p></div>`;
      break;
  }
  return node;
}

function renderMessage(msg) {
  switch (msg.messageType) {
    case "stickerMessage":
      return `
      <div class="message-box-holder">
      <div class="sticker-box ${msg.from_me ? "sticker-partner" : ""}">
      <div style="width:100%;max-width:300px;">
          <img src="/assets/stickers/${
            msg.file
          }" alt="img" style="width:100%;height:auto" onerror="this.onerror=null;this.src='/images/perro.jpg';"/>
      </div>
      </div>
      </div>`;
    case "imageMessage":
      return `
      <div class="message-box-holder">
      <div class="image-box ${msg.from_me ? "message-partner" : ""}">
      <div style="width:100%;max-width:300px;">
          <img src="/assets/images/${
            msg.file
          }" alt="img" style="width:100%;height:auto" onerror="this.onerror=null;this.src='/images/perro.jpg';"/>
          ${msg.caption ? '<p class="caption">' + msg.caption + "</p>" : ""}
      </div>
      </div>
      </div>`;
    default:
      return `
      <div class="message-box-holder"><div class="message-box ${
        msg.from_me ? "message-partner" : ""
      }"><p>${msg.messageContent}</p></div></div>`;
  }
}

// -----------------------------------------------------
btn2.addEventListener("click", () => {
  socket.emit("chat:getMessagesByChatId", {
    chatId: chatId.value,
  });
});

// Socket FRONT
socket.on("default", (data) => {
  console.log("default => ", data);
});

socket.on("chat:response", (data) => {
  console.log("chat:response => ", data);
});

socket.on("socket:channel:work", (data) => {
  console.log("default => ", data);
});

socket.on("socket:channel:get.result", (data) => {
  console.log(data);
  channel_list.innerHTML = "";
  data.channels.forEach((channel) => {
    channel_list.appendChild(renderChannel(channel));
  });
});

socket.on("socket:channel:new.result", (result) => {
  console.log(result);
  if (result.error) {
    alert("Error: " + result.message);
    return;
  }
  channel_list.appendChild(renderChannel(result.channel_info));
});

socket.on("socket:channel:delete.result", (result) => {
  console.log("socket:channel:delete.result=>", result);
  if (result.error) {
    alert("Error: " + result.message);
    return;
  }
});

socket.on("connecting", (data) => {
  console.log("connect => ", data, session_id);
});

socket.on("disconnect", (data) => {
  socket_status.innerHTML =
    "Socket Desconectado | Session ID: <b>" + session_id + "</b>";
});

socket.on("socket:session", (data) => {
  console.log(data);
  if (data.error) {
    alert("Usuario no existe");
    return;
  }
  socket.auth = { session_id: data.session_id, user_id: 1 };
  localStorage.setItem("session_id", data.session_id);
  socket_status.innerHTML =
    "Socket Conectado | Session ID: <b>" + data.session_id + "</b>";

  if (data.channels) {
    channel_list.innerHTML = "";
    data.channels.forEach((channel) => {
      channel_list.appendChild(renderChannel(channel));
    });
  }
});

// WHATSAPP

// Device connected to WS MD
socket.on("whatsapp:connected", (data) => {
  console.log(data);
});

// Device disconnected from WS MD
socket.on("whatsapp:disconnected", (data) => {
  console.log(data);
});

// Device Logged out, socket distroyed
socket.on("whatsapp:destroyed", (data) => {
  console.log("Sesión Terminada => ", data);
});

// Device connection update
socket.on("connection.update", (data) => {
  console.log(data);
});

// Device is reconnecting to WS MD
socket.on("whatsapp:reconnecting", (data) => {
  console.log(data);
});

// ---------

// Set Config Contacts
socket.on("whatsapp:config:contacts", (data) => {
  console.log("whatsapp:config:contacts=>", data);
});

// Set Config Messages
socket.on("whatsapp:config:messages", (data) => {
  console.log("whatsapp:config:messages", data);
});

// Set Config Chats
socket.on("whatsapp:config:chats", (data) => {
  console.log("whatsapp:config:chats", data);
});

// ----

// New Chat
socket.on("whatsapp:chat.upsert", (data) => {
  console.log("whatsapp:chat.upsert", data);
});

// ----

// Chat Update (Set unread message)
socket.on("whatsapp:chat.update", (data) => {
  console.log("whatsapp:chat.update", data);
});

// Chat Delete (Chat deleted by Device)
socket.on("whatsapp:chat.delete", (data) => {
  console.log("whatsapp:chat.delete", data);
});

// New Message
socket.on("whatsapp:message.new", (data) => {
  console.log(data);
  mensajes.prepend(renderRealtimeMessage(data));
});

// Contact update presence or whatsapp name
socket.on("whatsapp:contact.update", (data) => {
  console.log("whatsapp:contact.update", data);
});

// Get Messages by Chat ID
socket.on("whatsapp:getMessagesByChatId", (data) => {
  mensajes.innerHTML = "";
  data.map((msg) => {
    mensajes.innerHTML += `
    ${renderMessage(msg)}
  `;
  });
  console.log(data);
});

// Get Messages by Chat ID
socket.on("whatsapp:contacts.upsert", (data) => {
  console.log("whatsapp:contacts.upsert => ", data);
});

//
socket.on("ready", (data) => {
  console.log("ready => ", data);
});
//
socket.on("chat:messageSent", (data) => {
  console.log("chat => ", data);
  actions.innerHTML = "";
  output.innerHTML += `
    <p>
      ${data.from} => <small>${data.body}</small>
    </p>`;
});

socket.on("whatsapp:qr", (data) => {
  console.log(data);
  QRCode.toCanvas(document.getElementById("canvas"), data, function (error) {
    if (error) console.error(error);
    console.log("success!");
  });
});

//
socket.on("chat:messageReceived", (data) => {
  console.log("chat => ", data);
  actions.innerHTML = "";
  output.innerHTML += `
    <p>
      ${data.from} => <small>${data.body}</small>
    </p>`;
});
