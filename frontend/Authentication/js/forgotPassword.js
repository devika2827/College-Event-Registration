const API_URL =
    "https://college-event-registration-n942.onrender.com/api/v1/auth";


const form = document.getElementById("forgotPasswordForm");

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    // Clear previous messages
    emailError.textContent = "";
    message.className = "toast";
    message.textContent = "";

    const email = emailInput.value.trim();


    // ================= VALIDATION =================

    if (!email) {

        emailError.textContent =
            "Please enter your email address.";

        return;
    }


    // Basic email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        return;
    }


    // ================= BUTTON STATE =================

    submitBtn.disabled = true;

    submitBtn.textContent = "Sending...";


    try {

        const response = await fetch(
            `${API_URL}/forgot-password`,
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


        const data = await response.json();


        // ================= ERROR =================

        if (!response.ok) {

            throw new Error(
                data.message || "Something went wrong."
            );
        }


        // ================= SUCCESS =================

        message.textContent =
            "Password reset link has been sent to your email.";

        message.className =
            "toast success";

        emailInput.value = "";


    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );

        message.textContent =
            error.message ||
            "Unable to send reset link.";

        message.className =
            "toast error";

    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent =
            "Send Reset Link";
    }

});