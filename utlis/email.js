const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1 CREATE transporter 
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2 define EMAIL OPTION
    const mailOptions = {
        form: 'ajab.sharifulislam@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    // 3 send MAIL TO USER
    await transport.sendMail(mailOptions);
};
module.exports = sendEmail;