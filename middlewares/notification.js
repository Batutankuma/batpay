//Module de SMS
const TOKEN_KET = "Basic NkF3c2tKY0xzRzRRMUpwc0VBV280NEZTQXRkaGV5clk6MnU4Mmw3bURTblpqdGJESg==";
//const https = require('https');
//const request = require('request');
//const nodemailer = require('nodemailer');


class Notification {
    //send success message
    static async _success(res, status, message) {
        return res.status(200).json({ status: status, message: message });
    }

    //send error message 
    static async error(res, status, message) {
        return res.status(400).json({ status: status, message: message });
    }

    /**
    * @param {* ex: +243976729561} desinateur 
    * @param {* ex: votre compte client est valide} message 
    */
    sendSms = function (desinateur, message) {
        credentials = TOKEN_KET;
        var postData = "";
        postData += "grant_type=client_credentials";
        var options = {
            host: 'api.orange.com',
            path: '/oauth/v3/token'
        };
        options['method'] = 'POST';
        options['headers'] = {
            'Authorization': credentials,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        };
        var req = https.request(options, function (response) {
            response.setEncoding('utf8');
            var responseData = '';
            response.on('data', function (data) { responseData += data; });
            response.on('end', function () {
                var result = JSON.parse(responseData);
                console.log(result.access_token)
                send(result.access_token, desinateur, message);
            });
        })
            .on('error', function (e) { });
        req.write(postData);
        req.end();
    }

    //! ATTENTION N'EST PAS UTILISER
    send(token, desinateur, messagee) {
        var receveirr = "tel:" + desinateur;
        var senders = "tel:+243897745797";
        var headers = {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json'
        };
        var body = {
            outboundSMSMessageRequest: {
                address: receveirr,
                senderAddress: senders,
                outboundSMSTextMessage: {
                    message: messagee
                }
            }
        };
        var options = {
            uri: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+243897745797/requests',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 201) {
                console.log(response.statusCode)
            }
            else {
                console.log(error)
            }
        })
    }

    sendEmail = async (recev, title, message) => {
        // *add your email ex: exemple@outlook.fr
        let user = "";
        // *add your password ex:**************
        let pwd = "";
        // create transport
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secureConnection: false,// true for 465, false for other ports
            auth: {
                user: user, // generated ethereal user
                pass: pwd, // generated ethereal password
            },
        });

        // create model send email
        let info = await transporter.sendMail({
            from: `"MicroFinance 👻" ${user}`, // sender address
            to: recev, // list of receivers
            subject: title, // Subject line
            text: message, // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log()
    }
}

module.exports = Notification;






