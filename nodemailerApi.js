require("dotenv").config();

class NodeMailerApi {
  constructor() {
    this.nodemailer = require("nodemailer");

    this.transporter = this.nodemailer.createTransport({
      service: "SendinBlue",
      auth: {
        user: "justin.quillevere@edu.gobelins.fr",
        pass: process.env.SENDINBLUE_API_KEY,
      },
    });

    // verify connection configuration
    this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  }

  sendMail(video) {
    // Envoi d'un e-mail
    const mailOptions = {
      from: "justin.quillevere@edu.gobelins.fr",
      to: "justinspam@outlook.fr",
      subject: "Vidéo Cypher !",
      text: "Voici votre vidéo :",
      attachments: [
        {
            filename: 'video.mp4',
            content: video,
        }
    ]
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("E-mail envoyé: " + info.response);
      }
    });
  }
}

module.exports = {
  NodeMailerApi,
};
