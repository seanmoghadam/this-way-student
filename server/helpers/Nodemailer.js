import config from "../../config/config";

//this is the mailer class for verification


const sendmail = require("sendmail")({
    logger: {
        debug: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    },
    silent: false,
    dkim: false,
    smtpPort: 2525, // Default: 25
    smtpHost: "smtp-pulse.com" // Default: -1 - extra smtp host after resolveMX
});

export default class Mailer {
    constructor() {

    }

    static sendMailVerificationMail(to, forename, surname, token) {


        sendmail({
            from: config.originEmail,
            to,
            subject: "Verification of your account",
            html: Mailer.getVerificationMarkup(to, forename, surname, token),
        }, function (err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    }

    static getVerificationMarkup(email, forename, surname, token) {

        /*
                let link = "http://" + config.nodeEnv === "production" ? (config.productionUrl + "/verifyUser") : (config.host + ":" + config.port + "/verifyUser/token=" + token + "/email="+email);
        */
        let link = "http://" + (config.host + ":" + config.port + "/verifyUser/token=" + token + "/email=" + email);

        return `<table border="1" cellpadding="0" cellspacing="0" width="100%">
 <tr>
  <td width="260" valign="top">
   <table border="1" cellpadding="0" cellspacing="0" width="100%">
   <h2>Hi ${forename} ${surname}</h2>
    <tr>
     <td>
     We´re glad that you´ve joined our community!
    Please verify your email by clicking this link
    <a href="${link}">Verification Link</a>     
    </td>
   
    </tr>
   </table>
  </td>
 </tr>
</table>`;
    }


}

