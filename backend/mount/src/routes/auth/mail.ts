export function sendEmail(username: string, toEmail: string, idConfirm: string): boolean {
  const nodemailer = require("nodemailer");

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    port: 587, // true for 465, false for other ports
    host: "smtp-mail.outlook.com",
	secureConnection: false,
    auth: {
      user: process.env.NODEMAILDER_EMAIL,
      pass: process.env.NODEMAILDER_PASSWORD,
    },
	tls: {
        ciphers:'SSLv3'
    }
  });

  //email
  const mailData = {
    from: process.env.NODEMAILDER_EMAIL, // sender address
    to: toEmail, // list of receivers
    subject: "Verify your account",
    text: "Last step",
    html: `<b>Hey ${username}! </b><br>
	We are happy to have you here at MatchaLove42.<br>
	Please confirm your email with this link : <a href='http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/confirm/${idConfirm}'>
	http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/confirm/${idConfirm}</a> <br/>`,
  };


  //send email
  transporter.sendMail(mailData, (err: any, info: any) => {
    if (err) {
		console.log(err);
		return false;
	}
    else return true;
  });

  return true;
}
