const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: "loren.hagenes96@ethereal.email",
    pass: "5pm4ptF5XJrh216UTS",
  },
});

module.exports = transporter;