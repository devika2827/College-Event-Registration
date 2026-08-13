const mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    const mailgenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Nexus',
            link: process.env.FRONTEND_URL
        }
    
    });
    const emailHtml = mailgenerator.generate(options.mailgenContent);    

    const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    });
    const mail = {
        from: process.env.MAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: emailHtml
    };
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const emailVerificationMail = (username, verificationLink) => {
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
const forgotPasswordMail = (username, resetLink) => {
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
exports.emailVerificationMail = emailVerificationMail;
exports.forgotPasswordMail = forgotPasswordMail;
exports.sendEmail = sendEmail;
