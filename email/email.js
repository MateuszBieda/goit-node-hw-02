require("dotenv").config();
const nodemailer = require("nodemailer");
const { M_USER, M_PASS } = process.env;

console.log(M_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

const sendEmail = async (to, html) => {
  const info = await transporter.sendMail({
    from: "mateusbieda@gmail.com",
    to,
    subject: "Email verification",
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
