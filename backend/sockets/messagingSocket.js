const path = require("path");
const fs = require("fs");
const publicDirectoryPath = path.join(__dirname, "../public");
const sharp = require("sharp");
const { convertDate } = require("../globalFunctions");
const dbModel = require("../models/database_model");

module.exports = function (socket) {
  
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
  // add socket for messengerList and modify socket below to chatBoxSocket | SPECIFICITY
  socket.on("sendMessage", async ({ roomId, data }) => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const [user] = await dbModel.query(
        "SELECT staff_id, image_path FROM medicalstaff WHERE staff_id = ?",
        data.user_id
      );
      const newMessengerListQuery = `
        SELECT
          m.message_id,
          m.sender_id,
          CASE
            WHEN m.sender_id = ? THEN m.receiver_id
            ELSE m.sender_id
          END AS hearer,
          CASE
            WHEN m.sender_id = ? THEN mes_receiver.username
            ELSE mes_sender.username
          END as receiver,
          CASE
            WHEN m.sender_id = ? THEN mes_receiver.uuid
            ELSE mes_sender.uuid
          END AS target_uuid,
          CASE 
            WHEN m.sender_id = ? THEN mes_receiver.image_path
            ELSE mes_sender.image_path 
          END AS image_path, 
          m.message,
          m.is_read,
          m.datetime_sent
        FROM messaging m
        INNER JOIN
          medicalstaff mes_sender ON m.sender_id = mes_sender.staff_id
        INNER JOIN
          medicalstaff mes_receiver ON m.receiver_id = mes_receiver.staff_id
        WHERE m.message_id = ?`;
      const newMessengerListResponse = await dbModel.query(newMessengerListQuery, [
        data.user_id,
        data.user_id,
        data.user_id,
        data.user_id,
        data.message_id,
      ]);
      const images = await Promise.all(
        [...newMessengerListResponse.map((user) => user.image_path || "image")]?.map(
          async (imageName) => {
            const imagePath = path.join(publicDirectoryPath, `${imageName}`);
            if (!fs.existsSync(imagePath)) {
              return null;
            }
            const resizedImageBuffer = await sharp(imagePath)
              .resize(40, 40)
              .toBuffer();
            const base64Image = resizedImageBuffer.toString("base64");
            return {
              imageName,
              base64Image,
              contentType: "image/jpeg",
            };
          }
        )
      );
      const response = {
        messenger: newMessengerListResponse.map((prev, i) => ({
          ...prev,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          message: data.message,
          user_id: data.user_id,
          profile_image: images[i],
          datetime_sent: convertDate(data.datetime_sent),
          is_read: data.sender_id === data.user_id || Boolean(prev.is_read),
        })),
        conversation: {
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          message: data.message,
          datetime_sent: data.datetime_sent,
          user_id: data.user_id,
        }
      };
      socket.to(roomId).emit("messageSocket", response);
    } catch (error) {
      socket.emit("targetError", error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  });

};
