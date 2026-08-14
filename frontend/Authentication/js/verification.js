console.log("NEW VERIFICATION JS LOADED");

const API_URL =
    "https://college-event-registration-n942.onrender.com/api/v1/auth";

const params =
    new URLSearchParams(window.location.search);

const email =
    params.get("email");

const emailMessage =
    document.getElementById("emailMessage");

const message =
    document.getElementById("message");

const resendBtn =
    document.getElementById("resendBtn");

const timerText =
    document.getElementById("timerText");
    console.log("timerText element:", timerText);
console.log("resendBtn element:", resendBtn);


if (!email) {

    emailMessage.textContent =
        "Verification email was sent. Please check your inbox.";

    resendBtn.disabled = true;

} else {

    emailMessage.textContent =
        `We've sent a verification link to ${email}. Please check your inbox.`;

}


// ------------------------------
// 30 SECOND COOLDOWN
// ------------------------------

function startCooldown() {

    let seconds = 30;

    resendBtn.disabled = true;

    timerText.textContent =
        `You can resend again in ${seconds}s`;

    const timer = setInterval(() => {

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

// ------------------------------
// RESEND VERIFICATION EMAIL
// ------------------------------

resendBtn.addEventListener(
    "click",
    async () => {

        if (!email) {
            return;
        }

        resendBtn.disabled = true;

        resendBtn.textContent =
            "Sending...";

        message.textContent = "";

        message.className =
            "toast";


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


            message.textContent =
                "A new verification email has been sent.";

            message.className =
                "toast success";


            resendBtn.textContent =
                "Resend Verification Email";


            // START 30 SECOND TIMER
            startCooldown();


        } catch (error) {

            console.error(
                "Resend verification error:",
                error
            );


            message.textContent =
                error.message ||
                "Unable to resend verification email.";

            message.className =
                "toast error";


            resendBtn.disabled =
                false;

            resendBtn.textContent =
                "Resend Verification Email";

        }

    }
);
timerText.textContent = "TEST TIMER IS WORKING";