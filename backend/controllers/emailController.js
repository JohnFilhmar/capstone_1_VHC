const nodemailer = require('nodemailer');
require('dotenv').config();

class emailController {
  async sendEmail(req, res) {
    let transporter;
    try {
      // Set up the transporter with your SMTP credentials
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Extract data from the request body
      const { to, subject, text, html } = req.body;

      // Mail options
      const mailOptions = {
        from: '"This system" <your-email@example.com>', // Sender address
        to, // Recipient(s)
        subject, // Subject line
        text, // Plain text body
        html // HTML body (optional)
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);

      // Respond with success message
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

module.exports = new emailController();