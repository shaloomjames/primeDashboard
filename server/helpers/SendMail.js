const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "rahanayousaf11@gmail.com",
    pass: "xxzvuzoqzyukjgyp",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function SendMail(to,subject,text,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from:"rahanayousaf11@gmail.com", // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// main().catch(console.error);
module.exports = {SendMail}