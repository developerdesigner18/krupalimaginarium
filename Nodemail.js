require('dotenv').config();
const nodemailer = require("nodemailer");
const SendEmail = (email,subject, mailotp) => {
  
  let trasporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OWNER_MAIL,
      pass: process.env.OWNER_PASS,
    },
  });
  let messageOptions = {
    from: process.env.OWNER_MAIL,
    to: email,
    subject: subject,
    html: mailotp,
  };
  trasporter.sendMail(messageOptions, (err, res) => {
    if (err) return console.log(err.message);
    else console.log("Email sent Successfully");
  });
};
module.exports = SendEmail;