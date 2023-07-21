const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.form = `Shariful islam <${process.env.EMAIL_FROM}>`;
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    // send teh actual email
    async send(template, subject) {
        // render HTML based on  a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });
        // define email options
        const mailOptions = {
            form: this.form,
            to: this.to,
            subject,
            text: htmlToText(html)
        }
        // create a transport and send email
        await this.createTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }
}
