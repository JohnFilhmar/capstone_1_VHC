const dbModel = require("../models/database_model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { convertDate } = require("../globalFunctions");
const publicDirectoryPath = path.join(__dirname, "../public");

class Controller {
  async sendMessage(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const [user] = await dbModel.query(
        "SELECT staff_id, uuid FROM medicalstaff WHERE username = ?",
        decoded.username
      );
      const sender_id = user.staff_id;
      const { message, hearer, dateTime } = req.body;

      const sendMessageQuery = `
        INSERT INTO messaging
          (sender_id, receiver_id, message, datetime_sent, is_read)
        VALUES
          (?, ?, ?, ?, ?)`;
      // await dbModel.query(sendMessageQuery, [sender_id, hearer, message, dateTime, false]);

      return res
        .status(200)
        .json({
          status: 200,
          sent: "ok",
          data: {
            sender_id,
            receiver_id: hearer,
            message,
            datetime_sent: dateTime,
            user_id: sender_id,
          },
        });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async searchUsername(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const searchUsernameQuery = `
      WITH SearchResults AS (
        SELECT 
          staff_id,
          username, 
          image_path
        FROM 
          medicalstaff 
        WHERE 
          username LIKE CONCAT('%', ?, '%') AND 
          isVerified = 1 AND 
          username <> ?
      )
      SELECT 
        staff_id AS user_id,
        username,
        image_path
      FROM 
        SearchResults`;
      const searchUsernameResponse = await dbModel.query(searchUsernameQuery, [
        req.body.name,
        decoded.username,
      ]);
      const images = await Promise.all(
        [
          ...searchUsernameResponse.map((user) => user.image_path || "image"),
        ]?.map(async (imageName) => {
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
        })
      );

      const newResponse = [
        ...searchUsernameResponse.map((prev, i) => ({
          ...prev,
          profile_image: images[i],
        })),
      ];

      return res.status(200).json({
        status: 200,
        data: newResponse,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async getChatUsernames(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const [user] = await dbModel.query(
        "SELECT staff_id FROM medicalstaff WHERE username = ?",
        decoded.username
      );
      const getChatUsernames = `
        WITH RankedMessages AS (
          SELECT 
            m.message_id,
            m.sender_id,
            CASE
              WHEN m.sender_id = ? THEN m.receiver_id
              ELSE m.sender_id
            END AS hearer,
            CASE 
              WHEN m.sender_id = ? THEN ms_receiver.username
              ELSE ms_sender.username 
            END AS receiver, 
    		CASE
    		  WHEN m.sender_id = ? THEN ms_receiver.uuid
    		  ELSE ms_sender.uuid
    		END AS target_uuid,
            CASE 
              WHEN m.sender_id = ? THEN ms_receiver.image_path
              ELSE ms_sender.image_path 
            END AS image_path, 
            m.message, 
            m.is_read, 
            m.datetime_sent,
            ROW_NUMBER() OVER (
              PARTITION BY LEAST(m.sender_id, m.receiver_id), GREATEST(m.sender_id, m.receiver_id) 
              ORDER BY m.datetime_sent DESC
            ) AS rn
          FROM 
            messaging m
          INNER JOIN 
            medicalstaff ms_sender ON m.sender_id = ms_sender.staff_id
          INNER JOIN 
            medicalstaff ms_receiver ON m.receiver_id = ms_receiver.staff_id
          WHERE 
            m.sender_id = ? OR m.receiver_id = ?
        )
        SELECT 
          message_id,
          sender_id,
          hearer,
          receiver, 
          target_uuid,
          image_path, 
          message, 
          is_read, 
          datetime_sent
        FROM 
          RankedMessages
        WHERE 
          rn = 1;`;
      const getUsernameResponse = await dbModel.query(getChatUsernames, [
        user.staff_id,
        user.staff_id,
        user.staff_id,
        user.staff_id,
        user.staff_id,
        user.staff_id,
        user.staff_id,
      ]);

      const images = await Promise.all(
        [...getUsernameResponse.map((user) => user.image_path || "image")]?.map(
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

      const getImageUrl = (profileImage) =>
        `${req.protocol}://${req.get("host")}/${
          profileImage || "default_profile.png"
        }`;
      const newResponseLoad = [
        ...getUsernameResponse.map((prev, i) => ({
          ...prev,
          user_id: user.staff_id,
          profile_image: images[i],
          image_path: getImageUrl(prev.image_path),
          datetime_sent: convertDate(prev.datetime_sent),
          is_read: prev.sender_id === user.staff_id || Boolean(prev.is_read),
        })),
      ];
      return res.status(200).json({
        status: 200,
        data: newResponseLoad,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async updateMessageToRead(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const updateMessageToReadQuery = `UPDATE messaging SET is_read = ? WHERE message_id = ?`;
      await dbModel.query(updateMessageToReadQuery, [true, req.params.id]);

      return res.status(200).json({ status: 200 });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async getConversation(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const [user] = await dbModel.query(
        "SELECT staff_id FROM medicalstaff WHERE username = ?",
        decoded.username
      );
      const getConversationQuery = `
        SELECT 
          sender_id,
          receiver_id,
          message,
          datetime_sent
        FROM (
          SELECT 
            m.sender_id,
            m.receiver_id,
            m.message,
            m.datetime_sent
          FROM 
            messaging m
          WHERE 
            (m.sender_id = ? AND m.receiver_id = ?)
            OR (m.sender_id = ? AND m.receiver_id = ?)
          ORDER BY 
            m.datetime_sent DESC
          LIMIT 10
        ) AS latest_messages
        ORDER BY 
          datetime_sent ASC;`;

      const getConversationPayload = [
        user.staff_id,
        req.params.id,
        req.params.id,
        user.staff_id,
      ];

      const getConversationResponse = await dbModel.query(
        getConversationQuery,
        getConversationPayload
      );

      const newResponse = getConversationResponse.map((prev) => ({
        ...prev,
        datetime_sent: convertDate(prev.datetime_sent),
        user_id: user.staff_id,
      }));

      return res.status(200).json({
        status: 200,
        data: newResponse,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
}

module.exports = new Controller();
