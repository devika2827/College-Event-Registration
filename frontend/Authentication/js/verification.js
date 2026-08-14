const API_URL = "https://college-event-registration-n942.onrender.com/api/v1/auth";


const emailMessage = document.getElementById("emailMessage");
const message = document.getElementById("message");
const resendBtn = document.getElementById("resendBtn");
const timerText = document.getElementById("timerText");
const email = sessionStorage.getItem("verificationEmail");


if (!email) {

    emailMessage.textContent =
        "We couldn't find your email address. Please sign up again.";

    resendBtn.disabled = true;

} else {

    emailMessage.textContent =
        `We've sent a verification link to ${email}. Please check your inbox.`;

}

function startCooldown() {

    let seconds = 30;

    resendBtn.disabled = true;

    timerText.textContent =
        `You can resend again in ${seconds}s`;

    const timer =
        setInterval(() => {

            seconds--;

            if (seconds > 0) {

                timerText.textContent =
                    `You can resend again in ${seconds}s`;

            } else {

                clearInterval(timer);

                resendBtn.disabled = false;

                timerText.textContent =
                    "You can resend the verification email now.";

            }

        }, 1000);
}

// Resend Verification Email
resendBtn.addEventListener(
    "click",
    async () => {

        if (!email) {

            message.textContent =
                "Email address is missing.";

            message.className =
                "toast error";

            return;
        }

        resendBtn.disabled = true;
        resendBtn.textContent = "Sending...";
        message.textContent = "";
        message.className = "toast";

        try {

            const response =
                await fetch(
                    `${API_URL}/resend-verification-email`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email: email
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to resend verification email."
                );
            }

            message.textContent = "A new verification email has been sent.";
            message.className = "toast success";
            resendBtn.textContent = "Resend Verification Email";

            startCooldown();

        } catch (error) {

            console.error(
                "Resend verification error:",
                error
            );

            message.textContent =
                error.message ||
                "Unable to resend verification email.";

            message.className = "toast error";

            resendBtn.disabled = false;

            resendBtn.textContent = "Resend Verification Email";
        }

    }
);