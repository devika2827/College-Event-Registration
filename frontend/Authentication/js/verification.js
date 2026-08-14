const API_URL ="https://college-event-registration-n942.onrender.com/api/v1/auth";
const params =new URLSearchParams(window.location.search);
const email =params.get("email");
const emailMessage =document.getElementById("emailMessage");
const message =document.getElementById("message");
const resendBtn =document.getElementById("resendBtn");

if (!email) {

    emailMessage.textContent =
        "Verification email was sent. Please check your inbox.";

    resendBtn.disabled = true;

} else {

    emailMessage.textContent =
        `We've sent a verification link to ${email}. Please check your inbox.`;
}


// Resend verification email

resendBtn.addEventListener("click", async () => {

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

        const response = await fetch(
            `${API_URL}/resend-verification-email`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
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

    } finally {

        resendBtn.disabled = false;

        resendBtn.textContent =
            "Resend Verification Email";
    }

});