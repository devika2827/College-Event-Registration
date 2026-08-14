const API_URL ="https://college-event-registration-n942.onrender.com/api/v1/auth";


const form =
    document.getElementById("resendForm");

const emailInput =
    document.getElementById("email");

const message =
    document.getElementById("message");

const resendBtn =
    document.getElementById("resendBtn");


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        emailInput.value.trim();


    if (!email) {

        message.textContent =
            "Please enter your email.";

        message.className =
            "toast error";

        return;
    }


    resendBtn.disabled = true;

    resendBtn.textContent =
        "Sending...";


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
                "Unable to send verification email."
            );
        }


        message.textContent =
            data.message;

        message.className =
            "toast success";


    } catch (error) {

        message.textContent =
            error.message;

        message.className =
            "toast error";

    } finally {

        resendBtn.disabled = false;

        resendBtn.textContent =
            "Resend Verification Email";
    }

});