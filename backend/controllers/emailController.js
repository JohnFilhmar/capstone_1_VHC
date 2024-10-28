const nodemailer = require('nodemailer');

class EmailController {
  async sendEmail(req, res) {
    let transporter;
    try {
      const { reportDetails, severity, email, formType, dateTime } = req.body;
      const file = req.file;
      
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "olalalongisipmacapia.capstone@gmail.com",
          pass: "cypj uwdz jtpi xyoj"
        }
      });
      const mailOptions = {
        from: `KALUSUGAPP <olalalongisipmacapia.capstone@gmail.com>`,
        to:'olajohnfilhmar@gmail.com',
        subject: `KALUSUGAPP.COM ${formType.trim()}`,
        text: `${reportDetails.trim()}
        Severity: ${severity}
        Date and time: ${dateTime}`,
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ],
        replyTo: email,
      };
      const info = await transporter.sendMail(mailOptions);
      return res.status(200).json({
        status: 200,
        message: `${formType} submitted successfully!`,
        messageId: info.messageId
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: `Failed to send form.`,
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