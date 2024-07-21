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
    subject:"Email verification",  
    html,
    //  '<h1>Hello there</h1> <a href="http://localhost:3000/users/verify/bb8b85fb-3d4a-49f7-a714-7c85a2885797">Welcome on my website</a>',
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
