const nodemailer = require("nodemailer");
const dns = require("dns");
const jwt = require("jsonwebtoken");
const dbModel = require("../models/database_model");
const { convertDate } = require("../globalFunctions");

class EmailController {
  async sendEmail(req, res) {
    let transporter;
    try {
      const { details, severity, area, email, formType, dateTime } = req.body;
      const file = req.file;
      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      let staff;

      if (accessToken) {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const getStaffEmailQuery = "SELECT email FROM medicalstaff WHERE staff_id = ?";
        [staff] = await dbModel.query(getStaffEmailQuery, decoded.user_id);
      }

      const targetEmail = email || staff.email;

      // Validate email format
      if (targetEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(targetEmail)) {
          return res.status(204).json({
            status: 204,
            message: "Invalid email format.",
          });
        }

        const domain = targetEmail.split("@")[1];
        try {
          const resolveMxRecords = (domain) => {
            return new Promise((resolve, reject) => {
              dns.resolveMx(domain, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                  reject(new Error(`Invalid email domain (${domain}),! Try Again.`));
                } else {
                  resolve(addresses);
                }
              });
            });
          };
          await resolveMxRecords(domain);
        } catch (err) {
          return res.status(204).json({
            status: 204,
            message: err.message,
          });
        }
      }

      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.PROJECT_STATE === 'production' ? 465 : 587,
        secure: process.env.PROJECT_STATE === 'production' ? true : false,
        auth: {
          user: "olalalongisipmacapia.capstone@gmail.com",
          pass: "cypj uwdz jtpi xyoj",
        },
      });
      
      const mailOptions = {
        from: `KALUSUGAPP <olalalongisipmacapia.capstone@gmail.com>`,
        to: "olajohnfilhmar@gmail.com",
        subject: `KALUSUGAPP.COM ${formType.trim()}`,
        text: `
          Date and time: ${convertDate(dateTime)}
          ${severity ? `Severity: ${severity}` : `Area: ${area}`}
          ${details.trim()}`
      };
      if (targetEmail) mailOptions.replyTo = targetEmail;
      if (file) mailOptions.attachments = [{ filename: file.originalname, content: file.buffer }];
      
      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
          status: 200,
          message: `${formType} submitted successfully!`,
        });
      } catch (err) {
        console.error("Error sending email:", err.message);
        return res.status(204).json({
          status: 204,
          message: "The provided email address does not exist or failed to send.",
        });
      }
    } catch (error) {
      console.error("Server error:", error.message);
      if (!res.headersSent) {
        return res.status(500).json({
          status: 500,
          message: "Failed to send form.",
          error: error.message,
        });
      }
    } finally {
      if (transporter) {
        transporter.close();
      }
    }
  }
}

module.exports = new EmailController();