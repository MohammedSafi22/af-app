const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOpts = {
    from: 'Afkar App <afkarapp@gmail.com>', 
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  await transporter.sendMail(mailOpts);
}

module.exports = sendEmail;
