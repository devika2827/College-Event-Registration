const mailgen = require('mailgen');

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
