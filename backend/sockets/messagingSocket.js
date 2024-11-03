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
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

    socket.on("checkRooms", (callback) => {
      const joinedRooms = Array.from(socket.rooms);
      callback(joinedRooms);
    })
    
    socket.on("joinRoom", (UUID) => {
      socket.join(UUID);
      socket.emit("messagingSocket", { status: "ok" });
    });

    socket.on("sendMessage", async ({ roomId, data }) => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        io.to(roomId).emit("messageSocket", data);
      } catch (error) {
        socket.emit("targetError", error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });
  });
};
