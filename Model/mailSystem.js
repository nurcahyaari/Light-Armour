let nodemailer = require('nodemailer');
let email = require('email-templates');

let mailSystem = {
    transporter : function(){
        nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'officiallightarmour@gmail.com',
              pass: 'official2017'
            }
        });
    },
    mail : function(){
        new email({
            message: {
                from: 'officiallightarmour@gmail.com'
            },
            // uncomment below to send emails in development/test env:
            send: true,
            transport: {
                jsonTransport: true
            }
        })
    }
}

module.exports = mailSystem;