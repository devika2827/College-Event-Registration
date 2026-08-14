const mailgen = require("mailgen");

const sendEmail = async (options) => {

    const mailgenerator = new mailgen({
        theme: "default",
        product: {
            name: "Nexus",
            link: process.env.FRONTEND_URL
        }
    });

    const emailHtml =
        mailgenerator.generate(options.mailgenContent);


    const mail = {
        sender: {
            name: process.env.MAIL_FROM_NAME || "Nexus",
            email: process.env.MAIL_FROM
        },

        to: [
            {
                email: options.to
            }
        ],

        subject: options.subject,

        htmlContent: emailHtml
    };


    try {

        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.BREVO_API_KEY
                },

                body: JSON.stringify(mail)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            console.error(
                "Brevo email error:",
                data
            );

            throw new Error(
                data.message ||
                "Failed to send email through Brevo."
            );
        }


        console.log(
            "Email sent successfully through Brevo:",
            data.messageId
        );

        return data;

    } catch (error) {

        console.error(
            "Error sending email:",
            error
        );

        throw error;
    }
};


// ================= EMAIL VERIFICATION =================

const emailVerificationMail = (
    username,
    verificationLink
) => {

    return {

        body: {

            name: username,

            intro:
                "Welcome to Nexus!",

            action: {

                instructions:
                    "To get started with your account, please verify your email address by clicking the button below:",

                button: {

                    color: "#22BC66",

                    text: "Verify Email",

                    link: verificationLink
                }
            },

            outro:
                "If you did not create an account, no further action is required."
        }
    };
};


// ================= FORGOT PASSWORD =================

const forgotPasswordMail = (
    username,
    resetLink
) => {

    return {

        body: {

            name: username,

            intro:
                "You have requested to reset your password.",

            action: {

                instructions:
                    "Please click the button below to reset your password:",

                button: {

                    color: "#DC4D2F",

                    text: "Reset Password",

                    link: resetLink
                }
            },

            outro:
                "If you did not request a password reset, please ignore this email."
        }
    };
};


exports.emailVerificationMail =
    emailVerificationMail;

exports.forgotPasswordMail =
    forgotPasswordMail;

exports.sendEmail =
    sendEmail;