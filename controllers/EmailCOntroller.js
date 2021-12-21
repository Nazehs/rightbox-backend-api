const nodemailer = require("nodemailer");
const newOrderRequestTemplate = require("../utils/orderRequestTemplate");
const requestQuoteTemplate = require("../utils/requestQuoteTemplate");

const sendOrderRequestEmail = (req, res) => {
  try {
    const { type, ...body } = req.body;
    // email template
    let template;
    switch (type) {
      case "order":
        template = newOrderRequestTemplate(body);
        break;
      case "contact":
        console.log("here");
        template = requestQuoteTemplate(body);
        break;
      default:
        template = "";
        break;
    }

    const transporter = nodemailer.createTransport({
      // host: "smtp.mailtrap.io",
      // port: 2525,
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        //   user: "34d47903a0d8f4",
        //   pass: "190a8e8429bafc",
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // email recepients
    const to = `${body.to}`;
    // email subject
    const subject = `${body.subject}`;
    // Message object
    const message = {
      // Comma separated list of recipients
      to: `${to}`,
      // Subject of the message
      subject: `${subject}`,
      amp: `<!doctype html>`,
      //   html template
      html: `${template}`,
    };

    // verify the account
    transporter
      .verify()
      .then((response) => {
        //  sent the email
        transporter.sendMail(message, function(err, info) {
          if (err) {
            console.log(err);
            res.json({
              status: 1,
              success: failed,
              message: "Oop! an error occurred!",
            });
          } else {
            res.json({ status: 0, success: true, message: "email sent!" });
          }
        });
      })
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
    res.json({
      status: 1,
      success: failed,
      message: "Oop! an error occurred!",
    });
  }
};
module.exports = sendOrderRequestEmail;
