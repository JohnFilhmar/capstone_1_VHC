const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailController {
  async sendEmail(req, res) {
    let transporter;

    try {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const { to, subject, text, html } = req.body;

      const mailOptions = {
        from: 'This system <olalalongisipmacapia.capstone@gmail.com>',
        to:'ad.lalongisip.45@gmail.com',
        subject:'hello world',
        text:'hi pogi',
        html
      };

      const info = await transporter.sendMail(mailOptions);

      return res.status(200).json({
        status: 200,
        message: 'Email sent successfully',
        messageId: info.messageId
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Failed to send email',
        error: error.message
      });
    } finally {
      if (transporter) {
        transporter.close();
      }
    }
  }
}

module.exports = new EmailController();