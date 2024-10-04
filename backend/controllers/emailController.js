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
          user: "olalalongisipmacapia.capstone@gmail.com",
          pass: "cypj uwdz jtpi xyoj"
        }
      });
      const { to, subject, text, html } = req.body;
      const mailOptions = {
        from: 'KalusogApp in partnership with VMHO <olalalongisipmacapia.capstone@gmail.com>',
        to:'ad.lalongisip.45@gmail.com',
        subject:'KalusogApp Email Vericification',
        text:'Hi Everyone!!!',
        html:`
       <html>
          <body style="text-align: center;">
            <h1>Welcome to the KalusogApp!!!</h1>
            <p>Please click the button below to verify your email:</p>
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
              <button style="background-color: #228B22; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verify Email</button>
            </a>
            <p>If you did not sign up for the KalusogApp, please ignore this email.</p>
          </body>
        </html>`
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