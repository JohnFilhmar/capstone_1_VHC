const dbModel = require("../models/database_model");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("socketListener", async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();

        socket.emit("targetEmit", newResponse);
        socket.broadcast.emit("broadcastEmit", newResponse);
      } catch (error) {
        socket.emit("targetError", error.message);
        socket.broadcast.emit("broadcastError", error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

    socket.on("joinRoom", (UUID) => {
      socket.join(UUID);
      socket.emit("messagingSocket", { status: "ok" });
    });

    socket.on("sendMessage", ({ roomId, data }) => {
      console.log(data);
      // io.to(roomId).emit("messageSocket", { data });
    });
  });
};
