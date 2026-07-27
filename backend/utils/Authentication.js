const mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    const mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Event management',
            link: 'https://yourcompany.com'
        }
    
    });
    const emailTextual = mailgenerator.generatePlainText(options.mailgenContent);
    const emailHtml = mailgenerator.generate(options.mailgenContent);    

    const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    });
    const mail = {
        from: "mittal.diyaa19@gmail.com",
        to: options.to,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    };
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const emailVerificationTemplate = (username, verificationLink) => {
    return {
        body: {
            name: username,
            intro: 'Welcome to our site.',
            action: {
                instructions: 'To get started with your account, please verify your email address by clicking the button below:',
                button: {
                    color: '#22BC66', 
                    text: 'Verify Email',
                    link: verificationLink
                }
            },
            outro: 'If you did not create an account, no further action is required.'
        }
    };
}
const forgotPasswordTemplate = (username, resetLink) => {
    return {
        body: {
            name: username,
            intro: 'You have requested to reset your password.',
            action: {
                instructions: 'Please click the button below to reset your password:',
                button: {
                    color: '#DC4D2F',
                    text: 'Reset Password',
                    link: resetLink
                }
            },
            outro: 'If you did not request a password reset, please ignore this email.'
        }
    };
}
exports.emailVerificationTemplate = emailVerificationTemplate;
exports.forgotPasswordTemplate = forgotPasswordTemplate;
exports.sendEmail = sendEmail;
