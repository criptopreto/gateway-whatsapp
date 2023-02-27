"use strict";

const { logger } = require("../../helpers/logger");
const socketStore = require("../../services/socket.service");

global.io.on("connection", async (socket) => {
  // Crea un objeto para almacenar los datos del socket
  let data = {
    user: socket.user_id,
    session_id: socket.session_id,
    connected: true,
  };

  // Actualiza o inserta los datos del socket en el almacén de sockets
  const newSession = await socketStore.upsert(data);

  // Si no se pudo crear la sesión, envía un error a través del socket
  if (!newSession) {
    socket.emit("socket:session", {
      error: true,
      message: "User does not exist",
    });
    return;
  }

  // Intenta asignar el ID de sesión al socket
  try {
    socket.socket_id = newSession._id;
  } catch (error) {
    // Si hay un error, registra un aviso y envía un error a través del socket
    logger.warn("Error al recuperar la sesion del socket");
    logger.warn("Sesion: " + socket.session_id);
    console.log(error);
    socket.emit("socket:session", {
      error: true,
      message: "Error al recuperar la sesion del socket",
    });
    return;
  }

  // Envía la ID de sesión del socket al cliente
  socket.emit("socket:session", {
    success: true,
    session_id: socket.session_id,
  });
});
