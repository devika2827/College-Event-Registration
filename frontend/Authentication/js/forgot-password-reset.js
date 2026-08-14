const API_URL =
    "https://college-event-registration-n942.onrender.com/api/v1/auth";


const form =
    document.getElementById("forgotPasswordResetForm");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const message =
    document.getElementById("message");

const resetBtn =
    document.getElementById("resetBtn");


// ================= PASSWORD VISIBILITY =================

document.querySelectorAll(".toggle-eye").forEach(button => {

    button.addEventListener("click", () => {

        const input =
            document.getElementById(
                button.dataset.target
            );

        input.type =
            input.type === "password"
                ? "text"
                : "password";

    });

});


// ================= GET TOKEN =================

const params =
    new URLSearchParams(
        window.location.search
    );

const token =
    params.get("token");


if (!token) {

    message.textContent =
        "Invalid or missing password reset link.";

    message.className =
        "toast error";

    resetBtn.disabled = true;
}


// ================= RESET PASSWORD =================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!token) {
        return;
    }


    const newPassword =
        newPasswordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // ================= VALIDATION =================

    if (!newPassword || !confirmPassword) {

        message.textContent =
            "Please enter your new password.";

        message.className =
            "toast error";

        return;
    }


    if (newPassword !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        message.className =
            "toast error";

        return;
    }


    if (newPassword.length < 8) {

        message.textContent =
            "Password must be at least 8 characters long.";

        message.className =
            "toast error";

        return;
    }


    // ================= SEND REQUEST =================

    resetBtn.disabled = true;

    resetBtn.textContent =
        "Resetting...";


    try {

        const response = await fetch(
            `${API_URL}/reset-password/${token}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    newPassword: newPassword
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to reset password."
            );
        }


        // ================= SUCCESS =================

        message.textContent =
            data.message ||
            "Password reset successfully.";

        message.className =
            "toast success";


        newPasswordInput.value = "";
        confirmPasswordInput.value = "";


        resetBtn.textContent =
            "Password Reset";


        // Redirect to login

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 2000);


    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );


        message.textContent =
            error.message ||
            "Unable to reset password.";

        message.className =
            "toast error";


        resetBtn.disabled = false;

        resetBtn.textContent =
            "Reset Password";
    }

});