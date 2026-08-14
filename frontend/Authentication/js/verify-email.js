const API_URL =
    "https://college-event-registration-n942.onrender.com/api/v1/auth";

const title =
    document.getElementById("title");

const message =
    document.getElementById("message");

const toast =
    document.getElementById("toast");

const loginBtn =
    document.getElementById("loginBtn");


// Get token from URL

const params =
    new URLSearchParams(window.location.search);

const token =
    params.get("token");


// No token

if (!token) {

    title.textContent =
        "Verification Failed";

    message.textContent =
        "The verification link is invalid.";

    toast.textContent =
        "Verification token is missing.";

    toast.className =
        "toast error";

} else {

    verifyEmail();
}


// Verify email

async function verifyEmail() {

    try {

        const response = await fetch(
            `${API_URL}/verify-email/${token}`,
            {
                method: "GET"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to verify email."
            );
        }


        // SUCCESS

        title.textContent =
            "Email Verified!";

        message.textContent =
            "Your email has been verified successfully.";

        toast.textContent =
            "You can now login to your Nexus account.";

        toast.className =
            "toast success";

        loginBtn.style.display =
            "block";


    } catch (error) {

        console.error(
            "Email verification error:",
            error
        );


        title.textContent =
            "Verification Failed";

        message.textContent =
            "We could not verify your email.";

        toast.textContent =
            error.message ||
            "The verification link is invalid or expired.";

        toast.className =
            "toast error";
    }
}